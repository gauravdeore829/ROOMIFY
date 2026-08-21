const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.reportProperty = async (req, res, next) => {
  try {
    const { propertyId, reason, description } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const report = await prisma.report.create({
      data: {
        propertyId,
        userId: req.user.id,
        reason: reason || 'Inaccurate information',
        description: description || '',
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted to platform moderators',
      report,
    });
  } catch (error) {
    next(error);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        property: {
          select: { id: true, name: true, city: true, ownerId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

exports.resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await prisma.report.update({
      where: { id },
      data: { status: 'RESOLVED' },
    });

    res.status(200).json({
      success: true,
      message: 'Report marked as resolved',
      report: updated,
    });
  } catch (error) {
    next(error);
  }
};
