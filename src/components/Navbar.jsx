import React from 'react'

export default function Navbar({ session, currentTab, setCurrentTab, onLogout }) {
  return (
    <header className="border-b border-amber-500/30 bg-[#0d0b16] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold text-xl shadow-lg">⚡</div>
        <div>
          <h1 className="font-serif text-lg font-bold text-amber-400 tracking-wider">PÔLE RP NANOS</h1>
          <p className="text-[10px] text-amber-200/60 uppercase">Monde Sorcier & Administration</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {session ? (
          <div className="flex items-center space-x-3">
            {['staff', 'admin', 'mj'].includes(session.role) && (
              <div className="bg-black/60 border border-amber-500/30 p-1 rounded-xl flex space-x-1 text-xs">
                <button onClick={() => setCurrentTab('dossiers')} className={`px-2.5 py-1 rounded-lg ${currentTab==='dossiers'?'bg-amber-500/20 text-amber-300':'text-gray-400'}`}>Dossiers</button>
                <button onClick={() => setCurrentTab('operational')} className={`px-2.5 py-1 rounded-lg ${currentTab==='operational'?'bg-purple-500/20 text-purple-300':'text-gray-400'}`}>Hub MJ</button>
                <button onClick={() => setCurrentTab('codex')} className={`px-2.5 py-1 rounded-lg ${currentTab==='codex'?'bg-blue-500/20 text-blue-300':'text-gray-400'}`}>Codex</button>
                {session.role === 'admin' && (
                  <button onClick={() => setCurrentTab('admin')} className={`px-2.5 py-1 rounded-lg ${currentTab==='admin'?'bg-red-500/20 text-red-300':'text-gray-400'}`}>Admin</button>
                )}
              </div>
            )}
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold">
              {session.avatar} {session.username} ({session.role})
            </span>
            <button onClick={onLogout} className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-red-500/20">
              Déconnexion
            </button>
          </div>
        ) : (
          <button onClick={() => setCurrentTab('auth')} className="bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold px-5 py-2 rounded-xl text-xs shadow-lg hover:opacity-90 transition">
            Se Connecter
          </button>
        )}
      </div>
    </header>
  )
}
