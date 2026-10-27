import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';
import { isDbConnected } from '../config/db';
import { initialSeedUsers } from '../seed/seedData';

// Fallback in-memory users for offline/sandbox mode
interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

const memoryUsers: MemoryUser[] = initialSeedUsers.map((u, i) => ({
  id: `usr_demo_${i + 1}`,
  name: u.name,
  email: u.email.toLowerCase(),
  passwordHash: bcrypt.hashSync(u.password, 10),
  role: u.role,
}));

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'user',
      });
      await user.save();

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // Offline / In-memory fallback
      const exists = memoryUsers.find((u) => u.email === normalizedEmail);
      if (exists) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const newId = `usr_${Date.now()}`;
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: MemoryUser = {
        id: newId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
      };
      memoryUsers.push(newUser);

      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      });

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // In-memory fallback
      const user = memoryUsers.find((u) => u.email === normalizedEmail);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized.' });
      return;
    }

    if (isDbConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      const user = memoryUsers.find((u) => u.id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
