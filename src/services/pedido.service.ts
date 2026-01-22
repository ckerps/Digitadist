import { Pedido, PedidoRepository, PedidosPaginado } from "@/repositories/pedido.repository";
import { NuevoCliente } from "@/types/cliente"

export class PedidoService {
    static async obtenerTodos(filters: Partial<Pedido>, itemsPerPage: number, currentPage: number): Promise<PedidosPaginado> {
        console.debug('PedidoService.obtenerTodos params:', { filters, itemsPerPage, currentPage });
        const pedidos = await PedidoRepository.obtenerTodos(filters, itemsPerPage, currentPage);
        console.debug('PedidoService.obtenerTodos resultado:', pedidos);
        return pedidos;
    }

    // static async obtenerPorId(id: number) {
    //     return PedidoRepository.obtenerPorId(id)
    // }

    // static async crear(data: NuevoCliente) {
    //     // validaciones de negocio
    //     if (!data.nombre) {
    //         throw new Error('Nombre obligatorio')
    //     }

    //     return PedidoRepository.crear(data)
    // }

    // static async actualizar(id: number, data: Partial<NuevoCliente>) {
    //     // validaciones de negocio
    //     return PedidoRepository.actualizar(id, data)
    // }

    // static async eliminar(id: number) {
    //     // validaciones de negocio
    //     return PedidoRepository.eliminar(id)
    // }
}
