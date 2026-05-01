'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginClient() {
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-box">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <polygon points="6.5,1 12,4 12,9 6.5,12 1,9 1,4" stroke="#0a0c0a" strokeWidth="1" fill="none" />
              <polygon points="6.5,4 9.5,5.5 9.5,7.5 6.5,9 3.5,7.5 3.5,5.5" fill="#0a0c0a" />
            </svg>
          </div>
          AGENTN.IO
        </div>
        <div className="login-sub">Autonomous Growth Orchestration</div>

        <button className="btn-google" onClick={handleGoogle} disabled={loading}>
          {loading ? (
            <span className="spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
          )}
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>

        <p style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--text3)', marginTop: '20px', letterSpacing: '0.04em' }}>
          BY SIGNING IN YOU ACCEPT THE AGENTN.IO PROTOCOL TERMS
        </p>
      </div>
    </div>
  )
}
