'use client';
import { useState, useEffect } from 'react';

export default function PricingPage() {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'pro' | 'premium'>('pro');
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card'>('upi');
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success'>('form');

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

  const handleOauthLogin = async (name: string, email: string) => {
    setOauthLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      setOauthLoading(false);
      setShowOauthModal(false);
      setUserSignedIn(true);
      setUserName(data.name);
      setUserEmail(data.email);
      setIsPremiumUser(data.plan !== 'free');
      localStorage.setItem('docsamajh_signed_in', 'true');
      localStorage.setItem('docsamajh_user_name', data.name);
      localStorage.setItem('docsamajh_user_email', data.email);
      localStorage.setItem('docsamajh_jwt_token', data.jwtToken);
      localStorage.setItem('docsamajh_premium', data.plan !== 'free' ? 'true' : 'false');
    } catch (err) {
      console.error('Login error:', err);
      setOauthLoading(false);
    }
  };

  const handleSignOut = () => {
    setUserSignedIn(false);
    setIsPremiumUser(false);
    localStorage.removeItem('docsamajh_signed_in');
    localStorage.removeItem('docsamajh_user_name');
    localStorage.removeItem('docsamajh_user_email');
    localStorage.removeItem('docsamajh_jwt_token');
    localStorage.removeItem('docsamajh_premium');
  };

  const simulatePaymentSuccess = () => {
    setPaymentState('processing');
    setTimeout(() => {
      setPaymentState('success');
    }, 2000);
  };

  const completePremiumUpgrade = async () => {
    try {
      const res = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, plan: checkoutPlan }),
      });
      const data = await res.json();
      if (data.success) {
        setIsPremiumUser(true);
        localStorage.setItem('docsamajh_premium', 'true');
        setShowPaymentModal(false);
        // Redirect back to home page
        window.location.href = '/';
      } else {
        alert('Failed to update subscription in backend database.');
      }
    } catch (err) {
      console.error('Upgrade verification error:', err);
      alert('Network error upgrading account. Plan updated locally.');
      setIsPremiumUser(true);
      localStorage.setItem('docsamajh_premium', 'true');
      setShowPaymentModal(false);
      window.location.href = '/';
    }
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
          <a href="/pricing" className="active">Pricing</a>
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

      {/* 2. Pricing Section */}
      <section className="pricing-wrap" id="pricing" style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="eyebrow">Free · Instant · Private</div>
        <h2>Saral pricing,<br />
        <span className="accent">samajhne layak</span></h2>
        <p className="pricing-sub">Court notice, bank policy, medical report — kisi bhi document ka matlab samjho, apni zaroorat ke hisaab se plan chuno.</p>

        <div className="billing-toggle">
          <button 
            className={billingCycle === 'monthly' ? 'active' : ''} 
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button 
            className={billingCycle === 'yearly' ? 'active' : ''} 
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="save-pill">Save 20%</span>
          </button>
        </div>

        <div className="plans">
          {/* FREE PLAN */}
          <div className="plan">
            <div className="plan-name">Free</div>
            <div className="plan-desc">Document samajhna shuru karo</div>
            <div className="plan-price">₹0</div>
            <div className="plan-period">हमेशा free</div>
            <button className="plan-cta free" disabled style={{ opacity: 0.7 }}>Free mein shuru karo</button>
            <ul className="plan-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                3 documents / month
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Hindi + English explanation
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Court, bank, medical, govt docs
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Photo / PDF upload
              </li>
            </ul>
          </div>

          {/* PRO PLAN */}
          <div className="plan featured">
            <span className="popular-tag">Sabse popular</span>
            <div className="plan-name">Pro</div>
            <div className="plan-desc">Regular use ke liye</div>
            <div className="plan-price">
              {billingCycle === 'monthly' ? '₹99' : '₹79'}
              <span className="unit">/month</span>
            </div>
            <div className="plan-period">
              {billingCycle === 'monthly' ? 'Monthly billing' : 'Yearly billing, ₹949 total'}
            </div>
            <button 
              className="plan-cta primary" 
              onClick={() => {
                setCheckoutPlan('pro');
                setPaymentState('form');
                setShowPaymentModal(true);
              }}
            >
              Pro lo
            </button>
            <ul className="plan-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Unlimited documents
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Tezz AI processing (priority)
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Document history save
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                WhatsApp pe share karo
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                High-risk clause alerts
              </li>
            </ul>
          </div>

          {/* PREMIUM PLAN */}
          <div className="plan">
            <div className="plan-name">Premium</div>
            <div className="plan-desc">Family aur heavy use ke liye</div>
            <div className="plan-price">
              {billingCycle === 'monthly' ? '₹199' : '₹159'}
              <span className="unit">/month</span>
            </div>
            <div className="plan-period">
              {billingCycle === 'monthly' ? 'Monthly billing' : 'Yearly billing, ₹1,909 total'}
            </div>
            <button 
              className="plan-cta dark" 
              onClick={() => {
                setCheckoutPlan('premium');
                setPaymentState('form');
                setShowPaymentModal(true);
              }}
            >
              Premium lo
            </button>
            <ul className="plan-features">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Sab kuch Pro mein, plus:
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                5 family members tak shared plan
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Encrypted document vault
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg> 
                Priority WhatsApp support
              </li>
            </ul>
          </div>
        </div>

        <p className="fine-print">Cancel kabhi bhi. Prices GST exclusive. Razorpay se secure payment.</p>
      </section>

      {/* 3. Footer */}
      <footer className="global-footer">
        <p>
          © 2026 <span className="footer-brand">DocSamajh</span>. Made with ❤️ for India. · <a href="/faq" style={{ color: 'var(--saffron)', textDecoration: 'none', fontWeight: '500' }}>FAQ</a>
        </p>
      </footer>

      {/* 4. Payment Checkout Paywall Modal */}
      {showPaymentModal && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            {paymentState !== 'processing' && (
              <div className="checkout-header">
                <span className="checkout-header-title">DocSamajh Premium Upgrade</span>
                <button className="checkout-header-close" onClick={() => setShowPaymentModal(false)}>✕</button>
              </div>
            )}

            <div className="checkout-body">
              {paymentState === 'form' && (
                <>
                  <div className="checkout-summary">
                    <div>
                      <div className="checkout-summary-plan" style={{ color: '#0D0D0D' }}>
                        DocSamajh {checkoutPlan === 'pro' ? 'Pro' : 'Premium'} — {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#777777', marginTop: '2px' }}>
                        {billingCycle === 'yearly' ? 'Billed annually (Save 20%)' : 'Cancel anytime'}
                      </div>
                    </div>
                    <div className="checkout-summary-price">
                      {checkoutPlan === 'pro' 
                        ? (billingCycle === 'yearly' ? '₹949' : '₹99') 
                        : (billingCycle === 'yearly' ? '₹1,909' : '₹199')
                      }
                      <span style={{ fontSize: '11px', color: '#777777', fontWeight: 'normal' }}>
                        {billingCycle === 'yearly' ? '/year' : '/month'}
                      </span>
                    </div>
                  </div>

                  <div className="checkout-tabs">
                    <button 
                      className={`checkout-tab ${paymentTab === 'upi' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('upi')}
                    >
                      UPI (QR Code)
                    </button>
                    <button 
                      className={`checkout-tab ${paymentTab === 'card' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('card')}
                    >
                      Credit / Debit Card
                    </button>
                  </div>

                  {paymentTab === 'upi' ? (
                    <div className="upi-container">
                      <div className="upi-qr-box">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=docsamajh@upi%26pn=DocSamajh%26am=${checkoutPlan === 'pro' ? (billingCycle === 'yearly' ? 949 : 99) : (billingCycle === 'yearly' ? 1909 : 199)}%26cu=INR`} 
                          className="upi-qr-image" 
                          alt="Scan to Pay" 
                        />
                      </div>
                      <div className="upi-timer">
                        Approve payment within <span>04:59</span> minutes
                      </div>
                      <button className="checkout-btn" onClick={simulatePaymentSuccess}>
                        Simulate UPI Payment Success
                      </button>
                    </div>
                  ) : (
                    <form className="card-form" onSubmit={(e) => { e.preventDefault(); simulatePaymentSuccess(); }}>
                      <div className="input-field">
                        <label>CARDHOLDER NAME</label>
                        <input type="text" placeholder="Abhishek Sharma" required />
                      </div>
                      <div className="input-field">
                        <label>CARD NUMBER</label>
                        <input type="text" placeholder="4111 2222 3333 4444" maxLength={19} required />
                      </div>
                      <div className="input-row">
                        <div className="input-field">
                          <label>EXPIRY DATE</label>
                          <input type="text" placeholder="MM/YY" maxLength={5} required />
                        </div>
                        <div className="input-field">
                          <label>CVV / CVC</label>
                          <input type="password" placeholder="***" maxLength={3} required />
                        </div>
                      </div>
                      <button type="submit" className="checkout-btn" style={{ marginTop: '8px' }}>
                        Pay Securely
                      </button>
                    </form>
                  )}
                </>
              )}

              {paymentState === 'processing' && (
                <div className="processing-container">
                  <div className="processing-spinner"></div>
                  <div className="processing-text">Processing Payment...</div>
                  <div className="processing-sub">Securing session connection via Razorpay Gateway</div>
                </div>
              )}

              {paymentState === 'success' && (
                <div className="success-container">
                  <div className="confetti-wrapper">
                    {[...Array(15)].map((_, i) => (
                      <div 
                        key={i} 
                        className="confetti-dot" 
                        style={{
                          left: `${Math.random() * 100}%`,
                          background: i % 3 === 0 ? '#F97316' : i % 3 === 1 ? '#4CAF50' : '#1976D2',
                          animationDelay: `${Math.random() * 2}s`,
                          width: `${4 + Math.random() * 4}px`,
                          height: `${4 + Math.random() * 4}px`,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="success-badge-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A7A4A" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="success-title">Upgrade Successful!</div>
                  <div className="success-desc">Thank you! Welcome to DocSamajh Pro. Your account features are now unlocked.</div>

                  <div className="receipt-box">
                    <div className="receipt-row">
                      <span className="receipt-row-label">Order Reference</span>
                      <span className="receipt-row-val">DS-{Math.random().toString(36).substring(3, 9).toUpperCase()}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-row-label">Plan Name</span>
                      <span className="receipt-row-val">DocSamajh {checkoutPlan === 'pro' ? 'Pro' : 'Premium'}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-row-label">Billing Cycle</span>
                      <span className="receipt-row-val">{billingCycle === 'yearly' ? 'Annual (Recurring)' : 'Monthly (Recurring)'}</span>
                    </div>
                    <div className="receipt-row">
                      <span className="receipt-row-label">Total Amount</span>
                      <span className="receipt-row-val">
                        {checkoutPlan === 'pro' 
                          ? (billingCycle === 'yearly' ? '₹949' : '₹99') 
                          : (billingCycle === 'yearly' ? '₹1,909' : '₹199')
                        }
                      </span>
                    </div>
                  </div>

                  <button className="checkout-btn" onClick={completePremiumUpgrade}>
                    Start using Premium Features
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
