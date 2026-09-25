import React from 'react';
import '../styles/RefugeSection.css';

import dog2 from '../assets/dog2.png';
import cat1 from '../assets/cat1.png';
import dog1 from '../assets/dog1.png';

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
                    <h2>Titre du refuge</h2>
                    <p>
                        Trouver sur qui parle ce paragraphe.<br/>
                        But : Première impression du refuge après que le client est décidé de rester sur le site.
                    </p>
                </div>
            </div>
        </section>
    );
}