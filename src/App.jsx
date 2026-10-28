import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])
  const [dossiers, setDossiers] = useState([])
  const [trames, setTrames] = useState([])
  const [documents, setDocuments] = useState([])
  const [staffStatuses, setStaffStatuses] = useState({})
  
  const [currentTab, setCurrentTab] = useState('home')
  const [authMode, setAuthMode] = useState('login')
  
  // Formulaires
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Commerce Légal')
  const [newDesc, setNewDesc] = useState('')

  const [trameTitle, setTrameTitle] = useState('')
  const [trameTarget, setTrameTarget] = useState('')
  const [trameDesc, setTrameDesc] = useState('')
  const [trameReward, setTrameReward] = useState('')

  const [docTitle, setDocTitle] = useState('')
  const [docCat, setDocCat] = useState('Lore')
  const [docTag, setDocTag] = useState('#Général')
  const [docContent, setDocContent] = useState('')

  useEffect(() => {
    fetchAllData()
  }, [])

  async function fetchAllData() {
    const { data: uData } = await supabase.from('users').select('*')
    if (uData) setUsers(uData)

    const { data: dData } = await supabase.from('dossiers').select('*')
    if (dData) setDossiers(dData)

    const { data: tData } = await supabase.from('trames').select('*')
    if (tData) setTrames(tData)

    const { data: docData } = await supabase.from('documents').select('*')
    if (docData) setDocuments(docData)
  }

  // Auth
  async function handleLogin(e) {
    e.preventDefault()
    const cleanUser = username.trim()

    let { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', cleanUser)
      .eq('password', password)

    if (data && data.length > 0) {
      setSession(data[0])
      setCurrentTab('dossiers')
    } else {
      alert('Identifiant ou mot de passe incorrect.')
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    const cleanUser = username.trim()

    const { data, error } = await supabase.from('users').insert([
      { username: cleanUser, password: password, role: 'joueur', avatar: '🧙‍♂️', title: 'Sorcier Résident' }
    ]).select()

    if (error) alert("Erreur lors de l'inscription.")
    else if (data) {
      setSession(data[0])
      setCurrentTab('dossiers')
      fetchAllData()
    }
  }

  // Rôles Admin
  async function handleUpdateRole(userId, newRole) {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId)
    if (!error) {
      alert('Rôle mis à jour avec succès.')
      fetchAllData()
    }
  }

  // Actions Dossiers
  async function handleCreateDossier(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('dossiers').insert([
      { title: newTitle, type: newType, description: newDesc, author: session.username, author_id: session.id, status: 'En attente' }
    ])

    if (!error) {
      setNewTitle('')
      setNewDesc('')
      fetchAllData()
      alert('Dossier soumis avec succès.')
    }
  }

  // Actions Trames
  async function handleCreateTrame(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('trames').insert([
      { title: trameTitle, target: trameTarget, description: trameDesc, reward: trameReward, mj: session.username, status: 'En cours' }
    ])

    if (!error) {
      setTrameTitle('')
      setTrameTarget('')
      setTrameDesc('')
      setTrameReward('')
      fetchAllData()
      alert('Trame créée et assignée avec succès.')
    }
  }

  // Actions Codex Documents
  async function handleCreateDocument(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('documents').insert([
      { title: docTitle, category: docCat, tag: docTag, content: docContent, author: session.username }
    ])

    if (!error) {
      setDocTitle('')
      setDocContent('')
      fetchAllData()
      alert('Document ajouté au Codex.')
    }
  }

  // Statut Staff
  function setStaffStatus(status) {
    if (!session) return
    setStaffStatuses(prev => ({
      ...prev,
      [session.username]: { status, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    }))
  }

  return (
    <div className="min-h-screen bg-[#090a10] text-gray-200 flex flex-col font-sans">
      {/* NAVBAR */}
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

      {/* CONTENU */}
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
            </div>
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Pseudo" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mot de passe" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                <button type="submit" className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold py-3 rounded-xl text-sm shadow-lg">Se Connecter</button>
                <p className="text-center text-xs text-gray-400">Pas de compte ? <button type="button" onClick={() => setAuthMode('register')} className="text-amber-400 underline font-bold">S'inscrire</button></p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Nom RP / Pseudo" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Mot de passe" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none" />
                <button type="submit" className="w-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold py-3 rounded-xl text-sm">Créer mon compte</button>
                <p className="text-center text-xs text-gray-400">Déjà inscrit ? <button type="button" onClick={() => setAuthMode('login')} className="text-amber-400 underline font-bold">Se connecter</button></p>
              </form>
            )}
          </div>
        )}

        {/* DOSSIERS */}
        {currentTab === 'dossiers' && session && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-amber-400">Dossiers d'Organisations</h2>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">{dossiers.length} Dossier(s)</span>
            </div>
            <form onSubmit={handleCreateDossier} className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-serif font-bold text-amber-300">Nouveau Dossier</h3>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Titre du projet" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none" />
              <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none">
                <option value="Commerce Légal">Commerce Légal</option>
                <option value="Organisation Clandestine">Organisation Clandestine</option>
                <option value="Faction Sorcière">Faction Sorcière</option>
              </select>
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows="3" required placeholder="Description..." className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none"></textarea>
              <button type="submit" className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold py-2 rounded-xl text-sm">Déposer le dossier</button>
            </form>
            <div className="space-y-3">
              {dossiers.map(d => (
                <div key={d.id} className="bg-[#161322] border border-gray-800 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif font-bold text-amber-400 text-md">{d.title}</h4>
                    <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">{d.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">Auteur : {d.author} • Type : {d.type}</p>
                  <p className="text-sm text-gray-300">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HUB OPÉRATIONNEL MJ */}
        {currentTab === 'operational' && session && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-[#161322] border border-purple-500/30 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="text-xl font-serif font-bold text-purple-400">Hub Opérationnel MJ & Staff</h2>
                <p className="text-xs text-gray-400">Gestion des présences et attribution des trames</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setStaffStatus('Disponible')} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">Dispo</button>
                <button onClick={() => setStaffStatus('En Scène')} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">En Scène</button>
                <button onClick={() => alert(`${session.username} demande de l'assistance !`)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white animate-pulse">Besoin d'Aide</button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MEMBRES EN DIRECT */}
              <div className="bg-[#161322] border border-gray-800 p-6 rounded-2xl space-y-3">
                <h3 className="font-serif font-bold text-purple-300 text-sm">Présences Staff</h3>
                {Object.keys(staffStatuses).length === 0 ? <p className="text-xs text-gray-500">Aucun statut renseigné.</p> : (
                  Object.entries(staffStatuses).map(([stUser, stInfo]) => (
                    <div key={stUser} className="flex justify-between items-center p-3 bg-black/40 rounded-xl text-xs border border-gray-800">
                      <span className="font-bold text-white">{stUser}</span>
                      <span className="px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300">{stInfo.status} ({stInfo.time})</span>
                    </div>
                  ))
                )}
              </div>

              {/* TRAME */}
              <form onSubmit={handleCreateTrame} className="bg-[#161322] border border-purple-500/30 p-6 rounded-2xl space-y-3">
                <h3 className="font-serif font-bold text-purple-300 text-sm">Assigner une Trame RP</h3>
                <input type="text" value={trameTitle} onChange={e => setTrameTitle(e.target.value)} required placeholder="Nom de la trame" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                <input type="text" value={trameTarget} onChange={e => setTrameTarget(e.target.value)} required placeholder="Joueur ou Groupe cible" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                <textarea value={trameDesc} onChange={e => setTrameDesc(e.target.value)} rows="2" required placeholder="Description..." className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"></textarea>
                <input type="text" value={trameReward} onChange={e => setTrameReward(e.target.value)} placeholder="Récompenses prévues" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-xl text-xs">Créer et Assignée</button>
              </form>
            </div>
          </div>
        )}

        {/* CODEX */}
        {currentTab === 'codex' && session && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#161322] border border-blue-500/30 p-6 rounded-2xl">
              <h2 className="text-xl font-serif font-bold text-blue-400">Codex & Archives Staff</h2>
            </div>
            <form onSubmit={handleCreateDocument} className="bg-[#161322] border border-blue-500/30 p-6 rounded-2xl space-y-3">
              <input type="text" value={docTitle} onChange={e => setDocTitle(e.target.value)} required placeholder="Titre du document" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={docCat} onChange={e => setDocCat(e.target.value)} className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none">
                  <option value="Lore">Lore</option>
                  <option value="Légal">Légal</option>
                  <option value="Illégal">Illégal</option>
                </select>
                <input type="text" value={docTag} onChange={e => setDocTag(e.target.value)} placeholder="#Tag" className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
              </div>
              <textarea value={docContent} onChange={e => setDocContent(e.target.value)} rows="3" required placeholder="Contenu du document..." className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none"></textarea>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs">Ajouter au Codex</button>
            </form>
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map(dc => (
                <div key={dc.id} className="bg-[#161322] border border-gray-800 p-4 rounded-2xl space-y-2">
                  <span className="text-[10px] text-blue-400 font-bold">{dc.category} • {dc.tag}</span>
                  <h4 className="font-serif font-bold text-white text-sm">{dc.title}</h4>
                  <p className="text-xs text-gray-300">{dc.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN */}
        {currentTab === 'admin' && session && session.role === 'admin' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-[#161322] border border-red-500/30 p-6 rounded-2xl">
              <h2 className="text-xl font-serif font-bold text-red-400">Panel Administrateur — Rôles Équipe</h2>
            </div>
            <div className="bg-[#161322] border border-gray-800 p-6 rounded-2xl space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 bg-black/40 rounded-xl text-xs border border-gray-800">
                  <span className="font-bold text-white">{u.avatar} {u.username}</span>
                  <select value={u.role} onChange={e => handleUpdateRole(u.id, e.target.value)} className="bg-black/60 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white outline-none">
                    <option value="joueur">Joueur</option>
                    <option value="mj">MJ</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}