import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Roles
  const roles = [
    { name: 'Admin', description: 'System Administrator' },
    { name: 'ManagementBoard', description: 'Management Board Member' },
    { name: 'Communication', description: 'Communication Department' },
    { name: 'Legal', description: 'Legal Department' },
    { name: 'Operations', description: 'Operations and Logistics' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Roles seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
