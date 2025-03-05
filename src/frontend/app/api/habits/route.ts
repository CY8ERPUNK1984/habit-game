import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../frontend/lib/jwt';

// Получение всех привычек пользователя
export async function GET(_request: NextRequest) {
  try {
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

    // Отправляем запрос к бэкенду для получения привычек
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/habits`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, { status: backendResponse.status });
    }

    const habits = await backendResponse.json();
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Ошибка при получении привычек:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Создание новой привычки
export async function POST(request: NextRequest) {
  try {
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

    // Получаем данные привычки из запроса
    const habitData = await request.json();

    // Отправляем запрос к бэкенду для создания привычки
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/habits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(habitData)
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(error, { status: backendResponse.status });
    }

    const habit = await backendResponse.json();
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании привычки:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 