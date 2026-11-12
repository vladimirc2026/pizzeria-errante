-- ERRANTE · ACTUALIZACIÓN (solo si YA ejecutaste los pasos 1 y 2 de la versión anterior).
-- Pega todo en SQL Editor > Run. Agrega precio anterior, la categoría Promociones (primera) y 3 promos de ejemplo.
alter table public.products add column if not exists old_price numeric(10,2);
insert into public.categories (name, slug, emoji, sort) values ('Promociones','promociones','🔥',0) on conflict (slug) do nothing;
insert into public.settings (key, value) values ('map_query','Calle Colomi 2078, Jayhuayco, Cochabamba, Bolivia') on conflict (key) do nothing;

-- Promociones de EJEMPLO (precio normal tachado = old_price). Cambia nombres y precios desde el panel.
insert into public.products (category_id, name, slug, description, price, old_price, image_url, tag, featured)
select c.id, v.name, v.slug, v.descr, v.price, v.old, v.img, v.tag, true from (values
 ('Combo pizza + café','combo-pizza-cafe','1 pizza clásica + 2 cafés para compartir.',79,95,'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80','Combo'),
 ('Pizza de la casa en oferta','pizza-casa-oferta','Nuestra pizza favorita a precio especial.',55,65,'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80','Oferta'),
 ('Postre + helado','postre-helado','Un postre y un helado para endulzar el día.',39,48,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80','Dulce combo')
) as v(name,slug,descr,price,old,img,tag) join public.categories c on c.slug = 'promociones'
on conflict (slug) do nothing;
