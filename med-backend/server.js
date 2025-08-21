const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/medicineDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected to MedicineDB"))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas & Models
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

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Symptoms Routes
app.get('/api/symptoms', async (req, res) => {
  try {
    console.log('Fetching symptoms...');
    const symptoms = await Symptom.find().populate('relatedMedicines');
    console.log(`Found ${symptoms.length} symptoms`);
    res.json(symptoms);
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    res.status(500).json({ error: 'Error fetching symptoms' });
  }
});

app.get('/api/symptoms/:id/medicines', async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id).populate('relatedMedicines');
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    res.json(symptom.relatedMedicines);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching related medicines' });
  }
});

// Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      medicalHistory: []
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        medicalHistory: user.medicalHistory
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        medicalHistory: user.medicalHistory
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// User Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, medicalHistory } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, medicalHistory },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Error updating user profile' });
  }
});

// Medicine Routes
app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    console.error('Medicines fetch error:', error);
    res.status(500).json({ error: 'Error fetching medicines' });
  }
});

app.get('/api/medicines/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    console.error('Medicine fetch error:', error);
    res.status(500).json({ error: 'Error fetching medicine' });
  }
});

app.get('/api/medicines/category/:category', async (req, res) => {
  try {
    const medicines = await Medicine.find({ category: req.params.category });
    res.json(medicines);
  } catch (error) {
    console.error('Medicines by category fetch error:', error);
    res.status(500).json({ error: 'Error fetching medicines by category' });
  }
});

app.get('/api/medicines/search/:term', async (req, res) => {
  try {
    const searchTerm = req.params.term;
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    });
    res.json(medicines);
  } catch (error) {
    console.error('Medicine search error:', error);
    res.status(500).json({ error: 'Error searching medicines' });
  }
});

// Get unique categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Medicine.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// Symptom Routes
app.get('/api/symptoms', async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.json(symptoms);
  } catch (error) {
    console.error('Symptoms fetch error:', error);
    res.status(500).json({ error: 'Error fetching symptoms' });
  }
});

app.get('/api/symptoms/:id', async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }
    res.json(symptom);
  } catch (error) {
    console.error('Symptom fetch error:', error);
    res.status(500).json({ error: 'Error fetching symptom' });
  }
});

app.get('/api/symptoms/:id/medicines', async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      return res.status(404).json({ error: 'Symptom not found' });
    }

    // Find medicines by IDs in relatedMedicines array
    const medicines = await Medicine.find({
      _id: { $in: symptom.relatedMedicines }
    });
    
    res.json(medicines);
  } catch (error) {
    console.error('Medicines by symptom fetch error:', error);
    res.status(500).json({ error: 'Error fetching medicines for symptom' });
  }
});

// Admin Routes (protected)
app.post('/api/admin/medicines', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Medicine creation error:', error);
    res.status(500).json({ error: 'Error creating medicine' });
  }
});

app.put('/api/admin/medicines/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    console.error('Medicine update error:', error);
    res.status(500).json({ error: 'Error updating medicine' });
  }
});

app.delete('/api/admin/medicines/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Medicine deletion error:', error);
    res.status(500).json({ error: 'Error deleting medicine' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medicine API server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});