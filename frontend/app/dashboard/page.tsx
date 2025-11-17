// frontend/app/dashboard/page.tsx
'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskList from '@/app/components/task-list';
import TaskForm from '@/app/components/task-form';
import Modal from '@/app/components/ui/modal';
import Button from '@/app/components/ui/button';
export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(0);
  const handleTaskCreated = () => {
    setIsModalOpen(false);
    setRefreshTasks(prev => prev + 1); // Trigger task list refresh
  };
  const handleTaskUpdate = () => {
    setRefreshTasks(prev => prev + 1); // Trigger task list refresh
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Button>
      </div>
      <TaskList key={refreshTasks} onTaskUpdate={handleTaskUpdate} />
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm onSuccess={handleTaskCreated} />
      </Modal>
    </div>
  );
}
