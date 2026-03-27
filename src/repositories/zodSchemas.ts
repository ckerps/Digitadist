import { EnumAtributosLog, EnumCondicionVenta, EnumEstadoPago, EnumEstadoPedido, EnumPresentacion, EnumTipoCliente, EnumTipoDescuento } from '@prisma/client'
import * as z from 'zod';

// Helper para campos opcionales que tratan "" como undefined
const optionalString = (schema: z.ZodString) => z.preprocess((val) => val === "" ? undefined : val, schema.optional());

export const PaginacionSchema = z.object({
    itemsPerPage: z.coerce.number().gt(0).lt(100),
    currentPage: z.coerce.number().gt(0)
})

export const NuevoClienteSchema = z.object({
    nombre: z.string().min(2, "Minimo 2 digitos"),
    telefono: z.string().min(10, "Mínimo 10 dígitos").transform((val) => val.replace(/\D/g, "")),
    cuit: z.preprocess((val) => val === "" ? undefined : val, z.string().length(11, "Debe tener 11 dígitos").regex(/^\d+$/, "Solo números").optional()),
    direccion: z.string().min(5, "Mínimo 5 caracteres").max(20, "Máximo 20 caracteres"),
    tipo: z.enum([EnumTipoCliente.persona, EnumTipoCliente.razon_social]),
    email: z.email(),
    activo: z.boolean()
})

export const UpdateClienteSchema = z.object({
    id: z.number(),
    nombre: z.string().min(2, "Minimo 2 digitos").optional(),
    telefono: z.string().min(10, "Mínimo 10 dígitos").transform((val) => val.replace(/\D/g, "")).optional(),
    cuit: z.string().length(11, "Debe tener 11 dígitos").regex(/^\d+$/, "Solo números").optional(),
    direccion: z.string().min(5).max(20).optional(),
    tipo: z.enum([EnumTipoCliente.persona, EnumTipoCliente.razon_social]).optional(),
    email: z.email().optional(),
    activo: z.boolean().optional()
})

export const NuevoPedidoSchema = z.object({
    cliente_id: z.number().gt(0),
    vendedor_id: z.number().gt(0),
    total: z.number().gt(0),
    costo: z.number().gt(0),
    descuento: z.number().optional(),
    estado: z.enum(EnumEstadoPedido),
    estado_pago: z.enum(EnumEstadoPago),
    direccion_entrega: z.string().min(0).max(20),
    fecha_entrega_estimada: z.date().min(Date.now()),
    condicion_venta: z.enum(EnumCondicionVenta),
})

export const UpdatePedidoSchema = z.object({
    total: z.number().gt(0).optional(),
    costo: z.number().gt(0).optional(),
    descuento: z.number().optional(),
    estado: z.enum(EnumEstadoPedido).optional(),
    estado_pago: z.enum(EnumEstadoPago).optional(),
    direccion_entrega: z.string().min(0).max(20).optional(),
    fecha_entrega_estimada: z.date().min(Date.now()).optional(),
    condicion_venta: z.enum(EnumCondicionVenta).optional()
})

export const FiltrosPedidoSchema = z.object({
    searchTerm: z.string().optional().transform(v => v === "" ? undefined : v),
    cliente_id: z.coerce.number().gt(0).optional(),
    vendedor_id: z.coerce.number().gt(0).optional(),
    estado: z.enum(EnumEstadoPedido).optional(),
    estado_pago: z.enum(EnumEstadoPago).optional(),
    direccion_entrega: z.string().min(0).max(20).optional(),
    fecha_entrega_estimada: z.date().optional(),
    condicion_venta: z.enum(EnumCondicionVenta).optional()
})

export const NuevoDetallePedidoSchema = z.object({
    producto_id: z.number().gt(0),
    cantidad: z.number().gt(0),
    precio_unitario: z.number().gt(0),
    descuento: z.number().gte(0).optional(),
    subtotal: z.number().gt(0)
})

export const UpdateDetallePedidoSchema = z.object({
    cantidad: z.number().gt(0).optional(),
    precio_unitario: z.number().gt(0).optional(),
    descuento: z.number().gte(0).optional(),
    subtotal: z.number().gt(0).optional()
})

export const NuevoProductoSchema = z.object({
    codigo: z.string().min(1, "El código es obligatorio"),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    presentacion: z.enum(EnumPresentacion),
    tam_pack: z.number().gte(0, "El tamaño del pack debe ser mayor a 0"),
    costo: z.number().nonnegative("El costo no puede ser negativo"),
    porcentaje_recargo: z.number().nonnegative("El recargo no puede ser negativo"),
    stock_actual: z.number().int().nonnegative("El stock no puede ser negativo"),
    stock_minimo: z.number().int().nonnegative().optional(),
    activo: z.boolean().default(true),
    imagen: z.string().url("Debe ser una URL válida").optional().or(z.literal("").transform(() => undefined)),
    categoria_id: z.number().int().gt(0, "ID de categoría inválido"),
    fecha_vencimiento: z.date().optional(),
});

