const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://Nithish:Nithish21@remedy-radar.6je5hia.mongodb.net/?retryWrites=true&w=majority&appName=Remedy-Radar');
    console.log('Connected to MedicineDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Define schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  medicalHistory: [String]
}, { timestamps: true });

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  dosage: String,
  category: String
}, { timestamps: true });

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  relatedMedicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Medicine = mongoose.model('Medicine', medicineSchema);
const Symptom = mongoose.model('Symptom', symptomSchema);

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await Symptom.deleteMany({});
    console.log('Cleared existing data');

    // Create medicines
    const medicines = await Medicine.insertMany([
       { name: "Paracetamol", description: "Relief from fever and mild to moderate pain.", price: 30.00, image: "assets/images/paracetomal.jpg", dosage: "500mg", category: "pain-relief" },
  { name: "Ibuprofen", description: "Non-steroidal anti-inflammatory drug for pain and inflammation.", price: 65.00, image: "assets/images/ibuprofen.jpg", dosage: "400mg", category: "pain-relief" },
  { name: "Cetirizine", description: "Antihistamine for allergy symptoms like sneezing and runny nose.", price: 50.00, image: "assets/images/cetirizine.jpg", dosage: "10mg", category: "allergy" },
  { name: "Omeprazole", description: "Reduces stomach acid to treat indigestion and heartburn.", price: 90.00, image: "assets/images/Omeprazole.jpeg", dosage: "20mg", category: "digestive-health" },
  { name: "Azithromycin", description: "Antibiotic for a variety of bacterial infections.", price: 120.00, image: "assets/images/Azithromycin.jpg", dosage: "500mg", category: "antibiotics" },
  { name: "Loratadine", description: "Non-drowsy antihistamine for allergy relief.", price: 85.00, image: "assets/images/Loratadine.jpeg", dosage: "10mg", category: "allergy" },
  { name: "Amoxicillin", description: "Antibiotic used to treat bacterial infections like chest infections.", price: 75.00, image: "assets/images/Amoxicillin.jpeg", dosage: "500mg", category: "antibiotics" },
  { name: "Loperamide", description: "Anti-diarrheal medication.", price: 45.00, image: "assets/images/Loperamide.jpeg", dosage: "2mg", category: "digestive-health" },
  { name: "Aspirin", description: "Used to reduce pain, fever, or inflammation.", price: 20.00, image: "assets/images/aspirin.jpeg", dosage: "75mg", category: "pain-relief" },
  { name: "Dextromethorphan", description: "Cough suppressant for temporary relief of coughing.", price: 110.00, image: "assets/images/dextromethorphan.jpeg", dosage: "15mg/5ml", category: "cold-cough" },
  { name: "Guaifenesin", description: "Expectorant to help clear chest congestion.", price: 130.00, image: "assets/images/guaifenesin.jpeg", dosage: "200mg", category: "cold-cough" },
  { name: "Vitamin C", description: "Supplement for boosting immunity.", price: 150.00, image: "assets/images/vitaminc.jpeg", dosage: "500mg", category: "vitamins-supplements" },
  { name: "Vitamin D3", description: "Supports bone health and immune function.", price: 200.00, image: "assets/images/vitamin D3.jpeg", dosage: "60000 IU", category: "vitamins-supplements" },
  { name: "Metformin", description: "Used to treat type 2 diabetes.", price: 40.00, image: "assets/images/metformin.jpeg", dosage: "500mg", category: "diabetes" },
  { name: "Atorvastatin", description: "Lowers cholesterol and triglycerides in the blood.", price: 180.00, image: "assets/images/atorvastatin.jpeg", dosage: "10mg", category: "cardiovascular" },
  { name: "Amlodipine", description: "Used to treat high blood pressure (hypertension).", price: 95.00, image: "assets/images/amlodipine.jpeg", dosage: "5mg", category: "cardiovascular" },
  { name: "Clotrimazole Cream", description: "Antifungal cream for skin infections.", price: 80.00, image: "assets/images/clotrimazole Cream.jpeg", dosage: "1%", category: "skin-care" },
  { name: "Povidone-Iodine", description: "Antiseptic solution for preventing skin infections in minor cuts.", price: 60.00, image: "assets/images/povidone-Iodine.jpeg", dosage: "5% solution", category: "antiseptics" },
  { name: "Diclofenac Gel", description: "Topical pain relief for joint and muscle pain.", price: 125.00, image: "assets/images/diclofenac Gel.jpeg", dosage: "1%", category: "pain-relief" },
  { name: "Pantoprazole", description: "Proton pump inhibitor for acid reflux and ulcers.", price: 115.00, image: "assets/images/pantoprazole.jpeg", dosage: "40mg", category: "digestive-health" },
  { name: "Ciprofloxacin", description: "Antibiotic for urinary tract and other infections.", price: 90.00, image: "assets/images/Ciprofloxacin.jpeg", dosage: "500mg", category: "antibiotics" },
  { name: "Fexofenadine", description: "Non-drowsy antihistamine for seasonal allergies.", price: 140.00, image: "assets/images/fexofenadine.jpeg", dosage: "120mg", category: "allergy" },
  { name: "Sertraline", description: "SSRI antidepressant for depression and anxiety.", price: 250.00, image: "assets/images/sertraline.jpeg", dosage: "50mg", category: "mental-health" },
  { name: "Losartan", description: "Used to treat high blood pressure and help protect kidneys.", price: 160.00, image: "assets/images/losartan.jpeg", dosage: "50mg", category: "cardiovascular" },
  { name: "B-Complex Forte", description: "A blend of B vitamins to support energy metabolism.", price: 180.00, image: "assets/images/B-Complex Forte.jpeg", dosage: "1 tablet", category: "vitamins-supplements" },
  { name: "Salbutamol Inhaler", description: "Bronchodilator for asthma and COPD.", price: 350.00, image: "assets/images/Salbutamol Inhaler.jpeg", dosage: "100mcg/puff", category: "respiratory" },
  { name: "Levothyroxine", description: "Treats hypothyroidism (underactive thyroid).", price: 130.00, image: "assets/images/Levothyroxine.jpeg", dosage: "50mcg", category: "hormonal" },
  { name: "Hydrocortisone Cream", description: "Mild corticosteroid for skin irritation and rashes.", price: 95.00, image: "assets/images/Hydrocortisone Cream.jpeg", dosage: "1%", category: "skin-care" },
  { name: "Domperidone", description: "Used to treat nausea and vomiting.", price: 70.00, image: "assets/images/Domperidone.jpeg", dosage: "10mg", category: "digestive-health" },
  { name: "Iron + Folic Acid", description: "Supplement for preventing and treating anemia.", price: 220.00, image: "assets/images/Iron + Folic Acid.jpeg", dosage: "1 tablet", category: "vitamins-supplements" },
  { name: "Naproxen", description: "NSAID for pain, menstrual cramps, and inflammatory diseases.", price: 85.00, image: "assets/images/Naproxen.jpeg", dosage: "250mg", category: "pain-relief" },
  { name: "Ofloxacin", description: "Antibiotic for eye and ear infections.", price: 55.00, image: "assets/images/Ofloxacin.jpeg", dosage: "0.3% drops", category: "antibiotics" },
  { name: "Carboxymethylcellulose Eye Drops", description: "Lubricating eye drops for dry eyes.", price: 150.00, image: "assets/images/Carboxymethylcellulose Eye Drops.jpeg", dosage: "0.5%", category: "eye-care" },
  { name: "Glimepiride", description: "Used with diet and exercise to treat type 2 diabetes.", price: 60.00, image: "assets/images/Glimepiride.jpeg", dosage: "1mg", category: "diabetes" },
  { name: "Escitalopram", description: "SSRI antidepressant for generalized anxiety disorder.", price: 300.00, image: "assets/images/Escitalopram.jpeg", dosage: "10mg", category: "mental-health" },
  { name: "Metoprolol", description: "Beta-blocker for high blood pressure, chest pain, and heart failure.", price: 110.00, image: "assets/images/Metoprolol.jpeg", dosage: "25mg", category: "cardiovascular" },
  { name: "Miconazole Cream", description: "Antifungal used to treat ringworm, pityriasis versicolor.", price: 90.00, image: "assets/images/Miconazole Cream.jpeg", dosage: "2%", category: "skin-care" },
  { name: "Chlorhexidine Mouthwash", description: "Antiseptic mouthwash for gingivitis and oral hygiene.", price: 140.00, image: "assets/images/Chlorhexidine Mouthwash.jpeg", dosage: "0.2%", category: "antiseptics" },
  { name: "Bisacodyl", description: "Stimulant laxative for constipation.", price: 35.00, image: "assets/images/Bisacodyl.jpeg", dosage: "5mg", category: "digestive-health" },
  { name: "Calcium Carbonate", description: "Supplement for calcium deficiency and an antacid.", price: 170.00, image: "assets/images/Calcium Carbonate.jpeg", dosage: "500mg", category: "vitamins-supplements" },
  { name: "Doxycycline", description: "Tetracycline antibiotic for bacterial pneumonia, acne.", price: 110.00, image: "assets/images/Doxycycline.jpeg", dosage: "100mg", category: "antibiotics" },
  { name: "Phenylephrine", description: "Decongestant for stuffy nose caused by colds or allergies.", price: 75.00, image: "assets/images/Phenylephrine.jpeg", dosage: "10mg", category: "cold-cough" },
  { name: "Montelukast", description: "Used to prevent wheezing, difficulty breathing, and asthma attacks.", price: 280.00, image: "assets/images/Montelukast.jpeg", dosage: "10mg", category: "respiratory" },
  { name: "Famotidine", description: "H2 blocker that reduces the amount of acid in the stomach.", price: 65.00, image: "assets/images/Famotidine.jpeg", dosage: "20mg", category: "digestive-health" },
  { name: "Tramadol", description: "Opioid analgesic for moderate to severe pain.", price: 190.00, image: "assets/images/Tramadol.jpeg", dosage: "50mg", category: "pain-relief" },
  { name: "Telmisartan", description: "Used to treat high blood pressure.", price: 210.00, image: "assets/images/Telmisartan.jpeg", dosage: "40mg", category: "cardiovascular" },
  { name: "Alprazolam", description: "Benzodiazepine for anxiety and panic disorders.", price: 80.00, image: "assets/images/Alprazolam.jpeg", dosage: "0.25mg", category: "mental-health" },
  { name: "Zincovit", description: "Multivitamin and multimineral supplement.", price: 105.00, image: "assets/images/Zincovit.jpeg", dosage: "1 tablet", category: "vitamins-supplements" },
  { name: "Mupirocin Ointment", description: "Topical antibiotic for bacterial skin infections.", price: 135.00, image: "assets/images/Mupirocin Ointment.jpeg", dosage: "2%", category: "skin-care" },
  { name: "Clindamycin", description: "Antibiotic for skin infections and acne.", price: 250.00, image: "assets/images/Clindamycin.jpeg", dosage: "300mg", category: "antibiotics" },
  { name: "Lisinopril", description: "ACE inhibitor for hypertension and heart failure.", price: 120.00, image: "assets/images/Lisinopril.png", dosage: "10mg", category: "cardiovascular" },
  { name: "Prednisolone", description: "Corticosteroid for inflammation and allergies.", price: 50.00, image: "assets/images/Prednisolone.jpg", dosage: "5mg", category: "anti-inflammatory" },
  { name: "Ornidazole", description: "Antibiotic for amoebic and bacterial infections.", price: 95.00, image: "assets/images/Ornidazole.jpg", dosage: "500mg", category: "antibiotics" },
  { name: "Levocetirizine", description: "Antihistamine for allergies, less drowsy.", price: 70.00, image: "assets/images/Levocetirizine.jpg", dosage: "5mg", category: "allergy" },
  { name: "Spironolactone", description: "Diuretic for fluid retention and blood pressure.", price: 85.00, image: "assets/images/Spironolactone.jpg", dosage: "25mg", category: "cardiovascular" },
  { name: "Tamsulosin", description: "For enlarged prostate (BPH) symptoms.", price: 320.00, image: "assets/images/Tamsulosin.jpg", dosage: "0.4mg", category: "urology" },
  { name: "Pregabalin", description: "For neuropathic pain and fibromyalgia.", price: 450.00, image: "assets/images/Pregabalin.jpg", dosage: "75mg", category: "pain-relief" },
  { name: "Rosuvastatin", description: "Statin to lower cholesterol.", price: 230.00, image: "assets/images/Rosuvastatin.jpg", dosage: "10mg", category: "cardiovascular" },
  { name: "Etoricoxib", description: "NSAID for arthritis pain.", price: 180.00, image: "assets/images/Etoricoxib.jpg", dosage: "90mg", category: "pain-relief" },
  { name: "Isosorbide Mononitrate", description: "For preventing angina (chest pain).", price: 90.00, image: "assets/images/Isosorbide Mononitrate.jpg", dosage: "20mg", category: "cardiovascular" },
  { name: "Clonazepam", description: "For seizures, panic disorder, and anxiety.", price: 60.00, image: "assets/images/Clonazepam.jpg", dosage: "0.5mg", category: "mental-health" },
  { name: "Allopurinol", description: "For gout and high uric acid levels.", price: 55.00, image: "assets/images/Allopurinol.jpg", dosage: "100mg", category: "gout" },
  { name: "Clobetasol Propionate", description: "Potent steroid cream for skin conditions like psoriasis.", price: 150.00, image: "assets/images/Clobetasol Propionate.jpg", dosage: "0.05%", category: "skin-care" },
  { name: "Theophylline", description: "For respiratory diseases like asthma and COPD.", price: 130.00, image: "assets/images/T.jpg", dosage: "400mg", category: "respiratory" },
  { name: "Finasteride", description: "For male pattern hair loss and BPH.", price: 280.00, image: "assets/images/Finasteride.jpg", dosage: "1mg", category: "hair-care" },
  { name: "Propranolol", description: "Beta-blocker for blood pressure and performance anxiety.", price: 45.00, image: "assets/images/Propranolol.jpg", dosage: "40mg", category: "cardiovascular" },
  { name: "Vildagliptin", description: "Oral anti-diabetic agent.", price: 200.00, image: "assets/images/V.jpg", dosage: "50mg", category: "diabetes" },
  { name: "Mebeverine", description: "For irritable bowel syndrome (IBS).", price: 160.00, image: "assets/images/Mebeverine.jpg", dosage: "135mg", category: "digestive-health" },
  { name: "Silver Sulfadiazine", description: "Topical cream for preventing infection in burns.", price: 110.00, image: "assets/images/Silver Sulfadiazine.jpg", dosage: "1%", category: "antiseptics" },
  { name: "Folic Acid", description: "Essential B vitamin for cell growth.", price: 40.00, image: "assets/images/Folic Acid.jpg", dosage: "5mg", category: "vitamins-supplements" },
  { name: "Fluconazole", description: "Antifungal for systemic fungal infections.", price: 30.00, image: "assets/images/Fluconazole.jpeg", dosage: "150mg", category: "antifungal" },
  { name: "Hyoscine Butylbromide", description: "For abdominal cramps and pain.", price: 80.00, image: "assets/images/hb.jpeg", dosage: "10mg", category: "digestive-health" },
  { name: "Cefixime", description: "Antibiotic for a wide range of bacterial infections.", price: 220.00, image: "assets/images/Cefixime.jpeg", dosage: "200mg", category: "antibiotics" },
  { name: "Nifedipine", description: "Calcium channel blocker for high blood pressure and angina.", price: 75.00, image: "assets/images/Nifedipine.jpeg", dosage: "10mg", category: "cardiovascular" },
  { name: "Ondansetron", description: "Prevents nausea and vomiting from surgery or chemotherapy.", price: 50.00, image: "assets/images/Ondansetron.jpeg", dosage: "4mg", category: "digestive-health" },
  { name: "Tadalafil", description: "Treats erectile dysfunction and BPH.", price: 350.00, image: "assets/images/Tadalafil.jpeg", dosage: "10mg", category: "mens-health" },
  { name: "Gabapentin", description: "For seizures and neuropathic pain.", price: 290.00, image: "assets/images/Gabapentin.jpeg", dosage: "300mg", category: "pain-relief" },
  { name: "Indapamide", description: "Diuretic for hypertension.", price: 65.00, image: "assets/images/Indapamide.jpeg", dosage: "1.5mg", category: "cardiovascular" },
  { name: "Ambroxol", description: "Mucolytic agent for respiratory tract diseases.", price: 90.00, image: "assets/images/Ambroxol.jpeg", dosage: "30mg", category: "cold-cough" },
  { name: "Terbinafine Cream", description: "Antifungal cream for athlete's foot and jock itch.", price: 125.00, image: "assets/images/Terbinafine Cream.jpeg", dosage: "1%", category: "skin-care" },
  { name: "Lactulose Solution", description: "Laxative for constipation and hepatic encephalopathy.", price: 250.00, image: "assets/images/Lactulose Solution.jpeg", dosage: "10g/15ml", category: "digestive-health" },
  { name: "Fluticasone Nasal Spray", description: "Corticosteroid spray for allergic rhinitis.", price: 380.00, image: "assets/images/Fluticasone Nasal Spray.jpeg", dosage: "50mcg/spray", category: "allergy" },
  { name: "Paroxetine", description: "SSRI for depression, OCD, and panic attacks.", price: 260.00, image: "assets/images/Paroxetine.png", dosage: "20mg", category: "mental-health" },
  { name: "Aceclofenac", description: "NSAID for pain and inflammation in rheumatoid arthritis.", price: 100.00, image: "assets/images/Aceclofenac.jpeg", dosage: "100mg", category: "pain-relief" },
  { name: "Dapagliflozin", description: "SGLT2 inhibitor for type 2 diabetes.", price: 420.00, image: "assets/images/Dapagliflozin.jpeg", dosage: "10mg", category: "diabetes" },
  { name: "Clopidogrel", description: "Antiplatelet agent to prevent heart attack and stroke.", price: 90.00, image: "assets/images/Clopidogrel.jpeg", dosage: "75mg", category: "cardiovascular" },
  { name: "Mometasone Cream", description: "Corticosteroid for skin conditions like eczema.", price: 140.00, image: "assets/images/Mometasone Cream.jpeg", dosage: "0.1%", category: "skin-care" },
  { name: "Sodium Fusidate Ointment", description: "Antibiotic ointment for bacterial skin infections.", price: 160.00, image: "assets/images/SGO.jpeg", dosage: "2%", category: "skin-care" },
  { name: "Methylcobalamin", description: "Vitamin B12 supplement for nerve health and anemia.", price: 180.00, image: "assets/images/Methylcobalamin.jpeg", dosage: "1500mcg", category: "vitamins-supplements" },
  { name: "Ursodeoxycholic Acid", description: "For dissolving gallstones and treating liver disease.", price: 550.00, image: "assets/images/Ursodeoxycholic Acid.jpeg", dosage: "300mg", category: "digestive-health" },
  { name: "Deflazacort", description: "Corticosteroid with anti-inflammatory properties.", price: 170.00, image: "assets/images/Deflazacort.jpg", dosage: "6mg", category: "anti-inflammatory" },
  { name: "Teneligliptin", description: "Anti-diabetic drug for type 2 diabetes.", price: 150.00, image: "assets/images/Teneligliptin.jpg", dosage: "20mg", category: "diabetes" },
  { name: "Rabeprazole", description: "Proton pump inhibitor for GERD and peptic ulcers.", price: 80.00, image: "assets/images/Rabeprazole.jpg", dosage: "20mg", category: "digestive-health" },
  { name: "Minoxidil Solution", description: "For treating male pattern baldness.", price: 600.00, image: "assets/images/Minoxidil_solution.jpg", dosage: "5%", category: "hair-care" },
  { name: "Ebastine", description: "Non-sedating antihistamine for allergic rhinitis.", price: 110.00, image: "assets/images/Ebastine.jpg", dosage: "10mg", category: "allergy" },
  { name: "Ivabradine", description: "For symptomatic stable angina.", price: 480.00, image: "assets/images/Ivabradine.jpeg", dosage: "5mg", category: "cardiovascular" },
  { name: "Itraconazole", description: "Antifungal for a broad range of fungal infections.", price: 320.00, image: "assets/images/Itraconazole.jpeg", dosage: "100mg", category: "antifungal" },
  { name: "Ketorolac", description: "Potent NSAID for short-term management of moderate to severe pain.", price: 95.00, image: "assets/images/Ketorolac.jpeg", dosage: "10mg", category: "pain-relief" },
  { name: "Budesonide Inhaler", description: "Corticosteroid for long-term management of asthma.", price: 450.00, image: "assets/images/Budesonide Inhaler.jpeg", dosage: "200mcg/puff", category: "respiratory" },
  { name: "Ferrous Ascorbate", description: "Iron supplement for iron deficiency anemia.", price: 130.00, image: "assets/images/Ferrous Ascorbate.jpeg", dosage: "100mg", category: "vitamins-supplements" },
    ]);
    console.log(`✅ Inserted ${medicines.length} medicines`);

    // Create symptoms with medicine IDs
    const symptoms = await Symptom.insertMany([
      { 
    name: "Headache", 
    description: "Pain in any region of the head.", 
    relatedMedicines: [medicines[0]._id, medicines[1]._id, medicines[8]._id, medicines[30]._id, medicines[97]._id]
  },
  { 
    name: "Fever", 
    description: "A temporary increase in body temperature, often due to illness.", 
    relatedMedicines: [medicines[0]._id, medicines[1]._id, medicines[8]._id]
  },
  { 
    name: "Allergic Rhinitis", 
    description: "Inflammation of the inside of the nose caused by an allergen.", 
    relatedMedicines: [medicines[2]._id, medicines[5]._id, medicines[21]._id, medicines[53]._id, medicines[81]._id, medicines[94]._id]
  },
  { 
    name: "Heartburn / Acidity", 
    description: "A burning pain in the chest, just behind the breastbone.", 
    relatedMedicines: [medicines[3]._id, medicines[19]._id, medicines[39]._id, medicines[43]._id, medicines[92]._id]
  },
  { 
    name: "Sore Throat", 
    description: "Pain, scratchiness or irritation of the throat.", 
    relatedMedicines: [medicines[0]._id, medicines[4]._id, medicines[6]._id, medicines[72]._id]
  },
  { 
    name: "Diarrhea", 
    description: "Loose, watery bowel movements.", 
    relatedMedicines: [medicines[7]._id, medicines[52]._id]
  },
  { 
    name: "Muscle & Joint Pain", 
    description: "Pain affecting the muscles or joints of the body.", 
    relatedMedicines: [medicines[1]._id, medicines[18]._id, medicines[30]._id, medicines[58]._id, medicines[83]._id]
  },
  { 
    name: "Common Cold & Cough", 
    description: "A mild viral infection of the nose and throat, causing cough and congestion.", 
    relatedMedicines: [medicines[0]._id, medicines[2]._id, medicines[9]._id, medicines[10]._id, medicines[41]._id, medicines[78]._id]
  },
  { 
    name: "High Blood Pressure", 
    description: "Hypertension, a condition where the force of blood against artery walls is too high.", 
    relatedMedicines: [medicines[15]._id, medicines[23]._id, medicines[35]._id, medicines[45]._id, medicines[50]._id, medicines[54]._id, medicines[65]._id, medicines[73]._id, medicines[77]._id]
  },
  { 
    name: "Diabetes", 
    description: "A group of diseases that result in too much sugar in the blood.", 
    relatedMedicines: [medicines[13]._id, medicines[33]._id, medicines[66]._id, medicines[84]._id, medicines[91]._id]
  },
  {
    name: "Skin Fungal Infection",
    description: "Fungal infections on the skin like ringworm or athlete's foot.",
    relatedMedicines: [medicines[16]._id, medicines[36]._id, medicines[70]._id, medicines[79]._id, medicines[96]._id]
  },
  {
    name: "Bacterial Skin Infection",
    description: "Infections on the skin caused by bacteria, including minor cuts or burns.",
    relatedMedicines: [medicines[17]._id, medicines[48]._id, medicines[49]._id, medicines[68]._id, medicines[87]._id]
  },
  {
    name: "Nausea and Vomiting",
    description: "Feeling of sickness with an inclination to vomit.",
    relatedMedicines: [medicines[28]._id, medicines[74]._id]
  },
  {
    name: "Anxiety & Depression",
    description: "Feelings of worry, fear, or persistent sadness that interfere with daily activities.",
    relatedMedicines: [medicines[22]._id, medicines[34]._id, medicines[46]._id, medicines[60]._id, medicines[82]._id]
  },
  {
    name: "Asthma & Respiratory Issues",
    description: "Conditions affecting the airways, causing difficulty breathing, wheezing, or chest congestion.",
    relatedMedicines: [medicines[25]._id, medicines[42]._id, medicines[63]._id, medicines[98]._id]
  },
  {
    name: "Constipation",
    description: "Difficulty in emptying the bowels, usually associated with hardened feces.",
    relatedMedicines: [medicines[38]._id, medicines[80]._id]
  },
  {
    name: "Vitamin & Mineral Deficiency",
    description: "Lack of essential vitamins and minerals, affecting overall health and energy.",
    relatedMedicines: [medicines[11]._id, medicines[12]._id, medicines[24]._id, medicines[29]._id, medicines[69]._id, medicines[88]._id, medicines[99]._id]
  },
  {
    name: "High Cholesterol",
    description: "Elevated levels of cholesterol in the blood, managed by statin medications.",
    relatedMedicines: [medicines[14]._id, medicines[57]._id]
  },
  {
    name: "Hair Loss",
    description: "Thinning of hair or male pattern baldness.",
    relatedMedicines: [medicines[64]._id, medicines[93]._id]
  }
    ]);
    console.log(`✅ Inserted ${symptoms.length} symptoms`);

    // Create users with hashed passwords
    const hashedUserPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "user@example.com",
        password: hashedUserPassword,
        role: "user",
        medicalHistory: ["Allergy to peanuts", "Asthma"]
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "admin",
        medicalHistory: []
      }
    ]);
    console.log(`✅ Inserted ${users.length} users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('User: user@example.com / password123');
    console.log('Admin: admin@example.com / admin123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

async function main() {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
}

main();