'use client';

import { useParams } from 'next/navigation';
import HabitDetail from '../../../components/Habit/HabitDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Детали привычки | Habit Game',
  description: 'Просмотр деталей привычки и истории выполнения',
};

export default function HabitDetailPage() {
  const params = useParams();
  const habitId = params.habitId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <HabitDetail habitId={habitId} />
    </div>
  );
} 