import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from '../controllers/taskController';
const router = Router();
router.use(authenticateToken);
router.get('/', getTasks);
router.get('/:id', getTask);
router.post(
  '/',
  [
    body('title').notEmpty().trim(),
    body('description').optional().trim(),
  ],
  createTask
);
router.patch(
  '/:id',
  [
    body('title').optional().notEmpty().trim(),
    body('description').optional().trim(),
  ],
  updateTask
);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);
export default router;
