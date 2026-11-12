-- ERRANTE · PASO 1: pega TODO este archivo en Supabase > SQL Editor > Run (una sola vez).

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique not null, emoji text default '🍽️',
  sort int default 0, active boolean default true
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null, slug text unique not null, description text default '',
  price numeric(10,2) not null default 0, old_price numeric(10,2), image_url text default '', tag text default '',
  active boolean default true, featured boolean default false, created_at timestamptz default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null, phone text not null, address text default '', notes text default '',
  items jsonb not null, total numeric(10,2) not null, status text not null default 'nuevo',
  created_at timestamptz default now()
);
create table if not exists public.settings (key text primary key, value text not null default '');

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Permite al admin dar acceso a otro usuario (usada desde la pantalla Ajustes).
create or replace function public.add_admin(p_email text) returns void
language plpgsql security definer set search_path = public, auth as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'No autorizado'; end if;
  select id into uid from auth.users where lower(email) = lower(p_email);
  if uid is null then raise exception 'Usuario no encontrado'; end if;
  update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where id = uid;
  insert into public.admins (user_id, email) values (uid, lower(p_email)) on conflict do nothing;
end $$;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.settings enable row level security;

create policy "admins ven admins" on public.admins for select using (public.is_admin() or user_id = auth.uid());
create policy "admins borran admins" on public.admins for delete using (public.is_admin() and user_id <> auth.uid());
create policy "publico ve categorias" on public.categories for select using (active or public.is_admin());
create policy "admin gestiona categorias" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "publico ve productos" on public.products for select using (active or public.is_admin());
create policy "admin gestiona productos" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "publico ve ajustes" on public.settings for select using (true);
create policy "admin gestiona ajustes" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "cualquiera crea pedido" on public.orders for insert with check (status = 'nuevo' and total >= 0);
create policy "admin ve pedidos" on public.orders for select using (public.is_admin());
create policy "admin edita pedidos" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "admin borra pedidos" on public.orders for delete using (public.is_admin());

-- Carpeta de imágenes (bucket público "productos")
insert into storage.buckets (id, name, public) values ('productos', 'productos', true) on conflict (id) do nothing;
create policy "imagenes publicas" on storage.objects for select using (bucket_id = 'productos');
create policy "admin sube imagenes" on storage.objects for insert with check (bucket_id = 'productos' and public.is_admin());
create policy "admin cambia imagenes" on storage.objects for update using (bucket_id = 'productos' and public.is_admin());
create policy "admin borra imagenes" on storage.objects for delete using (bucket_id = 'productos' and public.is_admin());
