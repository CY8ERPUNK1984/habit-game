import { Metadata } from 'next';
import CreateHabit from '../../../components/Habit/CreateHabit';

export const metadata: Metadata = {
  title: 'Создание привычки | Habit Game',
  description: 'Создайте новую привычку для отслеживания и улучшения вашей жизни',
};

export default function CreateHabitPage() {
  return (
    <div className="container mx-auto px-4">
      <CreateHabit />
    </div>
  );
} 