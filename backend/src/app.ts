import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});
// Error handling
app.use(errorHandler);
export default app;
