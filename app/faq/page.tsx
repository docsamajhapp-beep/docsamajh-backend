'use client';
import { useState, useEffect } from 'react';

const FAQ_ITEMS = [
  {
    q: "DocSamajh kya karta hai?",
    a: (
      <>
        Court notice, bank statement, medical report, salary slip, ya government letter jaisa koi bhi confusing document paste karo ya photo/PDF upload karo — DocSamajh use <b>plain Hindi ya English</b> mein samjhata hai ki usme likha kya hai, aur kya risky clauses ya important points hain.
      </>
    )
  },
  {
    q: "Kya yeh lawyer ya doctor ki advice ka replacement hai?",
    a: (
      <>
        <b>Nahi.</b> DocSamajh document ko samajhne mein madad karta hai — ye legal ya medical advice nahi deta. High-risk ya complex matters (jaise court case, surgery decision) ke liye hum hamesha recommend karte hain ki aap qualified professional se confirm karein.
      </>
    )
  },
  {
    q: "Mera document kahan store hota hai? Kya ye safe hai?",
    a: (
      <>
        Aapka document sirf explanation generate karne ke liye process hota hai. Free plan mein documents save nahi hote — process hone ke baad delete ho jaate hain. Pro/Premium plan mein agar aap history save karna chahein, to wo encrypted storage mein rakha jaata hai aur sirf aapko dikhta hai.
      </>
    )
  },
  {
    q: "Kaunse document types support karte hain?",
    a: (
      <>
        Court notices, bank aur insurance papers, medical reports, salary slips/offer letters, aur government letters — sab support karte hain. "Auto Detect" feature khud pehchaan leta hai document kis type ka hai, ya aap manually category choose kar sakte hain.
      </>
    )
  },
  {
    q: "Photo upload kar sakte hain ya sirf text paste karna padega?",
    a: (
      <>
        Dono chalega. Aap document ka text directly paste kar sakte hain, ya photo/PDF upload kar sakte hain — DocSamajh usse text nikaal ke samjha dega. Scanned ya thodi blurry photo bhi mostly chal jaati hai.
      </>
    )
  },
  {
    q: "Free plan mein kya milta hai?",
    a: (
      <>
        Free plan mein har mahine <b>3 documents</b> samjha sakte hain, Hindi aur English dono mein, sabhi document categories ke saath. Zyada zaroorat ho to Pro ya Premium plan unlimited documents deta hai.
      </>
    )
  },
  {
    q: "Payment kaise karein, aur kya recurring hoga?",
    a: (
      <>
        Payment Razorpay ke through hota hai — UPI, card, netbanking sab chalta hai. Pro/Premium subscription monthly ya yearly auto-renew hota hai, jise aap <b>kabhi bhi cancel</b> kar sakte hain, koi lock-in nahi hai.
      </>
    )
  },
  {
    q: "Explanation mein galti ho sakti hai kya?",
    a: (
      <>
        AI-generated explanation hamesha sahi ho, ye guarantee nahi hai — especially complex legal ya medical language mein. Isi liye hum "High Risk" jaisa flag dikhate hain important clauses ke liye, aur recommend karte hain ki critical decisions se pehle professional se verify kar lein.
      </>
    )
  },
  {
    q: "WhatsApp pe bhi use kar sakte hain?",
    a: (
      <>
        Haan, Pro aur Premium users WhatsApp ke through bhi document share aur samajh sakte hain — alag se app khol ke aane ki zaroorat nahi.
      </>
    )
  }
];

export default function FAQPage() {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // Google OAuth and FAQ states
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [userName, setUserName] = useState('Abhishek');
  const [userEmail, setUserEmail] = useState('abhishek.sharma@gmail.com');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

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
          <a href="/how-it-works">How it works</a>
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

      {/* 2. FAQ Accordion Container */}
      <section className="faq-wrap" style={{ minHeight: 'calc(100vh - 140px)', padding: '60px 24px 80px' }}>
        <div className="eyebrow">Aksar Poochhe Jaane Wale Sawal</div>
        <h1>Aapke <span className="accent">sawaal</span>, hamare jawaab</h1>
        <p className="faq-sub">DocSamajh kaise kaam karta hai, kya safe hai, aur kya yeh lawyer ka replacement hai — sab kuch yahan clear ho jayega.</p>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className={`faq-item ${activeFaq === idx ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                {item.q}
                <span className="icon">+</span>
              </button>
              <div className="faq-a" style={{ maxHeight: activeFaq === idx ? '200px' : '0px' }}>
                <div className="faq-a-inner">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="faq-footer">Aur sawaal hai? <a href="mailto:docsamajh.app@gmail.com">email bhejo</a>.</p>
      </section>

      {/* 3. Global Footer */}
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
