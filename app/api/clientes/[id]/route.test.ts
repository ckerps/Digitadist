import { NextRequest } from 'next/server';
import { GET, PUT } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';
import { Cliente, Configuracion, EnumTipoCliente } from '@prisma/client';

// Mocking Prisma Client a través de nuestro mock global
jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Cliente/[ID] API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cliente/[id]', () => {
    it('debería retornar 200 y un cliente', async () => {
      // Configurar el mock
      const mockCliente: Cliente = {
        id: 1, nombre: "Cliente 1", telefono: "1123456789", cuit: "20123456789", direccion: "Calle Falsa 123", tipo: "persona", email: "[EMAIL_ADDRESS]", activo: true
      };
      prismaMock.cliente.findUnique.mockResolvedValue(mockCliente);
      const req = new NextRequest("http://localhost/api/cliente/1", {
        method: "GET",
      });

      const res = await GET(req, { params: Promise.resolve({ id: "1" }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });

    it('debería retornar 500 y un error', async () => {
      prismaMock.cliente.findUnique.mockRejectedValue(new Error("Error de base de datos"));
      const req = new NextRequest("http://localhost/api/cliente/1", {
        method: "GET",
      });

      const res = await GET(req, { params: Promise.resolve({ id: "1" }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });

    it('debería retornar 404 si el cliente no existe', async () => {
      prismaMock.cliente.findUnique.mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/cliente/1", {
        method: "GET",
      });

      const res = await GET(req, { params: Promise.resolve({ id: "1" }) });

      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error).toBe('Cliente no encontrado');
    });
  });

  describe('PUT /api/cliente/[id]', () => {
    it('debería retornar 200 y un cliente actualizado', async () => {
      const clienteActualizado = {
        id: 1,
        nombre: "Cliente Actualizado",
        cuit: "20123456789",
        direccion: "Calle Falsa 123",
      };
      prismaMock.cliente.findUnique.mockResolvedValue(clienteActualizado);
      prismaMock.cliente.update.mockResolvedValue(clienteActualizado);
      const req = new NextRequest('http://localhost/api/cliente/1', {
        method: 'PUT',
        body: JSON.stringify(clienteActualizado),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.nombre).toBe('Cliente Actualizado');
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {

      const req = new NextRequest('http://localhost/api/cliente/1', {
        method: 'PUT',
        body: JSON.stringify({ nombre: "Cliente Actualizado" }),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });

      expect(res.status).toBe(400);
    });

    it('debería retornar 500 si hay un error inesperado', async () => {
      prismaMock.cliente.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/cliente/1', {
        method: 'PUT',
        body: JSON.stringify({
          id: 1,
          telefono: '12345678910',
          cuit: '20123456789',
          direccion: 'Calle Falsa 123',
        }),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: "1" }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });
  });
});
