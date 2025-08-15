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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection
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
  profileCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

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
  createdAt: { type: Date, default: Date.now }
});

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
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

// Dashboard Stats Schema
const dashboardStatsSchema = new mongoose.Schema({
  happyClients: { type: String, default: '5000+' },
  successRate: { type: String, default: '98%' },
  growthRate: { type: String, default: '150%' },
  updatedAt: { type: Date, default: Date.now }
});

const DashboardStats = mongoose.model('DashboardStats', dashboardStatsSchema);

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
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

// Contact Info Schema
const contactInfoSchema = new mongoose.Schema({
  phone: [String],
  email: [String],
  address: [String],
  workingHours: [String],
  updatedAt: { type: Date, default: Date.now }
});

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

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
  active: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
});

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
  active: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now }
});

const TermsOfService = mongoose.model('TermsOfService', termsOfServiceSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
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
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Auth Routes
app.post('/api/auth/register', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, address, city, state, pincode, currentPosition, experience, skills, education, expectedSalary, preferredLocation, jobType, workMode } = req.body;
    
    // Parse interestedServices if it's a JSON string
    let interestedServices = [];
    if (req.body.interestedServices) {
      try {
        interestedServices = JSON.parse(req.body.interestedServices);
      } catch (e) {
        interestedServices = [req.body.interestedServices];
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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
      interestedServices,
      profileCompleted: true
    };

    if (req.file) {
      userData.resume = req.file.path;
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
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
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
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
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// User Profile Routes
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Users can only access their own profile, admins can access any profile
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
});

app.put('/api/users/:userId', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Users can only update their own profile, admins can update any profile
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = { ...req.body };
    
    // Parse interestedServices if it's a JSON string
    if (updateData.interestedServices && typeof updateData.interestedServices === 'string') {
      try {
        updateData.interestedServices = JSON.parse(updateData.interestedServices);
      } catch (e) {
        updateData.interestedServices = [updateData.interestedServices];
      }
    }

    // Handle date of birth
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    // Handle resume upload
    if (req.file) {
      updateData.resume = req.file.path;
    }

    // Remove password from update data if present
    delete updateData.password;
    delete updateData.confirmPassword;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Contact Routes
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form', error: error.message });
  }
});

app.get('/api/contacts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
});

// Newsletter Routes
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.subscribed) {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        existingSubscriber.subscribed = true;
        await existingSubscriber.save();
        return res.json({ message: 'Successfully resubscribed to newsletter' });
      }
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe to newsletter', error: error.message });
  }
});

// Testimonial Routes
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonial = new Testimonial({ ...req.body, approved: false });
    await testimonial.save();
    res.status(201).json({ message: 'Testimonial submitted successfully' });
  } catch (error) {
    console.error('Testimonial submission error:', error);
    res.status(500).json({ message: 'Failed to submit testimonial', error: error.message });
  }
});

app.get('/api/testimonials/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
  }
});

app.post('/api/testimonials/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json({ message: 'Testimonial created successfully', testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Failed to create testimonial', error: error.message });
  }
});

app.put('/api/testimonials/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial updated successfully', testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'Failed to update testimonial', error: error.message });
  }
});

app.delete('/api/testimonials/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'Failed to delete testimonial', error: error.message });
  }
});

// Service Routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
});

app.get('/api/services/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services', error: error.message });
  }
});

app.post('/api/services', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Failed to create service', error: error.message });
  }
});

app.put('/api/services/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Failed to update service', error: error.message });
  }
});

app.delete('/api/services/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Failed to delete service', error: error.message });
  }
});

