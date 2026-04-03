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
            include: { rol: true },
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

    async obtenerPorId(id: number): Promise<Usuario | null> {
        return await prisma.usuario.findUnique({ 
            where: { id },
            include: { rol: true }
        });
    },

    async crear(data: NuevoUsuario) {
        const validado = NuevoUsuarioSchema.parse(data);
        const hashedPassword = await bcrypt.hash(validado.password, 10);
        validado.password = hashedPassword;
        const result = await prisma.usuario.create({ data: validado })
        return result;
    },

    async actualizar(id: number, data: UpdateUsuario) {
        const validado = UpdateUsuarioSchema.parse(data);
        
        if (validado.password) {
            validado.password = await bcrypt.hash(validado.password, 10);
        } else {
            // Eliminar password si es undefined o string vacío (ya manejado por el transform del schema)
            delete validado.password;
        }

        const result = await prisma.usuario.update({ 
            where: { id }, 
            data: validado 
        });
        return result;
    },

    async eliminar(id: number) {
        const result = await prisma.usuario.update({ where: { id }, data: { activo: false } })
        return result;
    }
};
