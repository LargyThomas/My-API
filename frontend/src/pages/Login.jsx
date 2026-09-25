import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../services/auth'
import useAuth from '../hooks/useAuth'
import '../styles/Login.css'

// Login page: simple form that stores token with useAuth
export default function Login() {  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

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
      </form>

      <div className="">
        <button type="button" onClick={() => (window.location.href = "/")}>Retour à l'accueil</button>
      </div>

    </main>
  )
}
