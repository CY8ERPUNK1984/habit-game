'use client';

import { useParams } from 'next/navigation';
import EditHabit from '../../../../components/Habit/EditHabit';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Редактирование привычки | Habit Game',
  description: 'Редактирование существующей привычки',
};

export default function EditHabitPage() {
  const params = useParams();
  const habitId = params.habitId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <EditHabit habitId={habitId} />
    </div>
  );
} 