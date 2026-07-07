const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // New security tool
require('dotenv').config({ path: './backend/.env' });

const Product = require('./models/Product');
const User = require('./models/User'); // Import the new User blueprint

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("🟢 Connected to MongoDB Atlas successfully!");
        seedDatabase(); 
    })
    .catch((error) => console.error("🔴 MongoDB connection error:", error));

// Expanded Product Catalog & Database Seeder (Kept exactly the same)
const expandedProducts = [
    { id: 1, name: "Wireless Pro Mouse", price: 45.00, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" },
    { id: 2, name: "Mechanical Keyboard", price: 85.00, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80" },
    { id: 3, name: "Ultra HD Monitor", price: 250.00, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80" },
    { id: 4, name: "Noise Cancelling Headphones", price: 120.00, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
    { id: 5, name: "1080p Web Camera", price: 60.00, image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500&q=80" },
    { id: 6, name: "Studio Microphone", price: 95.00, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80" }
];

async function seedDatabase() {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            console.log("📦 Database is empty. Injecting expanded products...");
            await Product.insertMany(expandedProducts);
            console.log("✅ Products saved to cloud database!");
        } else {
            console.log(`📦 Database already has ${count} products loaded.`);
        }
    } catch (error) {
        console.error("Error seeding database:", error);
    }
}

// --- API ROUTES ---

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const productsFromDB = await Product.find(); 
        res.json(productsFromDB); 
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// NEW: User Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // 2. Hash (scramble) the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user and save to database
        const newUser = new User({
            name,
            email,
            password: hashedPassword // Save the scrambled version, NOT the plain text!
        });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!" });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error during signup" });
    }
});

// NEW: User Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if a user with this email actually exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 2. Securely compare the typed password with the saved hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 3. If they match, let them in!
        res.status(200).json({ message: "Login successful!" });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});