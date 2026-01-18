export type EstadoPedido = 'entregado' | 'registrado' | 'finalizado' | 'en_preparacion';
export type EstadoPago = 'pagado' | 'en_deuda';

export interface Pedido {
  id: string;
  direccionEntrega: string;
  fechaEstimada: string;
  estado: EstadoPedido;
  pago: EstadoPago;
  total: number;
  clienteId: number;
}

const mockPedidos: Pedido[] = [
  { id: '3001', direccionEntrega: '123 Industrial Ave', fechaEstimada: '2024-06-05', estado: 'entregado', pago: 'pagado', total: 2500.0, clienteId: 3001 },
  { id: '1002', direccionEntrega: '45 Market St', fechaEstimada: '2024-06-06', estado: 'registrado', pago: 'en_deuda', total: 1200.0, clienteId: 3001 },
  { id: '1003', direccionEntrega: '78 Elm Rd', fechaEstimada: '2024-06-07', estado: 'finalizado', pago: 'pagado', total: 500.0, clienteId: 1003 },
  { id: '1004', direccionEntrega: '90 Commerce Blvd', fechaEstimada: '2024-06-08', estado: 'en_preparacion', pago: 'en_deuda', total: 750.0, clienteId: 1004 },
  { id: '1005', direccionEntrega: '12 Ocean Dr', fechaEstimada: '2024-06-09', estado: 'entregado', pago: 'pagado', total: 3000.0, clienteId: 1005 },
  { id: '1006', direccionEntrega: '67 Digital Way', fechaEstimada: '2024-06-10', estado: 'registrado', pago: 'en_deuda', total: 1150.0, clienteId: 1006 },
  { id: '1007', direccionEntrega: '210 Fairway Ln', fechaEstimada: '2024-06-11', estado: 'entregado', pago: 'pagado', total: 2300.0, clienteId: 1007 },
];

export const PedidoRepository = {
  async obtenerPorClienteId(clienteId: number): Promise<Pedido[]> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockPedidos.filter(pedido => pedido.clienteId === clienteId)), 100);
    });
  },

  async obtenerPorId(id: string) {
    const p = mockPedidos.find((m) => m.id === id) || null;
    return new Promise<Pedido | null>((resolve) => setTimeout(() => resolve(p), 100));
  },
};
