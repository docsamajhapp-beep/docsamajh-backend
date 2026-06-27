export interface MedicalParameter {
  id: string;
  name: string;
  category: string;
  normal_range: string;
  low_meaning?: string;
  low_causes?: string;
  low_risk?: string;
  low_fix?: string;
  high_meaning: string;
  high_causes?: string;
  high_risk?: string;
  high_fix?: string;
  disclaimer: string;
}

export const MEDICAL_PARAMETERS: MedicalParameter[] = [
  {
    id: "hemoglobin",
    name: "Hemoglobin (Hb)",
    category: "CBC",
    normal_range: "Men: 13-17 g/dL, Women: 12-15 g/dL",
    low_meaning: "Hemoglobin kam hai — iska matlab anemia (khoon ki kami) ho sakta hai.",
    low_causes: "Iron ki kami, vitamin B12/folate ki kami, heavy periods, chronic disease, ya internal bleeding.",
    low_risk: "Thakaan, saans phoolna, chakkar aana, pale skin, dil pe extra load padna.",
    low_fix: "Iron-rich khana (paalak, chana, gud, anda), vitamin C ke saath iron absorption better hota hai. Severe ho to doctor iron supplement ya iron-rich diet prescribe karte hain.",
    high_meaning: "Hemoglobin zyada hai — dehydration, smoking, ya kabhi-kabhi lungs/heart condition ki nishaani ho sakti hai.",
    high_risk: "Khoon thick ho sakta hai, clotting risk badh sakta hai.",
    high_fix: "Paani zyada piyo, smoking avoid karo, underlying cause check karne ke liye doctor se milo.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "vitamin_d",
    name: "Vitamin D (25-OH)",
    category: "Vitamins",
    normal_range: "30-100 ng/mL",
    low_meaning: "Vitamin D ki kami hai — bahut common hai India mein, especially indoor lifestyle walon mein.",
    low_causes: "Dhoop kam milna, diet mein vitamin D na hona, obesity, kidney/liver issues.",
    low_risk: "Haddiyon mein dard, weakness, baal jhadna, mood low rehna, immunity weak hona, bachon mein growth issues.",
    low_fix: "Roz 15-20 min dhoop lo (subah/shaam), anda, fish, fortified milk khao. Doctor severe deficiency mein weekly/monthly supplement (60000 IU) deta hai.",
    high_meaning: "Vitamin D zyada hai — usually over-supplementation se hota hai.",
    high_risk: "Calcium overload, kidney stones, nausea.",
    high_fix: "Supplement band karo, doctor se dose adjust karwao.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "vitamin_b12",
    name: "Vitamin B12",
    category: "Vitamins",
    normal_range: "200-900 pg/mL",
    low_meaning: "B12 ki kami hai — nerves aur khoon banane ke liye zaroori vitamin.",
    low_causes: "Vegetarian/vegan diet, absorption issues (gut problems), kuch dawaiyan (jaise long-term acidity medicine).",
    low_risk: "Thakaan, haath-pair mein sunnpan/tingling, memory weak hona, anemia, severe cases mein nerve damage.",
    low_fix: "Anda, dairy, meat (non-veg) khao, ya doctor B12 tablets/injections suggest karte hain agar severe ho.",
    high_meaning: "B12 zyada hona usually supplement se hota hai, generally harmless hai but underlying liver/kidney issue bhi indicate kar sakta hai.",
    high_risk: "Rare cases mein liver disease ya certain blood disorders se link.",
    high_fix: "Doctor se cause check karwao agar without supplement zyada aaya hai.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "fasting_sugar",
    name: "Fasting Blood Sugar",
    category: "Diabetes",
    normal_range: "70-99 mg/dL",
    low_meaning: "Sugar level kam hai (hypoglycemia) — dangerous ho sakta hai turant treat na karein to.",
    low_causes: "Bina khaye lambe time tak rehna, diabetes medicine ki overdose, excessive exercise.",
    low_risk: "Chakkar, sweating, confusion, behoshi — severe ho to seizure bhi.",
    low_fix: "Turant kuch sweet khao (glucose, candy), aur doctor se medicine dose check karwao.",
    high_meaning: "Sugar zyada hai — prediabetes ya diabetes ki nishaani.",
    high_causes: "Insulin resistance, poor diet, sedentary lifestyle, family history, obesity.",
    high_risk: "Lambe time tak high sugar se kidney, eyes, nerves, heart damage ho sakta hai.",
    high_fix: "Sugar/maida kam karo, fiber-rich khana lo, roz walk/exercise karo, doctor se HbA1c bhi check karwao long-term control ke liye.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "hba1c",
    name: "HbA1c",
    category: "Diabetes",
    normal_range: "Below 5.7%",
    high_meaning: "5.7-6.4% prediabetes, 6.5%+ diabetes batata hai. Ye pichle 3 mahine ka average sugar level dikhata hai.",
    high_causes: "Poor diet control, insufficient medication, lack of exercise.",
    high_risk: "Heart disease, kidney damage, nerve damage, eye problems ka risk badh jaata hai long term mein.",
    high_fix: "Diet aur exercise pe focus karo, doctor se regular follow-up aur medication adjustment zaroori hai.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "total_cholesterol",
    name: "Total Cholesterol",
    category: "Lipid Profile",
    normal_range: "Below 200 mg/dL",
    high_meaning: "Cholesterol zyada hai — heart disease ka risk factor.",
    high_causes: "Oily/fried khana, genetics, kam exercise, obesity, smoking.",
    high_risk: "Arteries mein blockage, heart attack, stroke ka risk badhta hai.",
    high_fix: "Fried/oily food kam karo, fiber zyada lo (oats, fruits), roz exercise karo, doctor se LDL/HDL breakdown bhi dekhna zaroori hai.",
    low_meaning: "Bahut kam cholesterol rare hai, kabhi-kabhi malnutrition ya liver issue se ho sakta hai.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "ldl",
    name: "LDL (Bad Cholesterol)",
    category: "Lipid Profile",
    normal_range: "Below 100 mg/dL",
    high_meaning: "LDL zyada hai — ye 'bad cholesterol' hai jo arteries mein jamm jaata hai.",
    high_causes: "Saturated fat zyada khana, sedentary lifestyle, genetics.",
    high_risk: "Heart attack, stroke, blocked arteries ka direct risk.",
    high_fix: "Trans fat aur fried food avoid karo, green vegetables aur nuts khao, regular cardio exercise karo.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "hdl",
    name: "HDL (Good Cholesterol)",
    category: "Lipid Profile",
    normal_range: "Above 40 mg/dL (men), Above 50 mg/dL (women)",
    low_meaning: "HDL kam hai — ye 'good cholesterol' hai jo heart ko protect karta hai, kam hona risky hai.",
    low_causes: "Sedentary lifestyle, smoking, poor diet.",
    low_risk: "Heart disease ka risk badhta hai kyuki good cholesterol kam protection deta hai.",
    low_fix: "Exercise badhao (especially cardio), healthy fats lo (nuts, olive oil, fish), smoking chodo.",
    high_meaning: "Bahut high HDL rare hai aur generic target ranges se upar aane par dynamic issues check karne hote hain.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "triglycerides",
    name: "Triglycerides",
    category: "Lipid Profile",
    normal_range: "Below 150 mg/dL",
    high_meaning: "Triglycerides zyada hai — usually diet aur lifestyle se directly linked.",
    high_causes: "Sugar/carbs zyada khana, alcohol, obesity, kam physical activity.",
    high_risk: "Heart disease aur pancreatitis (pancreas inflammation) ka risk.",
    high_fix: "Sugar, alcohol, refined carbs kam karo, omega-3 (fish) lo, weight manage karo.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "tsh",
    name: "TSH (Thyroid)",
    category: "Thyroid",
    normal_range: "0.4-4.0 mIU/L",
    high_meaning: "TSH zyada hai — hypothyroidism (thyroid kam active hona) ki nishaani.",
    high_risk: "Weight gain, thakaan, cold lagna, baal jhadna, depression jaisa feel hona.",
    high_fix: "Doctor thyroid hormone replacement (levothyroxine) prescribe karte hain — khud se dose adjust mat karo.",
    low_meaning: "TSH kam hai — hyperthyroidism (thyroid zyada active hona) ki nishaani ho sakti hai.",
    low_risk: "Weight loss, ghabrahat, heart palpitations, hands mein kapkapi.",
    low_fix: "Doctor se proper diagnosis aur medication zaroori hai, self-treat na karein.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "creatinine",
    name: "Creatinine",
    category: "Kidney Function",
    normal_range: "0.6-1.3 mg/dL",
    high_meaning: "Creatinine zyada hai — kidney function kamzor hone ka sign ho sakta hai.",
    high_causes: "Dehydration, kidney disease, high protein diet, kuch medicines.",
    high_risk: "Agar lagataar high rahe to kidney damage badh sakta hai.",
    high_fix: "Paani zyada piyo, excess protein/painkillers avoid karo, doctor se kidney function tests (GFR) karwao.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "sgpt_alt",
    name: "SGPT / ALT (Liver Enzyme)",
    category: "Liver Function",
    normal_range: "7-56 U/L",
    high_meaning: "SGPT zyada hai — liver mein stress ya damage ka sign.",
    high_causes: "Fatty liver, alcohol, viral hepatitis, kuch medicines, obesity.",
    high_risk: "Untreated rehne se liver damage permanent ho sakta hai (cirrhosis tak).",
    high_fix: "Alcohol avoid karo, oily/junk food kam karo, weight manage karo, doctor se ultrasound/further tests karwao.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "uric_acid",
    name: "Uric Acid",
    category: "Metabolic",
    normal_range: "3.5-7.2 mg/dL",
    high_meaning: "Uric acid zyada hai — gout (joint pain) aur kidney stones ka risk factor.",
    high_causes: "Red meat, alcohol (especially beer), sugary drinks, obesity.",
    high_risk: "Joints mein dard/swelling (gout), kidney stones.",
    high_fix: "Red meat aur alcohol kam karo, paani zyada piyo, cherries/citrus fruits helpful hote hain, doctor se medication ki zaroorat bhi check karwao.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "platelets",
    name: "Platelet Count",
    category: "CBC",
    normal_range: "1.5-4.5 lakh/µL",
    low_meaning: "Platelets kam hain — bleeding/clotting issues ho sakte hain.",
    low_causes: "Dengue, viral infection, certain medicines, bone marrow issues.",
    low_risk: "Easy bruising, gums se bleeding, severe ho to internal bleeding risk.",
    low_fix: "Doctor se cause identify karwao (especially dengue season mein), papaya leaf extract jaisa home remedy doctor ki guidance ke bina avoid karein.",
    high_meaning: "Platelets zyada hain — inflammation, infection, ya bone marrow condition ka sign.",
    high_risk: "Clotting risk badh sakta hai.",
    high_fix: "Underlying cause ke liye doctor se further testing karwao.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  },
  {
    id: "wbc",
    name: "WBC Count (White Blood Cells)",
    category: "CBC",
    normal_range: "4,000-11,000 /µL",
    low_meaning: "WBC kam hai — immunity weak hone ka sign, infection se ladne ki capacity kam.",
    low_causes: "Viral infection, certain medicines, bone marrow issues, autoimmune disease.",
    low_risk: "Infections jaldi aur severely ho sakte hain.",
    low_fix: "Doctor se cause check karwao, immunity-boosting diet (fruits, vegetables) lo.",
    high_meaning: "WBC zyada hai — body mein infection ya inflammation chal raha hai.",
    high_risk: "Underlying infection ya inflammatory condition ka sign, severe cases mein blood disorder.",
    high_fix: "Doctor se infection source identify karwao aur treat karwao.",
    disclaimer: "Yeh general information hai. Sahi diagnosis ke liye doctor se consult karein."
  }
];
