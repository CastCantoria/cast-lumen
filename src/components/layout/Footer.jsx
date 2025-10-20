// src/components/layout/Footer.jsx
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sacred-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-icon">🎵</span>
            <strong>𝕮.𝕬.𝕾.𝕿. 𝕮𝖆𝖓𝖙𝖔𝖗𝖎𝖆</strong>
          </div>
          <p className="footer-subtitle">𝕮𝖍𝖔𝖊𝖚𝖗 𝕬𝖗𝖙𝖎𝖘𝖎𝖙𝖎𝖖𝖚𝖊 & 𝕾𝖕𝖎𝖗𝖎𝖙𝖚𝖊𝖑 𝖉𝖊 𝕿𝖆𝖓𝖆</p>
        </div>
        
        <div className="footer-info">
          <div className="footer-founded">
            <span className="footer-icon">🏛️</span>
            <p>Fondé en 2003 à Antananarivo</p>
          </div>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="footer-icon">📧</span>
              <p>castcantoria@gmail.com</p>
            </div>
            <div className="contact-item">
              <span className="footer-icon">📞</span>
              <p>+261 34 11 361 57</p>
            </div>
            <div className="contact-item">
              <span className="footer-icon">📱</span>
              <p>+261 32 91 828 83</p>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>&copy; 2003 - {currentYear} 𝕮.𝕬.𝕾.𝕿. 𝕮𝖆𝖓𝖙𝖔𝖗𝖎𝖆 - 𝕿𝖔𝖚𝖘 𝖉𝖗𝖔𝖎𝖙𝖘 𝖗𝖊𝖘𝖊𝖗𝖛𝖊𝖘</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;