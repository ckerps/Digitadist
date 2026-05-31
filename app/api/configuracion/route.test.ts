import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';
import { Configuracion, EnumTipoCliente } from '@prisma/client';

// Mocking Prisma Client a través de nuestro mock global
jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Configuraciones API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/configuracion', () => {
    it('debería retornar 200 y una lista de configuraciones', async () => {
      // Configurar el mock
      const mockConfig: Configuracion[] = [
        { id: 1, valor: "10", tipo_valor: "int", nombre: "Alerta stock minimo" }
      ];
      prismaMock.configuracion.findMany.mockResolvedValue(mockConfig);

      const res = await GET();

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
  });

  describe('POST /api/configuracion', () => {
    it('debería retornar 201 y crear una configuracion', async () => {
      const nuevaConfiguracion = [{
        nombre: "Nueva configuracion",
        descripcion: "Nueva config",
        valor: "valor",
        tipo_valor: "string"
      }];
      prismaMock.configuracion.findUnique.mockResolvedValue(null);
      prismaMock.$transaction.mockResolvedValue(nuevaConfiguracion);

      const req = new NextRequest('http://localhost/api/configuracion', {
        method: 'POST',
        body: JSON.stringify(nuevaConfiguracion),
      });

      const res = await POST(req);

      expect(res.status).toBe(201);
      const json = await res.json();
    });

    it('debería retornar 409 si la configuracion ya existe', async () => {
      const nuevaConfiguracion = {
        id: 1,
        nombre: 'Duplicado',
        descripcion: 'duplicado',
        valor: 'valor',
        tipo_valor: 'string'
      };
      // Simular que ya existe
      prismaMock.configuracion.findUnique.mockResolvedValue({ nuevaConfiguracion });

      const req = new NextRequest('http://localhost/api/configuracion', {
        method: 'POST',
        body: JSON.stringify(nuevaConfiguracion),
      });

      const res = await POST(req);

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error);
    });

    it('debería retornar 500 si hay un error inesperado', async () => {
      prismaMock.configuracion.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/configuracion', {
        method: 'POST',
        body: JSON.stringify({
          nombre: 'Configuracion Error',
          valor: 'valor',
          tipo_valor: 'string'
        }),
      });

      const res = await POST(req);

      expect(res.status).toBe(500);
    });
  });
});
