require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const applications = [
    {
      companyName: 'Acme Corp',
      jobTitle: 'Frontend Engineer Intern',
      jobType: 'Internship',
      status: 'Applied',
      appliedDate: new Date('2026-06-10'),
      notes: 'Applied through career portal. Waiting for response.',
    },
    {
      companyName: 'Brightside Technologies',
      jobTitle: 'Software Engineer',
      jobType: 'FullTime',
      status: 'Interviewing',
      appliedDate: new Date('2026-06-05'),
      notes: 'First round scheduled for next week.',
    },
    {
      companyName: 'CloudLeap',
      jobTitle: 'Backend Developer',
      jobType: 'FullTime',
      status: 'Offer',
      appliedDate: new Date('2026-05-25'),
      notes: 'Received verbal offer, negotiating salary.',
    },
    {
      companyName: 'Nimble Solutions',
      jobTitle: 'Part-Time QA Engineer',
      jobType: 'PartTime',
      status: 'Rejected',
      appliedDate: new Date('2026-05-15'),
      notes: 'Position filled internally.',
    },
  ];

  for (const application of applications) {
    await prisma.application.create({ data: application });
  }

  console.log(`Seeded ${applications.length} demo applications.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
