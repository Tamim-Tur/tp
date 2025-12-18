const bcrypt = require('bcrypt');
const { User, Ad, sequelize } = require('./models');

const seedData = async () => {
    try {
        console.log('--- STARTING SEED SCRIPT (SMART RESET) ---');
        await sequelize.sync({ alter: true });

        // Check/Create Alice
        const aliceEmail = process.env.SEED_USER_ALICE_EMAIL;
        const alicePassword = process.env.SEED_USER_ALICE_PASSWORD;

        let alice = await User.findOne({ where: { email: aliceEmail } });
        if (!alice) {
            console.log('Creating Alice...');
            alice = await User.create({
                username: 'Alice',
                email: aliceEmail,
                password: await bcrypt.hash(alicePassword, 10),
                role: 'user'
            });
        } else {
            console.log('Alice already exists.');
        }

        // Check/Create Bob
        const bobEmail = process.env.SEED_USER_BOB_EMAIL;
        const bobPassword = process.env.SEED_USER_BOB_PASSWORD;

        let bob = await User.findOne({ where: { email: bobEmail } });
        if (!bob) {
            console.log('Creating Bob...');
            bob = await User.create({
                username: 'Bob',
                email: bobEmail,
                password: await bcrypt.hash(bobPassword, 10),
                role: 'user'
            });
        } else {
            console.log('Bob already exists.');
        }

        // Check/Create Admin
        const adminEmail = process.env.SEED_ADMIN_EMAIL;
        const adminPassword = process.env.SEED_ADMIN_PASSWORD;

        let admin = await User.findOne({ where: { email: adminEmail } });
        if (!admin) {
            console.log('Creating Admin...');
            admin = await User.create({
                username: 'Admin',
                email: adminEmail,
                password: await bcrypt.hash(adminPassword, 10),
                role: 'admin'
            });
        } else {
            console.log('Admin already exists.');
        }


        console.log('Deleting default ads (Alice & Bob only)...');
        const { Op } = require('sequelize'); // Make sure to import Op
        await Ad.destroy({
            where: {
                userId: [alice.uuid, bob.uuid],
                status: { [Op.ne]: 'sold' } // DO NOT DELETE SOLD ADS
            }
        });

        console.log('Creating default ads with local images...');
        await Ad.bulkCreate([
            {
                title: 'iPhone 13 Pro',
                description: 'iPhone 13 Pro 128GB, excellent condition. Battery health 90%. Comes with original box and cable.',
                price: 650,
                status: 'available',
                imageUrl: '/images/iphone.jpg',
                userId: alice.uuid
            },
            {
                title: 'MacBook Pro M1',
                description: 'MacBook Pro M1 2020, 16GB RAM, 512GB SSD. Space Gray. Minor scratches on the lid.',
                price: 1200,
                status: 'available',
                imageUrl: '/images/macbook.jpg',
                userId: alice.uuid
            },
            {
                title: 'Mountain Bike',
                description: 'Trek Marlin 5, used for one season. Great for trails and city riding.',
                price: 450,
                status: 'available',
                imageUrl: '/images/bike.jpg',
                userId: bob.uuid
            },
            {
                title: 'Gaming PC',
                description: 'Custom built gaming PC. RTX 3060, Ryzen 5 5600X, 16GB RAM. Runs all modern games.',
                price: 900,
                status: 'available',
                imageUrl: '/images/pc.jpg',
                userId: bob.uuid
            },
            {
                title: 'Sony WH-1000XM4',
                description: 'Wireless noise-canceling headphones. Black color. Like new.',
                price: 250,
                status: 'available',
                imageUrl: '/images/headphones.jpg',
                userId: bob.uuid
            }
        ]);

        console.log(' Database seeded successfully with 5 default ads! (User ads preserved)');
    } catch (error) {
        console.error(' Error seeding database:', error);
    }
};

module.exports = seedData;
