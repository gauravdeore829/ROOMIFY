const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting RoomEase Database Seeding...');

  // Clean existing data
  await prisma.inquiry.deleteMany();
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.application.deleteMany();
  await prisma.review.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.houseRules.deleteMany();
  await prisma.amenity.deleteMany();
  await prisma.room.deleteMany();
  await prisma.property.deleteMany();
  await prisma.ownerVerification.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  const commonPassword = await bcrypt.hash('Demo@12345', 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@example.com',
      passwordHash: commonPassword,
      role: 'ADMIN',
      phone: '+91 9876543210',
    },
  });

  const ownerUser1 = await prisma.user.create({
    data: {
      name: 'Rajesh Sharma (Owner)',
      email: 'owner@example.com',
      passwordHash: commonPassword,
      role: 'OWNER',
      phone: '+91 9811223344',
      verificationRequest: {
        create: {
          phone: '+91 9811223344',
          idProofRef: 'AADHAAR_9811223344.pdf',
          propertyDocRef: 'REGISTRATION_DOC_88.pdf',
          address: 'Flat 402, Sunshine Heights, Kothrud, Pune',
          status: 'VERIFIED',
        },
      },
    },
  });

  const ownerUser2 = await prisma.user.create({
    data: {
      name: 'Priya Venkatesh',
      email: 'priya.owner@example.com',
      passwordHash: commonPassword,
      role: 'OWNER',
      phone: '+91 9744556677',
      verificationRequest: {
        create: {
          phone: '+91 9744556677',
          idProofRef: 'PAN_PRIYA_9744.pdf',
          propertyDocRef: 'PROPERTY_TAX_2025.pdf',
          address: '12th Cross, Indiranagar, Bangalore',
          status: 'VERIFIED',
        },
      },
    },
  });

  const studentUser = await prisma.user.create({
    data: {
      name: 'Aarav Patel',
      email: 'student@example.com',
      passwordHash: commonPassword,
      role: 'USER',
      phone: '+91 9123456789',
      profile: {
        create: {
          collegeOrOffice: 'MIT World Peace University',
          preferredLocation: 'Kothrud, Pune',
          budget: 8000,
          roomType: '2 Sharing',
          facilities: ['wifi', 'ac', 'attachedBathroom'].join(','),
        },
      },
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      name: 'Ananya Roy',
      email: 'ananya@example.com',
      passwordHash: commonPassword,
      role: 'USER',
      phone: '+91 9988776655',
      profile: {
        create: {
          collegeOrOffice: 'Christ University',
          preferredLocation: 'Koramangala, Bangalore',
          budget: 12000,
          roomType: 'Single',
          facilities: ['wifi', 'food', 'washingMachine'].join(','),
        },
      },
    },
  });

  console.log('✅ Demo Users & Accounts Created');

  // Sample Image URLs
  const sampleImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
  ];

  // 2. Create Properties & Rooms
  const p1 = await prisma.property.create({
    data: {
      ownerId: ownerUser1.id,
      name: 'Sunshine Luxury PG for Men',
      description: 'Modern, fully furnished student & working professional accommodation near MIT College, Kothrud. High-speed Wi-Fi, delicious home-style meals, and 24/7 security.',
      address: 'Lane 5, Paud Road, Opposite MIT WPU Gate',
      city: 'Pune',
      area: 'Kothrud',
      pincode: '411038',
      latitude: 18.5074,
      longitude: 73.8077,
      propertyType: 'PG',
      isVerified: true,
      status: 'VERIFIED',
      images: {
        create: [
          { url: sampleImages[0] },
          { url: sampleImages[1] },
          { url: sampleImages[2] },
        ],
      },
      amenities: {
        create: {
          wifi: true,
          ac: true,
          food: true,
          kitchen: false,
          washingMachine: true,
          attachedBathroom: true,
          powerBackup: true,
          furnished: true,
          cctv: true,
          waterSupply: true,
        },
      },
      rules: {
        create: {
          visitorsAllowed: true,
          smokingAllowed: false,
          petsAllowed: false,
          cookingAllowed: false,
          curfewTime: '10:30 PM',
          otherRules: 'No loud music after 11 PM.',
        },
      },
      rooms: {
        create: [
          {
            roomType: 'Single',
            totalBeds: 1,
            occupiedBeds: 0,
            availableBeds: 1,
            rent: 12500,
            securityDeposit: 25000,
            status: 'AVAILABLE',
          },
          {
            roomType: '2 Sharing',
            totalBeds: 4,
            occupiedBeds: 2,
            availableBeds: 2,
            rent: 7500,
            securityDeposit: 15000,
            status: 'AVAILABLE',
          },
          {
            roomType: '3 Sharing',
            totalBeds: 6,
            occupiedBeds: 5,
            availableBeds: 1,
            rent: 5500,
            securityDeposit: 10000,
            status: 'AVAILABLE',
          },
        ],
      },
    },
    include: { rooms: true },
  });

  const p2 = await prisma.property.create({
    data: {
      ownerId: ownerUser2.id,
      name: 'Indiranagar Urban Living Co-living Studio',
      description: 'Premium co-living space located right in the heart of Indiranagar. Walking distance to Metro station, tech parks, cafes, and gym.',
      address: '100 Feet Road, Near Toit',
      city: 'Bangalore',
      area: 'Indiranagar',
      pincode: '560038',
      latitude: 12.9784,
      longitude: 77.6408,
      propertyType: 'Flat',
      isVerified: true,
      status: 'VERIFIED',
      images: {
        create: [
          { url: sampleImages[3] },
          { url: sampleImages[4] },
          { url: sampleImages[0] },
        ],
      },
      amenities: {
        create: {
          wifi: true,
          ac: true,
          food: false,
          kitchen: true,
          washingMachine: true,
          attachedBathroom: true,
          powerBackup: true,
          furnished: true,
          cctv: true,
          waterSupply: true,
        },
      },
      rules: {
        create: {
          visitorsAllowed: true,
          smokingAllowed: true,
          petsAllowed: true,
          cookingAllowed: true,
          curfewTime: 'No Curfew',
          otherRules: 'Keep common areas clean.',
        },
      },
      rooms: {
        create: [
          {
            roomType: 'Single',
            totalBeds: 2,
            occupiedBeds: 1,
            availableBeds: 1,
            rent: 16000,
            securityDeposit: 30000,
            status: 'AVAILABLE',
          },
          {
            roomType: '2 Sharing',
            totalBeds: 4,
            occupiedBeds: 4,
            availableBeds: 0,
            rent: 9500,
            securityDeposit: 19000,
            status: 'FULL',
          },
        ],
      },
    },
    include: { rooms: true },
  });

  const p3 = await prisma.property.create({
    data: {
      ownerId: ownerUser1.id,
      name: 'Viman Nagar Comfort Hostel for Girls',
      description: 'Safe and secure hostel for female students near Symbiosis International University. Bio-metric access, 3-time wholesome meals, and daily housekeeping.',
      address: 'Datta Mandir Chowk, Viman Nagar',
      city: 'Pune',
      area: 'Viman Nagar',
      pincode: '411014',
      latitude: 18.5679,
      longitude: 73.9143,
      propertyType: 'Hostel',
      isVerified: true,
      status: 'VERIFIED',
      images: {
        create: [
          { url: sampleImages[1] },
          { url: sampleImages[2] },
        ],
      },
      amenities: {
        create: {
          wifi: true,
          ac: true,
          food: true,
          kitchen: false,
          washingMachine: true,
          attachedBathroom: true,
          powerBackup: true,
          furnished: true,
          cctv: true,
          waterSupply: true,
        },
      },
      rules: {
        create: {
          visitorsAllowed: false,
          smokingAllowed: false,
          petsAllowed: false,
          cookingAllowed: false,
          curfewTime: '09:30 PM',
          otherRules: 'ID card mandatory at gate.',
        },
      },
      rooms: {
        create: [
          {
            roomType: '2 Sharing',
            totalBeds: 6,
            occupiedBeds: 3,
            availableBeds: 3,
            rent: 8500,
            securityDeposit: 17000,
            status: 'AVAILABLE',
          },
        ],
      },
    },
    include: { rooms: true },
  });

  console.log('✅ Properties and Rooms Created');

  // 3. Create Reviews
  await prisma.review.create({
    data: {
      propertyId: p1.id,
      userId: studentUser.id,
      cleanliness: 5,
      location: 5,
      safety: 4,
      ownerBehavior: 5,
      facilities: 4,
      valueForMoney: 5,
      averageRating: 4.67,
      comment: 'Extremely good place! The landlord Rajesh uncle is super helpful and food quality is top notch.',
    },
  });

  await prisma.review.create({
    data: {
      propertyId: p2.id,
      userId: studentUser2.id,
      cleanliness: 4,
      location: 5,
      safety: 5,
      ownerBehavior: 4,
      facilities: 5,
      valueForMoney: 4,
      averageRating: 4.5,
      comment: 'Awesome location right near Indiranagar metro station. High speed internet for work from home!',
    },
  });

  // 4. Create Applications
  const roomToApply = p1.rooms.find((r) => r.roomType === '2 Sharing');
  if (roomToApply) {
    await prisma.application.create({
      data: {
        userId: studentUser.id,
        roomId: roomToApply.id,
        message: 'Hi Rajesh Sharma, I am looking to move in from 1st of next month. Is this bed still vacant?',
        status: 'PENDING',
      },
    });
  }

  // 5. Create Favorites
  await prisma.favorite.create({
    data: {
      userId: studentUser.id,
      propertyId: p1.id,
    },
  });

  // 6. Create Notifications
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      message: 'Welcome to RoomEase! Find your ideal room before visiting.',
      type: 'INFO',
    },
  });

  await prisma.notification.create({
    data: {
      userId: ownerUser1.id,
      message: 'New room application received for Sunshine Luxury PG.',
      type: 'APPLICATION',
    },
  });

  console.log('🎉 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
