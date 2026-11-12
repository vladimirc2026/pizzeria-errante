# ERRANTE · Tienda online (React + Vite + Supabase)

## Paso a paso (sin conocimientos técnicos)

### A) En Supabase (supabase.com)
1. Crea un proyecto nuevo (Create new project).
2. **Base de datos:** menú **SQL Editor** → New query → pega TODO `supabase/1_schema.sql` → **Run**. (Esto crea tablas, permisos y la carpeta de imágenes `productos`, que ya queda pública.)
3. **Tu usuario:** menú **Authentication → Users → Add user → Create new user**. Escribe tu correo y contraseña y marca **Auto Confirm User**.
4. **Hazte administrador:** abre `supabase/2_admin_y_datos.sql`, cambia `CAMBIA-ESTO@tucorreo.com` por tu correo, pégalo en SQL Editor → **Run**. (También carga categorías y 10 productos de ejemplo.)
5. **Dos datos de conexión:** **Project Settings → API**. Copia **Project URL** y la clave **anon / publishable**.

> **¿Ya tenías la versión anterior funcionando?** Solo ejecuta `supabase/3_actualizacion_promociones.sql` en SQL Editor (no repitas los pasos 1 y 2) y vuelve a publicar en Vercel.

> **Si ya tenías la tienda funcionando (versión v2):** ejecuta solo `supabase/4_actualizacion_fichas_y_categorias.sql` y luego publica el código nuevo con los comandos git.

### B) En Vercel (vercel.com)
1. Sube esta carpeta a GitHub e impórtala en Vercel (Add New → Project). Framework: Vite (se detecta solo).
2. En **Environment Variables** agrega (o importa un archivo `.env` con ellas):
   - `VITE_SUPABASE_URL` = tu Project URL
   - `VITE_SUPABASE_ANON_KEY` = tu clave anon
3. **Deploy**. Si cambias las variables después, haz **Redeploy**.

### C) Usar la tienda
- Tienda: tu dirección de Vercel. Panel: `/admin` con el correo del paso 3.
- Desde el panel: productos (con foto), categorías, pedidos, ajustes (WhatsApp, dirección, horario) y **crear más usuarios** (Ajustes y usuarios). Todo se ve al instante, sin volver a publicar.

## Probar en tu computadora (opcional)
Copia `.env.example` a `.env`, rellena los dos valores y ejecuta `npm install` y `npm run dev`.

## Promociones y ubicación
- Promociones: categoría **Promociones** (siempre primera). Para que un producto aparezca como oferta, escribe su *Precio anterior* en el panel: se muestra tachado y con el % de descuento. Las promos con foto forman el banner principal.
- Ubicación: dirección, horario y búsqueda del mapa se editan en Admin > Ajustes.

## Panel de administración
- **Promociones:** menú Promociones (crear, editar, borrar, foto, precio anterior).
- **Categorías:** foto, emoji, orden con flechas, visible/oculta, editar y borrar.
- **Productos:** descripción, ingredientes y *Tamaños y precios* (Personal, Mediana, Grande, Familiar…; tú decides cuántos). El cliente ve una ficha con ingredientes y elige el tamaño.
- **Pedidos:** el cliente elige Delivery, Recoger en local o Comer en el restaurante; se ve en cada pedido.

## Notas
- Los productos, fotos y precios de ejemplo son ilustrativos: reemplázalos por los reales.
- Los pedidos se guardan en Supabase y además se abre WhatsApp con el resumen.
- Nunca uses la clave `service_role` en este proyecto.
- Los datos de marca (logo, colores, nombre) están en `src/config/brand.ts` y `src/styles.css`.
