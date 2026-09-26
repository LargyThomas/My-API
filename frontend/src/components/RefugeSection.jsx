import React from 'react'
import '../styles/RefugeSection.css'

import dog2 from '../assets/dog2.png'
import cat1 from '../assets/cat1.png'
import dog1 from '../assets/dog1.png'

export default function RefugeSection() {
	return (
		<section className="refuge-section">
			<div className="background-images">
				<img src={dog2} alt="Background 1" className="background-image image1" />
				<img src={cat1} alt="Background 2" className="background-image image2" />
				<img src={dog1} alt="Background 3" className="background-image image3" />
			</div>

			<div className="content-card">
				<div className="gradient-overlay"></div>

				<div className="content-text">
                    <h2>Un refuge qui donne une seconde chance</h2>
                    <p>
                        Depuis plus de dix ans, notre équipe recueille, soigne et
                        trouve un nouveau foyer aux animaux abandonnés ou perdus de
                        la région. Chaque fiche que tu verras plus bas raconte une
                        histoire, et attend peut-être la tienne.
                    </p>
                </div>
			</div>
		</section>
	)
}