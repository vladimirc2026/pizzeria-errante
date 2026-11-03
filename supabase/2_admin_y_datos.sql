-- ERRANTE · PASO 2: antes de ejecutar, crea tu usuario en Supabase > Authentication > Users > Add user
-- (marca "Auto Confirm User"). Luego CAMBIA el correo de abajo por ese mismo correo y pulsa Run.

insert into public.admins (user_id, email)
select id, email from auth.users where lower(email) = lower('vladimirtrading2026@gmail.com')
on conflict do nothing;

insert into public.settings (key, value) values
 ('whatsapp','59168609243'),
 ('address','Calle Colomi #2078, entre calles Ayoma y Tablas, zona Jayhuayco, Cochabamba'),
 ('hours','Consulta nuestro horario por WhatsApp')
on conflict (key) do nothing;

insert into public.categories (name, slug, emoji, sort) values
 ('Pizzas','pizzas','🍕',1),('Café','cafe','☕',2),('Postres','postres','🍰',3),
 ('Helados','helados','🍨',4),('Masas','masas','🥐',5)
on conflict (slug) do nothing;

-- Productos de EJEMPLO (nombres, fotos y precios ilustrativos: edítalos desde el panel).
insert into public.products (category_id, name, slug, description, price, image_url, tag, featured)
select c.id, v.name, v.slug, v.descr, v.price, v.img, v.tag, v.feat from (values
 ('pizzas','Pizza de la casa','pizza-de-la-casa','Una pizza para compartir y disfrutar.',65,'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80','Favorito',true),
 ('pizzas','Pizza clásica','pizza-clasica','Una combinación clásica para cualquier ocasión.',60,'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80','Para compartir',true),
 ('pizzas','Pizza especial','pizza-especial','Una opción para quienes quieren probar algo más.',75,'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=80','De la casa',false),
 ('cafe','Café caliente','cafe-caliente','Una pausa aromática para cualquier momento.',15,'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=80','Pausa rica',true),
 ('cafe','Café con leche','cafe-con-leche','Suave, cremoso y perfecto para acompañar.',18,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80','Cremoso',false),
 ('postres','Pastel del día','pastel-del-dia','Un pequeño gusto para endulzar el día.',25,'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80','Dulce',true),
 ('postres','Postre de chocolate','postre-de-chocolate','Una propuesta para los amantes del chocolate.',28,'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80','Chocolate',false),
 ('helados','Helado especial','helado-especial','Una cucharada fresca para darte un gusto.',20,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80','Refrescante',false),
 ('helados','Helado con toppings','helado-con-toppings','Una combinación divertida y llena de sabor.',24,'https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=700&q=80','A tu gusto',true),
 ('masas','Masa recién horneada','masa-recien-horneada','Ideal para acompañar un café o compartir.',12,'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80','Recién hecha',false)
) as v(cat,name,slug,descr,price,img,tag,feat) join public.categories c on c.slug = v.cat
on conflict (slug) do nothing;
