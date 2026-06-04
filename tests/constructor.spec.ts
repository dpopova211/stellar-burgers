import { test, expect } from '@playwright/test';

const HAR_INGREDIENTS = './tests/hars/ingredients.har';
const HAR_AUTH = './tests/hars/auth.har';
const HAR_ORDER = './tests/hars/order.har';

test.describe('Страница конструктора', () => {
  test.beforeEach(async ({ page }) => {
    // Подставляем фейковые токены
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:3000',
      },
    ]);
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
    await page.context().clearCookies();
  });

  test('Добавление булки и соуса в конструктор', async ({ page }) => {
    // Перехватываем запрос ингредиентов через HAR
    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/api/ingredients' });

    // Добавляем булку
    await page.click('text=Краторная булка N-200i');
    // Ищем булку в конструкторе (верхнюю и нижнюю)
    const topBun = page.locator('.constructor-element_pos_top');
    const bottomBun = page.locator('.constructor-element_pos_bottom');
    await expect(topBun).toContainText('Краторная булка N-200i');
    await expect(bottomBun).toContainText('Краторная булка N-200i');

    // Добавляем соус
    await page.click('text=Соус с шипами Антарианского плоскоходца');
    const ingredients = page.locator('.constructor-element');
    await expect(ingredients).toContainText('Соус с шипами Антарианского плоскоходца');
  });

  test('Открытие модального окна ингредиента и проверка данных', async ({ page }) => {
    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/api/ingredients' });

    // Кликаем по булке
    await page.click('text=Краторная булка N-200i');
    const modal = page.locator('[class*="modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');
    await expect(modal).toContainText('420'); // калорийность
  });

  test('Закрытие модального окна по крестику и оверлею', async ({ page }) => {
    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/api/ingredients' });

    // Открываем модалку
    await page.click('text=Хрустящие минеральные кольца');
    // Закрываем крестиком
    await page.click('[class*="modal"] [class*="close"]');
    await expect(page.locator('[class*="modal"]')).not.toBeVisible();

    // Открываем снова, закрываем оверлеем
    await page.click('text=Соус традиционный галактический');
    await page.click('[class*="modal_overlay"]');
    await expect(page.locator('[class*="modal"]')).not.toBeVisible();
  });

  test('Создание заказа, проверка номера и очистка конструктора', async ({ page }) => {
    // Мокируем все нужные запросы
    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/api/ingredients' });
    await page.routeFromHAR(HAR_AUTH, { url: '**/api/auth/user' });
    await page.routeFromHAR(HAR_ORDER, { url: '**/api/orders' });

    // Собираем бургер
    await page.click('text=Краторная булка N-200i');
    await page.click('text=Соус с шипами Антарианского плоскоходца');
    await page.click('text=Хрустящие минеральные кольца');

    // Оформляем заказ
    await page.click('button:has-text("Оформить заказ")');
    const orderModal = page.locator('[class*="modal"]');
    await expect(orderModal).toBeVisible();
    await expect(orderModal).toContainText('12345');

    // Закрываем модальное окно
    await page.click('[class*="modal"] [class*="close"]');
    await expect(orderModal).not.toBeVisible();

    // Конструктор должен быть пуст
    await expect(page.locator('.constructor-element_pos_top')).not.toBeVisible();
    await expect(page.locator('.constructor-element')).toHaveCount(0);
  });
});
