import { GET, POST } from './route';
import { prismaMock } from '@/lib/__mocks__/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: require('@/lib/__mocks__/prisma').prismaMock,
}));

describe('Pedidos API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pedidos', () => {
    it('debería retornar 200 y una lista de pedidos', async () => {
      const mockPedidos = [
        {
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
        },
      ];
      prismaMock.pedido.findMany.mockResolvedValue(mockPedidos as any);
      prismaMock.pedido.count.mockResolvedValue(1);

      const req = new Request('http://localhost/api/pedidos') as any;
      const res = await GET(req);

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toBeDefined();
    });
    it('debería retornar 500 y un error', async () => {
      prismaMock.pedido.findMany.mockRejectedValue(new Error('Error de base de datos'));

      const req = new Request('http://localhost/api/pedidos') as any;
      const res = await GET(req);

      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error);
    });
  });

  describe('POST /api/pedidos', () => {
    it('debería retornar 201 y crear un pedido', async () => {
      const nuevoPedidoPayload = {
        pedido: {
          cliente_id: 1,
          vendedor_id: 1,
          total: 1000,
          costo: 800,
          estado: 'registrado',
          estado_pago: 'en_deuda',
          direccion_entrega: 'Calle Falsa 123',
          fecha_entrega_estimada: new Date(Date.now() + 86400000), // Mañana
          condicion_venta: 'contado'
        },
        detalle: [
          { producto_id: 1, cantidad: 2, precio_unitario: 500, subtotal: 1000 }
        ]
      };

      prismaMock.$transaction.mockResolvedValue({ id: 2, ...nuevoPedidoPayload.pedido } as any);

      const req = new Request('http://localhost/api/pedidos', {
        method: 'POST',
        body: JSON.stringify(nuevoPedidoPayload),
      });

      const res = await POST(req);

      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.id).toBe(2);
    });

    it('debería retornar 400 si faltan datos obligatorios', async () => {
      const payloadInvalido = { pedido: { cliente_id: 1 } };

      const req = new Request('http://localhost/api/pedidos', {
        method: 'POST',
        body: JSON.stringify(payloadInvalido),
      });

      const res = await POST(req);

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.type).toBe('ValidationError');
    });

    it('debería retornar 500 si hay un error', async () => {
      prismaMock.$transaction.mockRejectedValue(new Error('Error de base de datos'));

      const nuevoPedidoPayload = {
        pedido: {
          cliente_id: 1,
          vendedor_id: 1,
          total: 1000,
          costo: 800,
          estado: 'registrado',
          estado_pago: 'en_deuda',
          direccion_entrega: 'Calle Falsa 123',
          fecha_entrega_estimada: new Date(Date.now() + 86400000), // Mañana
          condicion_venta: 'contado'
        },
        detalle: [
          { producto_id: 1, cantidad: 2, precio_unitario: 500, subtotal: 1000 }
        ]
      };

      const req = new Request('http://localhost/api/pedidos', {
        method: 'POST',
        body: JSON.stringify(nuevoPedidoPayload),
      });

      const res = await POST(req);

      expect(res.status).toBe(500);
    });
  });
});
