import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import Dossiers from './components/Dossiers'
import OperationalHub from './components/OperationalHub'
import Codex from './components/Codex' // <-- 1. Import du Codex

export default function App() {
  const [session, setSession] = useState(null)
  const [currentTab, setCurrentTab] = useState('home')
  const [staffStatuses, setStaffStatuses] = useState({})

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-200 flex flex-col font-sans">
      <Navbar 
        session={session} 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onLogout={() => { setSession(null); setCurrentTab('home'); }} 
      />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {currentTab === 'home' && (
          <div className="space-y-8 py-12 text-center">
            <div className="bg-[#161322] border border-amber-500/30 rounded-3xl p-10 shadow-2xl max-w-3xl mx-auto space-y-6">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
                Architecture Modulaire
              </span>
              <h2 className="text-4xl font-serif font-extrabold text-amber-400">
                Le Hub Officiel du Pôle RP Nanos
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Le code est divisé en composants propres et maintenables.
              </p>
              <button 
                onClick={() => setCurrentTab('auth')} 
                className="bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold px-8 py-3 rounded-2xl text-sm shadow-xl hover:scale-105 transition"
              >
                Accéder au Portail
              </button>
            </div>
          </div>
        )}

        {currentTab === 'auth' && (
          <Auth setSession={setSession} setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'dossiers' && session && (
          <Dossiers session={session} />
        )}

        {currentTab === 'operational' && session && (
          <OperationalHub 
            session={session} 
            staffStatuses={staffStatuses} 
            setStaffStatuses={setStaffStatuses} 
          />
        )}

        {/* 2. Affichage du Codex */}
        {currentTab === 'codex' && session && (
          <Codex session={session} />
        )}
      </main>
    </div>
  )
}
