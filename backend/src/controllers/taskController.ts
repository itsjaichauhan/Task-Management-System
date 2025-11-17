import { Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
const prisma = new PrismaClient();
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    if (search) {
      where.title = {
        contains: search as string,
        mode: 'insensitive' as any,
      };
    }
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.task.count({ where }),
    ]);
    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    throw new AppError('Failed to fetch tasks', 500);
  }
};
export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const task = await prisma.task.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    res.json(task);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch task', 500);
  }
};
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }
    const userId = req.user!.userId;
    const { title, description, dueDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create task', 500);
  }
};
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }
    const { id } = req.params;
    const userId = req.user!.userId;
    const { title, description, status, dueDate } = req.body;
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update task', 500);
  }
};
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    await prisma.task.delete({
      where: { id },
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to delete task', 500);
  }
};
export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to toggle task status', 500);
  }
};
