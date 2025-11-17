// frontend/app/components/task-list.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '@/lib/api';
import { toast } from 'sonner';
import TaskItem from '@/app/components/task-item';
import Input from '@/app/components/ui/input';
import Select from '@/app/components/ui/select';
import Button from '@/app/components/ui/button';
interface TaskListProps {
  onTaskUpdate: () => void;
}
export default function TaskList({ onTaskUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const fetchTasks = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const response = await tasksAPI.getTasks({
        page,
        status: statusFilter || undefined,
        search: searchTerm || undefined,
      });
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch tasks.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm]);
  useEffect(() => {
    fetchTasks(1); // Fetch first page on filter/search change
  }, [statusFilter, searchTerm, fetchTasks]);
  const handleTaskDeleted = () => {
    // Refresh the list, go back to page 1 if current page is empty
    fetchTasks(tasks.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page);
    onTaskUpdate();
  };
  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Input
          placeholder="Search tasks by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No tasks found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onTaskUpdate={onTaskUpdate} 
              onTaskDelete={handleTaskDeleted}
            />
          ))}
        </div>
      )}
      {/**** Pagination ****/}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => fetchTasks(pagination.page - 1)}
            disabled={pagination.page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            onClick={() => fetchTasks(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
