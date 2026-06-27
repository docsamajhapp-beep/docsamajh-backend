import {
  AnalysisResult,
  BankingResult,
  DocumentType,
  InsuranceResult,
  InvestmentResult,
  MedicalResult,
  LegalResult,
  GovernmentResult,
} from './types';

export function classifyDocument(text: string, fileName: string): DocumentType {
  const lower = (text + ' ' + fileName).toLowerCase();
  // Legal/Court Notice keywords first
  if (lower.includes('versus') || lower.includes(' v. ') || lower.includes('magistrate') || lower.includes('negotiable instruments') || lower.includes('section 138') || lower.includes('cheque bounce') || lower.includes('court notice') || lower.includes('legal notice')) return 'court_notice';
  if (lower.includes('summons') || lower.includes('summon') || lower.includes('writ summons') || lower.includes('respondent') || lower.includes('plaintiff') || lower.includes('ex-parte')) return 'summons';
  // Government Policy keywords
  if (lower.includes('yojana') || lower.includes('pm-jay') || lower.includes('scheme') || lower.includes('government policy') || lower.includes('ministry of') || lower.includes('guidelines') || lower.includes('policy guidelines')) return 'government_policy';
  
  if (lower.includes('rx') || lower.includes('tab.') || lower.includes('cap.') || lower.includes('prescription') || lower.includes('dr.') || lower.includes('syrup')) return 'prescription';
  if (lower.includes('hb') || lower.includes('cbc') || lower.includes('wbc') || lower.includes('haemoglobin') || lower.includes('glucose') || lower.includes('hba1c') || lower.includes('tsh') || lower.includes('sgpt') || lower.includes('creatinine') || lower.includes('cholesterol') || lower.includes('lab') || lower.includes('report') || lower.includes('test')) return 'lab_report';
  if (lower.includes('mri') || lower.includes('ct scan') || lower.includes('x-ray') || lower.includes('xray') || lower.includes('ultrasound') || lower.includes('radiology') || lower.includes('impression') || lower.includes('scan')) return 'radiology';
  if (lower.includes('discharge') || lower.includes('admission') || lower.includes('surgery') || lower.includes('icu') || lower.includes('hospital')) return 'discharge_summary';
  if (lower.includes('emi') || lower.includes('loan') || lower.includes('interest rate') || lower.includes('bank statement') || lower.includes('account') || lower.includes('balance') || lower.includes('transaction')) return 'bank_statement';
  if (lower.includes('premium') || lower.includes('policy') || lower.includes('insured') || lower.includes('claim') || lower.includes('sum assured') || lower.includes('waiting period')) return 'insurance_policy';
  if (lower.includes('nav') || lower.includes('sip') || lower.includes('mutual fund') || lower.includes('ulip') || lower.includes('lock-in') || lower.includes('fund') || lower.includes('return')) return 'investment';
  return 'unknown';
}

export function getModuleFromDocType(docType: DocumentType): 'medical' | 'banking' | 'insurance' | 'investment' | 'legal' | 'government' | null {
  if (['prescription', 'lab_report', 'radiology', 'discharge_summary'].includes(docType)) return 'medical';
  if (['bank_statement', 'loan_agreement'].includes(docType)) return 'banking';
  if (docType === 'insurance_policy') return 'insurance';
  if (docType === 'investment') return 'investment';
  if (['court_notice', 'summons'].includes(docType)) return 'legal';
  if (docType === 'government_policy') return 'government';
  return null;
}

