// frontend/app/components/task-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { tasksAPI } from '@/lib/api';
import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/button';
import Select from '@/app/components/ui/select';
interface TaskFormProps {
  task?: any; // Task data for editing
  onSuccess: () => void;
}
interface TaskFormData {
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate: string;
}
export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'PENDING',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  });
  const onSubmit = async (data: TaskFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate || undefined,
      };
      if (task) {
        await tasksAPI.updateTask(task.id, payload);
        toast.success('Task updated successfully!');
      } else {
        await tasksAPI.createTask(payload);
        toast.success('Task created successfully!');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${task ? 'update' : 'create'} task`);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          {...register('title', { required: 'Title is required' })}
          id="title"
          className="mt-1"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {task && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select {...register('status')} id="status" className="mt-1">
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Select>
        </div>
      )}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <Input
          {...register('dueDate')}
          id="dueDate"
          type="date"
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
}
