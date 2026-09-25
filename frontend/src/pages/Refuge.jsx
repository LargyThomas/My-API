import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/Refuge.css'

// Static "About the shelter" page — no API calls needed, just informational content
export default function Refuge() {
	return (
		<>
			<Header />
			<main className="refuge-page">
				<section className="refuge-hero">
					<h1>Austin Animal Center</h1>
					<p className="lead">
						Le plus grand refuge « no-kill » (zéro-euthanasie sauf nécessité) des États-Unis,
						situé à Austin, au Texas.
					</p>
				</section>

				<section className="refuge-block">
					<h2>Qui gère le refuge ?</h2>
					<p>
						Austin Animal Center (AAC) est géré par le service municipal Animal Services Office
						de la ville d'Austin. Il accueille les animaux perdus ou abandonnés d'Austin et du
						comté de Travis, et propose aussi des services de prévention et d'éducation à la
						communauté.
					</p>
				</section>

				<section className="refuge-block">
					<h2>Le mouvement « no-kill »</h2>
					<p>
						Depuis 2010, le conseil municipal d'Austin a fixé un objectif de « taux de sortie
						vivante » (le pourcentage d'animaux qui quittent le refuge vivants, par adoption,
						transfert ou retour au propriétaire) d'au moins 90%. Le refuge a atteint ce seuil
						pour la première fois en février 2011, et l'objectif a été relevé à 95% en 2019.
					</p>
					<p>
						À noter : un audit municipal réalisé en 2023 a souligné que maintenir cet objectif
						élevé peut entrer en tension avec la capacité d'accueil du refuge, notamment en
						période de surpopulation.
					</p>
				</section>

				<section className="refuge-block">
					<h2>D'où viennent les animaux ?</h2>
					<ul>
						<li><strong>Stray</strong> : trouvés errants, sans propriétaire identifié</li>
						<li><strong>Owner Surrender</strong> : cédés directement par leur propriétaire</li>
						<li><strong>Public Assist</strong> : pris en charge à la demande d'un habitant</li>
						<li><strong>Euthanasia Request</strong> : demande d'euthanasie par le propriétaire</li>
						<li><strong>Wildlife</strong> : faune sauvage locale</li>
						<li><strong>Abandoned</strong> : abandonnés</li>
					</ul>
				</section>

				<section className="refuge-block">
					<h2>Quels animaux ?</h2>
					<p>
						Le refuge accueille principalement des chiens et des chats, mais aussi des oiseaux,
						du bétail, et d'autres espèces classées sous la catégorie « Other ».
					</p>
				</section>

				<section className="refuge-block refuge-source">
					<p>
						Source : rapports annuels et audits publics de la ville d'Austin
						(<a href="https://www.austintexas.gov" target="_blank" rel="noreferrer">austintexas.gov</a>).
						Toutes les données affichées sur ce site proviennent du jeu de données ouvertes de
						l'Austin Animal Center.
					</p>
				</section>
			</main>
			<Footer />
		</>
	)
}