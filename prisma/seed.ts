import { PrismaClient, Role, TournamentStatus, RegistrationMode } from "@prisma/client";
import bcryptjs from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const passwordHash = await bcryptjs.hash("admin1234", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@bbc.dk" },
    update: {},
    create: {
      name: "BBC Administrator",
      email: "admin@bbc.dk",
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Club admin user
  const clubAdminHash = await bcryptjs.hash("klubadmin1234", 12);
  const clubAdmin = await db.user.upsert({
    where: { email: "klubadmin@bbc.dk" },
    update: {},
    create: {
      name: "Klub Administrator",
      email: "klubadmin@bbc.dk",
      passwordHash: clubAdminHash,
      role: Role.CLUB_ADMIN,
    },
  });
  console.log(`Created club admin user: ${clubAdmin.email}`);

  // Clubs
  const parentClub = await db.club.upsert({
    where: { slug: "ballerup-bridge-club" },
    update: {},
    create: {
      name: "Ballerup Bridge Club",
      slug: "ballerup-bridge-club",
    },
  });
  console.log(`Created club: ${parentClub.name}`);

  const subClub = await db.club.upsert({
    where: { slug: "ballerup-junior-bridge" },
    update: {},
    create: {
      name: "Ballerup Junior Bridge",
      slug: "ballerup-junior-bridge",
      parentId: parentClub.id,
    },
  });
  console.log(`Created sub-club: ${subClub.name}`);

  // Assign club admin to parent club
  await db.clubAdminAssignment.upsert({
    where: { userId_clubId: { userId: clubAdmin.id, clubId: parentClub.id } },
    update: {},
    create: {
      userId: clubAdmin.id,
      clubId: parentClub.id,
    },
  });
  console.log(`Assigned ${clubAdmin.email} as admin of ${parentClub.name}`);

  // Tournaments
  const foraarsPar = await db.tournament.upsert({
    where: { slug: "foraarsparkurnering-2026" },
    update: {},
    create: {
      name: "Forårsparkurnering 2026",
      slug: "foraarsparkurnering-2026",
      clubId: parentClub.id,
      date: new Date("2026-03-15T10:00:00.000Z"),
      location: "Ballerup Idrætscenter, Sal 3",
      maxEntries: 24,
      price: 150,
      notes:
        "Åben parkurnering for alle niveauer. Startgebyret inkluderer frokost. Tilmelding senest 7 dage før.",
      signupDeadline: new Date("2026-03-08T23:59:59.000Z"),
      status: TournamentStatus.OPEN,
      registrationMode: RegistrationMode.PAIR,
      allowGuestSignup: true,
      waitlistEnabled: true,
    },
  });
  console.log(`Created tournament: ${foraarsPar.name}`);

  const sommercup = await db.tournament.upsert({
    where: { slug: "sommercup-2026" },
    update: {},
    create: {
      name: "Sommercup 2026",
      slug: "sommercup-2026",
      clubId: parentClub.id,
      date: new Date("2026-06-20T09:00:00.000Z"),
      location: "Ballerup Bridge Club, Lundtoftegårdsvej",
      maxEntries: 12,
      price: 200,
      notes:
        "Holdturnering med 4 spillere pr. hold. Minimum 3 og maksimum 4 spillere. Inkluderer aftensmad.",
      signupDeadline: new Date("2026-06-13T23:59:59.000Z"),
      status: TournamentStatus.OPEN,
      registrationMode: RegistrationMode.TEAM,
      allowGuestSignup: false,
      waitlistEnabled: true,
      teamMinPlayers: 3,
      teamMaxPlayers: 4,
    },
  });
  console.log(`Created tournament: ${sommercup.name}`);

  const enkeltmands = await db.tournament.upsert({
    where: { slug: "enkeltmands-dm-kvalifikation-2026" },
    update: {},
    create: {
      name: "Enkeltmands DM-kvalifikation 2026",
      slug: "enkeltmands-dm-kvalifikation-2026",
      clubId: parentClub.id,
      date: new Date("2026-09-05T09:00:00.000Z"),
      location: "Ballerup Bridge Club",
      maxEntries: 32,
      price: null,
      notes: "Kvalifikationsturnering til DM i enkeltmands bridge. Kun for klubmedlemmer.",
      signupDeadline: new Date("2026-08-29T23:59:59.000Z"),
      status: TournamentStatus.DRAFT,
      registrationMode: RegistrationMode.SINGLE,
      allowGuestSignup: false,
      waitlistEnabled: true,
    },
  });
  console.log(`Created tournament: ${enkeltmands.name} (DRAFT)`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