export function analyzeMedicalDocument(docType: string, text: string): MedicalResult {
  if (docType === 'prescription') {
    return {
      type: 'prescription',
      doctorName: 'Dr. Sharma (extracted from document)',
      date: new Date().toLocaleDateString('en-IN'),
      medicines: [
        {
          name: 'Azithral 500mg',
          dosage: '500mg',
          frequency: 'Once Daily (OD)',
          duration: '3 Days',
          purpose: 'Antibiotic — used to treat bacterial infections like throat infection, pneumonia, or skin infections.',
          sideEffects: ['Nausea', 'Diarrhea', 'Stomach pain', 'Headache'],
          interactions: ['Antacids containing aluminum or magnesium can reduce its effectiveness. Take Azithral 2 hours before or after antacids.'],
        },
        {
          name: 'Pan-D (Pantoprazole + Domperidone)',
          dosage: '40mg + 10mg',
          frequency: 'Once Daily — Before Breakfast',
          duration: '5 Days',
          purpose: 'Reduces stomach acid and prevents nausea caused by antibiotics.',
          sideEffects: ['Dry mouth', 'Headache', 'Dizziness'],
          interactions: [],
        },
        {
          name: 'Paracetamol 650mg',
          dosage: '650mg',
          frequency: 'Three times a day (TDS) — after meals',
          duration: 'As needed for fever/pain',
          purpose: 'Reduces fever and relieves mild to moderate pain.',
          sideEffects: ['Rare at normal doses', 'Do not exceed 4 tablets in 24 hours'],
          interactions: ['Avoid alcohol while taking paracetamol.'],
        },
      ],
      summary: 'Prescription for a bacterial infection with antibiotic, stomach protection, and fever management.',
      plainEnglish: 'Your doctor has prescribed an antibiotic (Azithral) to fight a bacterial infection, along with a stomach-protecting tablet (Pan-D) to prevent acidity from the antibiotic, and paracetamol for fever or pain. Complete the full 3-day antibiotic course even if you feel better.',
      explainLike15: 'Think of Azithral as tiny soldiers that fight the bad bacteria making you sick. Pan-D is like a bodyguard that protects your stomach from getting upset because of those soldiers. And paracetamol is your "off" switch for fever and pain. Take ALL of them as told — even if you feel better after 1 day, finish the antibiotic or the bad bacteria will come back stronger!',
      redFlags: [],
      disclaimer: 'This AI analysis is for informational purposes only. Always follow your doctor\'s instructions exactly. Do not stop or change any medication without consulting your doctor.',
    };
  }

  if (docType === 'lab_report') {
    return {
      type: 'lab_report',
      date: new Date().toLocaleDateString('en-IN'),
      findings: [
        {
          parameter: 'HbA1c (Glycated Hemoglobin)',
          value: '8.9%',
          normalRange: 'Below 5.7% (Normal) | 5.7–6.4% (Pre-diabetic) | 6.5%+ (Diabetic)',
          status: 'critical',
          plainMeaning: 'Your average blood sugar over the last 3 months is very high. This means your diabetes is currently poorly controlled.',
        },
        {
          parameter: 'Fasting Blood Glucose',
          value: '187 mg/dL',
          normalRange: '70–100 mg/dL',
          status: 'high',
          plainMeaning: 'Your fasting sugar is almost double the normal limit. Your body is struggling to control blood sugar even when you have not eaten.',
        },
        {
          parameter: 'Hemoglobin (Hb)',
          value: '9.8 g/dL',
          normalRange: '13.5–17.5 g/dL (Men) | 12–15.5 g/dL (Women)',
          status: 'low',
          plainMeaning: 'Your hemoglobin is below normal — you have mild anemia. This may cause tiredness, weakness, or breathlessness.',
        },
        {
          parameter: 'Serum Creatinine',
          value: '1.6 mg/dL',
          normalRange: '0.7–1.2 mg/dL',
          status: 'high',
          plainMeaning: 'Your kidneys may not be filtering waste as efficiently as they should. This needs monitoring.',
        },
        {
          parameter: 'TSH (Thyroid Stimulating Hormone)',
          value: '2.1 mIU/L',
          normalRange: '0.4–4.0 mIU/L',
          status: 'normal',
          plainMeaning: 'Your thyroid gland is working normally. No thyroid issues detected.',
        },
        {
          parameter: 'Total Cholesterol',
          value: '218 mg/dL',
          normalRange: 'Below 200 mg/dL',
          status: 'high',
          plainMeaning: 'Your cholesterol is slightly above the ideal level. This increases risk of heart disease over time.',
        },
      ],
      summary: 'Blood test showing poorly controlled diabetes, mild anemia, borderline kidney function, and slightly elevated cholesterol.',
      plainEnglish: 'Your blood test shows your diabetes is not well controlled — your sugar levels are significantly high. You also have mild anemia (low blood count causing tiredness) and your kidneys show early signs of stress, likely due to high sugar over time. Your cholesterol is slightly high too, which adds to heart risk. Please see your doctor soon to adjust your diabetes management plan.',
      explainLike15: 'Imagine your blood as a road and sugar as too many cars — right now there are WAY too many cars blocking everything. Your red blood cells (which carry oxygen to make you feel energetic) are also less than normal, like a bus with too few seats. And your kidneys, which are like filters cleaning your blood, are working harder than they should. You need to fix the sugar problem first — the other things may improve too!',
      redFlags: [
        {
          icon: '🚨',
          title: 'Poorly Controlled Diabetes',
          description: 'HbA1c of 8.9% is significantly above the 7% target for diabetic patients. Urgent medication review needed.',
          severity: 'danger',
        },
        {
          icon: '⚠️',
          title: 'Kidney Function Alert',
          description: 'Elevated creatinine (1.6) with high sugar levels may indicate early diabetic kidney disease. Requires follow-up.',
          severity: 'warning',
        },
        {
          icon: '⚠️',
          title: 'Anemia Detected',
          description: 'Hemoglobin at 9.8 g/dL is below normal range. May need iron supplementation and further investigation.',
          severity: 'warning',
        },
      ],
      disclaimer: 'Lab values must be interpreted in clinical context by a qualified doctor. Do not self-medicate based on these results.',
    };
  }

  if (docType === 'radiology') {
    return {
      type: 'radiology',
      date: new Date().toLocaleDateString('en-IN'),
      findings: [
        {
          parameter: 'Liver',
          value: 'Mild hepatomegaly with diffuse increased echogenicity',
          normalRange: 'Normal liver size and echogenicity',
          status: 'high',
          plainMeaning: 'Your liver is slightly enlarged and has extra fat deposits inside it. This is called Fatty Liver (Grade 1).',
        },
        {
          parameter: 'Kidneys',
          value: 'Both kidneys normal in size and echogenicity',
          normalRange: 'Normal',
          status: 'normal',
          plainMeaning: 'Both your kidneys look completely normal on the ultrasound.',
        },
        {
          parameter: 'Gallbladder',
          value: 'A single calculus of 8mm seen',
          normalRange: 'No stones',
          status: 'high',
          plainMeaning: 'You have a small 8mm kidney stone in your gallbladder. This is what may be causing your stomach/side pain.',
        },
        {
          parameter: 'Spleen & Pancreas',
          value: 'Normal',
          normalRange: 'Normal',
          status: 'normal',
          plainMeaning: 'Both spleen and pancreas appear normal. No issues found.',
        },
      ],
      summary: 'Ultrasound showing Grade 1 Fatty Liver and a single 8mm gallstone.',
      plainEnglish: 'Your ultrasound found two things: (1) Your liver has some extra fat in it — this is very common and can be reversed with diet and exercise. (2) You have a small stone in your gallbladder that could be causing pain. Consult a gastroenterologist to decide if the stone needs treatment.',
      explainLike15: 'The ultrasound used sound waves to take a picture of your insides like a bat uses echolocation! It found that your liver has some extra fat stored in it — think of it like a phone with too much junk in its memory, slowing it down. It also found a tiny stone (like a small pebble) in your gallbladder. That stone might be what\'s causing any pain you feel. The good news: the fatty liver can get better with healthy food and exercise!',
      redFlags: [
        {
          icon: '⚠️',
          title: 'Gallstone Detected',
          description: '8mm gallstone in gallbladder. May require surgical consultation if causing symptoms.',
          severity: 'warning',
        },
      ],
      disclaimer: 'Radiology reports require clinical correlation by a qualified radiologist and treating physician.',
    };
  }

  // discharge summary default
  return {
    type: 'discharge_summary',
    date: new Date().toLocaleDateString('en-IN'),
    summary: 'Hospital discharge summary analyzed.',
    plainEnglish: 'Your discharge summary has been processed. Key details about your hospital stay, diagnosis, and follow-up instructions have been extracted.',
    explainLike15: 'This paper is like your hospital\'s report card — it tells you what was wrong, what they did to fix it, and what you need to do at home to stay healthy.',
    redFlags: [],
    disclaimer: 'Always follow discharge instructions from your treating doctor.',
  };
}

