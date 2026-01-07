-- =====================================================
-- MIGRAÇÃO: Permitir nomes de usuário duplicados
-- =====================================================
-- Execute este script no SQL Editor do Supabase se você
-- já tem a tabela users criada e quer permitir múltiplos
-- usuários com o mesmo nome (mas telefones diferentes)
-- =====================================================

-- Remove a constraint UNIQUE do username
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_username_key;

-- Confirma que phone ainda é único (já deve ser, mas garante)
-- Se der erro aqui, é porque já existe a constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_phone_key' 
        AND conrelid = 'public.users'::regclass
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_phone_key UNIQUE (phone);
    END IF;
END $$;

-- =====================================================
-- MIGRAÇÃO COMPLETA!
-- =====================================================
-- Agora múltiplos usuários podem ter o mesmo nome,
-- desde que tenham telefones diferentes.
-- =====================================================

