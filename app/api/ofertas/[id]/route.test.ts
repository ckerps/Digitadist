import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Ofertas/[id] API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/ofertas/{id}', () => {
    it('debería retornar 200 y una oferta', async () => {
      const mockOferta =
      {
        id: 1,
        producto_id: 1,
        tipo: 'porcentaje',
        valor: 10,
        fecha_inicio: new Date(),
        fecha_fin: new Date(Date.now() + 86400000),
        activa: true
      };
      prismaMock.oferta.findUnique.mockResolvedValue(mockOferta as any);

      const req = new NextRequest('http://localhost/api/ofertas/1') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
    it('debería retornar 500 y un error', async () => {
      prismaMock.oferta.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/ofertas/1') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });
  });

  describe('PUT /api/ofertas/{id}', () => {
    it('debería retornar 200 y actualizar una oferta', async () => {
      const ofertaActualizada = {
        valor: 20,
        fecha_fin: new Date(Date.now() + 86400000),
      };

      prismaMock.oferta.update.mockResolvedValue({ id: 1, ...ofertaActualizada } as any);

      const req = new NextRequest('http://localhost/api/ofertas/1', {
        method: 'PUT',
        body: JSON.stringify(ofertaActualizada),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.valor).toBe(20);
    });

    it('debería retornar 500 si hay un error inesperado', async () => {
      const ofertaActualizada = { producto_id: 1, tipo: 'porcentaje', valor: 10, fecha_inicio: new Date(), fecha_fin: new Date(Date.now() + 86400000), activa: true };
      prismaMock.oferta.update.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/ofertas/1', {
        method: 'PUT',
        body: JSON.stringify(ofertaActualizada),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });
  });
});
