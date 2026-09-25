import React, { useEffect, useState } from 'react'
import { getAnimals } from '../services/api'
import AnimalCard from './AnimalCard'

// Component for the home preview of animals without pagination
export default function AnimalHomePreview() {
	// Set 5 animals for preview
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)

		getAnimals({ limit: 5 })
			.then(({ data }) => {
				setItems(Array.isArray(data) ? data.slice(0, 5) : [])
			})
			.finally(() => setLoading(false))
	}, [])

	return (
		<div>
			{loading && <p>Chargement...</p>}

			{!loading && items.length === 0 && <p>Aucun animal</p>}

			{!loading && items.length > 0 && (
				<div className="animal-list">
					{items.map((animal, idx) => (
						<AnimalCard
							key={animal.id ?? animal.external_id ?? idx}
							animal={animal}
						/>
					))}
				</div>
			)}
		</div>
	)
}