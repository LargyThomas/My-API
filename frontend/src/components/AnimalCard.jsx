import React from 'react'
import { Link } from 'react-router-dom'

// Small presentational component that shows a single animal summary
export default function AnimalCard({ animal }) {
  return (
    <div className="animal-card">
      <h3>{animal.name}</h3>
      <h3>{animal.sex}</h3>
      <p>{animal.animal_type} - {animal.breed}</p>
      <p></p>
      <Link to={`/animal/${animal.external_id}`}>Voir</Link>
    </div>
  )
}
