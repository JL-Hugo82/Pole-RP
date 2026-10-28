import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Codex({ session }) {
  const [documents, setDocuments] = useState([])
  const [docTitle, setDocTitle] = useState('')
  const [docCat, setDocCat] = useState('Lore')
  const [docTag, setDocTag] = useState('#Général')
  const [docContent, setDocContent] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    const { data } = await supabase.from('documents').select('*')
    if (data) setDocuments(data)
  }

  async function handleCreateDocument(e) {
    e.preventDefault()
    if (!session) return

    const { error } = await supabase.from('documents').insert([
      { 
        title: docTitle, 
        category: docCat, 
        tag: docTag, 
        content: docContent, 
        author: session.username 
      }
    ])

    if (!error) {
      setDocTitle('')
      setDocContent('')
      await fetchDocuments()
      alert('Document ajouté au Codex avec succès !')
    } else {
      alert('Erreur lors de la création du document.')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* EN-TÊTE */}
      <div className="bg-[#161322] border border-blue-500/30 p-6 rounded-2xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif font-bold text-blue-400">Codex & Archives Staff</h2>
          <p className="text-xs text-gray-400">Documentation officielle, trames publiques et guides de sorts</p>
        </div>
        <span className="text-xs text-blue-300 font-bold bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/30">
          {documents.length} Document(s)
        </span>
      </div>

      {/* FORMULAIRE DE CRÉATION */}
      <form onSubmit={handleCreateDocument} className="bg-[#161322] border border-blue-500/30 p-6 rounded-2xl space-y-3">
        <h3 className="font-serif font-bold text-blue-300 text-sm">Ajouter une notice au Codex</h3>
        <input 
          type="text" 
          value={docTitle} 
          onChange={e => setDocTitle(e.target.value)} 
          required 
          placeholder="Titre du document (ex: Guide des Sortilèges Interdits)" 
          className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500" 
        />
        <div className="grid grid-cols-2 gap-3">
          <select 
            value={docCat} 
            onChange={e => setDocCat(e.target.value)} 
            className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="Lore">Lore</option>
            <option value="Légal">Légal</option>
            <option value="Illégal">Illégal</option>
            <option value="Règlement">Règlement</option>
          </select>
          <input 
            type="text" 
            value={docTag} 
            onChange={e => setDocTag(e.target.value)} 
            placeholder="#Tag (ex: #Potions)" 
            className="bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500" 
          />
        </div>
        <textarea 
          value={docContent} 
          onChange={e => setDocContent(e.target.value)} 
          rows="3" 
          required 
          placeholder="Contenu détaillé de la note..." 
          className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
        ></textarea>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-md">
          Enregistrer au Codex
        </button>
      </form>

      {/* LISTE DES DOCUMENTS */}
      <div className="grid md:grid-cols-2 gap-4">
        {documents.length === 0 ? (
          <div className="md:col-span-2 bg-[#161322] border border-gray-800 p-6 rounded-2xl text-center text-gray-500 text-sm">
            Aucun document pour le moment.
          </div>
        ) : (
          documents.map(dc => (
            <div key={dc.id} className="bg-[#161322] border border-gray-800 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-blue-400 font-bold uppercase">{dc.category} • {dc.tag}</span>
                <span className="text-[10px] text-gray-500">Par {dc.author}</span>
              </div>
              <h4 className="font-serif font-bold text-white text-sm">{dc.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{dc.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}