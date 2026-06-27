/**
 * DocSamajh Dataset Engine
 * Loads the training dataset and injects relevant examples
 * into the AI system prompt for better, contextual responses.
 * 
 * Dataset: DocSamajh_Dataset_v1 — 76+ real Indian document Q&A entries
 * across 5 categories: Court/Legal, Banking/Loan, Medical, Govt, Salary/HR
 */

// ─── CORE DATASET ──────────────────────────────────────────────────────────
// Extracted key facts, Q&A pairs, and AI templates from DocSamajh_Dataset_v1.docx
// Each entry: { id, category, title, story, keyFacts, riskLevel, deadline, actions, qa, template }

export interface DatasetEntry {
  id: string;
  category: 'court_notice' | 'bank_insurance' | 'medical_report' | 'salary_offer' | 'govt_letter';
  title: string;
  keyFacts: string;
  riskLevel: 'high' | 'medium' | 'low';
  deadline: string;
  actions: string;
  qa: { q: string; a: string }[];
  template: string;
  keywords: string[];
}

export const DATASET: DatasetEntry[] = [
  // ─── COURT / LEGAL ────────────────────────────────────────────────────
  {
    id: '001',
    category: 'court_notice',
    title: 'Section 138 NI Act – Cheque Bounce Legal Notice',
    keyFacts: 'Section 138 Negotiable Instruments Act | Cheque bounce criminal offence | 15-day window to pay | Sender = Complainant',
    riskLevel: 'high',
    deadline: '15 din mein cheque amount pay karo notice milne ke baad',
    actions: '1) Lawyer se mile. 2) 15 din ke andar paise de do ya settlement karo. 3) Agar nahi kiya — court case inevitable.',
    qa: [
      { q: 'Yeh notice kya hai aur mujhe kya karna chahiye?', a: 'Yeh ek legal notice hai. Aapka cheque bounce hua hai. 15 din ke andar sender ko paise de do — warna criminal case ho sakta hai.' },
      { q: 'Kya mujhe jail ho sakti hai?', a: 'Haan, Section 138 NI Act mein 2 saal jail aur fine dono possible hain agar court case hua aur aap dose guilty paye.' },
      { q: 'Mujhe lawyer ki zaroorat hai?', a: 'Haan, zaroor milo. 15-day window bahut short hai. Agar settlement possible hai toh abhi karo, warna lawyer hi ek rasta hai.' },
    ],
    template: '🔴 Kya hua: Aapka cheque bounce hua, sender ne Section 138 NI Act ke under criminal notice bheja hai. ⏰ Deadline: 15 din mein pay karo. ⚠️ Risk: Criminal case, 2 saal jail, fine. ✅ Kya karo: Aaj hi ek criminal lawyer se milo. Agar paise hain toh settle karo.',
    keywords: ['cheque', 'bounce', 'section 138', 'negotiable instruments', 'ni act', 'funds insufficient', 'legal notice'],
  },
  {
    id: '002',
    category: 'court_notice',
    title: 'Consumer Court Notice – Defective Product',
    keyFacts: 'Consumer Protection Act 2019 | Defective goods | 2-year warranty implied | Reply mandatory within 30 days',
    riskLevel: 'medium',
    deadline: '30 din mein consumer court ko reply bhejo',
    actions: '1) Notice acknowledge karo. 2) Lawyer ya company legal team ko de do. 3) Settlement offer consider karo — refund ya replacement.',
    qa: [
      { q: 'Consumer court notice kitna serious hai?', a: 'Seriously lo. Ignore kiya toh ex-parte order aa sakta hai — matlab court tumhare khilaf bina sunhe decision de sakta hai.' },
      { q: 'Kya mujhe police case ki tension leni chahiye?', a: 'Consumer court civil matter hai, police nahi aayegi. Lekin ex-parte decree financial loss karayegi.' },
    ],
    template: '🟡 Kya hua: Consumer ne defective product ke liye District Consumer Forum mein case kiya hai. ⏰ Deadline: 30 din mein written reply. ⚠️ Risk: Ex-parte order, refund + penalty. ✅ Kya karo: Consumer law advocate se contact karo. Settlement discuss karo.',
    keywords: ['consumer', 'consumer court', 'defective', 'product', 'consumer forum', 'consumer protection', 'warranty'],
  },
  {
    id: '003',
    category: 'court_notice',
    title: 'RTI Reply – Government Department Response',
    keyFacts: 'RTI Act 2005 | First Appeal possible within 30 days | Section 8 exemptions | CIC second appeal',
    riskLevel: 'low',
    deadline: 'First appeal: 30 din mein First Appellate Authority ko',
    actions: '1) Reply padho samajh ke. 2) Agar information denied hai — First Appeal file karo within 30 days. 3) Still denied — CIC appeal.',
    qa: [
      { q: 'Government ne information deny kar di — kya main kuch kar sakta hoon?', a: 'Haan. 30 din ke andar First Appellate Authority ko appeal karo. Woh same department mein hote hain lekin senior officer.' },
    ],
    template: '🟢 Kya mila: Government ne aapki RTI ka reply diya hai. ⏰ Agar appeal karna chahte hain: 30 din mein First Appellate Authority. ✅ Kya karo: Reply ko dhyan se padho — kya mila, kya deny hua.',
    keywords: ['rti', 'right to information', 'government reply', 'information denied', 'first appeal', 'cic', 'central information commission'],
  },
  {
    id: '004',
    category: 'court_notice',
    title: 'Police FIR Copy – Theft Complaint',
    keyFacts: 'FIR = First Information Report | IPC Section 379 theft | FIR copy free milti hai | Charge sheet alag document hoti hai',
    riskLevel: 'low',
    deadline: 'FIR number save karo. Insurance claim ke liye 7 din mein.',
    actions: '1) FIR number note karo. 2) Phone insurance hai toh 7 din mein claim karo. 3) IMEI block ke liye telecom company ko inform karo.',
    qa: [
      { q: 'FIR mein IPC 379 kya hai?', a: 'IPC Section 379 theft/chori ka section hai. Aapki FIR mein yahi section correctly lagaya gaya hai. Aap victim hain, aap par koi case nahi hai.' },
      { q: 'Insurance claim ke liye FIR chahiye?', a: 'Haan, phone insurance claim ke liye FIR copy mandatory document hai. Jaldi submit karo — zyada tar 7-15 din ki window hoti hai.' },
    ],
    template: '🟢 Kya hai: Yeh aapki chori ki FIR ki copy hai. Aap victim hain. 📋 Kya karo: 1) FIR number save karo 2) IMEI telecom company ko de ke block karwao 3) Insurance claim — 7 din ke andar.',
    keywords: ['fir', 'first information report', 'theft', 'chori', 'ipc 379', 'police complaint', 'robbery'],
  },
  {
    id: '005',
    category: 'court_notice',
    title: 'Court Summons – Civil Case (Money Recovery)',
    keyFacts: 'Civil summons = appear karna mandatory | Ignore pe ex-parte decree | Written statement 30 days mein | Civil suit = no jail',
    riskLevel: 'medium',
    deadline: 'Court date par present hona mandatory. Written statement 30 din ke andar.',
    actions: '1) Civil vakeel karo turant. 2) Court date miss mat karo. 3) Written statement prepare karo apna side batate hue.',
    qa: [
      { q: 'Civil summons aur criminal summons mein kya fark hai?', a: 'Civil summons mein jail nahi hoti — sirf financial recovery. Criminal mein jail possible hai. Yeh civil hai toh jail ka risk nahi, lekin paise dene pad sakte hain.' },
      { q: 'Agar main court date pe na jaaon toh kya hoga?', a: 'Court aapke khilaf ex-parte decree pass kar sakti hai — matlab bina aapki baat sune aapko haara denge. Bank account bhi attach ho sakta hai.' },
    ],
    template: '🟠 Kya hua: Aapko civil court ka summons aaya hai. ⏰ Court date miss mat karo. 30 din mein written statement. ⚠️ Risk: Ex-parte decree — paise aur costs dono. ✅ Civil vakeel se aaj baat karo.',
    keywords: ['summons', 'court summons', 'civil case', 'money recovery', 'lawsuit', 'civil suit', 'district court'],
  },
  {
    id: '006',
    category: 'court_notice',
    title: 'Traffic Challan – Overspeeding / Signal Jump',
    keyFacts: 'Motor Vehicles Act 2019 | Online payment possible | Court option = fight challan | Non-payment = license suspension risk',
    riskLevel: 'low',
    deadline: '30-60 din mein payment — warna license suspension',
    actions: 'Agar galat challan nahi tha: Parivahan.gov.in pe online pay karo. Agar galat hai: Court date lo aur protest karo.',
    qa: [
      { q: 'Challan online pay karne ka kya process hai?', a: 'Parivahan.gov.in ya state traffic police portal pe jao. Vehicle number ya challan number dalo. Online pay karo — receipt save karo.' },
    ],
    template: '🟢 Kya hua: Aapko overspeeding challan mila hai Motor Vehicles Act ke under. ⏰ 30-60 din mein pay karo warna license issue. ✅ Agar sahi challan hai: parivahan.gov.in pe pay karo. Agar galat hai: court date lo.',
    keywords: ['challan', 'traffic challan', 'overspeeding', 'signal jump', 'motor vehicle', 'traffic fine', 'parivahan'],
  },
  {
    id: '009',
    category: 'court_notice',
    title: 'Domestic Violence Complaint – Protection Order',
    keyFacts: 'Protection of Women from DV Act 2005 | Protection order = restraining order | Respond within 3 days | Magistrate hearing mandatory',
    riskLevel: 'high',
    deadline: '3 din mein magistrate response. Hearing date mandatory attendance.',
    actions: 'Immediately lawyer lo. Order ka strict palan karo jab tak case pending hai. Violation pe criminal contempt.',
    qa: [
      { q: 'DV protection order mujhe kya karne se rokta hai?', a: 'Order mein specifically likha hoga — shared residence, contact, etc. Jo bhi likha hai strictly follow karo. Violation = arrest without warrant possible.' },
    ],
    template: '🔴 Serious legal matter: DV Act notice aaya hai. ⏰ 3 din mein respond karo, hearing mandatory. ⚠️ Protection order violate karna = criminal contempt. ✅ Aaj hi family law lawyer lo.',
    keywords: ['domestic violence', 'dv act', 'protection order', 'restraining order', 'magistrate', 'family violence'],
  },
  {
    id: '011',
    category: 'court_notice',
    title: 'Cyber Crime Complaint – Online Fraud',
    keyFacts: 'Cyber Crime = IT Act 2000 | cybercrime.gov.in portal | FIR mandatory for bank recovery | Golden hour = 24 hours mein report',
    riskLevel: 'low',
    deadline: '24 ghante ke andar bank ko inform karo. FIR jaldi file karo.',
    actions: '1) Bank ko IMMEDIATELY call karo — card/account block. 2) cybercrime.gov.in pe complaint. 3) Nearest police station mein FIR.',
    qa: [
      { q: 'Paise wapas aayenge kya?', a: 'Bank ki zero-liability policy ke under — agar 3 working days mein report kiya toh full refund possible. Delay kiya toh partially ya nahi. Jaldi karo.' },
      { q: 'Kis number pe bank ko call karoon?', a: 'SBI: 1800-11-2211, HDFC: 1800-202-6161, ICICI: 1800-1080. Yeh toll-free hain.' },
    ],
    template: '🟢 Victim hain aap. ⚡ Abhi karo: 1) Bank call karo — account/card block. 2) cybercrime.gov.in pe complaint. 3) FIR file karo. ⏰ 3 working days mein bank refund policy active rahti hai.',
    keywords: ['cyber crime', 'online fraud', 'upi fraud', 'otp fraud', 'internet fraud', 'phishing', 'cybercrime'],
  },
  {
    id: '054',
    category: 'court_notice',
    title: 'RERA Complaint – Builder Delay',
    keyFacts: 'RERA Act 2016 | State RERA portal | Delay compensation: SBI MCLR + 2% | Builder registration mandatory',
    riskLevel: 'medium',
    deadline: 'RERA complaint file karo. State RERA ke paas case history hai.',
    actions: '1) State RERA portal pe builder registration verify karo. 2) Online complaint file karo. 3) Compensation clause RERA Section 18 ke under.',
    qa: [
      { q: 'RERA complaint se kya milega?', a: 'Section 18 ke under: delay compensation (SBI MCLR+2% per annum on paid amount), ya full refund with interest. RERA adjudicating officer decision deta hai — 60 days typical.' },
    ],
    template: '🟠 Builder late hai — RERA complaint karo. State RERA portal pe: builder registration verify, project ID dekho, online complaint. Section 18 ke under delay compensation = interest on paid amount ya full refund.',
    keywords: ['rera', 'builder delay', 'flat possession', 'real estate', 'property delay', 'construction delay', 'developer'],
  },

  // ─── BANKING / LOAN ───────────────────────────────────────────────────
  {
    id: '012',
    category: 'bank_insurance',
    title: 'Home Loan Sanction Letter',
    keyFacts: 'Sanction ≠ Disbursement | Rate negotiable before acceptance | Processing fee non-refundable | 30-day acceptance window usually',
    riskLevel: 'low',
    deadline: '30 din mein acceptance letter sign karke jama karo',
    actions: '1) Interest rate compare karo other banks se. 2) Prepayment penalty clause check karo. 3) Processing fee negotiate karo. 4) Accept karne ke baad disbursement process start hoga.',
    qa: [
      { q: 'Sanction letter matlab kya hota hai?', a: 'Bank ne agree kar liya hai loan dene ke liye — yeh conditional approval hai. Abhi paise nahi aaye. Property documents verify hone ke baad disbursement hogi.' },
      { q: 'Interest rate negotiate ho sakta hai?', a: 'Haan! Sanction ke baad bhi negotiate karo — especially agar aapka CIBIL 750+ hai. 0.25–0.5% tak discount mil sakta hai.' },
      { q: 'Home loan insurance lena zaroori hai?', a: 'Bank bolega mandatory — lekin legally nahi hai (RBI guidelines). Alag term insurance bhi le sakte ho jo sasta padega.' },
    ],
    template: '✅ Bank ne home loan sanction kiya hai. 📋 Key details check karo: Interest rate (float/fixed), EMI amount, prepayment penalty. ⏰ 30 din mein accept karo. 💡 Tip: Rate negotiate karo aur insurance independently lo.',
    keywords: ['home loan', 'sanction letter', 'loan approval', 'mortgage', 'housing loan', 'emi', 'disbursement'],
  },
  {
    id: '013',
    category: 'bank_insurance',
    title: 'CIBIL Report – Low Score Notice',
    keyFacts: 'CIBIL score 300-900 | 750+ = good | Overdue = negative impact | Dispute mechanism available | 12-24 months improvement time',
    riskLevel: 'medium',
    deadline: 'Dispute ke liye: CIBIL dispute form — 30 days resolution',
    actions: '1) Report dhyan se check karo. 2) Koi galat entry hai toh CIBIL dispute portal pe raise karo. 3) Existing dues pay karo. 4) 6-12 month ke baad re-apply.',
    qa: [
      { q: '580 CIBIL score se kya hoga?', a: 'Zyada tar banks reject karenge ya bahut high interest rate denge. 650+ pe phir consider karte hain. 750+ pe best rates milti hain. Improvement possible hai.' },
      { q: 'Score improve karne mein kitna time lagega?', a: 'Consistent good behaviour se: 6 months mein 30-50 points, 12 months mein 100+ points possible. EMI on time dena sabse important.' },
    ],
    template: '🟡 Aapka CIBIL score low hai. ✅ Action plan: 1) Report mein galat entries dispute karo 2) Existing overdue pay karo 3) Secured credit card se credit history build karo 4) 6-12 months baad re-apply karo.',
    keywords: ['cibil', 'credit score', 'cibil score', 'loan rejection', 'credit report', 'credit rating', 'overdue'],
  },
  {
    id: '014',
    category: 'bank_insurance',
    title: 'Personal Loan NPA Notice – Loan Default',
    keyFacts: 'NPA = 90+ days default | SARFAESI Act powers for secured loans | Personal loan unsecured = no property seizure direct | Recovery agents RBI norms bound',
    riskLevel: 'high',
    deadline: 'Immediately bank se contact karo — settlement ya restructuring',
    actions: '1) Bank ko call karo — EMI restructuring ya moratorium request karo. 2) OTS (One Time Settlement) negotiate karo. 3) Legal aid agar recovery agents harass kar rahe hain.',
    qa: [
      { q: 'Recovery agent ghar aa raha hai — yeh legal hai?', a: 'RBI guidelines ke under recovery agents ka time 7 AM – 7 PM hai. Abuse, harassment, threats — illegal hai. Complain kar sakte ho RBI Ombudsman pe.' },
      { q: 'OTS kya hota hai?', a: 'One Time Settlement — bank ek reduced amount mein case close kar deta hai. Usually original loan se kam. CIBIL mein "settled" likhta hai.' },
      { q: 'Kya jail ho sakti hai loan default pe?', a: 'Personal loan default = civil matter, direct jail nahi. Lekin court decree ke baad contempt of court mein jail possible hai technically. Pehle settle karna best hai.' },
    ],
    template: '🔴 Serious situation: Loan default hai, NPA notice aaya. ✅ Abhi karo: 1) Bank branch manager se milo — restructuring request 2) OTS negotiate karo 3) Recovery harassment = RBI complaint. Bank se seedha baat karna best strategy hai.',
    keywords: ['npa', 'loan default', 'emi default', 'non-performing asset', 'recovery agent', 'loan recovery', 'ots', 'one time settlement'],
  },
  {
    id: '015',
    category: 'bank_insurance',
    title: 'Credit Card Bill – Minimum Payment Warning',
    keyFacts: 'Credit card APR = 42% annual | Minimum payment trap | Revolving credit | 3.5% monthly = 42% yearly',
    riskLevel: 'medium',
    deadline: 'Due date pe minimum se zyada pay karo jitna ho sake',
    actions: '1) Minimum sirf emergency mein karo. 2) Balance transfer card consider karo. 3) Personal loan at lower rate consider karo.',
    qa: [
      { q: 'Minimum payment karne se kya hoga?', a: 'Remaining balance pe 3.5% monthly interest lagega. Debt khatam hone mein saalon lag sakti hain. Total paid amount bahut zyada hoga.' },
      { q: 'Kya bank se negotiation ho sakta hai?', a: 'Haan! EMI convert karne ka option mangao — 12-24 months mein fixed EMI pe, interest much lower hoga.' },
    ],
    template: '⚠️ Warning: Minimum payment karna expensive trap hai. 3.5% monthly = 42% yearly interest. 💡 Kya karo: 1) Zyada se zyada pay karo 2) Balance transfer ya personal loan consider karo 3) Bank se EMI conversion mangao.',
    keywords: ['credit card', 'minimum payment', 'credit card bill', 'outstanding balance', 'interest charges', 'revolving credit'],
  },
  {
    id: '017',
    category: 'bank_insurance',
    title: 'Bank Account Freeze Notice – Suspicious Transaction',
    keyFacts: 'AML = Anti-Money Laundering | Account freeze = PMLA powers | KYC document + transaction explanation mandatory | 7-30 days typical resolution',
    riskLevel: 'medium',
    deadline: '7-14 din mein documents submit karo warna account permanently restricted',
    actions: '1) Branch manager se milo. 2) Transaction proof lo — invoice, contract. 3) KYC documents — Aadhaar, PAN, recent photo. 4) Written explanation letter likho.',
    qa: [
      { q: 'Bank mera account kyun freeze kar sakta hai?', a: 'PMLA 2002 ke under suspicious transactions pe bank legally account freeze kar sakta hai without prior notice. Bade ya unusual transactions trigger karte hain.' },
    ],
    template: '🟠 Kya hua: Unusual transaction ki wajah se account freeze hua. Bank KYC + proof maang raha hai. ⏰ 7-14 din mein documents do. ✅ Branch jaao, transaction ka invoice/proof lo, written explanation likho.',
    keywords: ['account freeze', 'bank freeze', 'account blocked', 'suspicious transaction', 'aml', 'kyc', 'money laundering'],
  },
  {
    id: '019',
    category: 'bank_insurance',
    title: 'UPI Fraud Alert – Unauthorized Transaction',
    keyFacts: 'UPI receive = money aata hai, request approve = money jata hai | Fraud = report within 24 hours | RBI Ombudsman | Cybercrime portal',
    riskLevel: 'high',
    deadline: '24 ghante ke andar bank aur cybercrime report',
    actions: '1) Bank helpline pe call — transaction block request. 2) cybercrime.gov.in complaint. 3) Police FIR. 4) RBI Ombudsman agar bank sahi se handle nahi kare.',
    qa: [
      { q: 'UPI request approve kar ke paise kaisa gaye?', a: 'UPI "collect request" mein aap approve karte ho toh paise AAPKE account se NIKALTA hai. "Prize" ya "refund" collect request = fraud. Kabhi bhi unknown request approve mat karo.' },
    ],
    template: '🔴 UPI Fraud hua. ⚡ Abhi karo: 1) Bank helpline call — transaction report. 2) cybercrime.gov.in complaint file karo. 3) FIR. ⏰ 24 hours critical hain recovery ke liye.',
    keywords: ['upi fraud', 'upi scam', 'unauthorized transaction', 'payment fraud', 'gpay fraud', 'phonepe fraud', 'paytm fraud'],
  },

  // ─── MEDICAL / INSURANCE ──────────────────────────────────────────────
  {
    id: '023',
    category: 'medical_report',
    title: 'Hospital Discharge Summary – Post Surgery',
    keyFacts: 'Discharge summary = medical-legal document | Follow-up mandatory | Medicines schedule important | Insurance claim mein chahiye',
    riskLevel: 'low',
    deadline: 'Follow-up appointment — doctor ka prescribed date follow karo',
    actions: '1) Discharge summary ki 3 copies rakhna. 2) Medicines schedule strictly follow karo. 3) Follow-up appointment miss mat karo. 4) Insurance claim mein original attach karo.',
    qa: [
      { q: 'Discharge summary kya hoti hai?', a: 'Hospital admission se lekar discharge tak ka poora medical summary — diagnosis, surgery details, medicines, follow-up instructions. Yeh ek important legal-medical document hai.' },
      { q: 'Insurance claim ke liye kya documents chahiye?', a: 'Discharge summary, bills, doctor prescriptions, diagnostic reports, OPD papers — sab originals insurance company ko submit karo claim ke liye.' },
    ],
    template: '🟢 Discharge summary — important medical document. 📋 Kya karo: 1) Medicines schedule strictly follow karo 2) Follow-up appointment book karo 3) Insurance claim ke liye originals safe rakho 4) Koi bhi side effect toh turant doctor ko call karo.',
    keywords: ['discharge summary', 'hospital discharge', 'surgery', 'post surgery', 'operation', 'hospital bill', 'medical record'],
  },
  {
    id: '024',
    category: 'medical_report',
    title: 'Diabetes Blood Report – HbA1c High',
    keyFacts: 'HbA1c = 3-month average blood sugar | Normal: below 5.7% | Pre-diabetic: 5.7-6.4% | Diabetic: 6.5%+',
    riskLevel: 'medium',
    deadline: 'Doctor follow-up within 1-2 weeks. Lifestyle changes immediately.',
    actions: '1) Diabetologist se milo. 2) Diet chart follow karo. 3) Exercise — 30 min daily. 4) Regular monitoring — glucometer ghar pe rakho.',
    qa: [
      { q: 'HbA1c 8.2% matlab kya?', a: 'HbA1c 8.2% = last 3 months ka average blood sugar bahut high tha. Diabetic range mein hai. Medication + lifestyle changes zaroor chahiye.' },
      { q: 'Kya diabetes theek ho sakti hai?', a: 'Type 2 diabetes mein significant weight loss aur lifestyle changes se "remission" possible hai. Lekin yeh lifelong condition hai — management ongoing rehti hai.' },
    ],
    template: '🟡 Blood report mein HbA1c high hai — diabetes control mein nahi hai. ✅ Kya karo: 1) Diabetologist se milo 2) Khana — refined sugar band, vegetables zyada 3) Daily 30 min walk 4) Glucometer se daily monitoring 5) Doctor ki medicines exactly follow karo.',
    keywords: ['diabetes', 'hba1c', 'blood sugar', 'glucose', 'diabetic', 'insulin', 'sugar report', 'blood test', 'sugar level'],
  },
  {
    id: '025',
    category: 'medical_report',
    title: 'Insurance Cashless Claim Denial',
    keyFacts: 'Cashless denial ≠ claim rejection | Reimbursement claim possible | Denial reasons: policy exclusion, pre-existing, non-network | Grievance mechanism available',
    riskLevel: 'medium',
    deadline: 'Reimbursement claim — 30 din ke andar discharge ke baad',
    actions: '1) Denial reason padho carefully. 2) Reimbursement claim form bharo. 3) Sab original bills aur documents submit karo. 4) Reject hua toh Insurance Ombudsman.',
    qa: [
      { q: 'Cashless deny hua matlab kya insurance kaam nahi karega?', a: 'Nahi! Cashless deny ≠ claim reject. Aap reimbursement claim kar sakte ho — apne paison se pay karo, phir insurance company se wapas lo.' },
      { q: 'Insurance Ombudsman kya hai?', a: 'IRDAI ke under independent authority jo insurance disputes resolve karta hai — free of cost. Agar company claim reject kare toh yahan appeal karo.' },
    ],
    template: '🟡 Cashless claim deny hua — lekin claim hoga! ✅ Kya karo: 1) Denial letter ka reason note karo 2) Apne paison se hospital pay karo 3) Discharge ke baad 30 din mein reimbursement form + all original bills submit karo 4) Company reject kare toh Insurance Ombudsman.',
    keywords: ['insurance', 'cashless', 'claim denial', 'health insurance', 'claim rejected', 'mediclaim', 'tpa', 'insurance claim'],
  },
  {
    id: '026',
    category: 'medical_report',
    title: 'Medical Prescription – Antibiotic Course',
    keyFacts: 'Prescription = legal medical document | Complete antibiotic course mandatory | Drug interactions possible | Generic vs brand',
    riskLevel: 'low',
    deadline: 'Medicine schedule exactly follow karo — koi din miss mat karo',
    actions: '1) Poora course complete karo. 2) Khana khake ya khali pet — doctor ki instructions follow karo. 3) Side effects toh immediately doctor ko batao.',
    qa: [
      { q: 'Antibiotic course bich mein band kar sakte hain?', a: 'Bilkul nahi! Antibiotics poora course complete karna mandatory hai. Bich mein band karne se bacteria resistant ho jaate hain — phir wahi medicine kaam nahi karti.' },
      { q: 'Generic medicine le sakte hain brand ki jagah?', a: 'Haan, same salt wali generic medicine same effect karti hai. Doctor se confirm karo, phir pharmacist se generic maango — 60-80% sasta padega.' },
    ],
    template: '🟢 Prescription document hai. 📋 Key points: 1) Antibiotic ka poora course complete karo — bich mein mat chodna 2) Khana/khali pet — prescription pe likha hai follow karo 3) Koi allergic reaction ya side effect — turant doctor ko call karo.',
    keywords: ['prescription', 'medicine', 'antibiotic', 'doctor prescription', 'tablet', 'dosage', 'rx', 'pharmacy'],
  },
  {
    id: '027',
    category: 'medical_report',
    title: 'Cancer Screening Report – Abnormal Finding',
    keyFacts: 'Abnormal screening ≠ cancer confirmed | Biopsy = confirmatory test | AIIMS/Tata Memorial = specialized centers | Second opinion always recommended',
    riskLevel: 'high',
    deadline: 'Oncologist appointment — within 1-2 weeks. Delay karna avoid karo.',
    actions: '1) Oncologist se milo turant. 2) Biopsy/confirmatory test karwao. 3) Second opinion lo. 4) Panic mat karo — abnormal finding ka matlab cancer confirm nahi hai.',
    qa: [
      { q: 'Report mein abnormal likha hai — kya cancer hai?', a: 'Screening test sirf suspicious area identify karta hai — cancer confirm nahi karta. Biopsy se hi confirm hota hai. Oncologist se milo — unhe poora picture pata hoga.' },
    ],
    template: '⚠️ Screening mein abnormal finding hai. ✅ Kya karo: 1) Panic mat karo — yeh cancer confirmed nahi hai 2) Oncologist appointment jaldi lo 3) Biopsy/confirmatory test karwao 4) AIIMS/Tata Memorial ya experienced oncologist se second opinion lo. Jaldi action = better outcome.',
    keywords: ['cancer', 'screening', 'abnormal', 'biopsy', 'tumor', 'oncology', 'malignant', 'mammography', 'pap smear'],
  },

  // ─── GOVERNMENT SCHEMES ──────────────────────────────────────────────
  {
    id: '033',
    category: 'govt_letter',
    title: 'EPFO – PF Withdrawal/Transfer Notice',
    keyFacts: 'EPFO UAN mandatory | Online withdrawal via EPFO portal | TDS if withdrawal before 5 years | Form 15G for TDS exemption',
    riskLevel: 'low',
    deadline: 'Claim processing: 15-20 working days typical',
    actions: '1) UAN activate karo (UAN member portal). 2) KYC link karo (Aadhaar, PAN, bank). 3) Online claim form submit karo. 4) Status track karo portal pe.',
    qa: [
      { q: 'PF withdrawal online kaise kare?', a: 'EPFO member portal pe jao. UAN login karo. Online services mein "Claim" select karo. Form 19 (full withdrawal) ya Form 10C (pension). Aadhaar OTP se verify. 15-20 din mein bank mein paise.' },
      { q: 'PF pe TDS lagega?', a: '5 saal se pehle withdrawal pe TDS lagta hai — 10% agar PAN linked hai, 30% agar nahi. Form 15G submit karo agar total income taxable limit se below hai.' },
    ],
    template: '🟢 EPFO/PF matter. ✅ Kya karo: 1) UAN portal pe login karo (unifiedportal-mem.epfindia.gov.in) 2) KYC update karo — Aadhaar, PAN, bank account 3) Online claim submit karo 4) 15-20 working days mein bank transfer. Helpline: 1800-118-005.',
    keywords: ['epfo', 'pf', 'provident fund', 'pf withdrawal', 'pf transfer', 'uan', 'employee provident fund', 'gratuity'],
  },
  {
    id: '034',
    category: 'govt_letter',
    title: 'Income Tax Notice – Section 139(9) Defective Return',
    keyFacts: 'ITR defective = mismatch in filing | 15 days to respond | AO = Assessing Officer | Revised return filing required',
    riskLevel: 'medium',
    deadline: '15 din mein response submit karo — warna return treated as invalid',
    actions: '1) Notice dhyan se padho — specific defect kya hai. 2) Chartered Accountant se milo. 3) Revised ITR file karo with correction. 4) Response portal pe submit karo.',
    qa: [
      { q: 'Income tax notice aaya — panic karna chahiye?', a: 'Nahi. Zyada tar notices routine compliance ke liye hote hain. Section 139(9) = aapka ITR mein koi mismatch ya error hai jise correct karna hai — criminal case nahi hai.' },
      { q: 'Kya main ITR khud correct kar sakta hoon?', a: 'Simple errors ke liye haan — income tax portal pe revised return file karo. Complicated mismatch ke liye CA lo — unka fee return value se bahut kam hoga.' },
    ],
    template: '🟡 Income Tax notice aaya hai — 139(9) = defective return. ⏰ 15 din mein respond karo. ✅ Kya karo: 1) Notice mein specific defect padho 2) CA se milo ya income tax portal pe revised return file karo 3) Response portal pe timely submit karo. Panic mat karo — yeh routine compliance matter hai.',
    keywords: ['income tax', 'tax notice', 'itr', 'income tax return', 'defective return', '139(9)', 'assessing officer', 'tax department'],
  },
  {
    id: '035',
    category: 'govt_letter',
    title: 'Aadhaar Update/Correction Letter',
    keyFacts: 'Aadhaar update = UIDAI process | Online/offline both options | Name, DOB, address, mobile update possible | Documents required',
    riskLevel: 'low',
    deadline: 'No strict deadline — lekin jaldi update karna better',
    actions: '1) myAadhaar.uidai.gov.in pe jao. 2) OTP se login karo. 3) Update section mein correction submit karo. 4) Supporting documents upload karo.',
    qa: [
      { q: 'Aadhaar mein naam galat hai — kaise theek karoon?', a: 'myAadhaar portal pe Online Document Update feature hai — name correction ke liye gazette notification ya school certificate upload karo. Fee: ₹25 online update ke liye.' },
    ],
    template: '🟢 Aadhaar update/correction matter. ✅ Kya karo: 1) myAadhaar.uidai.gov.in pe jao 2) Login karo — OTP on registered mobile 3) Update/correction request submit karo 4) Documents upload karo 5) Nearest Aadhaar Seva Kendra bhi option hai. Helpline: 1947.',
    keywords: ['aadhaar', 'aadhar', 'uidai', 'aadhaar update', 'aadhaar correction', 'aadhaar card', 'biometric'],
  },
  {
    id: '036',
    category: 'govt_letter',
    title: 'PM Kisan – Payment Stopped Notice',
    keyFacts: 'PM-Kisan = ₹6,000 annual in 3 installments | e-KYC mandatory | Eligibility criteria strict | Ineligible farmers = refund demand possible',
    riskLevel: 'medium',
    deadline: 'e-KYC complete karo for payment restoration',
    actions: '1) pmkisan.gov.in pe e-KYC complete karo. 2) Beneficiary status check karo. 3) Agar ineligible notice: CA/Mandal Parishad se consult karo.',
    qa: [
      { q: 'PM Kisan payment kyun ruk gayi?', a: 'Common reasons: e-KYC incomplete, bank account mismatch, land records not verified, ya income tax filer status. pmkisan.gov.in pe status check karo — exact reason pata chalega.' },
    ],
    template: '🟡 PM Kisan payment ruk gayi hai. ✅ Kya karo: 1) pmkisan.gov.in pe beneficiary status check karo 2) e-KYC complete karo (Aadhaar OTP se) 3) Bank account aur land details verify karo 4) Nearest Common Service Centre (CSC) mein help lo. Helpline: 155261.',
    keywords: ['pm kisan', 'pm-kisan', 'kisan scheme', 'farmer scheme', 'agricultural payment', 'kisaan', 'farming subsidy'],
  },
  {
    id: '040',
    category: 'govt_letter',
    title: 'PMJAY – Ayushman Bharat Card & Scheme',
    keyFacts: 'PMJAY = ₹5 lakh annual health cover | Cashless at empaneled hospitals | SECC 2011 database eligibility | Golden card at hospital',
    riskLevel: 'low',
    deadline: 'No deadline — scheme ongoing. Card banwao aur use karo.',
    actions: '1) pmjay.gov.in pe eligibility check karo. 2) Nearest empaneled hospital ya CSC pe golden card banwao. 3) Admission ke waqt card dikhao — cashless treatment milega.',
    qa: [
      { q: 'Ayushman Bharat mein kaunsi bimari cover hoti hai?', a: '1,500+ medical packages cover hain — cardiac surgery, cancer treatment, dialysis, maternity, accidents sab. Pre-existing diseases Day 1 se cover. Primary care aur OPD typically nahi.' },
    ],
    template: '🟢 PMJAY/Ayushman Bharat — great scheme hai! ✅ Kya karo: 1) pmjay.gov.in pe ya 14555 helpline se eligibility confirm karo 2) Nearest empaneled hospital pe Ayushman Mitra se golden card banwao — free hai 3) Admission pe card + Aadhaar dikhao — ₹5 lakh tak cashless treatment.',
    keywords: ['ayushman', 'pmjay', 'ayushman bharat', 'golden card', 'health scheme', 'pm jan arogya', 'government health insurance'],
  },

  // ─── SALARY / HR ────────────────────────────────────────────────────
  {
    id: '043',
    category: 'salary_offer',
    title: 'Job Offer Letter – Salary Negotiation',
    keyFacts: 'CTC ≠ In-hand salary | Variable component risk | Joining bonus clawback | Non-compete clause scope | Probation terms',
    riskLevel: 'low',
    deadline: 'Offer acceptance deadline — usually 3-7 days. Negotiate before accepting.',
    actions: '1) CTC breakdown maango. 2) Variable component — individual vs company target. 3) Non-compete clause check karo. 4) Counter-offer bhejo agar negotiating.',
    qa: [
      { q: 'CTC ₹10 lakh matlab kitna in-hand milega?', a: 'Rough calculation: CTC mein se PF (employer+employee ₹21,600), Gratuity, Medical insurance, other benefits minus karo. Roughly CTC ka 65-70% in-hand hota hai. Exact breakdown company se maango.' },
      { q: 'Joining bonus wapas lena padega?', a: 'Agar offer letter mein clawback clause hai — haan. Typically agar 1 year ke andar resign kiya toh joining bonus wapas dena padta hai. Clause dhyan se padho.' },
      { q: 'Non-compete clause kya hota hai?', a: 'Company bolegi ki resign ke baad X months tak competitor join nahi kar sakte. Indian courts mein enforcement difficult hai lekin lawsuit risk rehta hai. Scope aur duration reasonable hona chahiye.' },
    ],
    template: '✅ Job offer mila! 💡 Accept karne se pehle: 1) Full CTC breakdown maango — in-hand calculate karo 2) Variable component ki terms samjho 3) Non-compete clause ka scope aur duration check karo 4) Joining bonus clawback clause dekho 5) Probation period aur notice period note karo.',
    keywords: ['offer letter', 'job offer', 'salary', 'ctc', 'in-hand', 'joining bonus', 'employment offer', 'appointment letter'],
  },
  {
    id: '044',
    category: 'salary_offer',
    title: 'Form 16 – Salary TDS Certificate',
    keyFacts: 'Form 16 = TDS certificate from employer | Part A = TDS deducted | Part B = salary breakup | Mandatory for ITR filing',
    riskLevel: 'low',
    deadline: 'ITR filing deadline: July 31 (typically). Form 16 employer June 15 tak deta hai.',
    actions: '1) Form 16 se ITR file karo. 2) Part B mein exemptions verify karo. 3) Income tax portal pe prefilled data match karo. 4) CA ya online tool use karo.',
    qa: [
      { q: 'Form 16 ke bina ITR file kar sakte hain?', a: 'Haan, Form 26AS aur AIS se bhi file ho sakta hai. Lekin Form 16 sabse easy hai — employer se mandatory maango. June 15 ke baad milna chahiye.' },
    ],
    template: '🟢 Form 16 = TDS certificate. ✅ ITR filing ke liye: 1) Form 16 Part A aur B dono check karo 2) TDS amount Form 26AS se match karo 3) Income tax portal pe prefilled ITR check karo 4) July 31 deadline se pehle file karo. CA ya ClearTax/Tax2Win use kar sakte ho.',
    keywords: ['form 16', 'tds', 'tax deducted at source', 'salary tds', 'itr filing', 'income tax', 'tax certificate'],
  },
  {
    id: '045',
    category: 'salary_offer',
    title: 'Performance Improvement Plan (PIP)',
    keyFacts: 'PIP = structured performance plan | Legal protection for employer | Rarely leads to improvement | Documentation important | Alternative = negotiate exit',
    riskLevel: 'high',
    deadline: 'PIP duration: typically 30-90 days. Documentation start karo immediately.',
    actions: '1) HR se PIP goals clearly samjho — SMART goals hone chahiye. 2) Sab performance kaam document karo. 3) Legal advice lo. 4) Negotiated exit consider karo — better than termination record.',
    qa: [
      { q: 'PIP matlab kya hai?', a: 'Performance Improvement Plan — company formally document kar rahi hai ki aapki performance low hai. Yeh mostly termination ka precursor hota hai, lekin legally improvement chance dena required hai.' },
      { q: 'PIP se apni job kaise bacha sakte hain?', a: 'Goals clearly samjho — sab measurable hone chahiye. Weekly progress manager ko bhejo written mein. HR ke saath regular meetings. Documentation sabse important hai.' },
      { q: 'Negotiated exit kya hota hai?', a: 'Company se baat karo — "mujhe resign karna hai, aap severance doge?" Zyada tar companies prefer karti hain — litigation se bachti hain. 1-3 months severance milti hai negotiation se.' },
    ],
    template: '🔴 PIP (Performance Improvement Plan) — serious situation. ✅ Kya karo: 1) PIP goals document karo — agar vague hain toh written clarification maango 2) Sab work written mein bhejo 3) Legal advice lo 4) Negotiated exit explore karo — termination se better hai resignation with severance.',
    keywords: ['pip', 'performance improvement plan', 'job termination', 'performance review', 'fired', 'dismissal', 'performance issue'],
  },
  {
    id: '046',
    category: 'salary_offer',
    title: 'Layoff / Retrenchment Notice',
    keyFacts: 'Retrenchment = Industrial Disputes Act | 1 month notice or pay | Gratuity mandatory (5 years service) | Retrenchment compensation = 15 days per year',
    riskLevel: 'high',
    deadline: 'Notice period serve karo ya buyout accept karo. Last day ke baad dues maango.',
    actions: '1) Notice carefully padho — last working day, dues payable. 2) Gratuity calculation karo agar 5+ years. 3) Full and final settlement document maango. 4) Unemployment benefits check karo.',
    qa: [
      { q: 'Layoff mein kya kya milna chahiye?', a: 'Pending salary, notice pay (agar garden leave), earned leave encashment, gratuity (5+ years), PF settlement, performance bonus (pro-rata), relieving letter, experience certificate, Form 16.' },
      { q: 'Gratuity kaise calculate hoti hai?', a: 'Formula: (Last Basic Salary / 26) × 15 × Years of Service. Example: Basic ₹50,000, 6 years service = (50,000/26) × 15 × 6 = ₹1,73,077.' },
    ],
    template: '🔴 Layoff notice mila. ✅ Kya karo: 1) Last working day note karo 2) Gratuity calculate karo (5+ years service?) 3) Full & Final settlement checklist: salary, notice pay, leave encashment, gratuity, PF 4) Relieving letter aur experience certificate maango 5) Labor court option hai agar dues nahi milte.',
    keywords: ['layoff', 'retrenchment', 'job loss', 'termination', 'fired', 'redundancy', 'severance', 'last working day'],
  },
  {
    id: '047',
    category: 'salary_offer',
    title: 'Salary Slip – Understanding Deductions',
    keyFacts: 'CTC vs gross vs net | PF = 12% basic | ESI = 0.75% gross | Professional tax = state specific | HRA exemption calculation',
    riskLevel: 'low',
    deadline: 'No deadline — understanding ke liye',
    actions: '1) Salary slip dhyan se padho. 2) TDS correct hai kya — Form 16 se check karo. 3) PF contribution verify karo. 4) Investment declarations submit karo TDS save karne ke liye.',
    qa: [
      { q: 'Salary slip mein itni deductions kyun hain?', a: 'Typical deductions: PF (12% of basic), ESI (if applicable), Professional Tax (state wise), TDS (income tax). Sab legal deductions hain. PF toh aapki saving hi hai — retirement mein kaam aata hai.' },
      { q: 'HRA exemption kaise milti hai?', a: 'Agar rented accommodation mein ho toh: Rent receipts landlord se lo (PAN mandatory above ₹1 lakh annual), HR ko investment declaration mein submit karo. Minimum of (actual HRA, rent-10%*basic, 40/50% of basic) exempt hoga.' },
    ],
    template: '🟢 Salary slip — normal document. 📋 Key points: 1) Gross = Basic + HRA + Allowances 2) Net = Gross - PF - ESI - TDS - Prof Tax 3) PF aapki savings hai — employer bhi match karta hai 4) TDS bach sakti hai — investment declaration submit karo HR ko.',
    keywords: ['salary slip', 'payslip', 'salary deductions', 'pf deduction', 'esi', 'tds', 'net salary', 'gross salary', 'salary breakdown'],
  },
];

