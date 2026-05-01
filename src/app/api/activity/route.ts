import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
  let session
  try {
    session = await getServerSession(authOptions)
  } catch {
    return NextResponse.json([])
  }

  if (!session?.user?.id) {
    return NextResponse.json([])
  }

  let agents
  let tasks
  try {
    ;[agents, tasks] = await Promise.all([
      prisma.agent.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.task.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])
  } catch {
    return NextResponse.json([])
  }

  const agentItems = agents.map(a => ({
    id: `agent-${a.id}`,
    type: 'agent' as const,
    name: a.name,
    message: `${a.type} spawned for cluster: ${a.cluster}. Directive: ${a.directive.slice(0, 80)}${a.directive.length > 80 ? '…' : ''}`,
    timestamp: new Date(a.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase(),
    status: a.status,
  }))

  const taskItems = tasks.map(t => ({
    id: `task-${t.id}`,
    type: 'task' as const,
    name: `TASK-${t.id.slice(-6).toUpperCase()}`,
    message: `Goal: ${t.goal.slice(0, 100)}${t.goal.length > 100 ? '…' : ''}`,
    timestamp: new Date(t.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase(),
    status: t.status,
  }))

  // Merge and sort by original creation order (most recent first)
  const combined = [...agentItems, ...taskItems].sort((a, b) => {
    return b.id.localeCompare(a.id)
  })

  return NextResponse.json(combined.slice(0, 20))
}
