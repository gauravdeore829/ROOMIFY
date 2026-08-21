const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addRoom = async (req, res, next) => {
  try {
    const { propertyId, roomType, totalBeds, occupiedBeds, rent, securityDeposit } = req.body;

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to add rooms to this property' });
    }

    const tBeds = parseInt(totalBeds, 10);
    const oBeds = parseInt(occupiedBeds || 0, 10);

    if (oBeds > tBeds) {
      return res.status(400).json({ success: false, message: 'Occupied beds cannot exceed total beds' });
    }

    if (oBeds < 0 || tBeds <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid bed count parameters' });
    }

    const availableBeds = tBeds - oBeds;
    const status = availableBeds === 0 ? 'FULL' : 'AVAILABLE';

    const room = await prisma.room.create({
      data: {
        propertyId,
        roomType: roomType || '2 Sharing',
        totalBeds: tBeds,
        occupiedBeds: oBeds,
        availableBeds,
        rent: parseFloat(rent),
        securityDeposit: parseFloat(securityDeposit || rent),
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roomType, totalBeds, occupiedBeds, rent, securityDeposit } = req.body;

    const room = await prisma.room.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this room' });
    }

    const tBeds = totalBeds !== undefined ? parseInt(totalBeds, 10) : room.totalBeds;
    const oBeds = occupiedBeds !== undefined ? parseInt(occupiedBeds, 10) : room.occupiedBeds;

    if (oBeds > tBeds) {
      return res.status(400).json({ success: false, message: 'Occupied beds cannot exceed total beds' });
    }

    if (oBeds < 0 || tBeds <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid bed counts' });
    }

    const availableBeds = tBeds - oBeds;
    const status = availableBeds === 0 ? 'FULL' : 'AVAILABLE';

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        roomType: roomType || room.roomType,
        totalBeds: tBeds,
        occupiedBeds: oBeds,
        availableBeds,
        rent: rent ? parseFloat(rent) : room.rent,
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : room.securityDeposit,
        status,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.property.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this room' });
    }

    await prisma.room.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
