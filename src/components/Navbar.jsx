import React, { useState } from 'react'

export default function Navbar({ 
  session, 
  currentTab, 
  setCurrentTab, 
  staffMode, 
  setStaffMode, 
  notifications, 
  onLogout 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isStaff = session && ['staff', 'admin', 'mj'].includes(session.role)

  return (
    <header className="border-b border-amber-500/30 bg-[#0d0b16] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* LOGO & TITRE */}
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold text-xl shadow-lg">
            ⚡
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-amber-400 tracking-wider">ELDERWOOD</h1>
            <p className="text-[10px] text-amber-200/60 uppercase">Pôle RP Magique</p>
          </div>
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center space-x-2 text-xs">
          <button 
            onClick={() => setCurrentTab('home')} 
            className={`px-3 py-1.5 rounded-xl font-medium transition ${currentTab === 'home' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Accueil
          </button>
          <button 
            onClick={() => setCurrentTab('rules')} 
            className={`px-3 py-1.5 rounded-xl font-medium transition ${currentTab === 'rules' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Règlement
          </button>

          {session && (
            <>
              <button 
                onClick={() => setCurrentTab('lore')} 
                className={`px-3 py-1.5 rounded-xl font-medium transition ${currentTab === 'lore' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
              >
                Monde Magique
              </button>
              <button 
                onClick={() => setCurrentTab('dossiers')} 
                className={`px-3 py-1.5 rounded-xl font-medium transition ${currentTab === 'dossiers' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
              >
                Dossiers
              </button>
              <button 
                onClick={() => setCurrentTab('gazette')} 
                className={`px-3 py-1.5 rounded-xl font-medium transition ${currentTab === 'gazette' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}
              >
                Gazette & Rumeurs
              </button>
            </>
          )}
        </nav>

        {/* ACTIONS DROITE (Switch Staff + Notifs + Auth) */}
        <div className="flex items-center space-x-3">
          
          {/* SWITCH MODE STAFF (Réservé Staff/MJ/Admin) */}
          {isStaff && (
            <div className="bg-black/60 border border-purple-500/30 p-1 rounded-xl flex items-center space-x-1 text-xs">
              <button
                onClick={() => {
                  setStaffMode('admin')
                  setCurrentTab('staff-admin')
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${staffMode === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Admin
              </button>
              <button
                onClick={() => {
                  setStaffMode('game')
                  setCurrentTab('staff-game')
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${staffMode === 'game' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                En Jeu
              </button>
            </div>
          )}

          {/* CLOCHE DE NOTIFICATION */}
          {session && (
            <button className="relative p-2 rounded-xl bg-black/40 border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition">
              🔔
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>
          )}

          {/* BOUTON PROFIL / CONNEXION */}
          {session ? (
            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={() => setCurrentTab('settings')}
                className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-amber-500/20 transition"
              >
                {session.avatar || '👤'} {session.username}
              </button>
              <button 
                onClick={onLogout} 
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-red-500/20 transition"
              >
                🚪
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setCurrentTab('auth')} 
              className="bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg hover:scale-105 transition"
            >
              Se Connecter
            </button>
          )}

          {/* BOUTON MENU HAMBURGER (MOBILE) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden text-amber-400 text-xl p-1"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MENU TIROIR MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#120f1d] border-t border-amber-500/20 p-4 space-y-3 text-xs">
          <button onClick={() => { setCurrentTab('home'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300 hover:text-amber-400">Accueil</button>
          <button onClick={() => { setCurrentTab('rules'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300 hover:text-amber-400">Règlement HRP</button>
          {session && (
            <>
              <button onClick={() => { setCurrentTab('lore'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300 hover:text-amber-400">Monde Magique</button>
              <button onClick={() => { setCurrentTab('dossiers'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-300 hover:text-amber-400">Dossiers</button>
              <button onClick={() => { setCurrentTab('settings'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-amber-300 font-bold">Mon Compte ({session.username})</button>
              <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 text-red-400">Déconnexion</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}