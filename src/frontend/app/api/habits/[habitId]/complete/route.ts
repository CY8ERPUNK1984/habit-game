import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../../../frontend/lib/jwt';

// Отметка привычки как выполненной
export async function POST(
  request: NextRequest,
  { params }: { params: { habitId: string } }
) {
  try {
    const { habitId } = params;
    
    // Получаем токен из куки
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    // Проверяем токен
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: 'Неверный токен' },
        { status: 401 }
      );
    }

    // Отправляем запрос к бэкенду для отметки привычки
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/habits/${habitId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, { status: backendResponse.status });
    }

    const habit = await backendResponse.json();
    return NextResponse.json(habit);
  } catch (error) {
    console.error('Ошибка при отметке привычки:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 