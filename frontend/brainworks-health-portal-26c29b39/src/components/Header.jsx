import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// 🟢 1. Professional Fallback Avatar
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 

function Header({ 
  isLoggedIn, 
  userPhoto, 
  userName, 
  onLoginClick, 
  onServicesClick, 
  onHomeClick, 
  scrollToSection 
}) {
  
  // 2. State to track if the specific Google image failed
  const [imgError, setImgError] = useState(false);

  // 3. Smart Logic: Choose Google Photo OR Default Avatar
  const displayImage = (userPhoto && !imgError) ? userPhoto : DEFAULT_AVATAR;

  // Reset error state if userPhoto changes
  useEffect(() => {
    setImgError(false);
  }, [userPhoto]);

  return (
    <header className="header">
      {/* --- LEFT SECTION: Logo & Nav --- */}
      <div className="header-left">
        <div 
          className="logo" 
          onClick={onHomeClick} 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            cursor: "pointer",
            gap: "8px"
          }}
        >
          {/* 🟢 NEW LOGO IMAGE */}
          <img
            src="/iconn.png"
            alt="BrainWorks Logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          Brain<span>Works</span>
        </div>
        
        <hr />
        
        <nav>
          <ul className="nav-links">
            <li><a onClick={onHomeClick}>Home</a></li>
            <li><a onClick={onServicesClick}>Services</a></li>
            <li>
              <a onClick={() => { 
                onHomeClick(); 
                setTimeout(() => scrollToSection('about'), 100); 
              }}>
                About
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('footer')}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* --- RIGHT SECTION: Contact & Auth --- */}
      <div className="header-right">
         <span className='loc'>
            <LocationOnIcon className="location-icon" />
            <span className="adress">Rourkela</span>
         </span>
         
         <span className='phone'>
            <PhoneIcon className="phone-icon" />
            <span className="phone-number">+0 123 456 7890</span>
         </span>
         
        <SearchIcon className="search-icon" style={{ cursor: 'pointer' }} />
        
        {/* 🟢 AUTH CONTAINER */}
        <div className="auth-container" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
          
          {isLoggedIn && (
            <img 
              src={displayImage} 
              alt={userName || "Profile"} 
              onError={(e) => {
                e.target.onerror = null; 
                setImgError(true);
              }} 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                border: '2px solid #1d2b5f', 
                objectFit: 'cover',
                cursor: 'default',
                backgroundColor: '#fff' 
              }}
              title={userName || "User Profile"}
            />
          )}

          <button
            className={`login-btn ${isLoggedIn ? 'logged-in' : ''}`}
            onClick={onLoginClick}
          >
            {isLoggedIn ? 'Logout' : 'Log In'}
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;