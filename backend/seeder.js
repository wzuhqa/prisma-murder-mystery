require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data (optional, but good for a "make it work" fresh start)
        await User.deleteMany();
        await Event.deleteMany();

        console.log('Old data cleared...');

        // Create Admin User
        const admin = await User.create({
            name: 'Master Detective',
            email: 'admin@prisma.com',
            password: 'password123',
            role: 'admin'
        });

        console.log('Admin user created: admin@prisma.com / password123');

        // Create Sample Events (from Brochure)
        const categories = [
            { name: 'Dance', items: ['Solo Classical', 'Solo Western', 'Duet Dance', 'Street Battle Solo', 'Street Group Battle', 'Western Group', 'Folk Group'] },
            { name: 'Drama', items: ['Aabhas Stage Play', 'Street Play', 'Mono Acting / Duo', 'Mime'] },
            { name: 'Fashion', items: ['Group Fashion', 'Mr. / Miss Prisma', 'Face Artistry'] },
            { name: 'Photography', items: ['On-Spot Photography', 'Reel Making Competition'] },
            { name: 'Gaming', items: ['BGMI', 'Valorant', 'Tekken 8', 'FIFA', 'Clash Royale'] },
            { name: 'Literary', items: ['Slam Poetry', 'Poet\'s Ode', 'Asian Parliamentary Debate', 'Spell Bee', 'Emotion in Motion', 'Social Blueprint', 'Kavi Kya Kehta Hai', 'Gaathaayein', 'Mushayera'] },
            { name: 'Music', items: ['Battle of Bands', 'Solo Vocal', 'Production Battle', 'Rap Battle', 'Instrumental Solo'] },
            { name: 'Standup Comedy', items: ['Meme Battle', 'Mic Drop', 'Try Not to Laugh', 'Comedy Treasure Hunt', 'Standup Show'] },
            { name: 'Anime', items: ['The Ultimate Fandom Quiz', 'Dub It Your Way', 'Decode the Mystery', 'Fandom Pictionary'] },
            { name: 'Art', items: ['Art-a-thon', 'Body Painting', 'Wall Painting', 'Digital Art', 'Tote Bag Design', 'Best Out of Waste', 'Clay Modelling', 'Brush Off Brush', 'Doodling & Calligraphy', 'Mini Canvas'] }
        ];

        const events = [];
        let dayOffset = 1;

        categories.forEach(cat => {
            cat.items.forEach(item => {
                events.push({
                    title: item,
                    description: `${cat.name} Event: Participating in ${item} at PRISMA 2K26.`,
                    price: 1000,
                    date: new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000), // Spaced out
                    totalTickets: 100,
                    availableTickets: 100,
                    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
                    createdBy: admin._id,
                    isActive: true
                });
                dayOffset++;
            });
        });

        await Event.insertMany(events);
        console.log(`${events.length} events from brochure created successfully.`);

        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seedData();
