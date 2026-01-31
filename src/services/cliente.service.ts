import { ClienteRepository } from "@/repositories/cliente.repository"
import { NuevoClienteSchema, PaginacionSchema, UpdateClienteSchema } from "@/repositories/zodSchemas";

export class ClienteService {
    static async obtenerTodos(itemsPerPage: number, currentPage: number) {
        if (itemsPerPage > 100) itemsPerPage = 100; // Límite de seguridad
        const { itemsPerPage: take, currentPage: page } = PaginacionSchema.parse({ itemsPerPage, currentPage });
        return await ClienteRepository.obtenerTodos(take, page);
    }

    static async obtenerPorId(id: number) {
        const cliente = await ClienteRepository.obtenerPorId(id);

        if (!cliente) {
            throw new Error("El cliente no existe");
        }

        return cliente;
    }

    static async crear(data: any) {
        const validatedData = NuevoClienteSchema.parse(data);

        if (validatedData.cuit) {
            const existe = await ClienteRepository.obtenerPorCuit(validatedData.cuit);
            if (existe) throw new Error('Ya existe un cliente con ese CUIT');
        }

        return ClienteRepository.crear(validatedData);
    }

    static async actualizar(id: number, data: any) {
        if (id <= 0 || id !== data.id) throw new Error("ID inválido");
        
        const validatedData = UpdateClienteSchema.parse(data);

        const clienteActual = await ClienteRepository.obtenerPorId(id);
        if (!clienteActual) throw new Error("El cliente a modificar no existe");

        return ClienteRepository.actualizar(id, validatedData);
    }

    static async eliminar(id: number) {
        if (id <= 0) throw new Error("ID inválido");
        return ClienteRepository.eliminar(id);
    }
}
