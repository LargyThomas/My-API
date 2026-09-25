import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AnimalHomePreview from '../components/AnimalHomePreview'
import RefugeSection from '../components/RefugeSection'
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

				<section className="refuge-section">
					<RefugeSection />
				</section>

				<section id="animals" style={{ marginTop: 24 }}>
					<h2>Découvrir les animaux</h2>
					<AnimalHomePreview />
				</section>
			</main>
			<Footer />
		</>
	)
}
