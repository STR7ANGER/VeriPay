create table if not exists payment_requests (
  payment_request_id text primary key,
  record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_requests_updated_at_idx
  on payment_requests (updated_at desc);
