import { Usuario } from "@prisma/client";
import { UsuarioRepository } from "@/repositories/usuario.repository";
import { FiltrosUsuarioSchema, NuevoUsuarioSchema, PaginacionSchema, UpdateUsuarioSchema } from "@/repositories/zodSchemas";
import { FiltrosUsuario, NuevoUsuario, UpdateUsuario, UsuarioPaginado } from "@/types/usuario";

export class UsuarioService {
    static async obtenerTodos(itemsPerPage: number, currentPage: number, filters?: FiltrosUsuario) : Promise<UsuarioPaginado> {
        if (itemsPerPage > 100) itemsPerPage = 100; // Límite de seguridad

        const filtros = await FiltrosUsuarioSchema.parse(filters);
        const paginacion = await PaginacionSchema.parse({ itemsPerPage, currentPage });
        
        return await UsuarioRepository.obtenerTodos(paginacion.itemsPerPage, paginacion.currentPage, filtros);
    }

    static async obtenerPorId(id: number) : Promise<Usuario> {
        const usuario = await UsuarioRepository.obtenerPorId(id);

        if (!usuario) {
            throw new Error("El usuario no existe");
        }

        return usuario;
    }

    static async crear(data: NuevoUsuario) : Promise<Usuario> {
        const validatedData = NuevoUsuarioSchema.parse(data);

        return await UsuarioRepository.crear(validatedData);
    }

    static async actualizar(id: number, data: UpdateUsuario) : Promise<Usuario> {
        if (id <= 0) throw new Error("ID inválido");

        const validatedData = UpdateUsuarioSchema.parse(data);

        const usuarioActual = await UsuarioRepository.obtenerPorId(id);
        if (!usuarioActual) throw new Error("El usuario a modificar no existe");

        return UsuarioRepository.actualizar(id, validatedData);
    }

    static async eliminar(id: number) : Promise<Usuario>{
        if (id <= 0) throw new Error("ID inválido");
        return UsuarioRepository.eliminar(id);
    }
}
