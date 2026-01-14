import { prisma } from "@/lib/prisma";

/**
 * Script to mark a user as Guest
 * Usage: npx tsx scripts/mark-guest.ts <user-email-or-id>
 */
async function markGuest() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/mark-guest.ts <user-email-or-id>");
    console.error("Example: npx tsx scripts/mark-guest.ts user@example.com");
    console.error("Example: npx tsx scripts/mark-guest.ts clx1234567890");
    process.exit(1);
  }

  const identifier = args[0];
  
  try {
    // Try to find user by email or ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { id: identifier }
        ]
      }
    });

    if (!user) {
      console.error(`User not found: ${identifier}`);
      process.exit(1);
    }

    // Update user to mark as guest
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isGuest: true }
    });

    console.log("✅ User marked as guest successfully!");
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Name: ${updatedUser.name || "N/A"}`);
    console.log(`   Email: ${updatedUser.email || "N/A"}`);
    console.log(`   isGuest: ${updatedUser.isGuest}`);
  } catch (error: any) {
    console.error("Error marking user as guest:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

markGuest();
