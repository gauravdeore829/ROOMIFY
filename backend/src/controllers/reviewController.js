const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addReview = async (req, res, next) => {
  try {
    const {
      propertyId,
      cleanliness,
      location,
      safety,
      ownerBehavior,
      facilities,
      valueForMoney,
      comment,
    } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const ratings = [
      parseInt(cleanliness || 5),
      parseInt(location || 5),
      parseInt(safety || 5),
      parseInt(ownerBehavior || 5),
      parseInt(facilities || 5),
      parseInt(valueForMoney || 5),
    ];

    const averageRating = Number(
      (ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(2)
    );

    const review = await prisma.review.create({
      data: {
        propertyId,
        userId: req.user.id,
        cleanliness: ratings[0],
        location: ratings[1],
        safety: ratings[2],
        ownerBehavior: ratings[3],
        facilities: ratings[4],
        valueForMoney: ratings[5],
        averageRating,
        comment: comment || '',
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPropertyReviews = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { propertyId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
