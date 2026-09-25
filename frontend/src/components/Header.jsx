import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import '../styles/Header.css'

// Header with main navigation links
export default function Header() {
	const { token, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<header>
			<nav>
				<Link to="/">Accueil</Link>
				<Link to="/animals">Nos Animaux</Link>
				<Link to="/refuge">Le Refuge</Link>
				<Link to="/dashboard">Dashboard</Link>
				{!token && <Link to="/login">Connexion</Link>}
				{token && (
					<button onClick={handleLogout} style={{ marginLeft: 8 }}>
						Se déconnecter
					</button>
				)}

			</nav>
		</header>
	)
}
