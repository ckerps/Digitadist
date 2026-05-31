import { test, expect } from '@playwright/test';

test.describe.serial('Flujos Principales E2E', () => {
  const login = async (page: any) => {
    await page.goto('/');
    await page.waitForURL(/.*\/login.*/);
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await expect(page.getByText(/bienvenido/i)).toBeVisible();
  };

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Flujo de creación y modificación de cliente', async ({ page }) => {
    const suffix = `${Date.now()}`;
    const clientName = `Cliente E2E ${suffix}`;
    const clientEmail = `cliente.e2e.${suffix}@test.com`;

    await page.goto('/clientes');
    await page.getByRole('button', { name: /nuevo cliente/i }).click();

    await page.getByLabel(/nombre/i).fill(clientName);
    await page.getByLabel(/cuit/i).fill(Math.random().toString().slice(2, 13));
    await page.getByLabel(/dirección/i).fill('Calle E2E 123');
    await page.getByLabel(/teléfono/i).fill('1122334455');
    await page.getByLabel(/email/i).fill(clientEmail);

    await page.getByRole('button', { name: /guardar/i }).click();

    const createdRow = page.locator('tbody tr', { hasText: clientName }).first();
    await expect(createdRow).toBeVisible();

    await createdRow.click();
    await page.waitForURL(/\/clientes\/[0-9]+$/);
    await expect(page.getByRole('heading', { name: clientName })).toBeVisible();

    await page.getByRole('button', { name: /editar/i }).click();
    await page.getByLabel(/nombre/i).fill(`${clientName} Modificado`);
    await page.getByRole('button', { name: /guardar cambios/i }).click();

    await expect(await page.getByRole('heading', { name: `${clientName} Modificado` })).toBeVisible();
  });

  test('Flujo de creación de producto', async ({ page }) => {
    const suffix = `${Date.now()}`;
    const productCode = `PRD-E2E-${suffix}`;
    const productName = `E2E ${suffix}`;

    await page.goto('/productos');
    await page.getByRole('button', { name: /nuevo producto/i }).click();

    await page.getByLabel(/código/i).fill(productCode);
    await page.getByLabel(/nombre \*/i).fill(productName);
    await page.getByLabel(/tamaño de pack/i).fill('12');
    await page.getByLabel(/costo \*/i).fill('500');
    await page.getByLabel(/% recargo \*/i).fill('20');
    await page.getByLabel(/stock actual \*/i).fill('100');
    await page.getByLabel(/stock mínimo/i).fill('10');

    await page.getByRole('button', { name: /crear producto/i }).click();

    await expect(page.getByText("correctamente")).toBeVisible({ timeout: 10000 });
  });

  test('Flujo completo de crear pedido', async ({ page }) => {
    const suffix = `${Date.now()}`;
    const clientName = `Cliente ${suffix}`;
    const clientEmail = `pedido.cliente.${suffix}@test.com`;
    const productCode = `PRD${suffix}`;
    const productName = `Pedido ${suffix}`;

    // Crear cliente necesario para el pedido
    await page.goto('/clientes');
    await page.getByRole('button', { name: /nuevo cliente/i }).click();
    await page.getByLabel(/nombre/i).fill(clientName);
    await page.getByLabel(/email/i).fill(clientEmail);
    await page.getByLabel(/teléfono/i).fill('1144455566');
    await page.getByLabel(/dirección/i).fill('Av. Pedido 456');
    await page.getByRole('button', { name: /guardar/i }).click();
    await expect(page.locator('tbody tr', { hasText: clientName })).toBeVisible();

    // Crear producto necesario para el pedido
    await page.goto('/productos');
    await page.getByRole('button', { name: /nuevo producto/i }).click();
    await page.getByLabel(/código/i).fill(productCode);
    await page.getByLabel(/nombre \*/i).fill(productName);
    await page.getByLabel(/tamaño de pack/i).fill('6');
    await page.getByLabel(/costo \*/i).fill('250');
    await page.getByLabel(/% recargo \*/i).fill('15');
    await page.getByLabel(/stock actual \*/i).fill('50');
    await page.getByRole('button', { name: /crear producto/i }).click();
    await expect(page.getByText("correctamente")).toBeVisible({ timeout: 10000 });

    // Crear pedido usando el cliente y producto creados
    await page.goto('/pedidos/nuevo');
    await page.waitForURL(/\/pedidos\/nuevo$/);
    await expect(page.getByRole('heading', { name: "Nuevo Pedido" })).toBeVisible();

    await page.getByPlaceholder('Seleccionar cliente').fill(clientName);
    await page.getByText(clientName).click();

    await page.getByLabel(/dirección de entrega/i).fill('Calle 789');

    await page.getByPlaceholder('Escribi un nombre').fill(productName);
    await page.getByText(new RegExp(productName)).click();

    const selectedProductRow = page.locator('table tbody tr', { hasText: productName }).first();
    await expect(selectedProductRow).toBeVisible();
    await expect(page.locator('table tbody tr', { hasText: productName })).toBeVisible();
    
    await page.getByRole('button', { name: /crear pedido/i }).click();

    await page.waitForURL(/\/pedidos$/);

    await expect(await page.getByRole('heading', { name: `Pedidos` })).toBeVisible();
  });
});
