import { EstadoPago, EstadoPedido, Pedido, PedidosPaginado } from "@/types/pedido";

const mockPedidos: Pedido[] = [
  { id: 3001, direccionEntrega: '123 Industrial Ave', fechaEstimada: '2024-06-05', estado: EstadoPedido.entregado, pago: EstadoPago.pagado, total: 2500.0, clienteId: 3001 },
  { id: 1002, direccionEntrega: '45 Market St', fechaEstimada: '2024-06-06', estado: EstadoPedido.registrado, pago: EstadoPago.en_deuda, total: 1200.0, clienteId: 3001 },
  { id: 1003, direccionEntrega: '78 Elm Rd', fechaEstimada: '2024-06-07', estado: EstadoPedido.finalizado, pago: EstadoPago.pagado, total: 500.0, clienteId: 1003 },
  { id: 1004, direccionEntrega: '90 Commerce Blvd', fechaEstimada: '2024-06-08', estado: EstadoPedido.en_preparacion, pago: EstadoPago.en_deuda, total: 750.0, clienteId: 1004 },
  { id: 1005, direccionEntrega: '12 Ocean Dr', fechaEstimada: '2024-6-9', estado: EstadoPedido.entregado, pago: EstadoPago.pagado, total: 300.5, clienteId : 18 },
  { id: 1007, direccionEntrega: '210 Fairway Ln', fechaEstimada: '2024-06-11', estado: EstadoPedido.entregado, pago: EstadoPago.pagado, total: 2300.0, clienteId: 1007 },
];

export const PedidoRepository = {
  async obtenerTodos(filters: Partial<Pedido>, itemsPerPage: number, currentPage: number): Promise<PedidosPaginado> {
    return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = mockPedidos;
          if (filters.clienteId) {
            filtered = mockPedidos.filter(pedido => pedido.clienteId === Number(filters.clienteId));
          }
          const totalItems = filtered.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const pedidos = filtered.slice(startIndex, endIndex);
          resolve({
            pedidos,
            totalPages,
            currentPage,
            totalItems
          });
        }, 100);
    });
  },

  async obtenerPorId(id: number): Promise<Pedido | null> {
    const p = mockPedidos.find((m) => m.id === id) || null;
    return new Promise<Pedido | null>((resolve) => setTimeout(() => resolve(p), 100));
  },
};