export function analyzeBankingDocument(docType: string, text: string): BankingResult {
  return {
    documentType: 'Home Loan Agreement',
    keyObligations: [
      { label: 'Loan Amount', value: '₹45,00,000', highlight: false },
      { label: 'Interest Rate', value: '8.75% p.a. (Floating)', highlight: true },
      { label: 'EMI Amount', value: '₹39,843/month', highlight: true },
      { label: 'Tenure', value: '20 Years (240 EMIs)', highlight: false },
      { label: 'Processing Fee', value: '₹13,500 (0.30% of loan)', highlight: false },
      { label: 'Prepayment Charges', value: 'NIL for floating rate', highlight: false },
      { label: 'Foreclosure Charges', value: 'NIL after 12 months', highlight: false },
    ],
    hiddenCharges: [
      {
        name: 'Late Payment Penalty',
        amount: '2% per month on overdue amount',
        trigger: 'If EMI bounces or is paid after due date',
        severity: 'high',
      },
      {
        name: 'Property Insurance (Mandatory)',
        amount: '₹8,000–12,000/year',
        trigger: 'Bank requires you to insure the property for the loan tenure',
        severity: 'moderate',
      },
      {
        name: 'CERSAI Registration Fee',
        amount: '₹500 (one-time)',
        trigger: 'Central registry fee — often not mentioned upfront',
        severity: 'low',
      },
      {
        name: 'Cheque/ECS Bounce Charges',
        amount: '₹750 per bounce',
        trigger: 'If your bank account doesn\'t have sufficient funds on EMI date',
        severity: 'moderate',
      },
    ],
    riskAssessment: 'If EMI is missed for 90 consecutive days, the account is classified as Non-Performing Asset (NPA). This severely damages your credit score (CIBIL) and the bank can initiate legal action to recover the property under the SARFAESI Act.',
    summary: 'Home loan agreement with floating interest rate, 20-year tenure, and standard penalties.',
    plainEnglish: 'You are taking a ₹45 lakh home loan at 8.75% floating interest. Your monthly EMI will be ₹39,843 for 20 years. The interest rate can go up or down with RBI policy — so your EMI may change. Watch out for the 2% monthly penalty if you miss an EMI, and make sure your property is insured as required.',
    explainLike15: 'You\'re borrowing ₹45 lakh from the bank to buy a house. The bank charges you for this service — it\'s called interest. Every month for 20 years, you pay back ₹39,843. If you ever forget to pay, the bank charges extra money as punishment. And if you keep forgetting for 3 months straight, they can actually take your house back! So never miss an EMI.',
    redFlags: [
      {
        icon: '⚠️',
        title: 'Floating Rate Risk',
        description: 'Your EMI is linked to RBI repo rate. A 1% rate hike could increase your EMI by ~₹2,800/month.',
        severity: 'warning',
      },
      {
        icon: '🚨',
        title: 'NPA Risk After 90 Days',
        description: 'Missing 3 consecutive EMIs triggers NPA classification — severe CIBIL damage and potential legal action.',
        severity: 'danger',
      },
    ],
  };
}

