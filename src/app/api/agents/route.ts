import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const agents = await prisma.agent.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(agents)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, cluster, directive, budget } = body

  if (!type || !cluster || !directive) {
    return NextResponse.json({ error: 'type, cluster, and directive are required' }, { status: 400 })
  }

  const id = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  const name = `${type.split('_')[0]}-${id}`

  const agent = await prisma.agent.create({
    data: {
      name,
      type,
      cluster,
      directive,
      budget: typeof budget === 'number' ? budget : 0.5,
      status: 'ACTIVE',
      userId: session.user.id,
    },
  })

  return NextResponse.json(agent, { status: 201 })
}
