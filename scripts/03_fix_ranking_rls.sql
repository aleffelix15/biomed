-- Opção Recomendada: View Pública para o Leaderboard

-- 1. Criar a view
CREATE OR REPLACE VIEW public.leaderboard_view AS
  SELECT id, full_name, avatar_url, total_points 
  FROM public.profiles;

-- 2. Garantir permissões de SELECT para usuários autenticados
GRANT SELECT ON public.leaderboard_view TO authenticated;
GRANT SELECT ON public.leaderboard_view TO anon;

