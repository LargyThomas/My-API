import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AnimalList from '../components/AnimalList'

// Full paginated list of animals (20 per page, handled inside AnimalList)
export default function Animals() {
	return (
		<>
			<Header />
			<main className="page">
				<h1>Tous les animaux</h1>
				<AnimalList />
			</main>
			<Footer />
		</>
	)
}