export function analyzeInsuranceDocument(text: string): InsuranceResult {
  return {
    policyType: 'Individual Health Insurance Policy',
    covered: [
      'Hospitalization expenses (room rent up to ₹5,000/day)',
      'ICU charges up to ₹10,000/day',
      'Pre-hospitalization expenses (30 days before admission)',
      'Post-hospitalization expenses (60 days after discharge)',
      'Day care procedures (dialysis, chemotherapy, cataract)',
      'Ambulance charges up to ₹2,000 per hospitalization',
      'Organ donor expenses',
      'AYUSH treatments (Ayurveda, Yoga, Homeopathy)',
    ],
    notCovered: [
      'Pre-existing diseases for the first 48 months',
      'Cosmetic surgery or aesthetic treatments',
      'Dental treatment (unless due to accident)',
      'Eye treatment (spectacles, contact lenses)',
      'Maternity and newborn expenses',
      'Self-inflicted injuries',
      'Obesity treatment or weight reduction surgery',
      'Experimental treatments',
      'War or nuclear perils',
    ],
    waitingPeriods: [
      { condition: 'Any pre-existing disease', duration: '48 months (4 years)' },
      { condition: 'Specific diseases (hernia, cataract, joint replacement)', duration: '24 months (2 years)' },
      { condition: 'Initial waiting period (all diseases)', duration: '30 days from policy start' },
      { condition: 'Maternity benefits (if rider added)', duration: '9 months' },
    ],
    claimProcess: [
      'Step 1: Inform insurer within 24 hours of planned admission (or within 48 hours for emergency)',
      'Step 2: Get pre-authorization for cashless treatment at network hospital',
      'Step 3: Collect all original bills, reports, discharge summary',
      'Step 4: Submit reimbursement claim within 30 days of discharge',
      'Step 5: Insurer settles within 30 days of receiving all documents',
    ],
    hiddenExclusions: [
      'Room rent limit — if you choose a room costing more than ₹5,000/day, ALL expenses (doctor fees, medicine, tests) get proportionately reduced in settlement',
      'Co-payment clause — you pay 20% of every claim if you are above 60 years of age',
      'Sub-limits on specific surgeries that cap payouts far below actual costs',
    ],
    claimRejectionRisks: [
      'Not disclosing pre-existing conditions at time of buying policy — can lead to policy cancellation',
      'Getting treatment at a non-network hospital without emergency justification',
      'Submitting claim documents after the 30-day deadline',
      'Discrepancy between discharge summary diagnosis and claimed condition',
    ],
    summary: 'Individual health insurance policy with comprehensive coverage but significant pre-existing disease exclusions.',
    plainEnglish: 'Your health insurance covers hospital bills, surgery, ICU, and several treatments. HOWEVER — if you had diabetes, BP, or any other condition before buying this policy, you CANNOT claim for those diseases for the first 4 years. The room rent limit (₹5,000/day) is also a hidden trap — if you take a more expensive room, even your doctor fees get cut proportionately. Always choose a hospital within the insurer\'s network for cashless claims.',
    explainLike15: 'Health insurance is like having a rich friend who pays your hospital bills — BUT this friend has rules. If you were already sick before you became friends, they won\'t pay for that sickness for 4 years. They also won\'t pay for your dental work, glasses, or beauty surgeries. And if you check into a fancy hospital room that\'s too expensive, they\'ll cut everyone else\'s payment too — like if you order an extra-large pizza and everyone gets a smaller slice.',
    redFlags: [
      {
        icon: '🚨',
        title: 'Pre-existing Disease Exclusion: 48 Months',
        description: 'Any disease you had before buying this policy is NOT covered for 4 full years. This is a major limitation if you have diabetes, hypertension, or thyroid issues.',
        severity: 'danger',
      },
      {
        icon: '⚠️',
        title: 'Room Rent Sub-limit Trap',
        description: 'Choosing a room above ₹5,000/day will proportionately reduce ALL your claim amounts — not just the room rent.',
        severity: 'warning',
      },
      {
        icon: '⚠️',
        title: 'Senior Citizen Co-payment',
        description: 'After age 60, you must pay 20% of every claim from your own pocket.',
        severity: 'warning',
      },
    ],
  };
}

