'use client'

import { useState } from 'react'
import { MvpProvider } from '@/lib/mvpStore'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import RightPanel from '@/components/RightPanel'
import ActivityFeed from '@/components/ActivityFeed'
import Marketplace from '@/components/Marketplace'
import ProofOfWorkTable from '@/components/ProofOfWorkTable'
import SwarmCommand from '@/components/SwarmCommand'
import NetworkGraph from '@/components/NetworkGraph'
import Contracts from '@/components/Contracts'
import Insights from '@/components/Insights'
import Compute from '@/components/Compute'
import SpawnAgentModal from '@/components/SpawnAgentModal'
import PostTaskModal from '@/components/PostTaskModal'

type Page = 'activity' | 'marketplace' | 'proof' | 'swarm' | 'network' | 'contracts' | 'insights' | 'compute'

const WIDE_PAGES: Page[] = ['network', 'insights', 'compute']

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<Page>('activity')
  const [spawnOpen, setSpawnOpen] = useState(false)
  const [postTaskOpen, setPostTaskOpen] = useState(false)

  const isWide = WIDE_PAGES.includes(activePage)

  return (
    <MvpProvider><div className="app-shell">
      <Topbar />

      <div className="main">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onSpawnAgent={() => setSpawnOpen(true)}
          onPostTask={() => setPostTaskOpen(true)}
        />

        <div className={`content${isWide ? ' wide' : ''}`}>
          {activePage === 'activity' && <ActivityFeed />}
          {activePage === 'marketplace' && <Marketplace />}
          {activePage === 'proof' && <ProofOfWorkTable />}
          {activePage === 'swarm' && <SwarmCommand onSpawnAgent={() => setSpawnOpen(true)} />}
          {activePage === 'network' && <NetworkGraph />}
          {activePage === 'contracts' && <Contracts />}
          {activePage === 'insights' && <Insights />}
          {activePage === 'compute' && <Compute />}

          {!isWide && <RightPanel />}
        </div>
      </div>

      <div className="statusbar">
        <span>● NETWORK: CONNECTED</span>
        <span>LOCATION: US-WEST-GRID-02</span>
        <span className="right">AGENTN.IO PROTOCOL · © 2026</span>
      </div>

      <SpawnAgentModal
        open={spawnOpen}
        onClose={() => setSpawnOpen(false)}
        onSpawned={agent => {
          console.log('Agent spawned:', agent)
        }}
      />

      <PostTaskModal
        open={postTaskOpen}
        onClose={() => setPostTaskOpen(false)}
        onCompleted={result => {
          console.log('Task completed:', result)
        }}
      />
    </div></MvpProvider>
  )
}
