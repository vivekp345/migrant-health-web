const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'migrant-health-d51de.firebaseapp.com' // Ensure this is your correct bucket name
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// --- SMART ENDPOINT for the DASHBOARD ---
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const { district: districtFilter } = req.query;

        const migrantsSnapshot = await db.collection('migrants').get();
        const allMigrants = [];
        migrantsSnapshot.forEach(doc => allMigrants.push(doc.data()));

        let filteredMigrants = allMigrants;
        if (districtFilter && districtFilter !== 'All Districts') {
            filteredMigrants = allMigrants.filter(m => m.district === districtFilter);
        }

        // --- Perform All Calculations on the Filtered Migrant List ---
        const totalMigrants = filteredMigrants.length;
        const activeCases = filteredMigrants.filter(m => m.health_profile?.overall_status === 'Under Observation' || m.health_profile?.overall_status === 'Critical').length;
        const recovered = filteredMigrants.filter(m => m.health_profile?.overall_status === 'Recovered').length;

        const casesByCity = {};
        filteredMigrants.forEach(m => {
            if (m.health_profile?.overall_status !== 'Healthy' && m.health_profile?.overall_status !== 'Recovered') {
                if (m.city) {
                    if (!casesByCity[m.city]) casesByCity[m.city] = 0;
                    casesByCity[m.city]++;
                }
            }
        });
        const redZoneHotspots = Object.values(casesByCity).filter(count => count >= 2).length;

        // The bar chart ALWAYS shows a statewide view, so we use ALL migrants for it
        const casesByDistrictMap = {};
        allMigrants.forEach(migrant => {
            if (migrant.district) {
                if (!casesByDistrictMap[migrant.district]) casesByDistrictMap[migrant.district] = 0;
                if (migrant.health_profile?.overall_status !== 'Healthy' && migrant.health_profile?.overall_status !== 'Recovered') {
                    casesByDistrictMap[migrant.district]++;
                }
            }
        });
        const casesByDistrict = Object.keys(casesByDistrictMap).map(name => ({ name, cases: casesByDistrictMap[name] }));

        // --- THIS IS THE FIX ---
        // The diseaseMap now correctly uses the 'filteredMigrants' list.
        const diseaseMap = {};
        filteredMigrants.forEach(m => {
            m.chronicIllness?.forEach(disease => {
                if (disease) {
                    if (!diseaseMap[disease]) diseaseMap[disease] = 0;
                    diseaseMap[disease]++;
                }
            });
        });
        const diseaseTypes = Object.keys(diseaseMap).map(name => ({ name, value: diseaseMap[name] }));

        res.status(200).json({
            kpis: { totalMigrants, activeCases, hotspots: redZoneHotspots, recovered },
            casesByDistrict,
            diseaseTypes
        });
    } catch (error) {
        console.error("Error calculating dashboard stats:", error);
        res.status(500).json({ error: 'Failed to calculate dashboard stats' });
    }
});

// --- Endpoint for ALERTS page ---
app.get('/api/alerts', async (req, res) => {
    try {
        const migrantsSnapshot = await db.collection('migrants').get();
        const migrants = [];
        migrantsSnapshot.forEach(doc => migrants.push(doc.data()));

        const atRiskMigrants = migrants.filter(m => {
            const status = m.health_profile?.overall_status;
            return status === 'Under Observation' || status === 'Critical';
        });
        
        const casesByDistrict = {};
        atRiskMigrants.forEach(migrant => {
            if (migrant.district) {
                if (!casesByDistrict[migrant.district]) {
                    casesByDistrict[migrant.district] = { count: 0, lat: migrant.lat, lng: migrant.lng };
                }
                casesByDistrict[migrant.district].count++;
            }
        });

        const alerts = Object.keys(casesByDistrict).map(districtName => ({
            district: districtName,
            cases: casesByDistrict[districtName].count,
            position: [casesByDistrict[districtName].lat, casesByDistrict[districtName].lng],
            severity: casesByDistrict[districtName].count >= 2 ? 'red' : 'orange'
        }));
        
        res.status(200).json(alerts);
    } catch (error) {
        console.error("Error generating alerts:", error);
        res.status(500).json({ error: 'Failed to generate alerts' });
    }
});

// --- Endpoint to GET migrants (can be filtered by status and district) ---
app.get('/api/migrants', async (req, res) => {
  try {
    const { status, district } = req.query;
    let query = db.collection('migrants');

    if (district && district !== 'All Districts') {
      query = query.where('district', '==', district);
    }
    
    const migrantsSnapshot = await query.get();
    let migrants = [];
    migrantsSnapshot.forEach(doc => migrants.push(doc.data()));

    if (status === 'active') {
      migrants = migrants.filter(m => m.health_profile?.overall_status === 'Under Observation' || m.health_profile?.overall_status === 'Critical');
    } else if (status === 'recovered') {
      migrants = migrants.filter(m => m.health_profile?.overall_status === 'Recovered');
    }

    res.status(200).json(migrants);
  } catch (error) {
    console.error("Error fetching migrants:", error);
    res.status(500).json({ error: 'Something went wrong fetching migrants' });
  }
});

// --- Endpoint to GET a SINGLE migrant by phone number ---
app.get('/api/migrants/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const migrantDoc = await db.collection('migrants').doc(phone).get();
    if (!migrantDoc.exists) {
      return res.status(404).json({ error: 'Migrant not found' });
    }
    res.status(200).json(migrantDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong fetching a single migrant' });
  }
});

// --- Endpoint to POST (Register) a new migrant ---
app.post('/api/migrants/register', async (req, res) => {
  try {
    const migrantData = { ...req.body, createdAt: new Date().toISOString() };
    await db.collection('migrants').doc(migrantData.phone).set(migrantData);
    res.status(201).json({ message: 'Migrant registered successfully!', data: migrantData });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong during registration' });
  }
});

// --- Endpoint to POST (upload) a health record ---
app.post('/api/records/upload', upload.single('recordImage'), async (req, res) => {
  try {
    const { patientPhone, description } = req.body;
    if (!req.file || !patientPhone) {
      return res.status(400).json({ error: 'Missing file or patient phone.' });
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (error) => res.status(500).json({ error: 'Upload failed.' }));

    blobStream.on('finish', async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      const recordData = {
        imageUrl: publicUrl,
        fileName,
        description: description || '',
        uploadedAt: new Date().toISOString(),
      };
      await db.collection('migrants').doc(patientPhone).collection('records').add(recordData);
      res.status(200).json({ message: 'Record uploaded successfully!', record: recordData });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });