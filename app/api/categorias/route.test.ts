import { NextRequest } from 'next/server';
import { GET } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';
import { Categoria, EnumTipoCliente } from '@prisma/client';

// Mocking Prisma Client a través de nuestro mock global
jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Categorías API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categorias', () => {
    it('debería retornar 200 y una lista de categorias', async () => {
      // Configurar el mock
      const mockCategorias: Categoria[] = [
        { id: 1, descripcion: "Gaseosas, aguas, bebidas en general.", nombre: "Bebidas" }
      ];
      prismaMock.categoria.findMany.mockResolvedValue(mockCategorias);
      prismaMock.categoria.count.mockResolvedValue(1);

      const res = await GET();

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
  });

  describe('GET /api/categorias', () => {
    it('debería retornar 500 y un mensaje de error', async () => {

      prismaMock.categoria.findMany.mockRejectedValue(new Error('Error al obtener las categorías'));

      const res = await GET();

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe('Error al obtener las categorías');
    });
  });

});
