import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [dossiers, setDossiers] = useState([])
  const [currentTab, setCurrentTab] = useState('home')
  const [authMode, setAuthMode] = useState('login')
  
  // Formulaire d'auth
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Formulaire nouveau dossier
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Commerce Légal')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    fetchDossiers()
  }, [])

  async function fetchDossiers() {
    const { data } = await supabase.from('dossiers').select('*')
    if (data) setDossiers(data)
  }

  // Connexion sécurisée Supabase
  async function handleLogin(e) {
    e.preventDefault()
    const cleanUser = username.trim()

    // Requête directe dans Supabase
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', cleanUser)
      .eq('password', password)

    if (error) {
      alert('Erreur lors de la connexion.')
      return
    }

    if (users && users.length > 0) {
      setSession(users[0])
      setCurrentTab('dossiers')
      alert(`Bienvenue, ${users[0].username} !`)
    } else {
      // Si c'est Armin et que le compte n'existe pas encore dans Supabase, on le crée automatiquement
      if (cleanUser.toLowerCase() === 'armin' && password === 'armin') {
        const { data: newUser } = await supabase.from('users').insert([
          { username: 'Armin', password: 'armin', role: 'admin', avatar: '🧙‍♂️', title: 'Fondateur / Admin' }
        ]).select()

        if (newUser && newUser.length > 0) {
          setSession(newUser[0])
          setCurrentTab('dossiers')
          alert('Compte Administrateur Armin initialisé avec succès !')
          return
        }
      }
      alert('Identifiant ou mot de passe incorrect.')
    }
  }

  // Inscription
  async function handleRegister(e) {
    e.preventDefault()
    const cleanUser = username.trim()

    // Vérification existence
    const { data: existing } = await supabase.from('users').select('id').ilike('username', cleanUser)
    if (existing && existing.length > 0) {
      alert('Ce pseudo existe déjà.')
      return
    }

    const { data, error } = await supabase.from('users').insert([
      { username: cleanUser, password: password, role: 'joueur', avatar: '🧙‍♂️', title: 'Sorcier Résident' }
    ]).select()

    if (error) {
      alert('Erreur lors de l’inscription.')
    } else if (data) {
      setSession(data[0])
      setCurrentTab('dossiers')
      alert('Compte créé avec succès !')
    }
  }

  // Créer un dossier
  async function handleCreateDossier(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('dossiers').insert([
      { title: newTitle, type: newType, description: newDesc, author: session.username, author_id: session.id, status: 'En attente' }
    ])

    if (error) {
      alert('Erreur lors de la création du dossier.')
    } else {
      setNewTitle('')
      setNewDesc('')
      await fetchDossiers()
      alert('Dossier soumis au Staff avec succès !')
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
              <button onClick={() => { setSession(null); setCurrentTab('home'); }} className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl font-bold hover:bg-red-500/20">
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
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">Base de Données en Direct</span>
              <h2 className="text-4xl font-serif font-extrabold text-amber-400">Le Hub Officiel du Pôle RP Nanos</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Connecte-toi pour déposer tes dossiers d'organisations, suivre leur validation et synchroniser tes données en temps réel.
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
              <h2 className="text-2xl font-serif font-bold text-amber-400">{authMode === 'login' ? 'Connexion' : 'Créer un Compte'}</h2>
              <p className="text-xs text-gray-400">Admin par défaut : Armin / armin</p>
            </div>

            {authMode === 'login' ? (
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
                <p className="text-center text-xs text-gray-400 pt-2">
                  Pas de compte ? <button type="button" onClick={() => setAuthMode('register')} className="text-amber-400 underline font-bold">S'inscrire</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Nom RP / Pseudo</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Ex: Harry Potter" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Mot de passe</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold py-3 rounded-xl text-sm hover:bg-amber-500/30 transition">
                  Créer mon compte joueur
                </button>
                <p className="text-center text-xs text-gray-400 pt-2">
                  Déjà un compte ? <button type="button" onClick={() => setAuthMode('login')} className="text-amber-400 underline font-bold">Se connecter</button>
                </p>
              </form>
            )}
          </div>
        )}

        {currentTab === 'dossiers' && session && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-bold text-amber-400">Espace Dossiers RP</h2>
                <p class="text-xs text-gray-400">Gérez vos projets d'entreprises et d'organisations</p>
              </div>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">{dossiers.length} Dossier(s) total</span>
            </div>

            {/* FORMULAIRE DE CRÉATION */}
            <div className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-serif font-bold text-amber-300">Soumettre un nouveau dossier</h3>
              <form onSubmit={handleCreateDossier} className="grid md:grid-cols-2 gap-4">
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Nom du projet (ex: Boutique Ollivander)" className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                <select value={newType} onChange={e => setNewType(e.target.value)} className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none">
                  <option value="Commerce Légal">Commerce Légal</option>
                  <option value="Organisation Clandestine">Organisation Clandestine</option>
                  <option value="Faction Sorcière">Faction Sorcière</option>
                </select>
                <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows="3" required placeholder="Description détaillée du projet..." className="md:col-span-2 bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none"></textarea>
                <button type="submit" className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold py-2.5 rounded-xl text-sm shadow-md hover:opacity-90">
                  Déposer le dossier auprès du Staff
                </button>
              </form>
            </div>

            {/* LISTE DES DOSSIERS */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold text-gray-200">Dossiers enregistrés en base</h3>
              {dossiers.length === 0 ? (
                <div className="bg-[#161322] border border-gray-800 p-6 rounded-2xl text-center text-gray-500 text-sm">Aucun dossier pour le moment.</div>
              ) : (
                dossiers.map(d => (
                  <div key={d.id} className="bg-[#161322] border border-gray-800 p-6 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <div>
                        <span className="text-xs text-amber-400 font-bold uppercase">{d.type}</span>
                        <h4 className="text-lg font-serif font-bold text-white">{d.title}</h4>
                        <span className="text-[10px] text-gray-400">Par {d.author}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">{d.status}</span>
                    </div>
                    <p className="text-sm text-gray-300">{d.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}