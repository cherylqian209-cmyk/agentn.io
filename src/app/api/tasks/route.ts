import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: { taskRuns: { include: { artifacts: true, proofLogs: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { goal, targetCustomer, desiredOutput, budget } = body

  if (!goal) {
    return NextResponse.json({ error: 'goal is required' }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      goal,
      targetCustomer: targetCustomer ?? null,
      desiredOutput: desiredOutput ?? null,
      budget: typeof budget === 'number' ? budget : 1,
      status: 'PENDING',
      userId: session.user.id,
    },
  })

  return NextResponse.json({ taskId: task.id }, { status: 201 })
}
