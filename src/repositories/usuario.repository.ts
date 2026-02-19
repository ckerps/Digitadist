import { FiltrosUsuario, NuevoUsuario, UpdateUsuario, UsuarioPaginado } from "@/types/usuario";
import { FiltrosUsuarioSchema, NuevoUsuarioSchema, PaginacionSchema, UpdateUsuarioSchema } from "./zodSchemas";
import { prisma } from "@/lib/prisma";
import { Usuario } from "@prisma/client";
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

export const UsuarioRepository = {
    async obtenerTodos(itemsPerPage: number, currentPage: number, filtros?: FiltrosUsuario): Promise<UsuarioPaginado> {
        const skip = (currentPage - 1) * itemsPerPage;
        const usuarios = await prisma.usuario.findMany({
            where: {
                nombre: filtros?.nombre ?? undefined,
                apellido: filtros?.apellido ?? undefined,
                rol_id: filtros?.rol_id ?? undefined,
                email: filtros?.email ?? undefined,
                activo: filtros?.activo ?? undefined
            },
            skip,
            take: itemsPerPage,
            orderBy: { id: 'desc' }
        });

        const totalCount = await prisma.usuario.count();

        return {
            usuarios,
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / itemsPerPage),
            currentPage: currentPage
        }
    },

    async obtenerPorId(id: number): Promise<Usuario> {
        const usuario = await prisma.usuario.findUnique({ where: { id } });
        return usuario;
    },

    async crear(data: NuevoUsuario) {
        const validado = NuevoUsuarioSchema.parse(data);
        const hashedPassword = await bcrypt.hash(validado.password, 10);
        validado.password = hashedPassword;
        const result = await prisma.usuario.create({ data: validado })
        return result;
    },

    async actualizar(id: number, data: UpdateUsuario) {
        const usuario = await UpdateUsuarioSchema.parse({ data })
        const result = await prisma.usuario.update({ where: { id }, data: usuario })
        return result;
    },

    async eliminar(id: number) {
        const result = await prisma.usuario.update({ where: { id }, data: { activo: false } })
        return result;
    }
};
