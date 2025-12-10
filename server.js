require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/b2';

mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB', MONGODB_URI))
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });

const participantSchema = new mongoose.Schema({
    registration_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: String,
    phone: String,
    paper_title: String,
    college_name: String,
    scanned_successful: { type: Boolean, default: false },
    attendance_time: { type: Date, default: null }
}, { timestamps: true });

const Participant = mongoose.model('Participant', participantSchema, 'attendance');

app.get('/api/health', (req, res) => res.json({ok:true}));

app.get('/api/participants/:regId', async(req, res) =>{
    try{
        const regId = req.params.regId;
        const p = await(Participant.findOne({registration_id: regId}).lean());
        if (!p){
            return res.status(404).json({error: 'Participant not found'});
        }
        res.json(p);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/api/participants/:regId/checkin', async (req, res) => {
  try {
    const regId = req.params.regId;
    const p = await Participant.findOne({ registration_id: regId });
    if (!p) return res.status(404).json({ message: 'Participant not found' });
    if (p.scanned_successful) return res.status(400).json({ message: 'Already checked in' });

    p.scanned_successful = true;
    p.attendance_time = new Date();
    await p.save();

    res.json({ message: 'Check-in successful', attendance_time: p.attendance_time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
// Use '/*' as the catch-all route to be compatible with newer express/path-to-regexp
// Fallback handler: use middleware without a path pattern so path-to-regexp is not invoked
app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'API endpoint not found' });
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));