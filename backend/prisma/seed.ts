import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@marketplace.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: "System Admin",
        role: "ADMIN",
      },
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
