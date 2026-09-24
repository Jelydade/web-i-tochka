create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9]{5}$'),
  discount_percent smallint not null default 20 check (discount_percent = 20),
  expires_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'redeemed', 'disabled')),
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;
revoke all on table public.promo_codes from anon, authenticated;

create or replace function public.validate_promo_code(input_code text)
returns table (
  valid boolean,
  code text,
  discount_percent smallint,
  expires_at timestamptz,
  message text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  promo public.promo_codes%rowtype;
  normalized_code text := upper(trim(input_code));
begin
  select * into promo
  from public.promo_codes
  where public.promo_codes.code = normalized_code;

  if not found then
    return query select false, null::text, null::smallint, null::timestamptz, 'Промокод не найден.';
  elsif promo.status = 'redeemed' then
    return query select false, null::text, null::smallint, null::timestamptz, 'Этот промокод уже использован.';
  elsif promo.status <> 'active' then
    return query select false, null::text, null::smallint, null::timestamptz, 'Промокод отключён.';
  elsif promo.expires_at <= now() then
    return query select false, null::text, null::smallint, null::timestamptz, 'Срок действия промокода истёк.';
  end if;

  return query select true, promo.code, promo.discount_percent, promo.expires_at, null::text;
end;
$$;

revoke all on function public.validate_promo_code(text) from public;
grant execute on function public.validate_promo_code(text) to anon, authenticated;

-- После подтверждения заказа отметьте код использованным в Table Editor
-- или выполните: update public.promo_codes set status = 'redeemed', redeemed_at = now() where code = 'K7P2X';
