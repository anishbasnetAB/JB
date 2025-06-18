const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const jobRoutes = require('./routes/jobRoutes');
const jobSeekerRoutes = require('./routes/jobSeekerRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobseeker', jobSeekerRoutes);
app.use('/api/blogs', blogRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
