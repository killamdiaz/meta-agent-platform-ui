import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const org1 = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  })

  const org2 = await prisma.organization.upsert({
    where: { slug: 'globex' },
    update: {},
    create: {
      name: 'Globex',
      slug: 'globex',
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@acme-corp.com' },
    update: {},
    create: {
      email: 'admin@acme-corp.com',
      name: 'Alice Admin',
      passwordHash,
      role: 'ADMIN',
      organizationId: org1.id,
    },
  })

  const member = await prisma.user.upsert({
    where: { email: 'bob@acme-corp.com' },
    update: {},
    create: {
      email: 'bob@acme-corp.com',
      name: 'Bob Member',
      passwordHash,
      role: 'MEMBER',
      organizationId: org1.id,
    },
  })

  const globexAdmin = await prisma.user.upsert({
    where: { email: 'carol@globex.com' },
    update: {},
    create: {
      email: 'carol@globex.com',
      name: 'Carol Globex',
      passwordHash,
      role: 'ADMIN',
      organizationId: org2.id,
    },
  })

  console.log('Seeded organizations:', { org1: org1.slug, org2: org2.slug })
  console.log('Seeded users:', {
    admin: admin.email,
    member: member.email,
    globexAdmin: globexAdmin.email,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
