import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    { username: 'admin', email: 'admin@decs.et', roleName: 'Admin', department: 'ICT' },
    { username: 'board_member', email: 'board@decs.et', roleName: 'ManagementBoard', department: 'Board' },
    { username: 'comm_officer', email: 'comm@decs.et', roleName: 'Communication', department: 'Communication' },
    { username: 'legal_advisor', email: 'legal@decs.et', roleName: 'Legal', department: 'Legal' },
    { username: 'ops_manager', email: 'ops@decs.et', roleName: 'Operations', department: 'Operations' },
  ];

  for (const user of users) {
    const role = await prisma.role.findUnique({ where: { name: user.roleName } });
    if (role) {
      await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: {
          username: user.username,
          email: user.email,
          passwordHash,
          roleId: role.id,
          department: user.department,
        },
      });
    }
  }

  console.log('Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
