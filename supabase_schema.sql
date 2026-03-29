-- Supabase SQL Schema for Aura Mastery

-- Create the products table
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price numeric not null,
  affiliate_url text not null,
  image_url text,
  images text[] default '{}',
  category text default 'Tech',
  click_count integer default 0
);

-- Create the subscribers table
create table subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique not null
);

-- Create the contacts table
create table contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null
);

-- Create the media_requests table
create table media_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  company_name text not null,
  contact_name text not null,
  email text not null,
  website text,
  budget_range text,
  message text
);

-- Create the blogs table
create table blogs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  image_url text not null,
  author text not null,
  category text not null,
  slug text unique not null
);

-- Enable Row Level Security
alter table products enable row level security;
alter table subscribers enable row level security;
alter table contacts enable row level security;
alter table media_requests enable row level security;
alter table blogs enable row level security;

-- Create policies
-- 1. Allow anyone to read products
create policy "Allow public read access"
  on products for select
  using (true);

-- 2. Allow authenticated users (admins) to perform all actions
create policy "Allow admin full access"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 3. Allow anyone to insert subscribers
create policy "Allow public insert access"
  on subscribers for insert
  with check (true);

-- 4. Allow anyone to insert contacts
create policy "Allow public insert contacts"
  on contacts for insert
  with check (true);

-- 5. Allow anyone to insert media requests
create policy "Allow public insert media_requests"
  on media_requests for insert
  with check (true);

-- 6. Allow authenticated users (admins) to read subscribers
create policy "Allow admin read subscribers"
  on subscribers for select
  using (auth.role() = 'authenticated');

-- 7. Allow authenticated users (admins) to read contacts
create policy "Allow admin read contacts"
  on contacts for select
  using (auth.role() = 'authenticated');

-- 8. Allow authenticated users (admins) to read media requests
create policy "Allow admin read media_requests"
  on media_requests for select
  using (auth.role() = 'authenticated');

-- 9. Allow anyone to read blogs
create policy "Allow public read blogs"
  on blogs for select
  using (true);

-- 10. Allow authenticated users (admins) to perform all actions on blogs
create policy "Allow admin full access blogs"
  on blogs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Instructions:
-- 1. Go to your Supabase Dashboard -> SQL Editor
-- 2. Paste the above SQL and run it.
-- 3. Go to Authentication -> Providers and ensure Google or Email/Password is enabled.
-- 4. Create your admin user in Authentication -> Users.
