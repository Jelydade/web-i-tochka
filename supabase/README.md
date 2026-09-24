# Промокоды

1. В Supabase SQL Editor выполните `promo-codes.sql`.
2. Разверните Edge Function из `functions/validate-promo` под именем `validate-promo`.
3. В `index.html` заполните `window.PROMO_CONFIG`:

```js
window.PROMO_CONFIG = {
  endpoint: 'https://YOUR_PROJECT.supabase.co/functions/v1/validate-promo',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
};
```

`anonKey` можно размещать в клиентском коде. `service_role` ключ остаётся только в настройках Edge Function.

## Новый промокод

Создайте запись в Table Editor или выполните SQL:

```sql
insert into public.promo_codes (code, expires_at)
values ('K7P2X', '2026-12-31 23:59:59+03');
```

После подтверждения заказа смените `status` на `redeemed`. Ввод промокода на сайте сам по себе его не списывает.
