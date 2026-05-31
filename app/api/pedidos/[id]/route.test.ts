import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Pedidos/[id] API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pedidos/[id]', () => {
    it('debería retornar 200 y un pedido', async () => {
      prismaMock.pedido.findUnique.mockResolvedValue({
        id: 1,
        cliente_id: 1,
        vendedor_id: 1,
        total: 1000,
        costo: 800,
        estado: 'pendiente',
        estado_pago: 'pendiente',
        direccion_entrega: 'Calle Falsa 123',
        fecha_entrega_estimada: new Date(),
        condicion_venta: 'contado'
      } as any);

      const req = new NextRequest('http://localhost/api/pedidos/1') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
    it('debería retornar 500 y un error', async () => {
      prismaMock.pedido.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/pedidos/1') as any;
      const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });
  });

  describe('PUT /api/pedidos/[id]', () => {
    it('debería retornar 200 y actualizar un pedido', async () => {
      const actualizarPedidoPayload = {
        costo: 800,
        descuento: 100
      };

      prismaMock.pedido.findUnique.mockResolvedValue({ id: 1, ...actualizarPedidoPayload } as any);
      prismaMock.$transaction.mockResolvedValue({ id: 1, ...actualizarPedidoPayload } as any);

      const req = new NextRequest('http://localhost/api/pedidos/1', {
        method: 'PUT',
        body: JSON.stringify(actualizarPedidoPayload),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.id).toBe(1);
    });

    it('debería retornar 500 si hay un error', async () => {
      prismaMock.pedido.findUnique.mockRejectedValue(new Error('Error de base de datos'));

      const actualizarPedidoPayload = {
        total: 1000,
        costo: 800,
      };

      const req = new NextRequest('http://localhost/api/pedidos/1', {
        method: 'PUT',
        body: JSON.stringify(actualizarPedidoPayload),
      });

      const res = await PUT(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
    });
  });
  describe('DELETE /api/pedidos/[id]', () => {
    it('debería retornar 200 y eliminar un pedido', async () => {

      prismaMock.pedido.findUnique.mockResolvedValue({
        id: 1,
        cliente_id: 1,
        vendedor_id: 1,
        total: 1000,
        costo: 800,
        estado: 'registrado',
        estado_pago: 'pendiente',
        direccion_entrega: 'Calle Falsa 123',
        fecha_entrega_estimada: new Date(),
        condicion_venta: 'contado'
      } as any);

      prismaMock.pedido.delete.mockResolvedValue({ id: 1 } as any);

      const req = new NextRequest('http://localhost/api/pedidos/1', {
        method: 'DELETE',
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(200);
      const json = await res.json();
      console.log('PEDIDO CANCELADO: ', json);
      expect(json?.success).toBe(true);
    });

    it('debería retornar 500 si hay un error', async () => {
      prismaMock.$transaction.mockRejectedValue(new Error('Error de base de datos'));

      const req = new NextRequest('http://localhost/api/pedidos/1', {
        method: 'DELETE',
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

      expect(res.status).toBe(500);
    });
  });
});
