const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatUserResponse = (user) => {
  if (user && user.profile) {
    user.profile.facilities = typeof user.profile.facilities === 'string'
      ? (user.profile.facilities ? user.profile.facilities.split(',') : [])
      : (user.profile.facilities || []);
  }
  return user;
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'roomease_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserRole = ['USER', 'OWNER'].includes(role) ? role : 'USER';

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: newUserRole,
        phone: phone || null,
        profile: newUserRole === 'USER' ? { create: {} } : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
        verificationRequest: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      token,
      user: formatUserResponse(userWithoutPassword),
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        verificationRequest: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { passwordHash, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      user: formatUserResponse(userWithoutPassword),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { collegeOrOffice, preferredLocation, budget, roomType, facilities, name, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        profile: {
          upsert: {
            create: {
              collegeOrOffice,
              preferredLocation,
              budget: budget ? parseFloat(budget) : null,
              roomType,
              facilities: Array.isArray(facilities) ? facilities.join(',') : '',
            },
            update: {
              collegeOrOffice,
              preferredLocation,
              budget: budget ? parseFloat(budget) : undefined,
              roomType,
              facilities: Array.isArray(facilities) ? facilities.join(',') : undefined,
            },
          },
        },
      },
      include: { profile: true },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};
