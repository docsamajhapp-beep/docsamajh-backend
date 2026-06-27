'use client';
import { useState, useEffect } from 'react';

export default function HowItWorksPage() {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Google OAuth states
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [userName, setUserName] = useState('Abhishek');
  const [userEmail, setUserEmail] = useState('abhishek.sharma@gmail.com');

  // Load status from localStorage on mount
  useEffect(() => {
    const isPrem = localStorage.getItem('docsamajh_premium') === 'true';
    setIsPremiumUser(isPrem);
    const isSigned = localStorage.getItem('docsamajh_signed_in') === 'true';
    setUserSignedIn(isSigned);
    const savedName = localStorage.getItem('docsamajh_user_name');
    if (savedName) setUserName(savedName);
    const savedEmail = localStorage.getItem('docsamajh_user_email');
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleOauthLogin = (name: string, email: string) => {
    setOauthLoading(true);
    setTimeout(() => {
      setOauthLoading(false);
      setShowOauthModal(false);
      setUserSignedIn(true);
      setUserName(name);
      setUserEmail(email);
      localStorage.setItem('docsamajh_signed_in', 'true');
      localStorage.setItem('docsamajh_user_name', name);
      localStorage.setItem('docsamajh_user_email', email);
    }, 1500);
  };

  const handleSignOut = () => {
    setUserSignedIn(false);
    localStorage.removeItem('docsamajh_signed_in');
    localStorage.removeItem('docsamajh_user_name');
    localStorage.removeItem('docsamajh_user_email');
  };

  return (
    <>
      {/* 1. Sticky Nav Bar */}
      <nav className="sticky-nav">
        <a href="/" className="logo">
          <span className="logo-doc">Doc</span>
          <span className="logo-samajh">Samajh</span>
        </a>

        <div className="center-nav">
          <a href="/">Home</a>
          <a href="/pricing">Pricing</a>
          <a href="/how-it-works" className="active">How it works</a>
        </div>

        <div className="header-right">
          <span className="badge-india">🇮🇳 Made for India</span>
          
          {isPremiumUser && (
            <span className="badge-premium">👑 Premium Active</span>
          )}

          {!userSignedIn ? (
            <button className="btn-signin" onClick={() => setShowOauthModal(true)}>
              <svg viewBox="0 0 48 48" style={{ width: '15px', height: '15px', marginRight: '6px' }}>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l6-6C33.9 6.5 29.2 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.6-.2-3.1-.9-4.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.3 1 7.3 2.7l6-6C33.9 6.5 29.2 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z"/>
                <path fill="#4CAF50" d="M24 45.5c5.1 0 9.8-1.9 13.4-5.1l-6.2-5.2c-1.9 1.3-4.4 2.1-7.2 2.1-5.3 0-9.7-2.9-11.3-7l-6.6 5.1C9.6 41 16.2 45.5 24 45.5z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2c3.6-3.3 5.9-8.3 5.9-13.5 0-1.6-.2-3.1-.7-4.5z"/>
              </svg>
              Sign in
            </button>
          ) : (
            <div className="user-chip" onClick={handleSignOut} title="Click to Sign Out">
              <img src={`https://i.pravatar.cc/40?img=${userName === 'Karan Verma' ? 33 : userName === 'Abhishek Sharma' ? 12 : 47}`} alt="Avatar" />
              {userName.split(' ')[0]}
            </div>
          )}
        </div>
      </nav>

      {/* 2. Main Explanation Header */}
      <section className="hero">
        <div className="hero-eyebrow">Kaise Kaam Karta Hai?</div>
        <h1 className="hero-title" style={{ fontFamily: "'Baloo 2', cursive" }}>
          DocSamajh Ki <span>Karyapranali</span>
        </h1>
        <p className="hero-subtext">
          Janey ki kaise humare intelligent AI engines aapke documents ko read karte hain aur unhein saral bhasha mein translate karte hain.
        </p>
      </section>

      {/* 3. Steps Grid */}
      <section className="how-section" style={{ padding: '0 2rem 3rem' }}>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="how-card" style={{ padding: '2rem 1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span className="how-icon" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>📋</span>
            <h3 className="how-title" style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.4rem', marginBottom: '8px' }}>1. Upload / Paste</h3>
            <p className="how-desc" style={{ color: 'var(--ink-mute)', fontSize: '14px', lineHeight: '1.5' }}>
              Apna medical report, loan agreement, court notice ya offers text paste karein, ya photo/PDF upload karein.
            </p>
          </div>

          <div className="how-card" style={{ padding: '2rem 1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span className="how-icon" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🌐</span>
            <h3 className="how-title" style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.4rem', marginBottom: '8px' }}>2. Language Select</h3>
            <p className="how-desc" style={{ color: 'var(--ink-mute)', fontSize: '14px', lineHeight: '1.5' }}>
              Apni suvidha ke anusaar outputs ki language chunein — Shuddh Hindi, English, ya aam bol-chal ki Hinglish.
            </p>
          </div>

          <div className="how-card" style={{ padding: '2rem 1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span className="how-icon" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🤖</span>
            <h3 className="how-title" style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.4rem', marginBottom: '8px' }}>3. AI Processing</h3>
            <p className="how-desc" style={{ color: 'var(--ink-mute)', fontSize: '14px', lineHeight: '1.5' }}>
              Advanced LLM engines clauses, medical values ya banking rates ko cross check karke risk criteria analyze karte hain.
            </p>
          </div>

          <div className="how-card" style={{ padding: '2rem 1.5rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span className="how-icon" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>✅</span>
            <h3 className="how-title" style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.4rem', marginBottom: '8px' }}>4. Actionable Steps</h3>
            <p className="how-desc" style={{ color: 'var(--ink-mute)', fontSize: '14px', lineHeight: '1.5' }}>
              Aapko clear aur simplified high-risk highlights milte hain jisse aap bina kisi delay ke sahi decision le sakein.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Critical Warning Section: Images Converted into PDF */}
      <section style={{ maxWidth: '800px', margin: '0 auto 4rem', padding: '0 1.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(192, 57, 43, 0.05) 0%, rgba(249, 115, 22, 0.05) 100%)',
          border: '1px solid rgba(192, 57, 43, 0.2)',
          borderLeft: '5px solid var(--red)',
          borderRadius: '16px',
          padding: '2.5rem 2rem'
        }}>
          <h2 style={{ 
            fontFamily: "'Baloo 2', cursive", 
            color: 'var(--red)', 
            fontSize: '1.8rem', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span> Image Converted into PDF will NOT work!
          </h2>
          <p style={{ 
            fontSize: '15px', 
            lineHeight: '1.6', 
            color: 'var(--ink-soft)', 
            marginBottom: '1.5rem' 
          }}>
            Kya aapne kisi photo/image ko mobile scanner app ya website ke zariye direct **PDF save** kar liya hai?
            Aise <strong>converted PDFs</strong> DocSamajh par text extract karne mein fail ho sakte hain.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: 'var(--red)', fontSize: '20px', fontWeight: 'bold' }}>✕</div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Digital PDF vs Image Wrapper:</strong>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-mute)', marginTop: '2px', lineHeight: '1.5' }}>
                  Text-based PDFs (jaise digital e-statements ya bills) ke andar readable text-layers hoti hain. Lekin image ko convert karke banaye gaye PDF mein sirf ek "flat image" chipki hoti hai, jismein digital text-layer nahi hoti.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: 'var(--red)', fontSize: '20px', fontWeight: 'bold' }}>✕</div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Extraction Failure:</strong>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-mute)', marginTop: '2px', lineHeight: '1.5' }}>
                  Standard PDF parsers (`pdf-parse`) converted files mein se 0 characters extract karte hain. Jab content blank ho jata hai, tab automatic high-risk analysis generate nahi ho pata.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ color: 'var(--green)', fontSize: '20px', fontWeight: 'bold' }}>✓</div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Sahi Tarika (Best Solution):</strong>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-mute)', marginTop: '2px', lineHeight: '1.5' }}>
                  Agar aapke paas document ki photo hai, to use PDF mein convert **mat** karein. Seedhe photo file (<strong>.jpg, .png, .webp</strong>) ko upload karein. DocSamajh Vision API us image se automatic text read kar lega!
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="/" style={{
              background: 'linear-gradient(135deg, var(--saffron) 0%, #EA580C 100%)',
              color: 'var(--white)',
              fontWeight: '700',
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              letterSpacing: '0.3px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}>
              Try Uploading Correct Format Now
            </a>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="global-footer" style={{ marginTop: 'auto', padding: '2rem 0', borderTop: '1px solid var(--border)', background: 'var(--white)', textAlign: 'center' }}>
        <p style={{ color: 'var(--ink-mute)', fontSize: '14px' }}>
          © 2026 <span className="footer-brand" style={{ fontWeight: 'bold', color: 'var(--saffron)' }}>DocSamajh</span>. Made with ❤️ for India. · <a href="/faq" style={{ color: 'var(--saffron)', textDecoration: 'none', fontWeight: '500' }}>FAQ</a>
        </p>
      </footer>

      {/* Google OAuth Simulation Modal */}
      {showOauthModal && (
        <div className="oauth-overlay">
          <div className="oauth-modal">
            {!oauthLoading ? (
              <>
                <div className="google-logo-wrap">
                  <svg width="40" height="40" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.78H24v9.03h12.75c-.55 2.87-2.22 5.37-4.72 7.04l7.33 5.68C43.64 36.63 46.5 30.9 46.5 24z"/>
                    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.33-5.68c-2.11 1.42-4.8 2.3-8.56 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </div>
                <h3 className="oauth-title">Sign in with Google</h3>
                <p className="oauth-subtitle">to continue to DocSamajh</p>

                <div className="oauth-account-list">
                  <button className="oauth-account-item" onClick={() => handleOauthLogin('Abhishek Sharma', 'abhishek.sharma@gmail.com')}>
                    <img className="oauth-avatar" src="https://i.pravatar.cc/40?img=12" alt="Abhishek" />
                    <div className="oauth-account-info">
                      <span className="oauth-account-name">Abhishek Sharma</span>
                      <span className="oauth-account-email">abhishek.sharma@gmail.com</span>
                    </div>
                  </button>

                  <button className="oauth-account-item" onClick={() => handleOauthLogin('Karan Verma', 'karan.verma@gmail.com')}>
                    <img className="oauth-avatar" src="https://i.pravatar.cc/40?img=33" alt="Karan" />
                    <div className="oauth-account-info">
                      <span className="oauth-account-name">Karan Verma</span>
                      <span className="oauth-account-email">karan.verma@gmail.com</span>
                    </div>
                  </button>

                  <button className="oauth-account-item" onClick={() => handleOauthLogin('Guest User', 'guest.user@docsamajh.in')}>
                    <div className="oauth-avatar-placeholder">👤</div>
                    <div className="oauth-account-info">
                      <span className="oauth-account-name">Guest User</span>
                      <span className="oauth-account-email">guest.user@docsamajh.in</span>
                    </div>
                  </button>
                </div>

                <p className="oauth-footer" style={{ textAlign: 'left', fontSize: '11px', color: '#70757a' }}>
                  To create a secure account, Google OAuth credentials validation is in sandbox phase. Selecting an account above simulates Google Authentication.
                </p>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button onClick={() => setShowOauthModal(false)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="oauth-loading-container">
                <div className="oauth-spinner"></div>
                <div className="oauth-loading-text">Signing in with Google OAuth...</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
