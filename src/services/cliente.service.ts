import { ClienteRepository } from "@/repositories/cliente.repository"
import { NuevoCliente } from "@/types/cliente"

export class ClienteService {
    static async obtenerTodos() {
        return ClienteRepository.obtenerTodos()
    }

    static async obtenerPorId(id: number) {
        return ClienteRepository.obtenerPorId(id)
    }

    static async crear(data: NuevoCliente) {
        // validaciones de negocio
        if (!data.nombre) {
            throw new Error('Nombre obligatorio')
        }

        return ClienteRepository.crear(data)
    }

    static async actualizar(id: number, data: Partial<NuevoCliente>) {
        // validaciones de negocio
        return ClienteRepository.actualizar(id, data)
    }

    static async eliminar(id: number) {
        // validaciones de negocio
        return ClienteRepository.eliminar(id)
    }
}
