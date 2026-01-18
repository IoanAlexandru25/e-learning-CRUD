require('dotenv').config();
const PORT = process.env.PORT;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { db } = require('./config/firebase');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.json({message: 'The server is working'})
});

app.get('/api/test-db', async (req, res) => {
    try {
        const coursesRef = db.collection('courses');
        const snapshot = await coursesRef.limit(1).get();

        res.json({
            success: true,
            message: 'Firestore connection successful',
            coursesCount: snapshot.size,
            firebaseProject: process.env.FIREBASE_PROJECT_ID
        });
    } catch (error) {
        console.error('Firestore connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Firestore connection failed',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

