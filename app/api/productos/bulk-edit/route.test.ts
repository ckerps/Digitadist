import { NextRequest } from 'next/server';
import { POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';
import { Producto, ProductoLog } from '@prisma/client';
import { date } from 'zod';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Productos/bulk-edit API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/productos/bulk-edit', () => {
    it('debería retornar 200 y un total de productos actualizados', async () => {
      const productos: Producto[] = [
        {
          id: 1,
          codigo: 'PRD001',
          nombre: 'Producto 1',
          presentacion: 'gramos',
          tam_pack: 1,
          costo: 100,
          porcentaje_recargo: 10,
          stock_actual: 50,
          activo: true,
          categoria_id: 1,
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
          stock_minimo: 10,
          imagen: null,
          fecha_vencimiento: new Date()
        },
        {
          id: 1,
          codigo: 'PRD001',
          nombre: 'Producto 1',
          presentacion: 'gramos',
          tam_pack: 1,
          costo: 100,
          porcentaje_recargo: 10,
          stock_actual: 50,
          activo: true,
          categoria_id: 1,
          fecha_creacion: new Date(),
          fecha_actualizacion: new Date(),
          stock_minimo: 10,
          imagen: null,
          fecha_vencimiento: new Date()
        }
      ];
      prismaMock.producto.findMany.mockResolvedValue(productos);
      prismaMock.$transaction.mockResolvedValue(productos);

      const req = new NextRequest('http://localhost/api/productos/bulk-edit') as any;
      const res = await POST(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.count).toBe(2);
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.producto.findMany.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/productos/bulk-edit') as any;
      const res = await POST(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });
});
