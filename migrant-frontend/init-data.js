const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addUpdatedMigrantData() {
  console.log('Adding 50 updated migrant records (Team 2 Schema)...');

  const migrants = [
    // 50 migrant records with new schema
    { fullName: "Arjun Das", age: 32, gender: "Male", phoneNumber: "9876554321", district: "Ernakulam", city: "Perumbavoor", lat: 10.1118, lng: 76.4764, chronicDiseases: "" },
    { fullName: "Bina Khatun", age: 27, gender: "Female", phoneNumber: "9876554322", district: "Thrissur", city: "Chalakudy", lat: 10.32, lng: 76.34, chronicDiseases: "Asthma", pregnancyDetails: "5 months" },
    { fullName: "Chandan Kumar", age: 41, gender: "Male", phoneNumber: "9876554323", district: "Palakkad", city: "Palakkad Town", lat: 10.78, lng: 76.65, chronicDiseases: "Diabetes Mellitus Type 2" },
    { fullName: "Deepa Mondal", age: 29, gender: "Female", phoneNumber: "9876554324", district: "Kozhikode", city: "Kozhikode Town", lat: 11.25, lng: 75.78, chronicDiseases: "Anaemia" },
    { fullName: "Ganesh Sahni", age: 38, gender: "Male", phoneNumber: "9876554325", district: "Thiruvananthapuram", city: "Kazhakoottam", lat: 8.56, lng: 76.88, chronicDiseases: "Hypertension" },
    { fullName: "Harish Prasad", age: 22, gender: "Male", phoneNumber: "9876554326", district: "Ernakulam", city: "Aluva", lat: 10.12, lng: 76.36, chronicDiseases: "Tuberculosis (History)" },
    { fullName: "Ishita Roy", age: 33, gender: "Female", phoneNumber: "9876554327", district: "Kollam", city: "Kottarakkara", lat: 9.0, lng: 76.8, chronicDiseases: "" },
    { fullName: "Jamaluddin Sheikh", age: 45, gender: "Male", phoneNumber: "9876554328", district: "Kannur", city: "Thalassery", lat: 11.75, lng: 75.49, chronicDiseases: "Hypertension, Diabetes" },
    { fullName: "Kavita Oran", age: 25, gender: "Female", phoneNumber: "9876554329", district: "Idukki", city: "Thodupuzha", lat: 9.87, lng: 76.71, chronicDiseases: "", pregnancyDetails: "3 months" },
    { fullName: "Lal Babu", age: 28, gender: "Male", phoneNumber: "9876554330", district: "Ernakulam", city: "Perumbavoor", lat: 10.1118, lng: 76.4764, chronicDiseases: "" },
    { fullName: "Manish Rai", age: 29, gender: "Male", phoneNumber: "9876554331", district: "Malappuram", city: "Tirur", lat: 10.91, lng: 75.93, chronicDiseases: "" },
    { fullName: "Neha Prajapati", age: 26, gender: "Female", phoneNumber: "9876554332", district: "Wayanad", city: "Kalpetta", lat: 11.62, lng: 76.12, chronicDiseases: "" },
    { fullName: "Pawan Singh", age: 37, gender: "Male", phoneNumber: "9876554333", district: "Ernakulam", city: "Kakkanad", lat: 9.99, lng: 76.34, chronicDiseases: "Hypertension" },
    { fullName: "Rani Devi", age: 30, gender: "Female", phoneNumber: "9876554334", district: "Palakkad", city: "Ottapalam", lat: 10.77, lng: 76.35, chronicDiseases: "", pregnancyDetails: "7 months" },
    { fullName: "Sandeep Kumar", age: 24, gender: "Male", phoneNumber: "9876554335", district: "Kozhikode", city: "Vatakara", lat: 11.62, lng: 75.54, chronicDiseases: "" },
    { fullName: "Sita Murmu", age: 28, gender: "Female", phoneNumber: "9876554336", district: "Thrissur", city: "Guruvayur", lat: 10.59, lng: 76.04, chronicDiseases: "Sickle Cell Anaemia" },
    { fullName: "Tarun Biswas", age: 42, gender: "Male", phoneNumber: "9876554337", district: "Alappuzha", city: "Kayamkulam", lat: 9.18, lng: 76.48, chronicDiseases: "Diabetes" },
    { fullName: "Usha Rani", age: 23, gender: "Female", phoneNumber: "9876554338", district: "Kasaragod", city: "Kasaragod Town", lat: 12.5, lng: 75.0, chronicDiseases: "" },
    { fullName: "Vivek Kumar", age: 29, gender: "Male", phoneNumber: "9876554339", district: "Ernakulam", city: "Aluva", lat: 10.12, lng: 76.36, chronicDiseases: "" },
    { fullName: "Zarina Begum", age: 35, gender: "Female", phoneNumber: "9876554340", district: "Malappuram", city: "Manjeri", lat: 11.12, lng: 76.12, chronicDiseases: "Hypertension" },
    { fullName: "Anand Paswan", age: 27, gender: "Male", phoneNumber: "9876554341", district: "Palakkad", city: "Chittur", lat: 10.63, lng: 76.59, chronicDiseases: "" },
    { fullName: "Babita Kumari", age: 22, gender: "Female", phoneNumber: "9876554342", district: "Kollam", city: "Karunagappally", lat: 9.07, lng: 76.57, chronicDiseases: "", pregnancyDetails: "2 months" },
    { fullName: "Chintu Kumar", age: 19, gender: "Male", phoneNumber: "9876554343", district: "Ernakulam", city: "Perumbavoor", lat: 10.1118, lng: 76.4764, chronicDiseases: "" },
    { fullName: "Dhananjay Kumar", age: 48, gender: "Male", phoneNumber: "9876554344", district: "Idukki", city: "Kattappana", lat: 9.9, lng: 77.03, chronicDiseases: "Diabetes, Hypertension" },
    { fullName: "Guddi Devi", age: 31, gender: "Female", phoneNumber: "9876554345", district: "Kannur", city: "Payyannur", lat: 12.09, lng: 75.2, chronicDiseases: "" },
    { fullName: "Imran Khan", age: 33, gender: "Male", phoneNumber: "9876554346", district: "Thiruvananthapuram", city: "Varkala", lat: 8.73, lng: 76.71, chronicDiseases: "" },
    { fullName: "Jitendra Kumar", age: 26, gender: "Male", phoneNumber: "9876554347", district: "Kottayam", city: "Pala", lat: 9.72, lng: 76.7, chronicDiseases: "" },
    { fullName: "Khushboo Khatun", age: 20, gender: "Female", phoneNumber: "9876554348", district: "Ernakulam", city: "Perumbavoor", lat: 10.1118, lng: 76.4764, chronicDiseases: "" },
    { fullName: "Mithun Kumar", age: 30, gender: "Male", phoneNumber: "9876554349", district: "Palakkad", city: "Palakkad Town", lat: 10.78, lng: 76.65, chronicDiseases: "" },
    { fullName: "Neelam Devi", age: 28, gender: "Female", phoneNumber: "9876554350", district: "Ernakulam", city: "Muvattupuzha", lat: 9.97, lng: 76.57, chronicDiseases: "Anaemia", pregnancyDetails: "8 months" },
    { fullName: "Rakesh Mandal", age: 35, gender: "Male", phoneNumber: "9876554351", district: "Ernakulam", city: "Kochi", lat: 9.93, lng: 76.26, chronicDiseases: "" },
    { fullName: "Sunaina Devi", age: 29, gender: "Female", phoneNumber: "9876554352", district: "Ernakulam", city: "Kochi", lat: 9.93, lng: 76.26, chronicDiseases: "", pregnancyDetails: "6 months" },
    { fullName: "Aakash Singh", age: 24, gender: "Male", phoneNumber: "9876554353", district: "Thiruvananthapuram", city: "Neyyattinkara", lat: 8.4, lng: 77.08, chronicDiseases: "" },
    { fullName: "Priyanka Tudu", age: 21, gender: "Female", phoneNumber: "9876554354", district: "Thrissur", city: "Thrissur Town", lat: 10.52, lng: 76.21, chronicDiseases: "" },
    { fullName: "Rahul Kumar", age: 30, gender: "Male", phoneNumber: "9876554355", district: "Palakkad", city: "Shoranur", lat: 10.76, lng: 76.27, chronicDiseases: "Diabetes" },
    { fullName: "Anita Soren", age: 33, gender: "Female", phoneNumber: "9876554356", district: "Ernakulam", city: "Perumbavoor", lat: 10.1118, lng: 76.4764, chronicDiseases: "" },
    { fullName: "Vikash Kumar", age: 28, gender: "Male", phoneNumber: "9876554357", district: "Malappuram", city: "Kondotty", lat: 11.14, lng: 75.96, chronicDiseases: "" },
    { fullName: "Sarojini Hembram", age: 40, gender: "Female", phoneNumber: "9876554358", district: "Wayanad", city: "Sulthan Bathery", lat: 11.67, lng: 76.27, chronicDiseases: "Hypertension" },
    { fullName: "Santosh Yadav", age: 36, gender: "Male", phoneNumber: "9876554359", district: "Kozhikode", city: "Kozhikode Town", lat: 11.25, lng: 75.78, chronicDiseases: "" },
    { fullName: "Reena Devi", age: 26, gender: "Female", phoneNumber: "9876554360", district: "Kollam", city: "Punalur", lat: 9.01, lng: 76.92, chronicDiseases: "Anaemia" },
    { fullName: "Ajay Paswan", age: 25, gender: "Male", phoneNumber: "9876554361", district: "Idukki", city: "Munnar", lat: 10.08, lng: 77.05, chronicDiseases: "" },
    { fullName: "Meena Devi", age: 29, gender: "Female", phoneNumber: "9876554362", district: "Alappuzha", city: "Haripad", lat: 9.27, lng: 76.34, chronicDiseases: "" },
    { fullName: "Sonu Kumar", age: 22, gender: "Male", phoneNumber: "9876554363", district: "Ernakulam", city: "Kochi", lat: 9.93, lng: 76.26, chronicDiseases: "" },
    { fullName: "Mamata Das", age: 31, gender: "Female", phoneNumber: "9876554364", district: "Palakkad", city: "Palakkad Town", lat: 10.78, lng: 76.65, chronicDiseases: "" },
    { fullName: "Rajesh Kumar", age: 39, gender: "Male", phoneNumber: "9876554365", district: "Thrissur", city: "Irinjalakuda", lat: 10.33, lng: 76.23, chronicDiseases: "Asthma" },
    { fullName: "Pooja Kumari", age: 27, gender: "Female", phoneNumber: "9876554366", district: "Kottayam", city: "Kottayam Town", lat: 9.59, lng: 76.52, chronicDiseases: "", pregnancyDetails: "4 months" },
    { fullName: "Suresh Oraon", age: 34, gender: "Male", phoneNumber: "9876554367", district: "Kannur", city: "Kannur Town", lat: 11.87, lng: 75.37, chronicDiseases: "" },
    { fullName: "Geeta Devi", age: 25, gender: "Female", phoneNumber: "9876554368", district: "Kasaragod", city: "Nileshwaram", lat: 12.25, lng: 75.1, chronicDiseases: "" },
    { fullName: "Manoj Sah", age: 31, gender: "Male", phoneNumber: "9876554369", district: "Ernakulam", city: "Perumbavoor", lat: 10.1118, lng: 76.4764, chronicDiseases: "Tuberculosis (Active)" },
    { fullName: "Sunita Hansda", age: 26, gender: "Female", phoneNumber: "9876554370", district: "Pathanamthitta", city: "Thiruvalla", lat: 9.38, lng: 76.57, chronicDiseases: "" }
  ];

  const batch = db.batch();

  migrants.forEach(migrant => {
    // Standardize the schema for each migrant
    const docData = {
        fullName: migrant.fullName,
        age: String(migrant.age), // Team 2 schema uses string for age
        gender: migrant.gender,
        phoneNumber: migrant.phoneNumber,
        district: migrant.district,
        city: migrant.city,
        lat: migrant.lat,
        lng: migrant.lng,
        migrantType: migrant.migrationType || "Incoming",
        chronicDiseases: migrant.chronicDiseases || "",
        pregnancyDetails: migrant.pregnancyDetails || null,
        ashaId: "asha_worker_placeholder",
        registeredAt: new Date().toISOString(),
        
        // Keep our detailed health_profile for internal logic
        health_profile: {
            overall_status: (migrant.chronicDiseases.includes("Tuberculosis (Active)")) ? "Critical" : "Under Observation"
        },

        // Keep original chronicIllness as an array for our logic
        chronicIllness: (migrant.chronicDiseases || "").split(',').map(s => s.trim()).filter(Boolean),
    };
    
    const docRef = db.collection('migrants').doc(docData.phoneNumber);
    batch.set(docRef, docData);
  });

  await batch.commit();

  console.log(`Successfully added/updated ${migrants.length} migrant records with Team 2 schema!`);
  process.exit(0);
}

addUpdatedMigrantData().catch(error => {
  console.error('Error adding data:', error);
  process.exit(1);
});