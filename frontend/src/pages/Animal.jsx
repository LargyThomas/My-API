import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAnimal } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Animal detail page
export default function Animal() {
  const { id } = useParams()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    getAnimal(id)
      .then((a) => {
        if (!mounted) return
        setAnimal(a)
      })
      .catch((err) => {
        console.error('Error loading animal', err)
        if (mounted) setError('Impossible de charger l\'animal')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="page">Chargement...</div>
  if (error) return <div className="page">{error}</div>
  if (!animal) return <div className="page">Aucun animal trouvé</div>

  return (
    <>
      <Header />
      <main className="page">
        <div className="card">
          <h1>{animal.name}</h1>
          <p><strong>Type:</strong> {animal.animal_type || animal.type}</p>
          <p><strong>Race:</strong> {animal.breed}</p>
          <pre>{JSON.stringify(animal, null, 2)}</pre>
        </div>
      </main>
      <Footer />
    </>
  )
}
