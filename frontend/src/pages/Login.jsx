import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login as apiLogin } from '../services/auth'
import useAuth from '../hooks/useAuth'
import '../styles/Login.css'

// Login page: simple form that stores token with useAuth
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  // If Google redirected us back here with a token in the URL, log in with it
  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    const googleError = searchParams.get('error')

    if (tokenFromUrl) {
      login(tokenFromUrl)
      navigate('/dashboard')
    } else if (googleError) {
      setError('La connexion avec Google a échoué')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await apiLogin({ email, password })
      login(data.token)
      navigate('/dashboard')
    } catch (err) {
      setError('Identifiants invalides')
    }
  }

  const handleGoogleLogin = () => {
    // Full page redirect, not an API call: the browser needs to go through Google itself
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
  }

  return (
    <main className="page auth-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h1>Connexion</h1>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemple.com" />
        </label>

        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Se connecter</button>

        <button type="button" onClick={handleGoogleLogin}>
          Se connecter avec Google
        </button>
      </form>

      <div className="back-button">
        <button type="button" onClick={() => (window.location.href = "/")}>Retour à l'accueil</button>
      </div>
    </main>
  )
}