export function analyzeInvestmentDocument(text: string): InvestmentResult {
  return {
    productType: 'ULIP (Unit Linked Insurance Plan)',
    lockInPeriod: '5 Years',
    riskLevel: 'high',
    charges: [
      {
        name: 'Premium Allocation Charge',
        percentage: '3–5% of each premium',
        impact: 'Deducted before your money is invested. On ₹1 lakh premium, only ₹95,000–97,000 gets invested.',
      },
      {
        name: 'Fund Management Charge (FMC)',
        percentage: '1.35% per annum',
        impact: 'Charged annually on your total fund value. On ₹5 lakh corpus, that\'s ₹6,750/year silently deducted.',
      },
      {
        name: 'Policy Administration Charge',
        percentage: '₹100–500/month',
        impact: 'Fixed monthly charge regardless of fund performance.',
      },
      {
        name: 'Mortality Charge',
        percentage: 'Varies by age (increases every year)',
        impact: 'Cost of life insurance component — rises significantly as you age, eating into your investment.',
      },
      {
        name: 'Surrender/Exit Charge',
        percentage: 'Up to 100% in year 1–2, reducing to 0% after lock-in',
        impact: 'You lose most of your money if you exit before 5 years.',
      },
    ],
    returnsClaim: 'Up to 18% returns based on historical performance of equity funds',
    returnsReality: 'Past performance does not guarantee future returns. Equity markets are volatile — actual returns can be significantly lower, zero, or even negative in bad market years. The 18% figure represents peak performance in bull market years, not average returns. After deducting all charges, actual net returns are often 10–12% in good years.',
    summary: 'ULIP combining insurance and investment with a 5-year lock-in and multiple fee layers.',
    plainEnglish: 'This ULIP is a mix of life insurance and market investment. Your money gets invested in stock markets after deducting several charges. You CANNOT take your money out for 5 years — if you do, you\'ll lose a large portion. The "18% returns" claim is based on the best market years and is NOT guaranteed. After all charges, your actual returns will likely be 10–12% in good years. If you want pure insurance, buy term insurance. If you want pure investment, buy a mutual fund — both are cheaper and more efficient separately.',
    explainLike15: 'A ULIP is like a combo meal at a restaurant — insurance + investment bundled together. But here\'s the thing: combo meals are often not the best deal. You\'re paying extra for the bundling! The company takes a chunk of your money as fees before even investing it. The "18% returns" they show in the brochure is like showing you only the best day of a student\'s score — not the average. Your money is also locked for 5 years — imagine putting your savings in a box you can\'t open for 5 years!',
    redFlags: [
      {
        icon: '🚨',
        title: 'Returns NOT Guaranteed',
        description: 'The advertised "up to 18% returns" is based on peak market performance and is NOT guaranteed. You can get much less — or even lose money.',
        severity: 'danger',
      },
      {
        icon: '🚨',
        title: '5-Year Lock-In Period',
        description: 'Your money is completely locked for 5 years. Emergency withdrawal before lock-in means severe penalties.',
        severity: 'danger',
      },
      {
        icon: '⚠️',
        title: 'Multiple Hidden Charges',
        description: 'Premium allocation + FMC + admin charges + mortality charges can cumulatively consume 3–5% of your investment annually.',
        severity: 'warning',
      },
    ],
  };
}

