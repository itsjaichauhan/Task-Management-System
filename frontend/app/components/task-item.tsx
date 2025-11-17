// frontend/app/components/task-item.tsx
'use client';
import { useState } from 'react';
import { Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { tasksAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Button from '@/app/components/ui/button';
import Modal from '@/app/components/ui/modal';
import TaskForm from '@/app/components/task-form';
import { cn } from '@/lib/utils';
interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
  };
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
}
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};
export default function TaskItem({ task, onTaskUpdate, onTaskDelete }: TaskItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await tasksAPI.deleteTask(task.id);
        toast.success('Task deleted successfully!');
        onTaskDelete();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete task');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      await tasksAPI.toggleTaskStatus(task.id);
      toast.success('Task status updated!');
      onTaskUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to toggle status');
    } finally {
      setIsToggling(false);
    }
  };
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onTaskUpdate();
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 pr-2">{task.title}</h3>
        <span className={cn("px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap", statusColors[task.status])}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-gray-600 mb-4 text-sm line-clamp-3">{task.description || 'No description provided.'}</p>
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        {task.dueDate && (
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>Created: {formatDate(task.createdAt)}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button 
          variant="secondary" 
          onClick={handleToggleStatus}
          disabled={isToggling || isDeleting}
        >
          {isToggling 
            ? '...'
            : task.status === 'COMPLETED' ? 'Mark Pending' : 'Mark Complete'
          }
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsEditModalOpen(true)}
          disabled={isToggling || isDeleting}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="danger" 
          size="icon" 
          onClick={handleDelete}
          disabled={isDeleting || isToggling}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Task: ${task.title}`}
      >
        <TaskForm task={task} onSuccess={handleEditSuccess} />
      </Modal>
    </div>
  );
}
