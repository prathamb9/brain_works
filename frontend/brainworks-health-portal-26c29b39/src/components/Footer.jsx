import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer({ onServicesClick, scrollToSection, scrollToTop }) {
  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">
            Brain<span style={{ color: '#2196F3' }}>Works</span>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, 
            luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="social-icons">
            <a href="#"><FacebookIcon /></a>
            <a href="#"><TwitterIcon /></a>
            <a href="#"><InstagramIcon /></a>
            <a href="#"><LinkedInIcon /></a>
          </div>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a onClick={scrollToTop}>Home</a></li>
            <li><a onClick={onServicesClick}>Services</a></li>
            <li><a onClick={() => scrollToSection('about')}>About</a></li>
            <li><a onClick={() => scrollToSection('footer')}>Contact</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Our Services</h4>
          <ul>
            <li><a href="#">General Practitioners</a></li>
            <li><a href="#">Pregnancy Support</a></li>
            <li><a href="#">Nutritional Support</a></li>
            <li><a href="#">Pharmaceutical Care</a></li>
            <li><a href="#">Cardiology Clinic</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact Info</h4>
          <ul>
            <li><a href="#">+0 123 456 7890</a></li>
            <li><a href="#">info@brainworks.com</a></li>
            <li><a href="#">123 Medical Street</a></li>
            <li><a href="#">Healthcare City, HC 12345</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 BrainWorks Medical Healthcare. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;