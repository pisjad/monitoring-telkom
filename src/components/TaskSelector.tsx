'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tasks = [
  { slug: 'explore', name: 'Explore' },
  { slug: 'evaluate-purchase', name: 'Evaluate & Purchase' },
  { slug: 'activate', name: 'Activate' },
  { slug: 'use', name: 'Use' },
  { slug: 'pay', name: 'Pay' },
  { slug: 'get-support', name: 'Get Support' },
  { slug: 'terminate', name: 'Terminate' }
];

export const TaskSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract current task from pathname
  const currentTask = pathname.split('/').pop() || 'explore';
  
  const handleTaskChange = (newTask: string) => {
    router.push(`/cx/${newTask}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Task:</span>
      <Select value={currentTask} onValueChange={handleTaskChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {tasks.map((task) => (
            <SelectItem key={task.slug} value={task.slug}>
              {task.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 