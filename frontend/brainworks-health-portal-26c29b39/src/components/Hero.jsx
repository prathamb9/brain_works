import React from 'react';
// 🟢 Using the image from the New File
import doctorImage from '../assets/b-2.png';

function Hero({ scrollToSection }) {
  return (
    <section 
      className="hero" 
      style={{ 
        backgroundImage: `url(${doctorImage})`,
        backgroundRepeat: "no-repeat",
        // 🟢 Positioning from the New File (Adjusted for b-2.png)
        backgroundPosition: "-200px 70px",
        backgroundSize: "cover" 
      }}
    >
      <div className="hero-content">
        <button className="liveLife-btn">
          Live Your Life
        </button>

        <h1>We Care About Your Health</h1>

        {/* 🟢 Content from New File (AI Context) */}
        <p>
          Early and accurate brain tumor detection using advanced AI and medical imaging. 
          Our platform helps clinicians and patients make informed decisions faster and with confidence.
        </p>

        <button 
          className="contact-btn"
          onClick={() => scrollToSection('footer')}
        >
          Contact Us
        </button>
      </div>
    </section>
  );
}

export default Hero;