// ─── KEYWORD MATCHING ENGINE ───────────────────────────────────────────────
function scoreEntry(entry: DatasetEntry, documentText: string, category: string): number {
  let score = 0;
  const lowerText = documentText.toLowerCase();

  // Category match bonus
  if (entry.category === category) score += 50;

  // Keyword matching
  for (const kw of entry.keywords) {
    if (lowerText.includes(kw.toLowerCase())) {
      score += 10;
    }
  }

  // Risk level match from text signals
  if (entry.riskLevel === 'high' && (lowerText.includes('urgent') || lowerText.includes('immediately') || lowerText.includes('jail') || lowerText.includes('arrest'))) {
    score += 5;
  }

  return score;
}

/**
 * Get top 2 matching dataset entries for the given document text and category.
 * These entries are injected into the AI system prompt as few-shot examples.
 */
export function getRelevantExamples(documentText: string, category: string): DatasetEntry[] {
  const scored = DATASET.map(entry => ({
    entry,
    score: scoreEntry(entry, documentText, category),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Return top 2 entries with a minimum relevance score of 10
  return scored
    .filter(s => s.score >= 10)
    .slice(0, 2)
    .map(s => s.entry);
}

/**
 * Build a rich system prompt with injected few-shot examples from the dataset.
 */
export function buildEnrichedSystemPrompt(basePrompt: string, documentText: string, category: string): string {
  const examples = getRelevantExamples(documentText, category);

  if (examples.length === 0) {
    return basePrompt;
  }

  const examplesText = examples.map(ex => `
--- EXAMPLE: ${ex.title} ---
Key Facts: ${ex.keyFacts}
Risk Level: ${ex.riskLevel.toUpperCase()}
Deadline: ${ex.deadline}
Actions: ${ex.actions}
${ex.qa.map(qa => `Q: ${qa.q}\nA: ${qa.a}`).join('\n')}
Ideal Response Template: ${ex.template}
---`).join('\n');

  return `${basePrompt}

REFERENCE KNOWLEDGE (Use these real Indian document examples to guide your analysis):
${examplesText}

Apply the same level of detail, Hinglish tone, and action-first approach as shown in the examples above.`;
}
