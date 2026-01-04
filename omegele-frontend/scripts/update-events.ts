import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Convert IST to UTC
// IST is UTC+5:30
// January 4, 2026, 5:30 PM IST = January 4, 2026, 12:00 PM UTC
function getISTDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  // Create date in IST (UTC+5:30)
  // We need to subtract 5 hours and 30 minutes to convert to UTC
  // Handle minute rollover
  let utcMinute = minute - 30;
  let utcHour = hour - 5;
  if (utcMinute < 0) {
    utcMinute += 60;
    utcHour -= 1;
  }
  const date = new Date(Date.UTC(year, month - 1, day, utcHour, utcMinute));
  return date;
}

// Convert PST to UTC
// PST is UTC-8
// January 13, 2026, 6:00 PM PST = January 14, 2026, 2:00 AM UTC
function getPSTDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  // Create date in PST (UTC-8)
  // We need to add 8 hours to convert to UTC
  let utcHour = hour + 8;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;
  
  // Handle day rollover
  if (utcHour >= 24) {
    utcHour -= 24;
    utcDay += 1;
    // Handle month rollover
    const daysInMonth = new Date(year, month, 0).getDate();
    if (utcDay > daysInMonth) {
      utcDay = 1;
      utcMonth += 1;
      // Handle year rollover
      if (utcMonth > 12) {
        utcMonth = 1;
        utcYear += 1;
      }
    }
  }
  
  const date = new Date(Date.UTC(utcYear, utcMonth - 1, utcDay, utcHour, minute));
  return date;
}

async function updateEvents() {
  try {
    console.log("Updating events...");

    // Update or create Inauguration event
    const inaugurationDate = getISTDate(2026, 1, 4, 17, 30); // January 4, 2026, 5:30 PM IST

    // Find existing Inauguration event
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: {
          contains: "Inauguration",
          mode: "insensitive",
        },
      },
    });

    const eventData = {
      title: "Inauguration",
      description: `Join us for the official inauguration ceremony of Vinamah, powered by SURE Trust's innovative platform. This is a momentous occasion as we launch our platform and celebrate the beginning of a new era in professional networking and mentorship.

This special event will feature:
- Official platform launch announcement
- Keynote address from our leadership team
- Platform demonstration and features showcase
- Networking opportunities with industry leaders
- Q&A session with the founding team

Don't miss this historic moment as we embark on this exciting journey together.`,
      guestSpeaker: "SURE Trust",
      speakerBio: `SURE Trust (SURE ProEd) is India's first completely free and online platform that transforms skills into opportunities and dreams into reality. SURE Trust focuses on enhancing the employability of educated unemployed rural youth through human values-based skill up-gradation in emerging technologies, with no cost to students.

SURE Trust is a registered NGO on NGO-DARPAN and MCA portal (CSR00039792), eligible to undertake CSR activities. They are also an NGO Partner with TATA Group of Companies and their internships are AICTE approved. With over 5000+ students completed training, 400+ students placed, and 600+ students currently undergoing training, SURE Trust has made a significant impact in empowering rural youth through technology education.`,
      image: "/suretrust.png",
      eventDate: inaugurationDate,
      location: "Virtual Event",
      isVirtual: true,
      isActive: true,
    };

    let inaugurationEvent;
    if (existingEvent) {
      inaugurationEvent = await prisma.event.update({
        where: { id: existingEvent.id },
        data: eventData,
      });
      console.log("✅ Inauguration event updated:", inaugurationEvent.id);
    } else {
      inaugurationEvent = await prisma.event.create({
        data: eventData,
      });
      console.log("✅ Inauguration event created:", inaugurationEvent.id);
    }

    console.log("   Date:", inaugurationEvent.eventDate);
    console.log("   Title:", inaugurationEvent.title);

    // Update or create Guest Speaker event with Raghav Bansal
    const guestSpeakerDate = getPSTDate(2026, 1, 13, 18, 0); // January 13, 2026, 6:00 PM PST

    // Find existing Guest Speaker event
    const existingGuestSpeakerEvent = await prisma.event.findFirst({
      where: {
        title: {
          contains: "Raghav Bansal",
          mode: "insensitive",
        },
      },
    });

    const guestSpeakerEventData = {
      title: "Guest Speaker: Raghav Bansal",
      description: `Join us for an exclusive guest speaker event featuring Raghav Bansal, a serial entrepreneur and founder of githired.

This event will provide valuable insights into:
- Entrepreneurship journey and lessons learned
- Building successful startups
- Navigating the tech industry
- Career development and growth strategies
- Q&A session with the speaker

Don't miss this opportunity to learn from an accomplished founder and hackathon champion!`,
      guestSpeaker: "Raghav Bansal",
      speakerBio: `Raghav Bansal is a 3x founder and the founder of githired. His previous company was backed by Techstars, one of the world's most active early-stage investors. 

Raghav is a 6x hackathon winner, demonstrating his exceptional problem-solving skills and innovative thinking. He is also an international student at Arizona State University, where he continues to pursue excellence in technology and entrepreneurship.

With his extensive experience in building startups and navigating the tech ecosystem, Raghav brings valuable insights and practical knowledge to help aspiring entrepreneurs and professionals succeed in their careers.`,
      image: "/guestspeaker1.png",
      eventDate: guestSpeakerDate,
      location: "Virtual Event",
      isVirtual: true,
      isActive: true,
    };

    let guestSpeakerEvent;
    if (existingGuestSpeakerEvent) {
      guestSpeakerEvent = await prisma.event.update({
        where: { id: existingGuestSpeakerEvent.id },
        data: guestSpeakerEventData,
      });
      console.log("✅ Guest Speaker event updated:", guestSpeakerEvent.id);
    } else {
      guestSpeakerEvent = await prisma.event.create({
        data: guestSpeakerEventData,
      });
      console.log("✅ Guest Speaker event created:", guestSpeakerEvent.id);
    }

    console.log("   Date:", guestSpeakerEvent.eventDate);
    console.log("   Title:", guestSpeakerEvent.title);

    console.log("\n✅ Events update completed!");
  } catch (error) {
    console.error("❌ Error updating events:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateEvents();

