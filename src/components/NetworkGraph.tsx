'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
  name: string
  pulse: number
  fixed?: boolean
}

const NAMES = ['ZENITH-190', 'GLYPH-97', 'NEXUS-44', 'VEGA-12', 'CIPHER-08', 'ORION-31', 'DELTA-22', 'NODE-UND', 'ALPHA-01', 'BETA-07', 'GAMMA-14', 'SIGMA-03', 'OMEGA-22', 'KAPPA-11', 'LAMBDA-9', 'MU-33', 'NU-17', 'XI-99']
const COLS = ['#00ff88', '#00ff88', '#00ff88', '#ffaa00', '#4499ff', '#ff66cc', '#00cc6a', '#aa66ff']

function hexToRgb(hex: string): string {
  const map: Record<string, string> = {
    '#00ff88': '0,255,136',
    '#ffaa00': '255,170,0',
    '#4499ff': '68,153,255',
    '#ff66cc': '255,102,204',
    '#aa66ff': '170,102,255',
    '#00cc6a': '0,204,106',
  }
  return map[hex] ?? '0,255,136'
}

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: Node[] = []
    for (let i = 0; i < 18; i++) {
      nodes.push({
        x: 80 + Math.random() * (canvas.width - 160),
        y: 60 + Math.random() * (canvas.height - 120),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 5 + Math.random() * 7,
        color: COLS[Math.floor(Math.random() * COLS.length)],
        name: NAMES[i % NAMES.length],
        pulse: Math.random() * Math.PI * 2,
      })
    }
    nodes.push({ x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, r: 18, color: '#00ff88', name: 'ORCH-V4.2', pulse: 0, fixed: true })

    let raf: number
    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // edges
      nodes.forEach((a, i) => nodes.forEach((b, j) => {
        if (j <= i) return
        const dx = a.x - b.x, dy = a.y - b.y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 220) {
          ctx.strokeStyle = `rgba(0,255,136,${(1 - d / 220) * 0.25})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }))

      // nodes
      nodes.forEach(n => {
        n.pulse += 0.04
        const rgb = hexToRgb(n.color)

        // glow
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + 3 + Math.sin(n.pulse) * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},0.07)`
        ctx.fill()

        // fill
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.color + '18'
        ctx.fill()
        ctx.strokeStyle = n.color
        ctx.lineWidth = 1.5
        ctx.stroke()

        // label
        ctx.fillStyle = '#8a9e8a'
        ctx.font = '9px JetBrains Mono,monospace'
        ctx.textAlign = 'center'
        ctx.fillText(n.name, n.x, n.y + n.r + 12)
      })
    }

    function update() {
      nodes.forEach(n => {
        if (n.fixed) {
          if (canvas) { n.x = canvas.width / 2; n.y = canvas.height / 2 }
          return
        }
        n.x += n.vx; n.y += n.vy
        if (canvas) {
          if (n.x < n.r || n.x > canvas.width - n.r) n.vx *= -1
          if (n.y < n.r || n.y > canvas.height - n.r) n.vy *= -1
          n.vx += (canvas.width / 2 - n.x) * 0.00008
          n.vy += (canvas.height / 2 - n.y) * 0.00008
        }
      })
      draw()
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
      <div className="page-header">
        <div>
          <div className="page-title">NETWORK GRAPH</div>
          <div className="page-sub">Live topology of agent nodes & connections</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', alignItems: 'center' }}>
          <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
          LIVE&nbsp;
          <span style={{ color: 'var(--green)' }}>● ACTIVE</span>&nbsp;
          <span style={{ color: 'var(--amber)' }}>● BUSY</span>&nbsp;
          <span style={{ color: 'var(--text3)' }}>● IDLE</span>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: '30px', right: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text3)' }}>
          <div style={{ marginBottom: '4px' }}>NODES: <span style={{ color: 'var(--green)' }}>58 active</span></div>
          <div style={{ marginBottom: '4px' }}>EDGES: <span style={{ color: 'var(--text)' }}>142</span></div>
          <div>LATENCY: <span style={{ color: 'var(--text)' }}>4ms avg</span></div>
        </div>
      </div>
    </div>
  )
}
