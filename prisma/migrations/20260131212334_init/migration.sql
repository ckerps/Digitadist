-- CreateEnum
CREATE TYPE "EnumTipoCliente" AS ENUM ('persona', 'razon_social');

-- CreateEnum
CREATE TYPE "EnumPresentacion" AS ENUM ('gramos', 'litros');

-- CreateEnum
CREATE TYPE "EnumTipoValor" AS ENUM ('int', 'string', 'bool');

-- CreateEnum
CREATE TYPE "EnumAtributosLog" AS ENUM ('codigo', 'nombre', 'presentacion', 'tam_pack', 'costo', 'regargo', 'stock_minimo', 'activo', 'imagen', 'categoria', 'vencimiento');

-- CreateEnum
CREATE TYPE "EnumTipoDescuento" AS ENUM ('monto', 'porcentaje');

-- CreateEnum
CREATE TYPE "EnumEstadoPedido" AS ENUM ('registrado', 'en_preparacion', 'entregado', 'finalizado', 'cancelado');

-- CreateEnum
CREATE TYPE "EnumEstadoPago" AS ENUM ('pagado', 'en_deuda');

-- CreateEnum
CREATE TYPE "EnumCondicionVenta" AS ENUM ('contado', 'transferencia');

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "tipo" "EnumTipoCliente" NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "cuit" VARCHAR(11),
    "email" TEXT NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "presentacion" "EnumPresentacion" NOT NULL,
    "tam_pack" INTEGER NOT NULL,
    "costo" DECIMAL(65,30) NOT NULL,
    "porcentaje_recargo" DOUBLE PRECISION NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "stock_minimo" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "imagen" TEXT,
    "categoria_id" INTEGER NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo_valor" "EnumTipoValor" NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoLog" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "atributo" "EnumAtributosLog" NOT NULL,
    "valor_anterior" TEXT NOT NULL,
    "valor_nuevo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductoLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" SERIAL NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "tipo" "EnumTipoDescuento" NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "vendedor_id" INTEGER NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(65,30) NOT NULL,
    "costo" DECIMAL(65,30) NOT NULL,
    "descuento" DECIMAL(65,30),
    "estado" "EnumEstadoPedido" NOT NULL,
    "estado_pago" "EnumEstadoPago" NOT NULL,
    "direccion_entrega" TEXT NOT NULL,
    "fecha_entrega_estimada" TIMESTAMP(3) NOT NULL,
    "condicion_venta" "EnumCondicionVenta" NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetallePedido" (
    "producto_id" INTEGER NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,
    "descuento" DECIMAL(65,30),
    "subtotal" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DetallePedido_pkey" PRIMARY KEY ("pedido_id","producto_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cuit_key" ON "Cliente"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracion_nombre_key" ON "Configuracion"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoLog" ADD CONSTRAINT "ProductoLog_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoLog" ADD CONSTRAINT "ProductoLog_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallePedido" ADD CONSTRAINT "DetallePedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
