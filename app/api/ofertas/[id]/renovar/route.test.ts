import { NextRequest } from 'next/server';
import { PUT } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Ofertas/[id]/renovar API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/ofertas/[id]/renovar', () => {
    it('debería retornar 200 y renovar una oferta', async () => {
      const oferta = {
        id: 1,
        producto_id: 1,
        tipo: 'porcentaje',
        valor: 10,
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        activa: true
      }
      const ofertaActualizada =
      {
        nueva_fecha_fin: new Date()
      };
      prismaMock.oferta.findUnique.mockResolvedValue(oferta);
      prismaMock.oferta.update.mockResolvedValue(ofertaActualizada as any);

      const req = new NextRequest('http://localhost/api/ofertas/1/renovar', {
        method: 'PUT',
        body: JSON.stringify(ofertaActualizada),
      });
      const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
    it('debería retornar 500 y un error', async () => {
      prismaMock.oferta.update.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/ofertas/1') as any;
      const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });
  });
});
