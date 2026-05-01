'use client'

import Topbar from '@/components/Topbar'
import Forecast from '@/components/Forecast'

export default function ForecastRoutePage() {
  return (
    <div className="app-shell">
      <Topbar />
      <div className="main" style={{ gridTemplateColumns: '1fr' }}>
        <div className="content wide">
          <Forecast />
        </div>
      </div>
      <div className="statusbar">
        <span>● NETWORK: CONNECTED</span>
        <span>LOCATION: US-WEST-GRID-02</span>
        <span className="right">AGENTN.IO FORECAST · © 2026</span>
      </div>
    </div>
  )
}
