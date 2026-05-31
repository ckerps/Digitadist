import { GET, POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Productos API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/productos', () => {
    it('debería retornar 200 y una lista de productos', async () => {
      const mockProductos = [
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
        },
      ];
      prismaMock.producto.findMany.mockResolvedValue(mockProductos as any);
      prismaMock.producto.count.mockResolvedValue(1);

      const req = new Request('http://localhost/api/productos') as any;
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.producto.findMany.mockRejectedValue(new Error('Error de base de datos'));

      const req = new Request('http://localhost/api/productos') as any;
      const res = await GET(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });

  describe('POST /api/productos', () => {
    it('debería retornar 201 y crear un producto', async () => {
      const nuevoProducto = {
        codigo: 'PRD002',
        nombre: 'Producto 2',
        presentacion: 'litros',
        tam_pack: 1,
        costo: 100,
        porcentaje_recargo: 10,
        stock_actual: 50,
        activo: true,
        categoria_id: 1
      };

      prismaMock.producto.findFirst.mockResolvedValue(null);
      prismaMock.producto.create.mockResolvedValue({ id: 2, ...nuevoProducto } as any);

      const req = new Request('http://localhost/api/productos', {
        method: 'POST',
        body: JSON.stringify(nuevoProducto),
      });

      const res = await POST(req);

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.codigo).toBe('PRD002');
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      const nuevoProducto = { codigo: 'PRD003' };

      const req = new Request('http://localhost/api/productos', {
        method: 'POST',
        body: JSON.stringify(nuevoProducto),
      });

      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.type).toBe('ValidationError');
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.producto.create.mockRejectedValue();

      const req = new Request('http://localhost/api/productos', {
        method: 'POST',
        body: JSON.stringify({
          codigo: 'PRD003',
          nombre: 'Producto 3',
          presentacion: 'litros',
          tam_pack: 1,
          costo: 100,
          porcentaje_recargo: 10,
          stock_actual: 50,
          activo: true,
          categoria_id: 1
        }),
      });

      const res = await POST(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });
});
