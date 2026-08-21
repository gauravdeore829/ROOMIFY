const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProperties = async (req, res, next) => {
  try {
    const { city, area, search, propertyType, roomType, maxRent, verifiedOnly } = req.query;

    const where = {};

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (area) {
      where.area = { contains: area, mode: 'insensitive' };
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (verifiedOnly === 'true') {
      where.isVerified = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (maxRent || roomType) {
      where.rooms = {
        some: {
          ...(maxRent ? { rent: { lte: parseFloat(maxRent) } } : {}),
          ...(roomType ? { roomType: roomType } : {}),
        },
      };
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        images: true,
        rooms: true,
        amenities: true,
        rules: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reviews: {
          select: { averageRating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedProperties = properties.map((prop) => {
      const totalRatings = prop.reviews.length;
      const avgRating =
        totalRatings > 0
          ? prop.reviews.reduce((sum, r) => sum + r.averageRating, 0) / totalRatings
          : 4.5; // default initial fallback rating

      const minRent = prop.rooms.length > 0 ? Math.min(...prop.rooms.map((r) => r.rent)) : 0;
      const totalAvailableBeds = prop.rooms.reduce((sum, r) => sum + r.availableBeds, 0);

      return {
        ...prop,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews: totalRatings,
        minRent,
        totalAvailableBeds,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedProperties.length,
      properties: formattedProperties,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        rooms: true,
        amenities: true,
        rules: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            verificationRequest: {
              select: { status: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property listing not found' });
    }

    const totalRatings = property.reviews.length;
    const avgRating =
      totalRatings > 0
        ? property.reviews.reduce((sum, r) => sum + r.averageRating, 0) / totalRatings
        : 4.5;

    res.status(200).json({
      success: true,
      property: {
        ...property,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews: totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      city,
      area,
      pincode,
      latitude,
      longitude,
      propertyType,
      images,
      amenities,
      rules,
    } = req.body;

    const newProperty = await prisma.property.create({
      data: {
        ownerId: req.user.id,
        name,
        description,
        address,
        city,
        area,
        pincode,
        latitude: parseFloat(latitude || 18.5204),
        longitude: parseFloat(longitude || 73.8567),
        propertyType: propertyType || 'PG',
        images: {
          create: (images || []).map((imgUrl) => ({ url: imgUrl })),
        },
        amenities: amenities ? { create: amenities } : undefined,
        rules: rules ? { create: rules } : undefined,
      },
      include: {
        images: true,
        amenities: true,
        rules: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully. Awaiting verification.',
      property: newProperty,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const { name, description, address, city, area, pincode, propertyType, amenities, rules } = req.body;

    const updated = await prisma.property.update({
      where: { id },
      data: {
        name,
        description,
        address,
        city,
        area,
        pincode,
        propertyType,
        amenities: amenities
          ? {
              upsert: {
                create: amenities,
                update: amenities,
              },
            }
          : undefined,
        rules: rules
          ? {
              upsert: {
                create: rules,
                update: rules,
              },
            }
          : undefined,
      },
      include: {
        images: true,
        amenities: true,
        rules: true,
        rooms: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Property details updated successfully',
      property: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await prisma.property.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.getOwnerProperties = async (req, res, next) => {
  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: req.user.id },
      include: {
        images: true,
        rooms: {
          include: {
            applications: true,
          },
        },
        reviews: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    next(error);
  }
};