export const NuevoLogProductoSchema = z.object({
    usuario_id: z.number().int().gt(0),
    producto_id: z.number().int().gt(0),
    atributo: z.enum(EnumAtributosLog),
    valor_anterior: z.string(),
    valor_nuevo: z.string(),
});

export const NuevaOfertaSchema = z.object({
    producto_id: z.number().int().gte(0, "Seleccione un producto para continuar"),
    tipo: z.enum(EnumTipoDescuento),
    valor: z.number().gt(0, "El valor del descuento debe ser mayor a 0"),
    fecha_inicio: z.coerce.date(),
    fecha_fin: z.coerce.date(),
    activa: z.boolean().default(true),
}).refine((data) => data.fecha_fin > data.fecha_inicio, {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["fecha_fin"],
});

export const ActualizarOfertaSchema = z.object({
    tipo: z.enum(EnumTipoDescuento).optional(),
    valor: z.number().gt(0, "El valor del descuento debe ser mayor a 0").optional(),
    fecha_inicio: z.coerce.date().optional(),
    fecha_fin: z.coerce.date().optional(),
    activa: z.boolean().optional(),
}).refine((data) => !data.fecha_fin || !data.fecha_inicio || data.fecha_fin > data.fecha_inicio, {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["fecha_fin"],
});

export const RenovarOfertaSchema = z.object({
    nueva_fecha_fin: z.coerce.date(),
});

export const FiltrosOfertaSchema = z.object({
    id: z.coerce.number().optional(),
    producto_id: z.coerce.number().optional(),
    tipo: z.enum(EnumTipoDescuento).optional(),
    estado: z.enum(['activa', 'inactiva']).optional(),
    fecha_inicio_desde: z.string().optional().transform(v => v === "" ? undefined : v),
    fecha_inicio_hasta: z.string().optional().transform(v => v === "" ? undefined : v),
    fecha_fin_desde: z.string().optional().transform(v => v === "" ? undefined : v),
    fecha_fin_hasta: z.string().optional().transform(v => v === "" ? undefined : v),
    fecha_creacion_desde: z.string().optional().transform(v => v === "" ? undefined : v),
    fecha_creacion_hasta: z.string().optional().transform(v => v === "" ? undefined : v),
});

export const FiltrosProductoSchema = z.object({
    codigo: z.string().optional().transform(v => v === "" ? undefined : v),
    nombre: z.string().optional().transform(v => v === "" ? undefined : v),
    presentacion: z.enum(EnumPresentacion).optional(),
    tam_pack: z.coerce.number().optional(),
    stock_actual: z.coerce.number().optional(),
    stock_minimo: z.coerce.number().optional(),
    activo: z.preprocess((val) => val === 'true' ? true : val === 'false' ? false : val, z.boolean().optional()),
    categoria_id: z.coerce.number().optional(),
    fecha_vencimiento: z.coerce.date().optional(),
});


export const UpdateProductoSchema = z.object({
    nombre: z.string().min(2).optional().or(z.literal("").transform(() => undefined)),
    presentacion: z.enum(EnumPresentacion).optional(),
    tam_pack: z.coerce.number().gt(0).optional(),
    costo: z.coerce.number().nonnegative().optional(),
    porcentaje_recargo: z.coerce.number().nonnegative().optional(),
    stock_actual: z.coerce.number().int().nonnegative().optional(),
    stock_minimo: z.coerce.number().int().nonnegative().optional(),
    activo: z.boolean().optional(),
    imagen: z.string().url().optional().or(z.literal("").transform(() => undefined)),
    categoria_id: z.coerce.number().int().gt(0).optional(),
    fecha_vencimiento: z.coerce.date().optional(),
});

export const NuevoUsuarioSchema = z.object({
    nombre: z.string().min(2, "El nombre es muy corto"),
    apellido: z.string().min(2, "El apellido es muy corto"),
    rol_id: z.coerce.number().int().gt(0, "ID de rol inválido"),
    email: z.string().email("Email con formato inválido"),
    telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    activo: z.boolean().default(true)
});

export const UpdateUsuarioSchema = z.object({
    nombre: z.string().min(2, "El nombre es muy corto").optional(),
    apellido: z.string().min(2, "El apellido es muy corto").optional(),
    rol_id: z.coerce.number().int().gt(0, "ID de rol inválido").optional(),
    email: z.string().email("Email con formato inválido").optional(),
    telefono: z.string().min(10, "El teléfono debe tener al menos 10 dígitos").optional(),
    password: z.string().min(8).optional().or(z.literal("").transform(() => undefined)),
    activo: z.boolean().optional()
});

export const FiltrosUsuarioSchema = z.object({
    nombre: z.string().optional().transform(v => v === "" ? undefined : v),
    apellido: z.string().optional().transform(v => v === "" ? undefined : v),
    rol_id: z.coerce.number().optional(),
    email: z.string().optional().transform(v => v === "" ? undefined : v),
    activo: z.boolean()
});
