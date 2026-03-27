/*
  Warnings:

  - You are about to alter the column `precio_unitario` on the `DetallePedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `DetallePedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `DetallePedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `valor` on the `Oferta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `Pedido` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo` on the `Producto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "DetallePedido" ALTER COLUMN "precio_unitario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Oferta" ALTER COLUMN "valor" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "costo" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "costo" SET DATA TYPE DOUBLE PRECISION;
