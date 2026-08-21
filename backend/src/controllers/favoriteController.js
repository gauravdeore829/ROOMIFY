const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    const existingFav = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId,
        },
      },
    });

    if (existingFav) {
      await prisma.favorite.delete({
        where: { id: existingFav.id },
      });
      return res.status(200).json({ success: true, isFavorite: false, message: 'Removed from favorites' });
    } else {
      await prisma.favorite.create({
        data: {
          userId: req.user.id,
          propertyId,
        },
      });
      return res.status(201).json({ success: true, isFavorite: true, message: 'Added to saved favorites' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        property: {
          include: {
            images: true,
            rooms: true,
            amenities: true,
            reviews: { select: { averageRating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = favorites.map((fav) => {
      const p = fav.property;
      const totalRatings = p.reviews.length;
      const avgRating =
        totalRatings > 0
          ? p.reviews.reduce((sum, r) => sum + r.averageRating, 0) / totalRatings
          : 4.5;
      const minRent = p.rooms.length > 0 ? Math.min(...p.rooms.map((r) => r.rent)) : 0;

      return {
        ...p,
        avgRating: Number(avgRating.toFixed(1)),
        minRent,
      };
    });

    res.status(200).json({
      success: true,
      favorites: formatted,
    });
  } catch (error) {
    next(error);
  }
};
