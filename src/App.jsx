import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Auth from './components/Auth'
import Rules from './components/Rules'
import Dossiers from './components/Dossiers'
import OperationalHub from './components/OperationalHub'
import Codex from './components/Codex'

export default function App() {
  const [session, setSession] = useState(null)
  const [currentTab, setCurrentTab] = useState('home')
  const [staffMode, setStaffMode] = useState('admin') // 'admin' ou 'game'
  const [notifications, setNotifications] = useState(1)

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-200 flex flex-col font-sans">
      <Navbar 
        session={session} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        staffMode={staffMode} 
        setStaffMode={setStaffMode} 
        notifications={notifications} 
        onLogout={() => { setSession(null); setCurrentTab('home'); }} 
      />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {currentTab === 'home' && (
          <Home session={session} setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'rules' && (
          <Rules />
        )}

        {currentTab === 'auth' && (
          <Auth setSession={setSession} setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'dossiers' && session && (
          <Dossiers session={session} />
        )}

        {currentTab === 'staff-game' && session && (
          <OperationalHub session={session} staffStatuses={{}} setStaffStatuses={() => {}} />
        )}

        {currentTab === 'codex' && session && (
          <Codex session={session} />
        )}
      </main>
    </div>
  )
}