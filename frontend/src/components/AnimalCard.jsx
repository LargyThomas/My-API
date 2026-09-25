import React from 'react'
import { Link } from 'react-router-dom'
import { getAnimalImageUrl } from '../utils/animalImage'
import { translateAnimalType, translateSex } from '../utils/translate'

export default function AnimalCard({ animal }) {
  const imageUrl = getAnimalImageUrl(animal)

  return (
    <div className="cards-container">
      <div className="animal-card">
        <div className="card-image">
          <img
            src={imageUrl}
            alt={animal?.name || 'Animal'}
            onError={(event) => {
              event.currentTarget.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80'
              event.currentTarget.onerror = null
            }}
          />
        </div>

        <h3>{animal.name}</h3>
        <h3>{translateSex(animal.sex)}</h3>
        <p>{translateAnimalType(animal.animal_type)} - {animal.breed}</p>
        <Link to={`/animal/${animal.external_id}`}>Voir</Link>
      </div>
    </div>
  )
}