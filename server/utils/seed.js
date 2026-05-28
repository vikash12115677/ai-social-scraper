require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const { generateMockPosts } = require('../scrapers/mockDataGenerator');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/passport_scraper');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@passport-dashboard.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`👤 Admin created: admin@passport-dashboard.com / admin123`);

    // Create demo user
    await User.create({
      name: 'Demo User',
      email: 'demo@passport-dashboard.com',
      password: 'demo123',
      role: 'analyst',
    });
    console.log(`👤 Demo user: demo@passport-dashboard.com / demo123`);

    // Insert mock posts
    const mockPosts = generateMockPosts(50);
    await Post.insertMany(mockPosts);
    console.log(`📝 Inserted ${mockPosts.length} mock posts`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@passport-dashboard.com / admin123');
    console.log('   Demo:  demo@passport-dashboard.com  / demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
