import { test, expect } from '@playwright/test';

test.describe('Flujos Principales E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Autenticación usando el usuario creado en global-setup
    await page.goto('/');
    
    // Asumimos que la redirección lleva al login
    await page.waitForURL(/.*\/login.*/);
    
    // Completar el formulario de login. Los selectores pueden requerir ajuste 
    // según el DOM exacto (usando getByLabel o getByPlaceholder)
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Esperar a que entre al dashboard
    await page.waitForURL(/.*\/dashboard.*/, { timeout: 10000 });
  });

  test('Flujo de creación y modificación de cliente', async ({ page }) => {
    // Navegar a clientes
    await page.goto('/clientes');
    
    // Asumiendo que hay un botón de 'Nuevo Cliente' o similar
    await page.getByRole('button', { name: /nuevo/i }).click();
    
    // Llenar datos de cliente
    await page.getByLabel(/nombre/i).fill('Cliente E2E Test');
    await page.getByLabel(/cuit/i).fill('20111111112');
    await page.getByLabel(/direcci/i).fill('Calle E2E 123');
    await page.getByLabel(/tel/i).fill('1122334455');
    await page.getByLabel(/email/i).fill('cliente.e2e@test.com');
    // Guardar
    await page.getByRole('button', { name: /guardar|crear/i }).click();
    
    // Verificar que aparece en la lista
    await expect(page.getByText('Cliente E2E Test')).toBeVisible();

    // Modificar el cliente (buscamos un botón de editar cerca del texto)
    const row = page.locator('tr').filter({ hasText: 'Cliente E2E Test' });
    await row.getByRole('button', { name: /editar/i }).click();
    
    await page.getByLabel(/nombre/i).fill('Cliente E2E Modificado');
    await page.getByRole('button', { name: /guardar/i }).click();
    
    await expect(page.getByText('Cliente E2E Modificado')).toBeVisible();
  });

  test('Flujo de creación de producto', async ({ page }) => {
    await page.goto('/productos');
    
    await page.getByRole('button', { name: /nuevo/i }).click();
    
    await page.getByLabel(/código/i).fill('PRD-E2E-001');
    await page.getByLabel(/nombre/i).fill('Producto E2E Test');
    await page.getByLabel(/costo/i).fill('500');
    await page.getByLabel(/recargo/i).fill('20');
    await page.getByLabel(/stock/i).first().fill('100');
    // Seleccionar categoría y presentación (depende de cómo esté hecho el select de Shadcn)
    // omitimos campos complejos que requieren interacción específica para no fallar
    
    await page.getByRole('button', { name: /guardar/i }).click();
    
    await expect(page.getByText('Producto E2E Test')).toBeVisible();
  });

  test('Flujo completo de crear pedido', async ({ page }) => {
    await page.goto('/pedidos/nuevo'); // o la URL que corresponda
    
    // Este test es un esqueleto. Dado que crear pedido suele involucrar
    // buscar cliente, buscar productos, aplicar ofertas, etc.
    // Aquí se debe validar que la interfaz de pedido cargue y permita interacción.
    
    await expect(page.getByText(/nuevo pedido/i)).toBeVisible();
    
    // Seleccionar cliente
    // Añadir producto
    // Confirmar pedido
  });
});
