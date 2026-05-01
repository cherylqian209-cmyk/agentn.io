import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([])
  }

  const logs = await prisma.proofLog.findMany({
    where: { taskRun: { task: { userId: session.user.id } } },
    include: { taskRun: { include: { task: true } }, agent: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const rows = logs.map(l => ({
    id: l.id,
    taskId: `#TK-${l.taskRunId.slice(-6).toUpperCase()}`,
    agentName: l.agent?.name ?? 'AI-AGENT',
    type: l.taskRun.task.desiredOutput ?? 'AI Task',
    durationMs: l.durationMs,
    estimatedCost: l.estimatedCost,
    status: l.status,
    inputHash: l.inputHash,
    outputHash: l.outputHash,
    createdAt: l.createdAt.toISOString(),
    isReal: true,
  }))

  return NextResponse.json(rows)
}