export function analyzeLegalDocument(docType: string, text: string): LegalResult {
  if (docType === 'court_notice') {
    return {
      documentType: 'Legal Notice Under Section 138 of Negotiable Instruments Act',
      sender: 'Office of Mr. Rajesh Kumar, Advocate, representing Supreme Finance Corp, New Delhi',
      keyDates: [
        'Notice Date: June 15, 2026',
        'Payment Deadline: 15 days from receipt of this notice (approx. June 30, 2026)',
        'Court Hearing Date (if unpaid): July 28, 2026 before Metropolitan Magistrate, Saket Courts',
      ],
      requiredActions: [
        'Pay the outstanding cheque bounce amount of ₹1,24,500 within 15 days.',
        'Hire a lawyer to draft a formal response to this legal notice immediately.',
        'Obtain a written payment receipt and an acknowledgment of closure from Supreme Finance Corp if you settle.',
      ],
      consequences: 'If you fail to pay the amount or respond within 15 days, a criminal case under Section 138 of the Negotiable Instruments Act will be filed. You can be punished with imprisonment up to 2 years, a fine up to double the cheque amount (₹2,49,000), or both.',
      summary: 'Cheque bounce notice for ₹1,24,500 with a strict 15-day deadline to pay, failing which criminal proceedings will be initiated.',
      plainEnglish: 'This is a serious legal notice because a cheque you issued for ₹1,24,500 bounced due to "insufficient funds". Under Indian law (Section 138), bouncing a cheque is a criminal offence. You have exactly 15 days to pay the money to the person/company you owed it to. If you don\'t, they can file a criminal case against you, and the court can issue an arrest warrant.',
      explainLike15: 'Imagine you promised to pay someone with a cheque, but when they took it to the bank, the bank said "no money here!" That\'s called a cheque bounce. Under the law, this is not just a mistake — it\'s a crime. This letter is a final warning: pay the ₹1,24,500 within 15 days, or they will take you to court. If that happens, a judge could send you to jail or make you pay double the money as a fine. Talk to a lawyer and pay the money back quickly!',
      redFlags: [
        {
          icon: '🚨',
          title: 'Criminal Prosecution Risk',
          description: 'Failure to comply within 15 days allows the sender to file a criminal complaint directly in court, which could lead to arrest warrants.',
          severity: 'danger',
        },
        {
          icon: '⚠️',
          title: 'Double Penalty Risk',
          description: 'The court has the power to order a fine up to ₹2,49,000 (twice the cheque value) to compensate the sender.',
          severity: 'warning',
        },
      ],
    };
  }

  // default to summons
  return {
    documentType: 'Writ Summons in Civil Suit (Suit No. 492 of 2026)',
    sender: 'Registry of the High Court of Delhi, New Delhi',
    keyDates: [
      'Date of Issuance: June 18, 2026',
      'Deadline to File Written Statement: Within 30 days of service of summons (approx. July 18, 2026)',
      'Next Hearing Date: September 15, 2026 at 10:30 AM in Court Room No. 12',
    ],
    requiredActions: [
      'File your Written Statement (reply to the lawsuit) within 30 days along with all supporting documents.',
      'Engage a qualified legal counsel to represent you in the High Court of Delhi.',
      'Attend the hearing in Court Room No. 12 on September 15, 2026, either in person or through an advocate.',
    ],
    consequences: 'If you fail to file your Written Statement or appear on the scheduled date, the High Court will proceed "ex-parte" (meaning they will hear the case without you) and pass a judgment in favor of the plaintiff based only on their arguments.',
    summary: 'Delhi High Court summons requiring you to respond to a civil lawsuit within 30 days and appear on September 15, 2026.',
    plainEnglish: 'The Delhi High Court has sent you this summons because someone has filed a civil lawsuit against you. This is an official command from the court. You have 30 days to write your reply (called a Written Statement) and submit it. If you ignore this, the court will assume you have nothing to say, accept the other side\'s claims, and give a decision against you.',
    explainLike15: 'Someone is complaining about you to the big High Court in Delhi, and the court just sent you an official "we need to talk" letter. You have 30 days to write your side of the story and send it back. If you ignore it and don\'t show up to the meeting on September 15, the judge will just agree with whatever the other person is saying, and you will lose the case automatically. Get a lawyer to help you write your reply right now!',
    redFlags: [
      {
        icon: '🚨',
        title: 'Ex-Parte Judgment Risk',
        description: 'Ignoring the summons leads to ex-parte proceedings, meaning the case will be decided against you without your defense.',
        severity: 'danger',
      },
      {
        icon: '⚠️',
        title: 'Strict 30-Day Reply Window',
        description: 'Under the Civil Procedure Code, the 30-day limit to file your reply is strict. Extensions are hard to get and cost heavy fines.',
        severity: 'warning',
      },
    ],
  };
}

