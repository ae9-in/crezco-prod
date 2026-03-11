require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const College = require('./models/College');
const Membership = require('./models/Membership');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crezco');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await College.deleteMany({});
        await Membership.deleteMany({});
        console.log('Cleared existing data.');

        // Create a test user (Admin/CC)
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('password123', salt);
        
        const adminUser = await User.create({
            name: 'Crezco Admin',
            email: 'admin@crezco.com',
            password: adminPassword,
            role: 'admin'
        });
        console.log('Admin user created: admin@crezco.com / password123');

        // Create sample colleges
        const colleges = [
            { name: 'Indian Institute of Technology (IIT), Delhi', created_by: adminUser._id },
            { name: 'National Institute of Technology (NIT), Trichy', created_by: adminUser._id },
            { name: 'SRM Institute of Science and Technology', created_by: adminUser._id },
            { name: 'Delhi Technological University (DTU)', created_by: adminUser._id },
            { name: 'Birla Institute of Technology and Science (BITS), Pilani', created_by: adminUser._id }
        ];

        const createdColleges = await College.insertMany(colleges);
        console.log(`${createdColleges.length} colleges created.`);

        // Add admin as CC/Member to some colleges
        for (const college of createdColleges) {
            await Membership.create({
                user_id: adminUser._id,
                college_id: college._id,
                role: 'cc'
            });
        }
        console.log('Colleges memberships established.');

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedData();
