import React, { useState } from 'react';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

function TestimonialsAbout() {
  // 1. State to track the active review (0, 1, or 2)
  const [activeSlide, setActiveSlide] = useState(0);

  // 2. Data array for the 3 reviews
  const reviewData = [
    {
      name: "Sneha Iyer",
      role: "CUSTOMER",
      text: "I was very anxious while waiting for answers, but this website made the process simple and quick. It gave me clarity and reduced a lot of stress.",
     
    },
    {
      name: "Rohit Mehra",
      role: "PATIENT",
      text: "I was very anxious, but the process was easy and the results came quickly. It helped me and my family feel more prepared.",
     
    },
    {
      name: "Arjun Malhotra",
      role: "PARTNER",
      text: "This platform has strengthened our diagnostic workflow by providing fast and consistent AI-based brain tumor analysis.",
     
    }
  ];

  const current = reviewData[activeSlide];

  return (
    <section className="testimonials-about-wrapper" style={{ width: '100%', backgroundColor: 'white' }}>
      
      {/* 1. TESTIMONIALS SECTION */}
      <div className="testimonials-section" style={{
        backgroundColor: '#C6D6F6', 
        padding: '100px 10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '480px',
        overflow: 'hidden'
      }}>
        
        {/* DECORATIVE BACKGROUND CIRCLES */}
        <div style={{ position: 'absolute', right: '10%', top: '-10%', width: '350px', height: '350px', borderRadius: '50%', backgroundColor: "#E6F7FA", zIndex: 1 }}></div>
        <div style={{ position: 'absolute', right: '2%', bottom: '-20%', width: '400px', height: '400px', borderRadius: '50%', backgroundColor: '#C3E0F7', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', right: '3%', top: '7%', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: '#D6E9FF', zIndex: 1 }}></div>

        {/* FLOATING IMAGE CIRCLES (Left Side) */}
        <div className="image-container" style={{ position: 'relative', width: '40%', height: '350px', zIndex: 2 }}>
          {/* Top Left */}
          <img src= "https://images.unsplash.com/photo-1609737944640-6811139abe01?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tYW4lMjBpbiUyMHdoaXRlJTIwd2ludGVyJTIwY29hdCUyMGFuZCUyMGJlYW5pZSUyMHNtaWxpbmd8ZW58MHx8MHx8fDA%3D" alt="user" style={{ width: '75px', height: '75px', borderRadius: '50%', border: '4px solid white', position: 'absolute', top: '0', left: '50%' }} />
          {/* Far Left */}
          <img src="https://images.unsplash.com/photo-1624245532111-8f4aba352ba9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlkZGxlJTIwYWdlZCUyMG1hbiUyMHdpdGglMjBnbGFzc2VzJTIwYW5kJTIwc3VpdCUyMGxhdWdoaW5nfGVufDB8fDB8fHww" alt="user" style={{ width: '95px', height: '95px', borderRadius: '50%', border: '4px solid white', position: 'absolute', top: '19%', left: '10%' }} />
          {/* Center Main */}
          <img src="https://media.istockphoto.com/id/2067085905/photo/parent-and-daughter.webp?a=1&b=1&s=612x612&w=0&k=20&c=DBEeSmWO0jCPlPk8d9CWAbfOPB_Pbx0xnTjqLPfRz9Q=" alt="user" style={{ width: '125px', height: '125px', borderRadius: '50%', border: '4px solid white', position: 'absolute', top: '30%', left: '35%', zIndex: 3 }} />
          {/* Bottom Left */}
          <img src="https://plus.unsplash.com/premium_photo-1723514489790-18b9a81cbf09?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8eW91bmclMjBtYW4lMjBoZWFkc2hvdCUyMHN0dWRpbyUyMGxpZ2h0aW5nfGVufDB8fDB8fHww" alt="user" style={{ width: '85px', height: '85px', borderRadius: '50%', border: '4px solid white', position: 'absolute', bottom: '5%', left: '19%' }} />
          {/* Bottom Right */}
          <img src="https://media.istockphoto.com/id/531493419/photo/happy-family-sitting-on-floor-with-their-baby.webp?a=1&b=1&s=612x612&w=0&k=20&c=HjbpvzOU3B2rqDHUj7XNXlQpmPkcu_cDER5Escr6HDY=" alt="user" style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid white', position: 'absolute', bottom: '3%', left: '55%' }} />
        </div>

        {/* TESTIMONIAL CONTENT (Right Side) */}
        <div className="quote-content" style={{ width: '55%', zIndex: 3, paddingLeft: '50px' }}>
          <FormatQuoteIcon style={{ fontSize: '70px', color: '#1A237E', opacity: '0.2', marginBottom: '-20px' }} />
          <p style={{ fontSize: '20px', color: '#333', lineHeight: '1.6', fontStyle: 'italic', margin: '0', minHeight: '100px' }}>
            "{current.text}"
          </p>
          <div style={{ marginTop: '25px' }}>
            <h4 style={{ margin: 0, color: '#1A237E', fontSize: '24px' }}>{current.name}</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#666', fontWeight: 'bold' }}>{current.role}</p>
          </div>

          {/* Functional Navigation Dots */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: activeSlide === idx ? '#1A237E' : '#A0AEC0',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ABOUT US SECTION */}
      <div className="about-us-container" style={{ padding: '100px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: '#C6D6F6',
          width: '85%',
          maxWidth: '1100px',
          padding: '70px 90px',
          borderRadius: '45px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '38px', color: '#1A237E', marginBottom: '30px' }}>About Us</h2>
          <p style={{ fontSize: '17px', color: '#4A5568', lineHeight: '1.9', textAlign: 'justify' }}>
           "At Brain Works, we believe that AI in healthcare must be trustworthy and accessible to everyone. Developed by Team Neural Stack from NIT Rourkela, our platform tackles the 'Black Box' problem in medical diagnostics. We combine robust Convolutional Neural Networks (CNNs) for tumor detection with Explainable AI (Grad-CAM), allowing doctors to visualize exactly where the model is looking. By integrating Generative AI, we translate complex visual data into clear summaries. Crucially, we also empower patients with direct access—providing a simple interface where individuals can upload scans to gain preliminary understanding and peace of mind about their health. Our goal is to serve as a transparent second opinion that supports the radiologist while demystifying the diagnosis for the patient."
          </p>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsAbout;