import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useAuth from '../hooks/useAuth'
import { getAnimals, getAnimalTypes, createAnimal, updateAnimal, deleteAnimal } from '../services/api'
import '../styles/Dashboard.css'

export default function Dashboard() {
	const { token, logout } = useAuth()
	const navigate = useNavigate()

	const [animals, setAnimals] = useState([])
	const [animalTypes, setAnimalTypes] = useState([])
	const [outcomeTypes, setOutcomeTypes] = useState([])
	const [editingId, setEditingId] = useState(null)
	const [editForm, setEditForm] = useState({})
	const [createForm, setCreateForm] = useState({
		external_id: '', name: '', animal_type_id: '', outcome_type_id: '', sex: 'Unknown', breed: ''
	})
	const [feedback, setFeedback] = useState('')
	const [page, setPage] = useState(1)
	const [pagination, setPagination] = useState({})

	// Load animals + reference data (types), reusable after create/update/delete
	const loadData = async (targetPage = page) => {
		const [animalsRes, typesRes] = await Promise.all([
			getAnimals({ page: targetPage, limit: 20 }),
			getAnimalTypes()
		])
		setAnimals(animalsRes.data)
		setPagination(animalsRes.pagination)
		setAnimalTypes(typesRes.animalTypes || [])
		setOutcomeTypes(typesRes.outcomeTypes || [])
	}

	useEffect(() => {
		loadData(page)
	}, [page])

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	// --- Create ---
	const handleCreateChange = (e) => {
		setCreateForm({ ...createForm, [e.target.name]: e.target.value })
	}

	const handleCreateSubmit = async (e) => {
		e.preventDefault()
		setFeedback('')
		try {
			await createAnimal({
				...createForm,
				animal_type_id: createForm.animal_type_id ? parseInt(createForm.animal_type_id, 10) : null,
				outcome_type_id: createForm.outcome_type_id ? parseInt(createForm.outcome_type_id, 10) : null
			})
			setCreateForm({ external_id: '', name: '', animal_type_id: '', outcome_type_id: '', sex: 'Unknown', breed: '' })
			setFeedback('Animal créé avec succès.')
			loadData()
		} catch (err) {
			console.error(err)
			setFeedback("Erreur lors de la création de l'animal.")
		}
	}

	// --- Edit ---
	const startEdit = (animal) => {
		setEditingId(animal.external_id)
		setEditForm({
			name: animal.name || '',
			date_of_birth: animal.date_of_birth ? animal.date_of_birth.slice(0, 10) : '',
			age_outcome_days: animal.age_outcome_days || ''
		})
	}

	const cancelEdit = () => {
		setEditingId(null)
		setEditForm({})
	}

	const handleEditChange = (e) => {
		setEditForm({ ...editForm, [e.target.name]: e.target.value })
	}

	const handleEditSubmit = async (externalId) => {
		setFeedback('')
		try {
			await updateAnimal(externalId, editForm)
			setFeedback('Animal mis à jour.')
			cancelEdit()
			loadData()
		} catch (err) {
			console.error(err)
			setFeedback("Erreur lors de la mise à jour de l'animal.")
		}
	}

	// --- Delete ---
	const handleDelete = async (externalId) => {
		if (!window.confirm(`Supprimer l'animal ${externalId} ?`)) return
		setFeedback('')
		try {
			await deleteAnimal(externalId)
			setFeedback('Animal supprimé.')
			loadData()
		} catch (err) {
			console.error(err)
			setFeedback("Erreur lors de la suppression de l'animal.")
		}
	}

	return (
		<>
			<Header />
			<main className="page dashboard-page">
				<div className="card">
					<h1>Dashboard</h1>
					<p>Tu es connecté.</p>
				</div>

				{feedback && <p className="dashboard-feedback">{feedback}</p>}

				<div className="card">
					<h2>Ajouter un animal</h2>
					<form onSubmit={handleCreateSubmit} className="dashboard-form">
						<input name="external_id" placeholder="ID externe (ex. A999999)" value={createForm.external_id} onChange={handleCreateChange} required />
						<input name="name" placeholder="Nom" value={createForm.name} onChange={handleCreateChange} />
						<select name="animal_type_id" value={createForm.animal_type_id} onChange={handleCreateChange} required>
							<option value="">Type d'animal</option>
							{animalTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
						</select>
						<select name="outcome_type_id" value={createForm.outcome_type_id} onChange={handleCreateChange}>
							<option value="">Type d'événement</option>
							{outcomeTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
						</select>
						<select name="sex" value={createForm.sex} onChange={handleCreateChange}>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Unknown">Unknown</option>
						</select>
						<input name="breed" placeholder="Race" value={createForm.breed} onChange={handleCreateChange} />
						<button type="submit">Créer</button>
					</form>
				</div>

				<div className="card">
					<h2>Gérer les animaux</h2>
					<table className="dashboard-table">
						<thead>
							<tr>
								<th>ID</th><th>Nom</th><th>Type</th><th>Race</th><th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{animals.map((animal) => (
								<tr key={animal.external_id}>
									{editingId === animal.external_id ? (
										<>
											<td>{animal.external_id}</td>
											<td><input name="name" value={editForm.name} onChange={handleEditChange} /></td>
											<td colSpan={2}>
												<input type="date" name="date_of_birth" value={editForm.date_of_birth} onChange={handleEditChange} />
												<input type="number" name="age_outcome_days" value={editForm.age_outcome_days} onChange={handleEditChange} placeholder="Âge (jours)" />
											</td>
											<td>
												<button onClick={() => handleEditSubmit(animal.external_id)}>Sauver</button>
												<button onClick={cancelEdit}>Annuler</button>
											</td>
										</>
									) : (
										<>
											<td>{animal.external_id}</td>
											<td>{animal.name}</td>
											<td>{animal.animal_type}</td>
											<td>{animal.breed}</td>
											<td>
												<button onClick={() => startEdit(animal)}>Modifier</button>
												<button onClick={() => handleDelete(animal.external_id)}>Supprimer</button>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
					<div className="dashboard-pagination">
						<button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!pagination.hasPrevious}>
							Précédent
						</button>
						<span>Page {pagination.page || page} / {pagination.totalPages || '-'}</span>
						<button onClick={() => setPage((p) => (pagination.hasNext ? p + 1 : p))} disabled={!pagination.hasNext}>
							Suivant
						</button>
					</div>
				</div>
			</main>
			<Footer />
		</>
	)
}