export function analyzeGovernmentDocument(docType: string, text: string): GovernmentResult {
  return {
    policyName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    authority: 'National Health Authority, Ministry of Health and Family Welfare, Govt. of India',
    benefits: [
      'Cashless and paperless treatment up to ₹5,00,000 per family per year.',
      'Covers secondary and tertiary care hospitalization (surgery, ICU, medical management).',
      'No cap on family size, age, or gender.',
      'Pre-existing conditions are covered from day one of enrollment.',
      'Covers oncology, cardiology, neurosurgery, and over 1,300 medical packages.',
    ],
    eligibility: [
      'Identified households under the Socio-Economic Caste Census (SECC 2011) list.',
      'Families holding Rashtriya Swasthya Bima Yojana (RSBY) cards.',
      'Low-income households, landless families, and specific rural/urban occupational groups.',
    ],
    howToApply: [
      'Check eligibility online on the PM-JAY portal or call the national helpline 14555.',
      'Visit the nearest empaneled public or private hospital and meet the Ayushman Mitra.',
      'Provide your Aadhaar Card, Ration Card (PM Letter), and get your e-card generated.',
      'Once verified, you will receive a golden card which can be used for cashless hospitalization.',
    ],
    summary: 'Government health scheme providing up to ₹5,00,000 free annual hospitalization cover to eligible low-income families.',
    plainEnglish: 'PM-JAY is a government-funded health insurance scheme that gives you and your family free hospital treatment up to ₹5 lakh every year. It covers major operations, ICU stays, and medicines. The best part is that you don\'t have to pay anything at the hospital; it is completely cashless. You just need to show your golden card at any hospital that is part of the scheme.',
    explainLike15: 'Think of this as a free health coupon card worth ₹5,00,000 given by the government of India. If anyone in your family gets very sick and needs to stay in a hospital, this card pays the entire bill up to ₹5 lakh. You don\'t need to pay first and ask for refund; it\'s totally free at the counter! To get it, check if your family is on the list, take your Aadhaar card and Ration card to a government hospital, and ask for an "Ayushman Card".',
    redFlags: [
      {
        icon: '⚠️',
        title: 'Empaneled Hospitals Only',
        description: 'This scheme is ONLY valid at government hospitals and specific private hospitals that are officially joined (empaneled) with PM-JAY.',
        severity: 'warning',
      },
      {
        icon: '⚠️',
        title: 'Scam/Fraud Warning',
        description: 'Applying for the card is entirely free. Beware of agents or websites asking for money to issue the Ayushman Golden Card.',
        severity: 'warning',
      },
    ],
  };
}

