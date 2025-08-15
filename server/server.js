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

// File upload configuration
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
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerguard')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
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
  profileCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' }
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
  approved: { type: Boolean, default: false }
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
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

// About Content Schema
const aboutContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  values: [{
    title: String,
    description: String,
    icon: String
  }],
  commitments: [String],
  active: { type: Boolean, default: true }
}, { timestamps: true });

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

// Contact Info Schema
const contactInfoSchema = new mongoose.Schema({
  phone: [String],
  email: [String],
  address: [String],
  workingHours: [String]
}, { timestamps: true });

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

// Dashboard Stats Schema
const dashboardStatsSchema = new mongoose.Schema({
  happyClients: { type: String, default: '5000+' },
  successRate: { type: String, default: '98%' },
  growthRate: { type: String, default: '150%' }
}, { timestamps: true });

const DashboardStats = mongoose.model('DashboardStats', dashboardStatsSchema);

// Privacy Policy Schema
const privacyPolicySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  introduction: { type: String, required: true },
  sections: [{
    title: String,
    content: [{
      subtitle: String,
      items: [String]
    }]
  }],
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

// Terms of Service Schema
const termsOfServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  introduction: { type: String, required: true },
  sections: [{
    title: String,
    content: [{
      subtitle: String,
      items: [String]
    }]
  }],
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const TermsOfService = mongoose.model('TermsOfService', termsOfServiceSchema);

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// JWT Middleware
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

// Authentication Routes
app.post('/api/auth/register', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, password, ...otherData } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Parse interested services if it's a string
    let interestedServices = otherData.interestedServices;
    if (typeof interestedServices === 'string') {
      try {
        interestedServices = JSON.parse(interestedServices);
      } catch (e) {
        interestedServices = [];
      }
    }

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      ...otherData,
      interestedServices,
      resume: req.file ? req.file.path : null,
      profileCompleted: true
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userResponse } = user.toObject();
    userResponse.id = userResponse._id;

    res.status(201).json({
      success: true,
      user: userResponse,
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userResponse } = user.toObject();
    userResponse.id = userResponse._id;

    res.json({
      success: true,
      user: userResponse,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// User Profile Routes
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userResponse = user.toObject();
    userResponse.id = userResponse._id;

    res.json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});

app.put('/api/users/:id', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Parse interested services if it's a string
    if (typeof updateData.interestedServices === 'string') {
      try {
        updateData.interestedServices = JSON.parse(updateData.interestedServices);
      } catch (e) {
        updateData.interestedServices = [];
      }
    }

    // Add resume if uploaded
    if (req.file) {
      updateData.resume = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userResponse = user.toObject();
    userResponse.id = userResponse._id;

    res.json({ success: true, data: userResponse });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user profile' });
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
    res.status(500).json({ success: false, message: 'Failed to submit contact form' });
  }
});

app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
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
    res.status(500).json({ success: false, message: 'Failed to submit testimonial' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

app.get('/api/admin/testimonials', authenticateToken, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get admin testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

app.post('/api/admin/testimonials', authenticateToken, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({ success: true, message: 'Testimonial created successfully' });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to create testimonial' });
  }
});

app.put('/api/admin/testimonials/:id', authenticateToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to update testimonial' });
  }
});

app.delete('/api/admin/testimonials/:id', authenticateToken, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete testimonial' });
  }
});

// Service Routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

app.get('/api/admin/services', authenticateToken, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get admin services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

app.post('/api/admin/services', authenticateToken, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, message: 'Service created successfully' });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
});

app.put('/api/admin/services/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
});

app.delete('/api/admin/services/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

// Dashboard Stats Routes
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [
      totalContacts,
      totalUsers,
      totalTestimonials,
      totalServices,
      dashboardStats
    ] = await Promise.all([
      Contact.countDocuments(),
      User.countDocuments(),
      Testimonial.countDocuments(),
      Service.countDocuments(),
      DashboardStats.findOne()
    ]);

    const stats = {
      totalContacts,
      totalUsers,
      totalTestimonials,
      totalServices,
      totalApplications: totalUsers, // Assuming users are job applications
      totalFraudCases: Math.floor(totalContacts * 0.3), // Estimate
      placedJobs: Math.floor(totalUsers * 0.8), // Estimate
      resolvedFraudCases: Math.floor(totalContacts * 0.25), // Estimate
      newsletterSubscribers: await Newsletter.countDocuments(),
      successRate: dashboardStats?.successRate || '98%',
      happyClients: dashboardStats?.happyClients || '5000+',
      growthRate: dashboardStats?.growthRate || '150%'
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const dashboardStats = await DashboardStats.findOne();
    
    const stats = {
      successRate: dashboardStats?.successRate || '98%',
      happyClients: dashboardStats?.happyClients || '5000+',
      growthRate: dashboardStats?.growthRate || '150%'
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Get public dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

app.put('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await DashboardStats.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Update dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to update dashboard stats' });
  }
});

// About Content Routes
app.get('/api/about', async (req, res) => {
  try {
    const aboutContent = await AboutContent.findOne({ active: true });
    res.json({ success: true, data: aboutContent });
  } catch (error) {
    console.error('Get about content error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch about content' });
  }
});

app.put('/api/admin/about', authenticateToken, async (req, res) => {
  try {
    const aboutContent = await AboutContent.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: aboutContent });
  } catch (error) {
    console.error('Update about content error:', error);
    res.status(500).json({ success: false, message: 'Failed to update about content' });
  }
});

// Contact Info Routes
app.get('/api/contact-info', async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    res.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Get contact info error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contact info' });
  }
});

app.put('/api/admin/contact-info', authenticateToken, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({ success: false, message: 'Failed to update contact info' });
  }
});

// Privacy Policy Routes
app.get('/api/privacy-policy', async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findOne({ active: true });
    res.json({ success: true, data: privacyPolicy });
  } catch (error) {
    console.error('Get privacy policy error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch privacy policy' });
  }
});

app.put('/api/admin/privacy-policy', authenticateToken, async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: privacyPolicy });
  } catch (error) {
    console.error('Update privacy policy error:', error);
    res.status(500).json({ success: false, message: 'Failed to update privacy policy' });
  }
});

// Terms of Service Routes
app.get('/api/terms-of-service', async (req, res) => {
  try {
    const termsOfService = await TermsOfService.findOne({ active: true });
    res.json({ success: true, data: termsOfService });
  } catch (error) {
    console.error('Get terms of service error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch terms of service' });
  }
});

app.put('/api/admin/terms-of-service', authenticateToken, async (req, res) => {
  try {
    const termsOfService = await TermsOfService.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: termsOfService });
  } catch (error) {
    console.error('Update terms of service error:', error);
    res.status(500).json({ success: false, message: 'Failed to update terms of service' });
  }
});

// Newsletter Routes
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: 'Email already subscribed' });
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe to newsletter' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use('/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});