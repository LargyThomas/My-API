import React, { useEffect, useState } from 'react'
import { getAnimals } from '../services/api'
import AnimalCard from './AnimalCard'
import '../styles/Animals.css'

// Component that loads a page of animals and shows simple pagination
export default function AnimalList() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(false)
	const [page, setPage] = useState(1)
	const [pagination, setPagination] = useState({})

	useEffect(() => {
		setLoading(true)

		getAnimals({ page })
			.then(({ data, pagination }) => {
				setItems(data || [])
				setPagination(pagination || {})
			})
			.finally(() => setLoading(false))
	}, [page])

	const handlePrev = () => setPage((p) => Math.max(1, p - 1))
	const handleNext = () => setPage((p) => Math.min(pagination.totalPages || p + 1, p + 1))

	return (
		<div>
			{loading && <p>Chargement...</p>}

			{!loading && (!Array.isArray(items) || items.length === 0) && <p>Aucun animal</p>}

			{!loading && Array.isArray(items) && items.length > 0 && (
				<div className="animal-list">
					{items.map((animal, idx) => (
						<AnimalCard key={animal.id ?? animal.external_id ?? idx} animal={animal} />
					))}
				</div>
			)}

			<div className="pagination-controls">
				<button onClick={handlePrev} disabled={!pagination.hasPrevious}>
					Précédent
				</button>
				<span>
					Page {pagination.page || page} / {pagination.totalPages || '-'}
				</span>
				<button onClick={handleNext} disabled={!pagination.hasNext}>
					Suivant
				</button>
			</div>
		</div>
	)
}