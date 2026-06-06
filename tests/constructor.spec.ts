import { test, expect } from '@playwright/test';

const HAR_INGREDIENTS = './tests/hars/ingredients.har';
const HAR_AUTH = './tests/hars/auth.har';
const HAR_ORDER = './tests/hars/order.har';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    // Устанавливаем моковые токены
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:3000',
      },
    ]);

    // Перехватываем основные запросы до загрузки страницы
    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/api/ingredients' });
    await page.routeFromHAR(HAR_AUTH, { url: '**/api/auth/user' });

    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('refreshToken');
    });
    await page.context().clearCookies();
  });

  test('Добавление булки и начинки в конструктор', async ({ page }) => {
    await page.click('li:has-text("Краторная булка N-200i") >> button:has-text("Добавить")');
    await expect(page.locator('text=Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.locator('text=Краторная булка N-200i (низ)')).toBeVisible();

    await page.click('li:has-text("Соус с шипами Антарианского плоскоходца") >> button:has-text("Добавить")');
    await expect(
      page.locator('span[class*="constructor-element__text"]:has-text("Соус с шипами Антарианского плоскоходца")')
    ).toBeVisible();
  });

  test('Открытие модального окна ингредиента и проверка данных', async ({ page }) => {
    await page.click('a:has-text("Краторная булка N-200i")');
    const modal = page.locator('#modals div:has-text("Детали ингредиента")').first();
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Краторная булка N-200i');
    await expect(modal).toContainText('420');
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    await page.click('a:has-text("Хрустящие минеральные кольца")');
    await page.click('#modals button');
    await expect(page.locator('#modals div:has-text("Детали ингредиента")').first()).not.toBeVisible();
  });

  test('Создание заказа, проверка номера и очистка конструктора', async ({ page }) => {
    // Добавляем только перехват заказа
    await page.routeFromHAR(HAR_ORDER, { url: '**/api/orders' });

    // Добавляем ингредиенты
    await page.click('li:has-text("Краторная булка N-200i") >> button:has-text("Добавить")');
    await page.click('li:has-text("Соус с шипами Антарианского плоскоходца") >> button:has-text("Добавить")');
    await page.click('li:has-text("Хрустящие минеральные кольца") >> button:has-text("Добавить")');

    // Ждём кнопку и кликаем
    const orderButton = page.locator('button:has-text("Оформить заказ")');
    await expect(orderButton).toBeVisible({ timeout: 5000 });
    await expect(orderButton).not.toBeDisabled();

    await orderButton.click();

    // Делаем скриншот для отладки (если нужно, можно убрать после успешного прогона)
    await page.screenshot({ path: 'debug-order.png' });

    // Ждём появления номера заказа
    await expect(page.locator('text=12345').first()).toBeVisible({ timeout: 15000 });

    // Закрываем модалку
    await page.locator('#modals button').first().click();
    await expect(page.locator('text=12345')).not.toBeVisible();

    // Проверяем, что конструктор очищен
    await expect(page.locator('text=Краторная булка N-200i (верх)')).not.toBeVisible();
    await expect(page.locator('text=Краторная булка N-200i (низ)')).not.toBeVisible();
    await expect(page.locator('span[class*="constructor-element__text"]:has-text("Соус с шипами Антарианского плоскоходца")')).not.toBeVisible();
    await expect(page.locator('span[class*="constructor-element__text"]:has-text("Хрустящие минеральные кольца")')).not.toBeVisible();
  });
});