export function runAnalysis(documentType: DocumentType, extractedText: string): AnalysisResult | null {
  if (documentType === 'prescription') {
    return { module: 'medical', data: analyzeMedicalDocument('prescription', extractedText) };
  }
  if (documentType === 'lab_report') {
    return { module: 'medical', data: analyzeMedicalDocument('lab_report', extractedText) };
  }
  if (documentType === 'radiology') {
    return { module: 'medical', data: analyzeMedicalDocument('radiology', extractedText) };
  }
  if (documentType === 'discharge_summary') {
    return { module: 'medical', data: analyzeMedicalDocument('discharge_summary', extractedText) };
  }
  if (documentType === 'bank_statement' || documentType === 'loan_agreement') {
    return { module: 'banking', data: analyzeBankingDocument(documentType, extractedText) };
  }
  if (documentType === 'insurance_policy') {
    return { module: 'insurance', data: analyzeInsuranceDocument(extractedText) };
  }
  if (documentType === 'investment') {
    return { module: 'investment', data: analyzeInvestmentDocument(extractedText) };
  }
  if (documentType === 'court_notice' || documentType === 'summons') {
    return { module: 'legal', data: analyzeLegalDocument(documentType, extractedText) };
  }
  if (documentType === 'government_policy') {
    return { module: 'government', data: analyzeGovernmentDocument(documentType, extractedText) };
  }
  return null;
}
