'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Topbar() {
  const { data: session } = useSession()
  const [neuralLoad, setNeuralLoad] = useState('12.4')
  const [clusterCount, setClusterCount] = useState(1402)

  useEffect(() => {
    const id = setInterval(() => {
      setNeuralLoad(((12.4 + (Math.random() - 0.5) * 3)).toFixed(1))
      setClusterCount(prev => prev + Math.floor(Math.random() * 3))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AG'

  return (
    <div className="topbar">
      <div className="logo">
        <div className="logo-box">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <polygon points="6.5,1 12,4 12,9 6.5,12 1,9 1,4" stroke="#0a0c0a" strokeWidth="1" fill="none" />
            <polygon points="6.5,4 9.5,5.5 9.5,7.5 6.5,9 3.5,7.5 3.5,5.5" fill="#0a0c0a" />
          </svg>
        </div>
        AGENTN.IO
      </div>
      <div className="topbar-stat">
        <span className="pulse-dot" />
        &nbsp;STATUS:&nbsp;<span className="status-txt">SYNCC_READY</span>
      </div>
      <div className="topbar-stat">
        NEURAL_LOAD:&nbsp;<span className="val">{neuralLoad}%</span>
      </div>
      <div className="topbar-stat">
        ACTIVE_CLUSTERS:&nbsp;<span className="val">{clusterCount.toLocaleString()}</span>
      </div>
      <div className="topbar-right">
        <div className="user-pill" onClick={() => signOut({ callbackUrl: '/login' })}>
          <div className="avatar">
            {session?.user?.image ? (
              <Image src={session.user.image} alt="avatar" width={22} height={22} style={{ borderRadius: '50%' }} />
            ) : (
              initials
            )}
          </div>
          &nbsp;{session?.user?.email ?? 'guest'}&nbsp;▾
        </div>
      </div>
    </div>
  )
}
