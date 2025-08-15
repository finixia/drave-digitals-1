const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerguard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  currentPosition: String,
  experience: String,
  skills: String,
  education: String,
  expectedSalary: String,
  preferredLocation: String,
  jobType: String,
  workMode: String,
  interestedServices: [String],
  resume: String,
  profileCompleted: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  avatar: { type: String, default: '👤' },
  service: { type: String, required: true },
  featured: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

// Service Schema
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Shield' },
  color: { type: String, default: 'from-red-500 to-pink-600' },
  features: [String],
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/register', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, address, city, state, pincode, currentPosition, experience, skills, education, expectedSalary, preferredLocation, jobType, workMode, interestedServices } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse interested services if it's a string
    let parsedServices = [];
    if (interestedServices) {
      try {
        parsedServices = typeof interestedServices === 'string' ? JSON.parse(interestedServices) : interestedServices;
      } catch (e) {
        parsedServices = [];
      }
    }

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      city,
      state,
      pincode,
      currentPosition,
      experience,
      skills,
      education,
      expectedSalary,
      preferredLocation,
      jobType,
      workMode,
      interestedServices: parsedServices,
      resume: req.file ? req.file.path : undefined,
      profileCompleted: true,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      currentPosition: user.currentPosition,
      experience: user.experience,
      skills: user.skills,
      education: user.education,
      expectedSalary: user.expectedSalary,
      preferredLocation: user.preferredLocation,
      jobType: user.jobType,
      workMode: user.workMode,
      interestedServices: user.interestedServices,
      resume: user.resume,
      profileCompleted: user.profileCompleted,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      currentPosition: user.currentPosition,
      experience: user.experience,
      skills: user.skills,
      education: user.education,
      expectedSalary: user.expectedSalary,
      preferredLocation: user.preferredLocation,
      jobType: user.jobType,
      workMode: user.workMode,
      interestedServices: user.interestedServices,
      resume: user.resume,
      profileCompleted: user.profileCompleted,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Contact Routes
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit contact form', error: error.message });
  }
});

app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts', error: error.message });
  }
});

// User Routes
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
});

// Dashboard Stats
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalTestimonials = await Testimonial.countDocuments();
    const totalServices = await Service.countDocuments();

    const stats = {
      totalUsers,
      totalContacts,
      totalTestimonials,
      totalServices,
      totalApplications: totalContacts,
      totalFraudCases: Math.floor(totalContacts * 0.3),
      placedJobs: Math.floor(totalContacts * 0.6),
      resolvedFraudCases: Math.floor(totalContacts * 0.8),
      newsletterSubscribers: Math.floor(totalUsers * 0.4),
      successRate: 98,
      happyClients: '5000+',
      growthRate: '150%'
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

// Testimonial Routes
app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({ success: true, message: 'Testimonial submitted successfully' });
  } catch (error) {
    console.error('Testimonial submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit testimonial', error: error.message });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
});

app.get('/api/admin/testimonials', authenticateToken, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Fetch admin testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
});

// Service Routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Fetch services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services', error: error.message });
  }
});

app.get('/api/admin/services', authenticateToken, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Fetch admin services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services', error: error.message });
  }
});

app.post('/api/admin/services', authenticateToken, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, message: 'Service created successfully', data: service });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Failed to create service', error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

module.exports = app;