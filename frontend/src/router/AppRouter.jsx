import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Animal from '../pages/Animal'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import useAuth from '../hooks/useAuth'

// Small wrapper to protect private routes
function PrivateRoute({ children }) {
	const { token } = useAuth()

	if (!token) {
		return <Navigate to="/login" replace />
	}

	return children
}

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/animal/:id" element={<Animal />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
			</Routes>
		</BrowserRouter>
	)
}
