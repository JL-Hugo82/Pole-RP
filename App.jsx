import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])
  const [dossiers, setDossiers] = useState([])
  const [currentTab, setCurrentTab] = useState('home')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Charger les utilisateurs et dossiers depuis Supabase au démarrage
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: userData } = await supabase.from('users').select('*')
    if (userData) setUsers(userData)

    const { data: dossierData } = await supabase.from('dossiers').select('*')
    if (dossierData) setDossiers(dossierData)
    setLoading(false)
  }

  // Connexion
  async function handleLogin(e) {
    e.preventDefault()
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password)
    if (user) {
      setSession(user)
      setCurrentTab('dossiers')
      alert(`Bienvenue de retour, ${user.username} !`)
    } else {
      alert('Identifiant ou mot de passe incorrect.')
    }
  }

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-200 flex flex-col font-sans">
      {/* HEADER */}
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
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold">
                {session.avatar} {session.username} ({session.role})
              </span>
              <button onClick={() => setSession(null)} className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold">
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

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {currentTab === 'home' && (
          <div className="space-y-8 py-12 text-center">
            <div className="bg-[#161322] border border-amber-500/30 rounded-3xl p-10 shadow-2xl max-w-3xl mx-auto space-y-6">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">Plateforme Centralisée en Ligne</span>
              <h2 className="text-4xl font-serif font-extrabold text-amber-400">Le Hub Officiel du Pôle RP Nanos</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Désormais, toutes les données sont synchronisées en temps réel. Les comptes, les dossiers et les trames sont partagés instantanément entre tous les membres de l'équipe et les joueurs, quel que soit leur appareil !
              </p>
              <button onClick={() => setCurrentTab('auth')} className="bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold px-8 py-3 rounded-2xl text-sm shadow-xl hover:scale-105 transition">
                Accéder au Portail
              </button>
            </div>
          </div>
        )}

        {currentTab === 'auth' && (
          <div className="max-w-md mx-auto bg-[#161322] border border-amber-500/40 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-amber-400">Connexion</h2>
              <p className="text-xs text-gray-400">Entre tes identifiants (Par défaut - Admin : Armin / armin)</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Nom / Pseudo</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Armin" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold py-3 rounded-xl text-sm shadow-lg hover:opacity-90 transition">
                Se Connecter
              </button>
            </form>
          </div>
        )}

        {currentTab === 'dossiers' && session && (
          <div className="space-y-6">
            <div className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-bold text-amber-400">Espace Dossiers RP</h2>
                <p className="text-xs text-gray-400">Connecté en tant que {session.username} ({session.role})</p>
              </div>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">{dossiers.length} Dossier(s) en base</span>
            </div>
            <div className="bg-[#161322] border border-gray-800 p-6 rounded-2xl text-center text-gray-400 text-sm">
              La base de données Supabase est connectée avec succès ! Les fonctionnalités de dossiers, trames et chat s'intègrent maintenant ici proprement.
            </div>
          </div>
        )}
      </main>
    </div>
  )
}