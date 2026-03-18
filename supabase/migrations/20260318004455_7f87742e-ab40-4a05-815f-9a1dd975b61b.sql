-- Delete existing user and recreate properly
DELETE FROM public.user_roles WHERE user_id = '3cb8d39e-7c5d-41df-a66b-d87fbdd96e5a';
DELETE FROM auth.identities WHERE user_id = '3cb8d39e-7c5d-41df-a66b-d87fbdd96e5a';
DELETE FROM auth.users WHERE id = '3cb8d39e-7c5d-41df-a66b-d87fbdd96e5a';