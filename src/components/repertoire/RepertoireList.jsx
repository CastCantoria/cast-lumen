import React from 'react'
import RepertoireItem from './RepertoireItem'

const RepertoireList = ({ works = [] }) => { // ← Ajout de = [] comme valeur par défaut
  // Vérification de sécurité
  if (!works || works.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎵</div>
        <p className="text-gray-500 text-lg">Aucune œuvre dans le répertoire</p>
        <p className="text-gray-400 text-sm mt-2">
          Le répertoire musical sera bientôt disponible
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {works.map(work => (
        <RepertoireItem key={work.id} work={work} />
      ))}
    </div>
  )
}

export default RepertoireList