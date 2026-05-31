import { NextRequest } from 'next/server';
import { GET } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';
import { ProductoLog } from '@prisma/client';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Productos/[id]/logs API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/productos/[id]/logs', () => {
    it('debería retornar 200 y una lista de logs', async () => {
      const logs: ProductoLog[] = [];
      prismaMock.productoLog.findMany.mockResolvedValue(logs);

      const req = new NextRequest('http://localhost/api/productos/1/logs') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.productoLog.findMany.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/productos/1/logs') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });
  });
});
