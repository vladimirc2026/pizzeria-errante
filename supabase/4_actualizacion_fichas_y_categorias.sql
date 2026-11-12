-- ERRANTE · ACTUALIZACIÓN v3 (si ya tenías la tienda funcionando). Pega todo en SQL Editor > Run.
alter table public.categories add column if not exists image_url text default '';
alter table public.products add column if not exists ingredients text default '';
alter table public.products add column if not exists variants jsonb not null default '[]'::jsonb;
alter table public.orders add column if not exists order_type text default 'delivery';

-- Tamaños e ingredientes de EJEMPLO para las pizzas (edítalos desde el panel: Productos > Editar).
update public.products set variants='[{"name":"Personal","price":35},{"name":"Mediana","price":55},{"name":"Grande","price":79},{"name":"Familiar","price":99}]'::jsonb, price=35,
  ingredients='Queso mozzarella, salsa de tomate, orégano, masa artesanal' where slug in ('pizza-de-la-casa','pizza-clasica','pizza-especial') and variants='[]'::jsonb;
update public.products set ingredients='Jamón, pepperoni, champiñones, aceitunas, queso mozzarella' where slug='pizza-especial' and ingredients='';