// Dashboard Stats Routes
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [
      totalContacts,
      totalApplications,
      totalFraudCases,
      totalUsers,
      totalTestimonials
    ] = await Promise.all([
      Contact.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Contact.countDocuments({ service: 'fraud-assistance' }),
      User.countDocuments(),
      Testimonial.countDocuments({ approved: true })
    ]);

    // Get editable stats
    let editableStats = await DashboardStats.findOne();
    if (!editableStats) {
      editableStats = new DashboardStats();
      await editableStats.save();
    }

    const stats = {
      totalContacts,
      totalApplications,
      totalFraudCases,
      placedJobs: Math.floor(totalApplications * 0.8),
      resolvedFraudCases: Math.floor(totalFraudCases * 0.9),
      totalUsers,
      newsletterSubscribers: await Newsletter.countDocuments({ subscribed: true }),
      totalTestimonials,
      successRate: editableStats.successRate,
      happyClients: editableStats.happyClients,
      growthRate: editableStats.growthRate
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

app.get('/api/dashboard-stats', async (req, res) => {
  try {
    let stats = await DashboardStats.findOne();
    if (!stats) {
      stats = new DashboardStats();
      await stats.save();
    }
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats data', error: error.message });
  }
});

app.put('/api/dashboard-stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let stats = await DashboardStats.findOne();
    if (!stats) {
      stats = new DashboardStats(req.body);
    } else {
      Object.assign(stats, req.body);
      stats.updatedAt = new Date();
    }
    await stats.save();
    res.json({ message: 'Dashboard stats updated successfully', stats });
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    res.status(500).json({ message: 'Failed to update dashboard stats', error: error.message });
  }
});

// About Content Routes
app.get('/api/about-content', async (req, res) => {
  try {
    const aboutContent = await AboutContent.findOne({ active: true });
    res.json(aboutContent || {});
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Failed to fetch about content', error: error.message });
  }
});

app.put('/api/about-content', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let aboutContent = await AboutContent.findOne();
    if (!aboutContent) {
      aboutContent = new AboutContent(req.body);
    } else {
      Object.assign(aboutContent, req.body);
    }
    await aboutContent.save();
    res.json({ message: 'About content updated successfully', aboutContent });
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ message: 'Failed to update about content', error: error.message });
  }
});

// Contact Info Routes
app.get('/api/contact-info', async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    res.json(contactInfo || {});
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ message: 'Failed to fetch contact info', error: error.message });
  }
});

app.put('/api/contact-info', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne();
    if (!contactInfo) {
      contactInfo = new ContactInfo(req.body);
    } else {
      Object.assign(contactInfo, req.body);
      contactInfo.updatedAt = new Date();
    }
    await contactInfo.save();
    res.json({ message: 'Contact info updated successfully', contactInfo });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ message: 'Failed to update contact info', error: error.message });
  }
});

// Privacy Policy Routes
app.get('/api/privacy-policy', async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findOne({ active: true });
    res.json(privacyPolicy || {});
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({ message: 'Failed to fetch privacy policy', error: error.message });
  }
});

app.put('/api/privacy-policy', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let privacyPolicy = await PrivacyPolicy.findOne();
    if (!privacyPolicy) {
      privacyPolicy = new PrivacyPolicy({ ...req.body, lastUpdated: new Date() });
    } else {
      Object.assign(privacyPolicy, req.body);
      privacyPolicy.lastUpdated = new Date();
    }
    await privacyPolicy.save();
    res.json({ message: 'Privacy policy updated successfully', privacyPolicy });
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    res.status(500).json({ message: 'Failed to update privacy policy', error: error.message });
  }
});

// Terms of Service Routes
app.get('/api/terms-of-service', async (req, res) => {
  try {
    console.log('Fetching terms of service...');
    const termsOfService = await TermsOfService.findOne({ active: true });
    console.log('Terms of service found:', termsOfService);
    res.json(termsOfService || {});
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    res.status(500).json({ message: 'Failed to fetch terms of service', error: error.message });
  }
});

app.put('/api/terms-of-service', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Updating terms of service with data:', req.body);
    let termsOfService = await TermsOfService.findOne();
    if (!termsOfService) {
      termsOfService = new TermsOfService({ ...req.body, lastUpdated: new Date() });
    } else {
      Object.assign(termsOfService, req.body);
      termsOfService.lastUpdated = new Date();
    }
    await termsOfService.save();
    console.log('Terms of service updated successfully');
    res.json({ message: 'Terms of service updated successfully', termsOfService });
  } catch (error) {
    console.error('Error updating terms of service:', error);
    res.status(500).json({ message: 'Failed to update terms of service', error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error', error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});