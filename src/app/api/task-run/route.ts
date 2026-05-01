import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'
import { createHash } from 'crypto'

const MODEL = 'claude-haiku-4-5-20251001'

// Cost estimate: ~$0.80/MTok input, ~$4.00/MTok output for Haiku
function estimateCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens / 1_000_000) * 0.80 + (outputTokens / 1_000_000) * 4.0
}

function sha256(text: string): string {
  return '0x' + createHash('sha256').update(text).digest('hex').slice(0, 16) + '…'
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { taskId, goal, targetCustomer, desiredOutput } = body

  if (!taskId || !goal) {
    return NextResponse.json({ error: 'taskId and goal are required' }, { status: 400 })
  }

  // Verify task belongs to user
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
  })
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  // Create task run
  const taskRun = await prisma.taskRun.create({
    data: {
      taskId,
      status: 'RUNNING',
      startedAt: new Date(),
    },
  })

  await prisma.task.update({ where: { id: taskId }, data: { status: 'RUNNING' } })

  const startedAt = Date.now()

  try {
    const apiKey = process.env.AI_API_KEY
    if (!apiKey) throw new Error('AI_API_KEY is not configured')

    const client = new Anthropic({ apiKey })

    const systemPrompt = `You are an autonomous growth agent on the AgentN.IO platform. Your job is to execute marketing and growth tasks efficiently and return high-quality, actionable output. Be concise and professional. Format your output clearly.`

    const userPrompt = [
      `TASK: ${goal}`,
      targetCustomer ? `TARGET CUSTOMER: ${targetCustomer}` : null,
      desiredOutput ? `DESIRED OUTPUT FORMAT: ${desiredOutput}` : null,
      '\nExecute this task now and provide the complete output.',
    ].filter(Boolean).join('\n')

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    })

    const outputText = response.content
      .filter(b => b.type === 'text')
      .map(b => b.type === 'text' ? b.text : '')
      .join('')

    const durationMs = Date.now() - startedAt
    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens
    const cost = estimateCost(inputTokens, outputTokens)

    const inputHash = sha256(userPrompt)
    const outputHash = sha256(outputText)

    // Save artifact
    const artifact = await prisma.artifact.create({
      data: {
        taskId,
        taskRunId: taskRun.id,
        type: 'TEXT',
        content: outputText,
      },
    })

    // Save proof log
    const proofLog = await prisma.proofLog.create({
      data: {
        taskRunId: taskRun.id,
        model: MODEL,
        durationMs,
        estimatedCost: cost,
        status: 'VERIFIED',
        inputHash,
        outputHash,
      },
    })

    // Update task run to completed
    await prisma.taskRun.update({
      where: { id: taskRun.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        durationMs,
      },
    })

    await prisma.task.update({ where: { id: taskId }, data: { status: 'COMPLETED' } })

    return NextResponse.json({
      taskId,
      taskRunId: taskRun.id,
      artifact: { content: artifact.content, type: artifact.type },
      proofLog: {
        model: proofLog.model,
        durationMs: proofLog.durationMs,
        estimatedCost: proofLog.estimatedCost,
        status: proofLog.status,
        inputHash: proofLog.inputHash,
        outputHash: proofLog.outputHash,
      },
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI call failed'
    const durationMs = Date.now() - startedAt

    await prisma.taskRun.update({
      where: { id: taskRun.id },
      data: { status: 'FAILED', completedAt: new Date(), durationMs },
    })
    await prisma.task.update({ where: { id: taskId }, data: { status: 'FAILED' } })

    // Record failed proof log
    await prisma.proofLog.create({
      data: {
        taskRunId: taskRun.id,
        model: MODEL,
        durationMs,
        estimatedCost: 0,
        status: 'FAILED',
        inputHash: sha256(goal),
        outputHash: sha256('FAILED'),
      },
    })

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
