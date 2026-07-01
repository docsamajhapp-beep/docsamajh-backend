'use client';
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalysisSection {
  label: string;
  content: string;
}

interface AnalysisResult {
  docType: string;
  oneLiner: string;
  sections: AnalysisSection[];
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const CATEGORIES = [
  { id: 'auto', label: 'Auto Detect', icon: '🔍' },
  { id: 'court_notice', label: 'Court Notice', icon: '⚖️' },
  { id: 'bank_insurance', label: 'Bank / Insurance', icon: '🏦' },
  { id: 'medical_report', label: 'Medical Report', icon: '🏥' },
  { id: 'salary_offer', label: 'Salary / Offer Letter', icon: '💰' },
  { id: 'govt_letter', label: 'Government Letter', icon: '🏛️' },
];

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

export default function LandingPage() {
  // Input states
  const [selectedCategory, setSelectedCategory] = useState('auto');
  const [selectedLanguage, setSelectedLanguage] = useState<'hindi' | 'english' | 'both'>('both');
  const [pastedText, setPastedText] = useState('');
  
  // Account and Payment states
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [analysesCount, setAnalysesCount] = useState(0);

  // Google OAuth and FAQ states
  const [showOauthModal, setShowOauthModal] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [userName, setUserName] = useState('Abhishek');
  const [userEmail, setUserEmail] = useState('abhishek.sharma@gmail.com');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Load session from Supabase on mount
  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserSignedIn(true);
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
        setUserEmail(session.user.email || '');
        const isPrem = localStorage.getItem('docsamajh_premium') === 'true';
        setIsPremiumUser(isPrem);
        const count = parseInt(localStorage.getItem('docsamajh_analyses_count') || '0', 10);
        setAnalysesCount(count);
      }
    });

    // Listen for auth state changes (handles OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserSignedIn(true);
        setUserName(session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
        setUserEmail(session.user.email || '');
        setShowOauthModal(false);
        setOauthLoading(false);
        localStorage.setItem('docsamajh_signed_in', 'true');
        localStorage.setItem('docsamajh_user_name', session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
        localStorage.setItem('docsamajh_user_email', session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUserSignedIn(false);
        setUserName('');
        setUserEmail('');
        setIsPremiumUser(false);
        localStorage.removeItem('docsamajh_signed_in');
        localStorage.removeItem('docsamajh_user_name');
        localStorage.removeItem('docsamajh_user_email');
        localStorage.removeItem('docsamajh_premium');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real Google OAuth via Supabase
  const handleGoogleSignIn = async () => {
    setOauthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      if (error) {
        console.error('Google sign-in error:', error.message);
        alert('Sign-in failed: ' + error.message);
        setOauthLoading(false);
      }
      // Redirect happens automatically — onAuthStateChange handles the rest
    } catch (err) {
      console.error('OAuth error:', err);
      setOauthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserSignedIn(false);
    setIsPremiumUser(false);
    localStorage.removeItem('docsamajh_signed_in');
    localStorage.removeItem('docsamajh_user_name');
    localStorage.removeItem('docsamajh_user_email');
    localStorage.removeItem('docsamajh_jwt_token');
    localStorage.removeItem('docsamajh_premium');
    localStorage.removeItem('docsamajh_analyses_count');
    setAnalysesCount(0);
  };
  
  // File states
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [showResultSection, setShowResultSection] = useState(false);

  // live character counter
  const charCount = pastedText.length;
  const isSubmitDisabled = charCount < 30 || isAnalyzing || isOcrLoading;

  // File Picker Click
  const handleUploadClick = () => {
    if (!userSignedIn) {
      setShowOauthModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  // Convert File to Base64 and run OCR
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size bahut badi hai! Please 10MB se choti file upload karein.");
      return;
    }

    setAttachedFileName(file.name);
    setIsOcrLoading(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const resultString = reader.result as string;
        // Strip data prefix (e.g. data:image/png;base64,) to get raw base64
        const fileBase64 = resultString.split(',')[1];
        
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64,
            mimeType: file.type,
            fileName: file.name,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          setErrorMessage(errData.error || "File upload or text extraction fail ho gaya. Please manually text paste karein.");
          setShowResultSection(true);
          setAttachedFileName(null);
          setIsOcrLoading(false);
          return;
        }

        const data = await response.json();
        if (data.warning) {
          // Extraction failed but not an error — prompt user to paste manually
          setErrorMessage(data.warning);
          setShowResultSection(true);
          setAttachedFileName(null);
        } else if (data.text && data.text.length > 20) {
          // Real text extracted from the document
          setPastedText(data.text);
        } else {
          setErrorMessage("Document se text extract nahi ho saka. Please text manually paste karein.");
          setShowResultSection(true);
          setAttachedFileName(null);
        }
      } catch (err) {
        console.error("OCR Extraction error:", err);
        setErrorMessage("File upload or text extraction fail ho gaya. Please manually text paste karein.");
        setShowResultSection(true);
      } finally {
        setIsOcrLoading(false);
      }
    };
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setAttachedFileName(null);
    setPastedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Fetch with retry & backoff
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 800): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok && (response.status === 429 || response.status === 503 || response.status === 529)) {
        if (retries > 0) {
          console.warn(`Transient error ${response.status}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Network error. Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  // Submit Text for Analysis
  const handleAnalyze = async () => {
    if (!userSignedIn) {
      setShowOauthModal(true);
      return;
    }

    if (pastedText.trim().length < 30) {
      alert("Document text kam se kam 30 characters ka hona chahiye.");
      return;
    }

    // Check usage limits if not premium
    if (!isPremiumUser && analysesCount >= 3) {
      window.location.href = '/pricing';
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setErrorMessage(null);
    setApiNotice(null);
    setShowResultSection(true);

    try {
      const jwtToken = localStorage.getItem('docsamajh_jwt_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
      }

      const response = await fetchWithRetry('/api/analyze', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: pastedText,
          category: selectedCategory,
          language: selectedLanguage,
        }),
      });

      if (response.status === 403) {
        const errData = await response.json();
        if (errData.limitHit) {
          alert("Aapki document limit (3/3) khatam ho gayi hai. Pro ya Premium plan mein upgrade karein.");
          window.location.href = '/pricing';
          setIsAnalyzing(false);
          return;
        }
      }

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.notice) {
        setApiNotice(data.notice);
      }
      if (data.result) {
        setAnalysisResult(data.result);
        
        // Increment usage count for free user
        if (!isPremiumUser) {
          const newCount = analysesCount + 1;
          setAnalysesCount(newCount);
          localStorage.setItem('docsamajh_analyses_count', newCount.toString());
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Analysis API failed:", error);
      setErrorMessage("Sever overload ya connection fail ho gaya. Please thodi der baad fir se koshish karein.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper for dynamic category style overrides
  const getCategoryLabelClass = (docTypeLabel: string): string => {
    const lower = docTypeLabel.toLowerCase();
    if (lower.includes('court') || lower.includes('notice') || lower.includes('legal') || lower.includes('summons')) {
      return 'label-court';
    }
    if (lower.includes('bank') || lower.includes('loan') || lower.includes('statement')) {
      return 'label-bank';
    }
    if (lower.includes('medical') || lower.includes('prescription') || lower.includes('report') || lower.includes('discharge')) {
      return 'label-medical';
    }
    if (lower.includes('salary') || lower.includes('offer') || lower.includes('job')) {
      return 'label-salary';
    }
    return 'label-general';
  };

  return (
    <>
      {/* 1. Sticky Nav Bar */}
      <nav className="sticky-nav">
        <a href="#" className="logo">
          <span className="logo-doc">Doc</span>
          <span className="logo-samajh">Samajh</span>
        </a>

        <div className="center-nav">
          <a href="#" className="active">Home</a>
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

      {/* 2. Hero Section */}
      <section className="hero">
        <div className="hero-eyebrow">FREE · INSTANT · PRIVATE</div>
        <h1 className="hero-title">
          Koi bhi document, <br />
          <span>seedha samjho</span>
        </h1>
        <p className="hero-subtext">
          Court notice, bank policy, medical report, salary slip — paste karo, aur plain Hindi ya English mein poora matlab samjho. Lawyers ki zaroorat nahi.
        </p>

        {!userSignedIn && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowOauthModal(true)}
              style={{
                background: 'var(--saffron)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '30px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
                transition: 'transform 0.2s ease',
              }}
            >
              🚀 Get Started Free
            </button>
            <button
              onClick={() => setShowOauthModal(true)}
              style={{
                background: '#fff',
                color: 'var(--ink)',
                border: '1px solid var(--border)',
                padding: '12px 24px',
                borderRadius: '30px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg viewBox="0 0 48 48" style={{ width: '18px', height: '18px' }}>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l6-6C33.9 6.5 29.2 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.6-.2-3.1-.9-4.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.3 1 7.3 2.7l6-6C33.9 6.5 29.2 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z"/>
                <path fill="#4CAF50" d="M24 45.5c5.1 0 9.8-1.9 13.4-5.1l-6.2-5.2c-1.9 1.3-4.4 2.1-7.2 2.1-5.3 0-9.7-2.9-11.3-7l-6.6 5.1C9.6 41 16.2 45.5 24 45.5z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2c3.6-3.3 5.9-8.3 5.9-13.5 0-1.6-.2-3.1-.7-4.5z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        )}
      </section>

      {/* 3. Document-type Chip Row */}
      <div className="chips-container">
        <div className="chips-wrapper">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Input Card */}
      <main className="main-card">
        {/* Card Top Bar */}
        <div className="card-top-bar">
          <div className="card-top-left">
            <span className="card-label">📋 Apna document yahan paste karo</span>
            <button className="upload-btn" onClick={handleUploadClick}>
              📎 Upload Photo / PDF
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />
          </div>

          {/* Language Toggle */}
          <div className="lang-toggle-group">
            <button
              className={`lang-btn ${selectedLanguage === 'hindi' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('hindi')}
            >
              हिंदी
            </button>
            <button
              className={`lang-btn ${selectedLanguage === 'english' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('english')}
            >
              English
            </button>
            <button
              className={`lang-btn ${selectedLanguage === 'both' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('both')}
            >
              Both
            </button>
          </div>
        </div>

        {/* File Chip */}
        {attachedFileName && (
          <div className="file-chip">
            <span className="file-name" title={attachedFileName}>
              📎 Attached: {attachedFileName}
            </span>
            <button className="file-remove" onClick={handleRemoveFile}>
              ✕
            </button>
          </div>
        )}

        {/* Textarea */}
        <div className="textarea-wrapper">
          <textarea
            className="main-textarea"
            placeholder={
              isOcrLoading 
                ? "Document se text extract ho raha hai..." 
                : "Apna document text yahan paste karein, ya photo/PDF upload karein (kam se kam 30 characters)..."
            }
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            disabled={isOcrLoading}
          />
        </div>

        {/* Card Bottom Bar */}
        <div className="card-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="char-counter" style={{ textAlign: 'left' }}>
            <div>{charCount} characters</div>
            {!isPremiumUser && (
              <div className="limit-indicator" style={{ marginTop: '4px', textAlign: 'left', padding: 0 }}>
                Free checks remaining: <span>{Math.max(0, 3 - analysesCount)} of 3</span>
              </div>
            )}
          </div>
          <button
            className="submit-btn"
            disabled={isSubmitDisabled}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <div className="spinner"></div>
                Samajh raha hoon...
              </>
            ) : (
              'Samjhao ✨'
            )}
          </button>
        </div>
      </main>

      {/* 5. Result Section */}
      <section className={`result-section ${showResultSection ? 'visible' : ''}`}>
        <div className="result-header">
          <span className="result-title">📖 Yeh raha seedha matlab</span>
          {analysisResult && (
            <span
              className={`status-badge ${
                analysisResult.riskLevel === 'high'
                  ? 'warning bg-red-light text-[#C0392B]'
                  : analysisResult.riskLevel === 'medium'
                  ? 'warning'
                  : 'safe'
              }`}
            >
              {analysisResult.riskLevel === 'high'
                ? '🚨 High Risk'
                : analysisResult.riskLevel === 'medium'
                ? '⚠️ Attention Needed'
                : '✅ Safe / Low Risk'}
            </span>
          )}
        </div>

        {/* Error Box */}
        {errorMessage && (
          <div className="error-box">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* API Notice Box */}
        {apiNotice && !isAnalyzing && (
          <div className="api-notice-box">
            ℹ️ <strong>Notice:</strong> {apiNotice}
          </div>
        )}

        {/* Loading placeholder cards */}
        {isAnalyzing && (
          <div className="summary-card" style={{ opacity: 0.6 }}>
            <div className="summary-block">
              <div className="block-label label-general">Document type</div>
              <div className="block-content">AI is analyzing document type...</div>
            </div>
            <div className="summary-block">
              <div className="block-label label-general">One-liner summary</div>
              <div className="block-content">Processing summary details...</div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        {analysisResult && !errorMessage && !isAnalyzing && (
          <>
            <div className="summary-card">
              {/* Block 1: Doc Type */}
              <div className="summary-block">
                <div className={`block-label ${getCategoryLabelClass(analysisResult.docType)}`}>
                  Document Type
                </div>
                <div className="block-content font-bold">
                  {analysisResult.docType}
                </div>
              </div>

              {/* Block 2: One-Liner */}
              <div className="summary-block">
                <div className={`block-label ${getCategoryLabelClass(analysisResult.docType)}`}>
                  One-liner summary
                </div>
                <div className="block-content">
                  {analysisResult.oneLiner}
                </div>
              </div>

              {/* Block 3: Key Details */}
              {analysisResult.sections.map((section, idx) => (
                <div className="summary-block" key={idx}>
                  <div className={`block-label ${getCategoryLabelClass(analysisResult.docType)}`}>
                    {section.label}
                  </div>
                  <div className="block-content">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Items Box */}
            {analysisResult.actions && analysisResult.actions.length > 0 && (
              <div className="action-items-box">
                <h3 className="action-heading">Aapko kya karna chahiye</h3>
                <div className="action-list">
                  {analysisResult.actions.map((act, idx) => (
                    <div className="action-item" key={idx}>
                      <span className="number-badge">{idx + 1}</span>
                      <span className="action-text">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="disclaimer-text">
              ⚠️ <strong>Important Note:</strong> DocSamajh ek AI-based assistant hai, koi advocate ya doctor nahi. Kisi bhi legal ya medical action se pehle professional ki consult zaroor lein.
            </p>
          </>
        )}
      </section>





      {/* FAQ Section */}
      <section className="faq-wrap">
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

      {/* 8. Footer */}
      <footer className="global-footer">
        <p>
          © 2026 <span className="footer-brand">DocSamajh</span>. Made with ❤️ for India. · <a href="/faq" style={{ color: 'var(--saffron)', textDecoration: 'none', fontWeight: '500' }}>FAQ</a>
        </p>
      </footer>

      {/* Google OAuth Modal */}
      {showOauthModal && (
        <div className="oauth-overlay" onClick={() => { setShowOauthModal(false); setOauthLoading(false); }}>
          <div className="oauth-modal" onClick={(e) => e.stopPropagation()}>
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
                <h3 className="oauth-title">Sign in to DocSamajh</h3>
                <p className="oauth-subtitle">Use your Google account to get started</p>

                <button
                  onClick={handleGoogleSignIn}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '12px 20px',
                    marginTop: '20px',
                    background: '#fff',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#3c4043',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(60,64,67,0.3)')}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
                >
                  <svg viewBox="0 0 48 48" style={{ width: '20px', height: '20px' }}>
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l6-6C33.9 6.5 29.2 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25c0-1.6-.2-3.1-.9-4.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.3 1 7.3 2.7l6-6C33.9 6.5 29.2 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z"/>
                    <path fill="#4CAF50" d="M24 45.5c5.1 0 9.8-1.9 13.4-5.1l-6.2-5.2c-1.9 1.3-4.4 2.1-7.2 2.1-5.3 0-9.7-2.9-11.3-7l-6.6 5.1C9.6 41 16.2 45.5 24 45.5z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2c3.6-3.3 5.9-8.3 5.9-13.5 0-1.6-.2-3.1-.7-4.5z"/>
                  </svg>
                  Continue with Google
                </button>

                <p style={{ textAlign: 'center', fontSize: '11px', color: '#70757a', marginTop: '16px' }}>
                  By continuing, you agree to DocSamajh&apos;s Terms of Service and Privacy Policy.
                </p>
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <button onClick={() => setShowOauthModal(false)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="oauth-loading-container">
                <div className="oauth-spinner"></div>
                <div className="oauth-loading-text">Redirecting to Google...</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
