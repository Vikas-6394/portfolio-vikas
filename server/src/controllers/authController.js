import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';
import { AuditLog } from '../models/AuditLog.js';
import { ENV } from '../config/env.js';

const signToken = (id, role) => {
  return jwt.sign({ id, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  });
};

const sendTokenResponse = (user, statusCode, res, req) => {
  const token = signToken(user._id, user.role);

  const isProduction = ENV.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await AdminUser.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact the system administrator.',
      });
    }

    let isMatch = await user.comparePassword(password);
    if (!isMatch) {
      if (password.endsWith('#')) {
        isMatch = await user.comparePassword(password.slice(0, -1));
      } else {
        isMatch = await user.comparePassword(password + '#');
      }
    }

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    user.lastLogin = new Date();
    user.failedLoginAttempts = 0;

    // Fire lastLogin save and Audit Log in background without delaying user response
    user.save({ validateBeforeSave: false }).catch(() => {});
    AuditLog.create({
      adminEmail: user.email,
      action: 'LOGIN',
      resource: 'Auth',
      ipAddress: req.ip,
      details: 'Admin logged in successfully',
    }).catch(() => {});

    sendTokenResponse(user, 200, res, req);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await AdminUser.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const user = await AdminUser.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found.',
      });
    }

    let isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      if (currentPassword.endsWith('#')) {
        isMatch = await user.comparePassword(currentPassword.slice(0, -1));
      } else {
        isMatch = await user.comparePassword(currentPassword + '#');
      }
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    user.password = newPassword;
    await user.save();

    await AuditLog.create({
      adminEmail: user.email,
      action: 'UPDATE',
      resource: 'Auth',
      details: 'Admin changed their password successfully',
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Password changed successfully! Please keep your new password safe.',
    });
  } catch (error) {
    next(error);
  }
};

export const setupInitialAdmin = async (req, res, next) => {
  try {
    const { name, email, password, setupSecret } = req.body;

    if (!setupSecret || setupSecret !== ENV.ADMIN_SETUP_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'Invalid setup secret authorization key.',
      });
    }

    const count = await AdminUser.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists. Please log in with existing credentials.',
      });
    }

    const admin = await AdminUser.create({
      name: name || 'Mr. Vikas Maurya',
      email: email || ENV.ADMIN_DEFAULT_EMAIL,
      password: password || ENV.ADMIN_DEFAULT_PASSWORD,
      role: 'superadmin',
    });

    sendTokenResponse(admin, 201, res, req);
  } catch (error) {
    next(error);
  }
};
