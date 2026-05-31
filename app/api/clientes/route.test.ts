import { NextRequest } from 'next/server';
import { GET, POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';
import { EnumTipoCliente } from '@prisma/client';

// Mocking Prisma Client a través de nuestro mock global
jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Clientes API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/clientes', () => {
    it('debería retornar 200 y una lista de clientes', async () => {
      // Configurar el mock
      const mockClientes = [
        { id: 1, nombre: 'Cliente 1', cuit: '20123456789', telefono: "", direccion: "", email: "", activo: true, tipo: EnumTipoCliente.persona },
      ];
      prismaMock.cliente.findMany.mockResolvedValue(mockClientes);
      prismaMock.cliente.count.mockResolvedValue(1); // Si el repo hace un count para paginación

      const req = new Request('http://localhost/api/clientes') as any;
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      // Ajusta según cómo devuelva los datos ClienteService.obtenerTodos
      // asumiendo que devuelve { data, total, page, totalPages } o similar
      expect(json).toBeDefined();
    });
  });

  describe('POST /api/clientes', () => {
    it('debería retornar 201 y crear un cliente', async () => {
      const nuevoCliente = {
        nombre: 'Nuevo Cliente',
        telefono: '1123456789',
        cuit: '20987654321',
        direccion: 'Calle Falsa 123',
        tipo: 'persona',
        email: 'test@test.com',
        activo: true
      };
      prismaMock.cliente.findUnique.mockResolvedValue(null); // No existe CUIT
      prismaMock.cliente.create.mockResolvedValue({ id: 2, ...nuevoCliente } as any);

      const req = new Request('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify(nuevoCliente),
      });

      const res = await POST(req);

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.nombre).toBe('Nuevo Cliente');
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      // El esquema de Zod requiere nombre, etc
      const nuevoCliente = { cuit: '20987654321' };

      const req = new Request('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify(nuevoCliente),
      });

      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.type).toBe('ValidationError');
    });

    it('debería retornar 409 si el CUIT ya existe', async () => {
      const nuevoCliente = {
        nombre: 'Duplicado',
        telefono: '1123456789',
        cuit: '20123456789',
        direccion: 'Calle Falsa 123',
        tipo: 'persona',
        email: 'test@test.com',
        activo: true
      };
      // Simular que ya existe
      prismaMock.cliente.findUnique.mockResolvedValue({ id: 1, ...nuevoCliente } as any);

      const req = new Request('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify(nuevoCliente),
      });

      const res = await POST(req);

      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toBe('Ya existe un cliente con ese CUIT');
    });

    it('debería retornar 500 si hay un error inesperado', async () => {
      prismaMock.cliente.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const req = new Request('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify({
          nombre: 'Cliente Error',
          telefono: '1123456789',
          cuit: '20111111111',
          direccion: 'Calle Falsa',
          tipo: 'persona',
          email: 'error@test.com',
          activo: true
        }),
      });

      const res = await POST(req);

      expect(res.status).toBe(500);
    });
  });
});
