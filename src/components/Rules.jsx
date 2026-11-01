import React, { useState } from 'react'

export default function Rules() {
  const [activeTab, setActiveTab] = useState('hrp')

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      
      {/* EN-TÊTE */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-extrabold text-amber-400">
          Règlement & Cadre Légal Elderwood
        </h1>
        <p className="text-xs text-gray-400">
          Ensemble des directives HRP et lois RP régissant la communauté et le monde magique.
        </p>
      </div>

      {/* ONGLETS SÉLECTION */}
      <div className="flex justify-center space-x-2 border-b border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab('hrp')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'hrp'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-black/40 text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          📜 Règlement Général HRP
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'legal'
              ? 'bg-amber-500 text-black shadow-lg'
              : 'bg-black/40 text-gray-400 border border-gray-800 hover:text-white'
          }`}
        >
          ⚖️ Cadre Légal & Illégal (In-Game)
        </button>
      </div>

      {/* CONTENU : RÈGLEMENT HRP */}
      {activeTab === 'hrp' && (
        <div className="space-y-4">
          <div className="bg-[#161322] border border-amber-500/20 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-amber-300 text-base flex items-center gap-2">
              <span>1.</span> Respect & Fairplay
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Le respect mutuel est obligatoire entre tous les joueurs et membres du staff. Le Metagaming, Powergaming et Stream-hack sont strictement interdits sous peine de sanction immédiate.
            </p>
          </div>

          <div className="bg-[#161322] border border-amber-500/20 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-amber-300 text-base flex items-center gap-2">
              <span>2.</span> Incarner son Personnage (FearRP & PainRP)
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Vous devez crédiblement ressentir la peur face au danger magique ou mortel (FearRP). La douleur et les blessures reçues lors d'affrontements doivent être obligatoirement jouées (PainRP).
            </p>
          </div>

          <div className="bg-[#161322] border border-amber-500/20 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-amber-300 text-base flex items-center gap-2">
              <span>3.</span> Mort RP & Dossiers Sensibles
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              La mort définitive d'un personnage (Mort RP) nécessite obligatoirement un dossier validé au préalable par l'équipe d'Administration et de Gestion. Aucun meurtre spontané sans trame n'est toléré.
            </p>
          </div>
        </div>
      )}

      {/* CONTENU : LÉGISLATION IN-GAME */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="bg-[#161322] border border-red-500/20 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-red-400 text-base flex items-center gap-2">
              <span>🔴</span> Magie Noire & Infracteurs Interdits
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              L'usage des Sortilèges Impardonnables (Endoloris, Imperium, Avada Kedavra) entraîne des poursuites directes par le Ministère de la Magie et une incarcération à Azkaban. La détention d'objets sombres ou d'ingrédients proscrits est passible d'amendes lourdes.
            </p>
          </div>

          <div className="bg-[#161322] border border-green-500/20 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-green-400 text-base flex items-center gap-2">
              <span>🟢</span> Activités Légales & Commerces
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Tout commerce, officine ou établissement de services doit faire l'objet d'un bon de commande et d'un registre validé auprès du Pôle RP. La fraude fiscale magique et la vente sans licence sont réglementées par le Ministère.
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
