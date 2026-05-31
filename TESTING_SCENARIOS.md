# Escenarios de Pruebas Automatizadas Asistidas (Antigravity AI)

Este documento define las directrices y flujos para que el agente Antigravity ejecute pruebas exploratorias sobre el proyecto Digitadist simulando un usuario final en el navegador (usando la herramienta de "Browser").

## Instrucciones para el Agente:
Cuando se te pida "Ejecutar pruebas exploratorias según TESTING_SCENARIOS.md", debes seguir estos pasos:
1. Iniciar el servidor Next.js en local (`npm run dev`).
2. Abrir tu herramienta de Browser en `http://localhost:3000`.
3. Informar cualquier error o advertencia en la consola del navegador o del servidor.
4. Seguir los flujos detallados abajo, verificando visualmente los cambios.
5. Elaborar un reporte detallando si hubo fallas en la navegación o en la carga de datos.

## Flujo 1: Carga y Modificación de Productos
1. **Login**: Acceder con el usuario `test@test.com` y password `password123`.
2. **Navegación**: Ir a la sección de "Productos".
3. **Creación**: 
   - Pulsar en "Nuevo Producto".
   - Rellenar campos de forma semi-aleatoria (ej. Código: `EXPL-001`, Nombre: `Gaseosa AI 1L`, Costo: `1000`, Recargo: `30%`, Stock: `50`).
   - Guardar y confirmar que la lista refleja el producto.
4. **Modificación**:
   - Encontrar `Gaseosa AI 1L` en la tabla.
   - Pulsar Editar, cambiar el precio a `1500`.
   - Guardar y comprobar que el valor se actualizó en la tabla y base de datos.
   
## Flujo 2: Gestión de Clientes
1. Navegar a "Clientes".
2. Crear un nuevo cliente de tipo "persona" con datos ficticios.
3. Crear un nuevo cliente de tipo "razon_social" probando introducir un CUIT inválido primero (ej. 5 dígitos) para asegurar que se muestran los mensajes de error de validación de Zod. Luego, ingresar un CUIT válido (11 dígitos).
4. Comprobar que los toast/alertas de éxito o error se despliegan correctamente.

## Flujo 3: Creación de Pedido con y sin Ofertas
1. Asegurarse de tener al menos una "Oferta" activa para un producto en el módulo de Ofertas.
2. Navegar a "Pedidos" -> "Nuevo Pedido".
3. Seleccionar el cliente creado en el Flujo 2.
4. Seleccionar un producto sin oferta y añadirlo al carrito. Comprobar el subtotal.
5. Seleccionar un producto CON oferta activa. Añadirlo y verificar que el descuento se aplique automáticamente sobre el subtotal o total del pedido.
6. Guardar el pedido y verificar que en el dashboard o listado, el estado sea "Registrado" (o el estado inicial) y los totales coincidan.
