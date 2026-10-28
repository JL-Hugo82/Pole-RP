import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function OperationalHub({ session, staffStatuses, setStaffStatuses }) {
  const [trameTitle, setTrameTitle] = useState('')
  const [trameTarget, setTrameTarget] = useState('')
  const [trameDesc, setTrameDesc] = useState('')
  const [trameReward, setTrameReward] = useState('')

  function setStaffStatus(status) {
    if (!session) return
    setStaffStatuses(prev => ({
      ...prev,
      [session.username]: { 
        status, 
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) 
      }
    }))
  }

  async function handleCreateTrame(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('trames').insert([
      { 
        title: trameTitle, 
        target: trameTarget, 
        description: trameDesc, 
        reward: trameReward, 
        mj: session.username, 
        status: 'En cours' 
      }
    ])

    if (!error) {
      setTrameTitle('')
      setTrameTarget('')
      setTrameDesc('')
      setTrameReward('')
      alert('Trame créée et assignée avec succès !')
    } else {
      alert('Erreur lors de la création de la trame.')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* EN-TÊTE ET STATUTS */}
      <div className="bg-[#161322] border border-purple-500/30 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-purple-400">Hub Opérationnel MJ & Staff</h2>
          <p className="text-xs text-gray-400">Gestion des présences et attribution des trames</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setStaffStatus('Disponible')} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition">Dispo</button>
          <button onClick={() => setStaffStatus('En Scène')} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition">En Scène</button>
          <button onClick={() => alert(`${session.username} demande de l'assistance d'urgence !`)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white animate-pulse shadow-lg">Besoin d'Aide</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LISTE DES PRESENCES */}
        <div className="bg-[#161322] border border-gray-800 p-6 rounded-2xl space-y-3">
          <h3 className="font-serif font-bold text-purple-300 text-sm">Présences Staff en direct</h3>
          {Object.keys(staffStatuses).length === 0 ? (
            <p className="text-xs text-gray-500">Aucun statut renseigné pour l'instant.</p>
          ) : (
            Object.entries(staffStatuses).map(([stUser, stInfo]) => (
              <div key={stUser} className="flex justify-between items-center p-3 bg-black/40 rounded-xl text-xs border border-gray-800">
                <span className="font-bold text-white">{stUser}</span>
                <span className="px-2.5 py-1 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">{stInfo.status} ({stInfo.time})</span>
              </div>
            ))
          )}
        </div>

        {/* FORMULAIRE DE TRAME */}
        <form onSubmit={handleCreateTrame} className="bg-[#161322] border border-purple-500/30 p-6 rounded-2xl space-y-3">
          <h3 className="font-serif font-bold text-purple-300 text-sm">Assigner une Trame RP</h3>
          <input type="text" value={trameTitle} onChange={e => setTrameTitle(e.target.value)} required placeholder="Nom de la trame" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500" />
          <input type="text" value={trameTarget} onChange={e => setTrameTarget(e.target.value)} required placeholder="Joueur ou Groupe cible" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500" />
          <textarea value={trameDesc} onChange={e => setTrameDesc(e.target.value)} rows="2" required placeholder="Description détaillée..." className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"></textarea>
          <input type="text" value={trameReward} onChange={e => setTrameReward(e.target.value)} placeholder="Récompenses prévues" className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500" />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md">Créer et Assigner la Trame</button>
        </form>
      </div>
    </div>
  )
}