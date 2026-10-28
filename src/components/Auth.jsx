import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth({ setSession, setCurrentTab }) {
  const [authMode, setAuthMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    const cleanUser = username.trim()

    let { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', cleanUser)
      .eq('password', password)

    if (error) {
      alert('Erreur lors de la connexion.')
      return
    }

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
    }
  }

  return (
    <div className="max-w-md mx-auto bg-[#161322] border border-amber-500/40 p-8 rounded-3xl shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif font-bold text-amber-400">
          {authMode === 'login' ? 'Connexion' : 'Créer un Compte'}
        </h2>
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
  )
}