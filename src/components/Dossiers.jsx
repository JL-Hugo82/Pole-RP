import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Dossiers({ session }) {
  const [dossiers, setDossiers] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Commerce Légal')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    fetchDossiers()
  }, [])

  async function fetchDossiers() {
    const { data, error } = await supabase.from('dossiers').select('*')
    if (data) setDossiers(data)
  }

  async function handleCreateDossier(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('dossiers').insert([
      { 
        title: newTitle, 
        type: newType, 
        description: newDesc, 
        author: session.username, 
        author_id: session.id, 
        status: 'En attente' 
      }
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* EN-TÊTE */}
      <div className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif font-bold text-amber-400">Espace Dossiers RP</h2>
          <p className="text-xs text-gray-400">Gérez vos projets d'entreprises et d'organisations</p>
        </div>
        <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
          {dossiers.length} Dossier(s) total
        </span>
      </div>

      {/* FORMULAIRE DE CRÉATION */}
      <div className="bg-[#161322] border border-amber-500/30 p-6 rounded-2xl space-y-4">
        <h3 className="text-md font-serif font-bold text-amber-300">Soumettre un nouveau dossier</h3>
        <form onSubmit={handleCreateDossier} className="grid md:grid-cols-2 gap-4">
          <input 
            type="text" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)} 
            required 
            placeholder="Nom du projet (ex: Boutique Ollivander)" 
            className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500" 
          />
          <select 
            value={newType} 
            onChange={e => setNewType(e.target.value)} 
            className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="Commerce Légal">Commerce Légal</option>
            <option value="Organisation Clandestine">Organisation Clandestine</option>
            <option value="Faction Sorcière">Faction Sorcière</option>
          </select>
          <textarea 
            value={newDesc} 
            onChange={e => setNewDesc(e.target.value)} 
            rows="3" 
            required 
            placeholder="Description détaillée du projet..." 
            className="md:col-span-2 bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
          ></textarea>
          <button type="submit" className="md:col-span-2 bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold py-2.5 rounded-xl text-sm shadow-md hover:opacity-90 transition">
            Déposer le dossier auprès du Staff
          </button>
        </form>
      </div>

      {/* LISTE DES DOSSIERS */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-gray-200">Dossiers enregistrés en base</h3>
        {dossiers.length === 0 ? (
          <div className="bg-[#161322] border border-gray-800 p-6 rounded-2xl text-center text-gray-500 text-sm">
            Aucun dossier pour le moment.
          </div>
        ) : (
          dossiers.map(d => (
            <div key={d.id} className="bg-[#161322] border border-gray-800 p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase">{d.type}</span>
                  <h4 className="text-lg font-serif font-bold text-white">{d.title}</h4>
                  <span className="text-[10px] text-gray-400">Par {d.author}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {d.status}
                </span>
              </div>
              <p className="text-sm text-gray-300">{d.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}