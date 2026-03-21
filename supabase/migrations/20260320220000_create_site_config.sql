create table public.site_config (
  id integer primary key default 1,
  logo_url text,
  hero_image_url text,
  hero_title text,
  hero_subtitle text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.site_config enable row level security;

create policy "Allow public read access to site_config"
on public.site_config for select
using (true);

create policy "Allow authenticated update to site_config"
on public.site_config for update
to authenticated
using (true)
with check (true);

create policy "Allow authenticated insert to site_config"
on public.site_config for insert
to authenticated
with check (true);

insert into public.site_config (id, hero_title, hero_subtitle) 
values (
  1, 
  'NÃO DECORE SUA PAREDE. DECLARE QUEM VOCÊ É.', 
  'Quadros em Alumínio Premium e MDF de alta densidade. Identidade visual para quem não aceita o comum.'
);
