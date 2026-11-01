import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth({ setSession, setCurrentTab }) {
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Champs Connexion
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Champs Inscription
  const [rpName, setRpName] = useState('')
  const [oocPseudo, setOocPseudo] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regAvatar, setRegAvatar] = useState('')
  const [regBio, setRegBio] = useState('')

  // GESTION CONNEXION
  async function handleLogin(e) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', loginUsername)
      .eq('password', loginPassword)
      .single()

    if (error || !data) {
      alert('Identifiants incorrects ou compte inexistant.')
    } else {
      setSession(data)
      setCurrentTab('home')
    }
  }

  // GESTION INSCRIPTION
  async function handleRegister(e) {
    e.preventDefault()
    
    // Format du pseudo combiné : "Nom RP | Pseudo"
    const fullUsername = `${rpName.trim()} | ${oocPseudo.trim()}`
    const defaultAvatar = regAvatar.trim() || '🧙‍♂️'

    const { data, error } = await supabase.from('users').insert([
      {
        username: fullUsername,
        password: regPassword,
        role: 'joueur',
        avatar: defaultAvatar,
        bio: regBio
      }
    ]).select().single()

    if (error) {
      alert('Erreur lors de la création du compte (pseudo peut-être déjà pris).')
    } else {
      alert('Compte RP créé avec succès ! Connexion automatique...')
      setSession(data)
      setCurrentTab('home')
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-[#161322] border border-amber-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* EN-TÊTE FORMULAIRE */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-extrabold text-2xl mx-auto shadow-lg">
            🔮
          </div>
          <h2 className="text-2xl font-serif font-extrabold text-amber-400">
            {isRegistering ? 'Rejoindre Elderwood' : 'Portail de Connexion'}
          </h2>
          <p className="text-xs text-gray-400">
            {isRegistering 
              ? 'Créez votre identité sorcière pour participer au RP' 
              : 'Accédez à vos dossiers et au réseau du Pôle RP'}
          </p>
        </div>

        {/* FORMULAIRE CONNEXION */}
        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Nom RP | Pseudo</label>
              <input 
                type="text" 
                value={loginUsername} 
                onChange={e => setLoginUsername(e.target.value)} 
                required 
                placeholder="Ex: Harry Potter | Dadou" 
                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 transition" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Mot de passe</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)} 
                required 
                placeholder="••••••••" 
                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 transition" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold py-3 rounded-xl text-xs shadow-lg hover:scale-[1.02] transition"
            >
              Se Connecter
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)} 
                className="text-xs text-amber-400 hover:underline"
              >
                Pas encore de compte ? Créer un compte RP
              </button>
            </div>
          </form>
        ) : (
          /* FORMULAIRE INSCRIPTION */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block
