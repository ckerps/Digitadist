import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Productos/[id] API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/productos/[id]', () => {
    it('debería retornar 200 y un producto', async () => {
      const mockProductos =
      {
        id: 1,
        codigo: 'PRD001',
        nombre: 'Producto 1',
        presentacion: 'unidad',
        tam_pack: 1,
        costo: 100,
        porcentaje_recargo: 10,
        stock_actual: 50,
        activo: true,
        categoria_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      prismaMock.producto.findUnique.mockResolvedValue(mockProductos as any);

      const req = new NextRequest('http://localhost/api/productos') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.producto.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/productos') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });

  // describe('PUT /api/productos/[id]', () => {
  //   it('debería retornar 200 y un producto actualizado', async () => {
  //     const nuevoProducto = {
  //       nombre: 'Producto 2',
  //       tam_pack: 1,
  //       costo: 100,
  //       porcentaje_recargo: 10,
  //       stock_actual: 50,
  //       activo: true,
  //       categoria_id: 1
  //     };

  //     prismaMock.producto.findUnique.mockResolvedValue(nuevoProducto);
  //     prismaMock.producto.update.mockResolvedValue({ id: 2, ...nuevoProducto } as any);
  //     prismaMock.productoLog.create.mockResolvedValue(undefined as any);

  //     const req = new NextRequest('http://localhost/api/productos/1', {
  //       method: 'PUT',
  //       body: JSON.stringify(nuevoProducto),
  //     });

  //     const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

  //     expect(res.status).toBe(200);
  //     const json = await res.json();
  //     expect(json.nombre).toBe('Producto 2');
  //   });

  //   it('debería retornar 500 y un error', async () => {
  //     prismaMock.producto.update.mockRejectedValue();

  //     const req = new NextRequest('http://localhost/api/productos/1', {
  //       method: 'PUT',
  //       body: JSON.stringify({
  //         nombre: 'Producto 3',
  //         tam_pack: 1,
  //         costo: 100,
  //         porcentaje_recargo: 10,
  //         stock_actual: 50,
  //         activo: true,
  //         categoria_id: 1
  //       }),
  //     });

  //     const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

  //     expect(res.status).toBe(500);
  //     const json = await res.json();
  //     expect(json.error).toBeDefined();
  //   });
  // });

  describe('DELETE /api/productos/[id]', () => {
    it('debería retornar 200 y eliminar un producto', async () => {
      prismaMock.producto.delete.mockResolvedValue(undefined as any);

      const req = new NextRequest('http://localhost/api/productos/1', {
        method: 'DELETE',
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.producto.update.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/productos/1', {
        method: 'DELETE',
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });
});
