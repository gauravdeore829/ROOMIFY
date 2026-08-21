const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createApplication = async (req, res, next) => {
  try {
    const { roomId, message } = req.body;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { property: { select: { name: true, ownerId: true } } },
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Selected room not found' });
    }

    if (room.availableBeds <= 0 || room.status === 'FULL') {
      return res.status(400).json({ success: false, message: 'Sorry, this room is currently full.' });
    }

    const existingApp = await prisma.application.findFirst({
      where: {
        userId: req.user.id,
        roomId: roomId,
        status: 'PENDING',
      },
    });

    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You already have a pending application for this room.' });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        roomId: roomId,
        message: message || '',
        status: 'PENDING',
      },
      include: {
        room: {
          include: { property: true },
        },
      },
    });

    // Send Notification to Owner
    await prisma.notification.create({
      data: {
        userId: room.property.ownerId,
        message: `New application received from ${req.user.name} for ${room.property.name} (${room.roomType}).`,
        type: 'APPLICATION',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    let applications;

    if (req.user.role === 'OWNER') {
      applications = await prisma.application.findMany({
        where: {
          room: {
            property: {
              ownerId: req.user.id,
            },
          },
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          room: {
            include: { property: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (req.user.role === 'ADMIN') {
      applications = await prisma.application.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          room: {
            include: { property: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      applications = await prisma.application.findMany({
        where: { userId: req.user.id },
        include: {
          room: {
            include: { property: { include: { images: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED, REJECTED, CANCELLED

    if (!['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        room: {
          include: { property: true },
        },
        user: true,
      },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Role checks
    if (status === 'CANCELLED') {
      if (application.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this application' });
      }
    } else {
      if (application.room.property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Not authorized to manage this application' });
      }
    }

    // Process room occupancy if ACCEPTED
    if (status === 'ACCEPTED' && application.status !== 'ACCEPTED') {
      const currentRoom = application.room;
      if (currentRoom.availableBeds <= 0) {
        return res.status(400).json({ success: false, message: 'Cannot accept: Room has no available beds left.' });
      }

      const newOccupied = currentRoom.occupiedBeds + 1;
      const newAvailable = currentRoom.totalBeds - newOccupied;
      const newStatus = newAvailable === 0 ? 'FULL' : 'AVAILABLE';

      await prisma.room.update({
        where: { id: currentRoom.id },
        data: {
          occupiedBeds: newOccupied,
          availableBeds: newAvailable,
          status: newStatus,
        },
      });
    }

    const updatedApp = await prisma.application.update({
      where: { id },
      data: { status },
    });

    // Notify applicant user
    await prisma.notification.create({
      data: {
        userId: application.userId,
        message: `Your application for ${application.room.property.name} has been ${status.toLowerCase()}.`,
        type: 'APPLICATION',
      },
    });

    res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      application: updatedApp,
    });
  } catch (error) {
    next(error);
  }
};
