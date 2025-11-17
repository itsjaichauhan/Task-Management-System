import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const generateTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWTACCESSSECRET!,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId, email },
    process.env.JWTREFRESHSECRET!,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};
export const storeRefreshToken = async (userId: string, token: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};
export const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWTREFRESHSECRET!) as { userId: string; email: string };
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: { gt: new Date() }
      }
    });
    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
export const revokeRefreshToken = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token }
  });
};
