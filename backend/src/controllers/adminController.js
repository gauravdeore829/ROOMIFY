const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalProperties,
      verifiedProperties,
      pendingProperties,
      totalRooms,
      totalApplications,
      totalReports,
      pendingVerifications,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'OWNER' } }),
      prisma.property.count(),
      prisma.property.count({ where: { isVerified: true } }),
      prisma.property.count({ where: { isVerified: false } }),
      prisma.room.count(),
      prisma.application.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.ownerVerification.count({ where: { status: 'PENDING' } }),
    ]);

    // Data formatted for Recharts diagrams
    const categoryDistribution = [
      { name: 'Regular Users', value: totalUsers },
      { name: 'Property Owners', value: totalOwners },
      { name: 'Verified Properties', value: verifiedProperties },
      { name: 'Pending Listings', value: pendingProperties },
    ];

    const monthlyTrends = [
      { month: 'Jan', applications: 12, properties: 4, users: 25 },
      { month: 'Feb', applications: 19, properties: 7, users: 38 },
      { month: 'Mar', applications: 32, properties: 12, users: 60 },
      { month: 'Apr', applications: 45, properties: 15, users: 89 },
      { month: 'May', applications: 58, properties: 22, users: 110 },
      { month: 'Jun', applications: 78, properties: totalProperties, users: totalUsers },
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalProperties,
        verifiedProperties,
        pendingProperties,
        totalRooms,
        totalApplications,
        totalReports,
        pendingVerifications,
      },
      charts: {
        categoryDistribution,
        monthlyTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isSuspended: true,
        createdAt: true,
        profile: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedUsers = users.map(user => {
      if (user.profile) {
        user.profile.facilities = typeof user.profile.facilities === 'string'
          ? (user.profile.facilities ? user.profile.facilities.split(',') : [])
          : (user.profile.facilities || []);
      }
      return user;
    });

    res.status(200).json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Admin users cannot be suspended' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isSuspended: !user.isSuspended },
      select: { id: true, name: true, email: true, isSuspended: true },
    });

    res.status(200).json({
      success: true,
      message: `User ${updatedUser.name} is now ${updatedUser.isSuspended ? 'Suspended' : 'Active'}`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyProperty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isVerified, status } = req.body; // isVerified: true/false, status: VERIFIED/REJECTED

    const property = await prisma.property.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
        isVerified: isVerified !== undefined ? isVerified : true,
        status: status || 'VERIFIED',
      },
    });

    // Send notification to property owner
    await prisma.notification.create({
      data: {
        userId: property.ownerId,
        message: `Your property listing "${property.name}" has been ${isVerified ? 'verified & approved' : 'rejected'}.`,
        type: 'SYSTEM',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Property verification status updated',
      property: updated,
    });
  } catch (error) {
    next(error);
  }
};
