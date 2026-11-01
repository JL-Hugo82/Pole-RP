import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Home({ session, setCurrentTab }) {
  const [openPositions, setOpenPositions] = useState([])

  useEffect(() => {
    fetchOpenPositions()
  }, [])

  async function fetchOpenPositions() {
    const { data } = await supabase.from('positions').select('*')
    if (data && data.length > 0) {
      setOpenPositions(data)
    } else {
      // Données de démonstration si la table est vide
      setOpenPositions([
        { id: 1, title: 'Auror Stagiaire', category: 'Ministère', status: 'Disponible' },
        { id: 2, title: 'Botaniste Érudit', category: 'Commerces', status: 'Disponible' },
        { id: 3, title: 'Membre Faction Ombre', category: 'Clandestin', status: 'Réservé' }
      ])
    }
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-6">
      
      {/* HERO SECTION DYNAMIQUE */}
      <div className="relative bg-[#161322] border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl overflow-hidden space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest animate-pulse">
          Serveur Roleplay Sorcier Elderwood
        </span>

        <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
          Bienvenue sur le Hub du Pôle RP
        </h1>

        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Incarnez votre sorcier, forgez vos alliances, créez vos entreprises magiques et participez à des trames immersives animées en direct par notre équipe de MJ.
        </p>

        {/* CTA BOUTONS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => setCurrentTab(session ? 'dossiers' : 'auth')} 
            className="w-full sm:w-auto bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-xl hover:scale-105 transition"
          >
            {session ? 'Accéder à mes Dossiers' : 'Se Connecter / Rejoindre'}
          </button>
          
          <button 
            onClick={() => setCurrentTab('rules')} 
            className="w-full sm:w-auto bg-black/50 border border-amber-500/40 text-amber-300 font-bold px-8 py-3.5 rounded-2xl text-sm hover:bg-amber-500/10 transition"
          >
            Consulter le Règlement HRP
          </button>
        </div>
      </div>

      {/* SECTION POSTES ET PLACES DISPONIBLES */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-800 pb-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-400">Postes & Intrigues Disponibles</h2>
            <p className="text-xs text-gray-400">Places libres à pourvoir pour lancer votre RP sur Elderwood</p>
          </div>
          <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl font-bold">
            Actualisé par le Staff
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {openPositions.map(pos => (
            <div key={pos.id} className="bg-[#161322] border border-gray-800 p-5 rounded-2xl space-y-2 hover:border-amber-500/40 transition">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400/80">{pos.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pos.status === 'Disponible' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
                  {pos.status}
                </span>
              </div>
              <h3 className="font-serif font-bold text-white text-base">{pos.title}</h3>
              <p className="text-xs text-gray-400">Déposez un dossier RP pour solliciter ce rôle.</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}