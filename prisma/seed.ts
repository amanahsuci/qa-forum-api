import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const passwordHash = await bcrypt.hash('password123', 10);

    const john = await prisma.user.upsert({
        where: { email: 'johndoe@example.com' },
        update: {},
        create: {
            username: 'johndoe',
            email: 'johndoe@example.com',
            passwordHash,
        },
    });

    const jane = await prisma.user.upsert({
        where: { email: 'jane@example.com' },
        update: {},
        create: {
            username: 'janedoe',
            email: 'jane@example.com',
            passwordHash,
        },
    });

    await prisma.thread.createMany({
        data: [
            {
                userId: john.id,
                title: 'How do I set up environment variables in Node.js?',
                content:
                'I am new to backend development and confused about how to hide my API keys. Could someone explain how to use dotenv?',
            },
            {
                userId: jane.id,
                title: 'When should I use PostgreSQL vs MongoDB?',
                content:
                'For a medium-scale e-commerce project, which database is more recommended and why?',
            },
            {
                userId: john.id,
                title: 'Getting a CORS error when hitting the API from React',
                content:
                "I keep getting an 'Access-Control-Allow-Origin' error. How do I handle this on the Express.js side?",
            },
        ],
        skipDuplicates: true,
    });

    console.log('✅ Seeding complete!');
    console.log(`   Users created: johndoe, janedoe`);
    console.log(`   Password for both: password123`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });