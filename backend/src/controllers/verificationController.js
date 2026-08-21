const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.submitVerification = async (req, res, next) => {
  try {
    const { phone, idProofRef, propertyDocRef, address } = req.body;

    const verification = await prisma.ownerVerification.upsert({
      where: { ownerId: req.user.id },
      create: {
        ownerId: req.user.id,
        phone,
        idProofRef,
        propertyDocRef,
        address,
        status: 'PENDING',
      },
      update: {
        phone,
        idProofRef,
        propertyDocRef,
        address,
        status: 'PENDING',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Owner verification document submitted successfully',
      verification,
    });
  } catch (error) {
    next(error);
  }
};

exports.getVerifications = async (req, res, next) => {
  try {
    const verifications = await prisma.ownerVerification.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      verifications,
    });
  } catch (error) {
    next(error);
  }
};

exports.handleVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // VERIFIED, REJECTED

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be VERIFIED or REJECTED' });
    }

    const verification = await prisma.ownerVerification.update({
      where: { id },
      data: { status },
      include: { owner: true },
    });

    await prisma.notification.create({
      data: {
        userId: verification.ownerId,
        message: `Your owner identity verification has been ${status.toLowerCase()}.`,
        type: 'SYSTEM',
      },
    });

    res.status(200).json({
      success: true,
      message: `Owner status updated to ${status}`,
      verification,
    });
  } catch (error) {
    next(error);
  }
};
