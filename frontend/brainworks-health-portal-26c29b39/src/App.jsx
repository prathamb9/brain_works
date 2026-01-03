import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, logoutUser } from './firebase'; // Using real backend logic
import { Toaster, toast } from 'sonner';

// --- COMPONENTS ---
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import StatsBar from './components/StatsBar.jsx';
import Services from './components/Services.jsx';
import TestimonialsAbout from './components/TestimonialsAbout.jsx';
import FAQ from './components/FAQ.jsx';
import CardiologyClinic from './components/CardiologyClinic.jsx';
import Partners from './components/Partners.jsx';
import Subscribe from './components/Subscribe.jsx';
import Footer from './components/Footer.jsx';
import BrainWorksApp from './components/detection.jsx';

function App() {
  // --- 1. STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('landing'); // Controls 'landing' vs 'detection' view

  // --- 2. REAL AUTH LISTENER (Security) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Optional: Auto-redirect to tool if user was already on it? 
      // For now, we keep them on landing unless they click "Get Started"
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 3. LOGIN / LOGOUT HANDLER ---
  const handleLoginClick = async () => {
    if (user) {
      // LOGOUT LOGIC
      try {
        await logoutUser();
        setView('landing');
        toast.info("Logged out successfully");
      } catch (error) {
        toast.error("Logout failed");
      }
    } else {
      // LOGIN LOGIC (Google Popup)
      try {
        const loggedInUser = await signInWithGoogle();
        if (loggedInUser) {
          toast.success(`Welcome back, ${loggedInUser.displayName.split(' ')[0]}!`);
          setView('detection'); // Auto-navigate to tool on success
        }
      } catch (error) {
        console.error("Login Error:", error);
        toast.error("Login failed. Please try again.");
      }
    }
  };

  // --- 4. NAVIGATION HANDLERS ---
  const handleServicesClick = () => {
    if (!user) {
      // Guest: Block access and show friendly error
      toast.error('Access Restricted', {
        description: 'Please log in to access AI Diagnostic Services.',
        duration: 4000,
        icon: '🔒',
      });
      // Scroll to services section on landing page instead
      if (view !== 'landing') setView('landing');
      setTimeout(() => scrollToSection('services'), 100);
    } else {
      // User: Allow access
      setView('detection');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    setView('landing');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  // --- 5. SMART SCROLL SYSTEM ---
  const scrollToSection = (sectionId) => {
    // If user is in Detection mode, switch back to Landing first
    if (view === 'detection') {
      setView('landing');
      // Small delay to allow React to render the Landing page before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      // Standard scroll
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- 6. LOADING STATE ---
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-blue-900 font-bold animate-pulse">
      Initializing NeuroScan System...
    </div>
  );

  return (
    <div className="app relative min-h-screen">
      {/* 🟢 NOTIFICATIONS: Professional UI */}
      <Toaster 
        richColors 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #e2e8f0',
            borderRadius: '50px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '600'
          }
        }}
      />

      {/* 🟢 HEADER: Controls the entire nav flow */}
      <Header
        isLoggedIn={!!user}
        userPhoto={user?.photoURL}
        userName={user?.displayName}
        onLoginClick={handleLoginClick}
        onServicesClick={handleServicesClick}
        onHomeClick={handleHomeClick} // Added explicit Home handler
        scrollToSection={scrollToSection}
        setShowDetection={setView} // Compatible with older header prop names
      />
      
      {/* 🟢 MAIN CONTENT SWITCHER */}
      {view === 'detection' && user ? (
        // VIEW A: The AI Tool
        <BrainWorksApp user={user} />
      ) : (
        // VIEW B: The Landing Page
        <main>
          <Hero 
            scrollToSection={scrollToSection} 
            onLoginClick={handleLoginClick} // Pass login to Hero buttons
            user={user} 
          />
          <StatsBar />
          
          <div id="services">
            <Services />
          </div>

          <TestimonialsAbout />
          
          <div id="about">
            <FAQ />
          </div>
          
          <CardiologyClinic />
          <Partners />
          <Subscribe />
          
          <Footer
            onServicesClick={handleServicesClick}
            scrollToSection={scrollToSection}
          />
        </main>
      )}
    </div>
  );
}

export default App;