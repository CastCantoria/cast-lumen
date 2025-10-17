import React, { useState, useEffect } from 'react'
import repertoireService from '../../services/repertoireService'
import RepertoireList from '../../components/repertoire/RepertoireList'
import RepertoireFilters from '../../components/repertoire/RepertoireFilters'

const Repertoire = () => {
  const [works, setWorks] = useState([])
  const [filteredWorks, setFilteredWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadWorks()
  }, [])

  const loadWorks = async () => {
    try {
      const worksData = await repertoireService.getAllWorks()
      setWorks(worksData)
      setFilteredWorks(worksData)
    } catch (error) {
      console.error('Erreur chargement répertoire:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    
    // Filtrage côté client pour l'instant
    let filtered = works
    
    if (newFilters.style) {
      filtered = filtered.filter(work => work.style === newFilters.style)
    }
    if (newFilters.period) {
      filtered = filtered.filter(work => work.period === newFilters.period)
    }
    if (newFilters.difficulty) {
      filtered = filtered.filter(work => work.difficulty === newFilters.difficulty)
    }
    if (newFilters.language) {
      filtered = filtered.filter(work => work.language === newFilters.language)
    }
    if (newFilters.search) {
      const searchTerm = newFilters.search.toLowerCase()
      filtered = filtered.filter(work => 
        work.title?.toLowerCase().includes(searchTerm) ||
        work.composer?.toLowerCase().includes(searchTerm) ||
        work.description?.toLowerCase().includes(searchTerm)
      )
    }
    
    setFilteredWorks(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-light pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du répertoire...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-primary mb-4">Répertoire Musical</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection d'œuvres musicales, des classiques aux contemporains
          </p>
        </div>

        <RepertoireFilters onFilter={handleFilter} />
        
        <div className="mt-8">
          <RepertoireList works={filteredWorks} />
        </div>

        {filteredWorks.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune œuvre trouvée avec les filtres actuels
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Repertoire