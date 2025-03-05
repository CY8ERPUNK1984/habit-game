/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    // Посещаем главную страницу перед каждым тестом
    cy.visit('/');
  });

  it('displays the header and footer', () => {
    // Проверяем, что хедер отображается
    cy.get('header').should('be.visible');
    cy.contains('Геймификация жизни').should('be.visible');
    
    // Проверяем навигацию
    cy.contains('Привычки').should('be.visible');
    cy.contains('Задачи').should('be.visible');
    cy.contains('Достижения').should('be.visible');
    
    // Проверяем, что футер отображается
    cy.get('footer').should('be.visible');
    cy.contains('Все права защищены').should('be.visible');
  });

  it('allows clicking on the start button', () => {
    // Находим и кликаем по кнопке "Начать"
    cy.contains('Начать').click();
    
    // Здесь можно добавить проверку редиректа или другого ожидаемого поведения
    // например:
    // cy.url().should('include', '/dashboard');
  });

  it('has responsive design', () => {
    // Проверка отображения на мобильных устройствах
    cy.viewport('iphone-x');
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
    
    // Проверка отображения на планшетах
    cy.viewport('ipad-2');
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
    
    // Проверка отображения на десктопах
    cy.viewport(1920, 1080);
    cy.get('header').should('be.visible');
    cy.get('footer').should('be.visible');
  });
}); 