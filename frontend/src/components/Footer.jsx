import React from 'react'
import '../styles/Footer.css'

// Simple footer placeholder
export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer-description">
				<h1>Austin Shelter</h1>
				<p>
					Donnez une seconde chance à un animal et trouvez le compagnon qui vous correspond.
					Découvrez les animaux disponibles à l’adoption et offrez-leur un nouveau foyer rempli d’amour.
					Admissions au Centre Animal du 1er octobre 2013 au 5 mai 2025.
				</p>
			</div>

			<div className="footer-links">
				<a href="/privacy">Politique de confidentialité</a>
				<a href="/terms">Conditions d'utilisation</a>
				<a href="/contact">Contact</a>
				<a href="/donation">Faire un don</a>
			</div>
			<p>&copy; 2026 Austin Shelter App. Tous droits réservés.</p>
		</footer>
	)
}
