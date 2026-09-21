import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useAuth from '../hooks/useAuth'
import { me } from '../services/auth'

// Simple dashboard for authenticated users
export default function Dashboard() {
	const { token, logout } = useAuth()
	const [user, setUser] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		let mounted = true
		async function fetchUser() {
			if (!token) return
			try {
				const data = await me()
				if (mounted) setUser(data)
			} catch (err) {
				console.error('failed to fetch user', err)
			}
		}
		fetchUser()
		return () => { mounted = false }
	}, [token])

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	const name = user && (user.name || user.nom || user.firstName || user.firstname || user.email)

	return (
		<>
			<Header />
			<main className="page">
				<div className="card">
					<h1>Dashboard</h1>
					{name ? (
						<p>Bonjour {name} — que voulez-vous faire aujourd'hui ?</p>
					) : (
						<p>Tu es connecté.</p>
					)}
					<button onClick={handleLogout}>Se déconnecter</button>
				</div>
			</main>
			<Footer />
		</>
	)
}
