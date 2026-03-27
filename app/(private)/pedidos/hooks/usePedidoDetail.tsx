import { pedidosApi } from "@/api/pedidos.api";
import { PedidoConProductos } from "@/types/pedido";
import { QueryObserverResult, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";

interface UsePedidosReturn {
  pedido:  PedidoConProductos | undefined;
  isLoadingDetail: boolean;
  errorDetail: Error | null;
  errorUpdate: Error | null;
  errorDelete: Error | null;
  updatePedido: (id: number, pedido: Partial<PedidoConProductos>) => Promise<PedidoConProductos>;
  deletePedido: (id: number) => Promise<void>;
  agregarProducto: (pedidoId: number, detalle: { producto_id: number; cantidad: number; precio_unitario: number; descuento?: number; subtotal: number }) => Promise<PedidoConProductos>;
  editarCantidad: (pedidoId: number, productoId: number, cantidad: number, subtotal: number, precio_unitario: number, descuento?: number) => Promise<PedidoConProductos>;
  eliminarProducto: (pedidoId: number, productoId: number) => Promise<PedidoConProductos>;
  isUpdating: boolean;
  isDeleting: boolean;
  refetchDetail: () => Promise<QueryObserverResult<PedidoConProductos, Error>>;
}

export function usePedidoDetail({pedidoId}: { pedidoId: number}): UsePedidosReturn {
  const queryClient = useQueryClient();

  const detailQuery = useSuspenseQuery({
    queryKey: ['pedidos:detail', pedidoId],
    queryFn: () => pedidosApi.getById(pedidoId),
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, pedido }: { id: number; pedido: Partial<PedidoConProductos> }) =>
      pedidosApi.update(id, pedido),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.refetchQueries({ queryKey: ['pedidos:detail', variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pedidosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos:detail'] });
    },
  });

  const agregarProductoMutation = useMutation({
    mutationFn: ({ pedidoId, detalle }: { pedidoId: number; detalle: any }) =>
      pedidosApi.agregarProducto(pedidoId, detalle),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.refetchQueries({ queryKey: ['pedidos:detail', variables.pedidoId] });
    },
  });

  const editarCantidadMutation = useMutation({
    mutationFn: ({ pedidoId, productoId, detalle }: { pedidoId: number; productoId: number; detalle: any }) =>
      pedidosApi.actualizarDetalle(pedidoId, productoId, detalle),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.refetchQueries({ queryKey: ['pedidos:detail', variables.pedidoId] });
    },
  });

  const eliminarProductoMutation = useMutation({
    mutationFn: ({ pedidoId, productoId }: { pedidoId: number; productoId: number }) =>
      pedidosApi.eliminarProducto(pedidoId, productoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos:list'] });
      queryClient.refetchQueries({ queryKey: ['pedidos:detail', variables.pedidoId] });
    },
  });

  const updatePedido = useCallback(
    async (id: number, pedido: Partial<PedidoConProductos>) => {
      return updateMutation.mutateAsync({ id, pedido });
    },
    [updateMutation]
  );

  const deletePedido = useCallback(
    async (id: number) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  const agregarProducto = useCallback(
    async (pedidoId: number, detalle: { producto_id: number; cantidad: number; precio_unitario: number; descuento?: number; subtotal: number }) => {
      return agregarProductoMutation.mutateAsync({ pedidoId, detalle });
    },
    [agregarProductoMutation]
  );

  const editarCantidad = useCallback(
    async (pedidoId: number, productoId: number, cantidad: number, subtotal: number, precio_unitario: number, descuento?: number) => {
      return editarCantidadMutation.mutateAsync({
        pedidoId,
        productoId,
        detalle: { cantidad, subtotal, descuento, precio_unitario }
      });
    },
    [editarCantidadMutation]
  );

  const eliminarProducto = useCallback(
    async (pedidoId: number, productoId: number) => {
      return eliminarProductoMutation.mutateAsync({ pedidoId, productoId });
    },
    [eliminarProductoMutation]
  );

  const refetchDetail = useCallback(
    () => detailQuery.refetch(),
    [detailQuery]
  );

  return {
    pedido: detailQuery.data,
    isLoadingDetail: detailQuery.isLoading,
    errorDetail: detailQuery.error as Error | null,
    errorUpdate: updateMutation.error as Error | null,
    errorDelete: deleteMutation.error as Error | null,
    updatePedido,
    deletePedido,
    agregarProducto,
    editarCantidad,
    eliminarProducto,
    isUpdating: updateMutation.isPending || editarCantidadMutation.isPending || agregarProductoMutation.isPending,
    isDeleting: deleteMutation.isPending || eliminarProductoMutation.isPending,
    refetchDetail,
  };
}
