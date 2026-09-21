import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AnimalList from '../components/AnimalList'
import heroImg from '../assets/preview_image20241130-1-1wf2bxw.svg'

// Simple, friendly homepage with hero and animal list preview
export default function Home() {
	return (
		<>
			<Header />
			<main className="page">
				<section className="hero">
					<div className="hero-content">
						<h1>Trouver votre nouveau compagnon !</h1>
						<p className="lead">Découvre des fiches d'animaux. Parcours, cherche, et apprends.</p>
					</div>
					<div className="hero-image">
						<img src={heroImg} alt="Placeholder" />
					</div>
				</section>

				<section id="animals" style={{ marginTop: 24 }}>
					<h2>Derniers animaux</h2>
					<AnimalList />
				</section>
			</main>
			<Footer />
		</>
	)
}
