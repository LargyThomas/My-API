import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAnimal } from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { translateAnimalType, translateSex, translateOrigin, translateColor, translateCondition } from '../utils/translate'
import { getAnimalImageUrl } from '../utils/animalImage'
import '../styles/Animal.css'

// Turns the raw "is_intact" boolean into a readable label.
function getSterilizedLabel(isIntact) {
	if (isIntact === true) return 'Non'
	if (isIntact === false) return 'Oui'
	return 'Inconnu'
}

// Turns a date string into a readable French date (ex: 12/03/2021)
function formatDate(dateString) {
	if (!dateString) return 'Inconnue'
	const date = new Date(dateString)
	return date.toLocaleDateString('fr-FR')
}

// Small helper to turn the raw intake condition into a short human sentence
function getDescription(animal) {
	if (!animal.outcome_subtype) return 'Pas de description particulière pour cet animal.'
	return `Arrivé(e) au refuge, état à l'arrivée : ${translateCondition(animal.outcome_subtype)}.`
}

export default function Animal() {
	const { id } = useParams()
	const [animal, setAnimal] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		let isMounted = true

		setLoading(true)
		setError(null)

		getAnimal(id)
			.then((result) => {
				if (isMounted) {
					setAnimal(result)
				}
			})
			.catch((err) => {
				console.error('Error loading animal', err)
				if (isMounted) {
					setError("Impossible de charger l'animal")
				}
			})
			.finally(() => {
				if (isMounted) {
					setLoading(false)
				}
			})

		return () => {
			isMounted = false
		}
	}, [id])

	if (loading) return <div className="page">Chargement...</div>
	if (error) return <div className="page">{error}</div>
	if (!animal) return <div className="page">Aucun animal trouvé</div>

	const imageUrl = getAnimalImageUrl(animal)

	return (
		<>
			<Header />
			<main className="page">
				<div className="animal-sheet">
					<div className="animal-photo-card">
						<img
							src={imageUrl}
							alt={animal.name || 'Animal'}
							className="animal-photo"
							onError={(event) => {
								event.currentTarget.src = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80'
								event.currentTarget.onerror = null
							}}
						/>
						<p className="animal-description">{getDescription(animal)}</p>
						<span className="animal-id-badge">{animal.external_id}</span>
					</div>

					<div className="animal-info">
						<h1 className="animal-name">{animal.name || 'Nom inconnu'}</h1>

						<div className="animal-pills">
							<span className="pill">{animal.breed || 'Race inconnue'}</span>
							<span className="pill">{animal.age_outcome_days ?? '?'} jours ici</span>
						</div>

						<ul className="animal-details">
							<li><strong>Espèce :</strong> {translateAnimalType(animal.animal_type) || 'Inconnue'}</li>
							<li><strong>Date d'arrivée :</strong> {formatDate(animal.outcome_datetime)}</li>
							<li><strong>Sexe :</strong> {translateSex(animal.sex) || 'Inconnu'}</li>
							<li><strong>D'où il vient :</strong> {translateOrigin(animal.outcome_type) || 'Inconnu'}</li>
							<li><strong>Couleurs :</strong> {translateColor(animal.color) || 'Inconnues'}</li>
							<li><strong>Stérilisé :</strong> {getSterilizedLabel(animal.is_intact)}</li>
							<li><strong>Date d'anniversaire :</strong> {formatDate(animal.date_of_birth)}</li>
						</ul>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}