import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateTokens, storeRefreshToken, verifyRefreshToken, revokeRefreshToken } from '../utils/tokens';
import { AppError } from '../middleware/errorHandler';
const prisma = new PrismaClient();
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }
    const { email, password, name } = req.body;
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    await storeRefreshToken(user.id, refreshToken);
    res.status(201).json({
      message: 'User created successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Registration failed', 500);
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }
    const { email, password } = req.body;
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, user.email);
    await storeRefreshToken(user.id, refreshToken);
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Login failed', 500);
  }
};
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }
    const decoded = await verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId, decoded.email);
    // Revoke old refresh token and store new one
    await revokeRefreshToken(refreshToken);
    await storeRefreshToken(decoded.userId, newRefreshToken);
    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    res.json({ message: 'Logout successful' });
  } catch (error) {
    throw new AppError('Logout failed', 500);
  }
};
