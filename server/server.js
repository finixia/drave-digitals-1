const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5173','http://127.0.0.1:5173','https://dravedigitals.in'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

console.log("MONGODB_URI:", process.env.MONGODB_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerguard')
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  // Personal Details
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not-to-say'] },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  // Professional Details
  currentPosition: { type: String },
  experience: { type: String },
  skills: { type: String },
  education: { type: String },
  expectedSalary: { type: String },
  preferredLocation: { type: String },
  
  // Preferences
  jobType: { type: String },
  workMode: { type: String },
  interestedServices: [{ type: String }],
  
  // Documents
  resume: { type: String }, // File path
  
  // Profile completion
  profileCompleted: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create default admin user if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@careerguard.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@careerguard.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Job Application Schema
const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  skills: { type: String, required: true },
  expectedSalary: { type: String },
  location: { type: String },
  resume: { type: String }, // File path
  status: { type: String, enum: ['applied', 'screening', 'interview', 'placed', 'rejected'], default: 'applied' },
  createdAt: { type: Date, default: Date.now }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

// Fraud Case Schema
const fraudCaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  fraudType: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number },
  dateOfIncident: { type: Date },
  policeComplaint: { type: Boolean, default: false },
  evidence: [{ type: String }], // File paths
  status: { type: String, enum: ['reported', 'investigating', 'resolved', 'closed'], default: 'reported' },
  createdAt: { type: Date, default: Date.now }
});

const FraudCase = mongoose.model('FraudCase', fraudCaseSchema);

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Website Content Schema
const websiteContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware for admin authentication
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/register-detailed', upload.single('resume'), async (req, res) => {
  try {
    const {
      name, email, password, phone, dateOfBirth, gender, address, city, state, pincode,
      currentPosition, experience, skills, education, expectedSalary, preferredLocation,
      jobType, workMode, interestedServices
    } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse interested services if it's a string
    let parsedServices = [];
    if (interestedServices) {
      try {
        parsedServices = typeof interestedServices === 'string' 
          ? JSON.parse(interestedServices) 
          : interestedServices;
      } catch (error) {
        parsedServices = [];
      }
    }

    // Create user with detailed information
    const userData = {
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
      profileCompleted: true
    };

    // Add resume path if uploaded
    if (req.file) {
      userData.resume = req.file.path;
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    console.error('Detailed registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Contact Routes
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    // Send email notification (configure nodemailer)
    // ... email sending logic
    
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/contacts', authenticateAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Job Application Routes
app.post('/api/job-applications', upload.single('resume'), async (req, res) => {
  try {
    const applicationData = { ...req.body };
    if (req.file) {
      applicationData.resume = req.file.path;
    }
    const application = new JobApplication(applicationData);
    await application.save();
    res.status(201).json({ message: 'Job application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/job-applications', authenticateAdmin, async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fraud Case Routes
app.post('/api/fraud-cases', upload.array('evidence', 5), async (req, res) => {
  try {
    const fraudData = { ...req.body };
    if (req.files && req.files.length > 0) {
      fraudData.evidence = req.files.map(file => file.path);
    }
    const fraudCase = new FraudCase(fraudData);
    await fraudCase.save();
    res.status(201).json({ message: 'Fraud case reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/fraud-cases', authenticateAdmin, async (req, res) => {
  try {
    const cases = await FraudCase.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Newsletter Routes
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    
    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const totalApplications = await JobApplication.countDocuments();
    const totalFraudCases = await FraudCase.countDocuments();
    const placedJobs = await JobApplication.countDocuments({ status: 'placed' });
    const resolvedFraudCases = await FraudCase.countDocuments({ status: 'resolved' });
    const totalUsers = await User.countDocuments();
    const newsletterSubscribers = await Newsletter.countDocuments();

    res.json({
      totalContacts,
      totalApplications,
      totalFraudCases,
      placedJobs,
      resolvedFraudCases,
      totalUsers,
      newsletterSubscribers,
      successRate: totalApplications > 0 ? Math.round((placedJobs / totalApplications) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Website Content Management Routes
app.get('/api/website-content', async (req, res) => {
  try {
    const content = await WebsiteContent.find();
    const contentObj = {};
    content.forEach(item => {
      contentObj[item.section] = item.content;
    });
    res.json(contentObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/website-content/:section', authenticateAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const content = req.body;
    
    await WebsiteContent.findOneAndUpdate(
      { section },
      { 
        content, 
        lastUpdated: new Date(),
        updatedBy: req.user.userId 
      },
      { upsert: true, new: true }
    );
    
    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/website-content/:section/:itemId', authenticateAdmin, async (req, res) => {
  try {
    const { section, itemId } = req.params;
    
    const websiteContent = await WebsiteContent.findOne({ section });
    if (!websiteContent) {
      return res.status(404).json({ message: 'Content section not found' });
    }
    
    if (Array.isArray(websiteContent.content)) {
      websiteContent.content = websiteContent.content.filter(
        item => item.id.toString() !== itemId
      );
      await websiteContent.save();
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Status update routes
app.put('/api/contacts/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await Contact.findByIdAndUpdate(id, { status });
    res.json({ message: 'Contact status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/job-applications/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await JobApplication.findByIdAndUpdate(id, { status });
    res.json({ message: 'Job application status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/fraud-cases/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await FraudCase.findByIdAndUpdate(id, { status });
    res.json({ message: 'Fraud case status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User management routes
app.get('/api/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/users/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/careerguard'}`);
  
  // Wait for MongoDB connection before creating default data
  mongoose.connection.once('open', async () => {
    console.log('MongoDB connection established');
    await createDefaultAdmin();
    // await createDefaultContent();
    console.log('Server initialization complete');
  });
  
  // Handle connection errors gracefully
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
});