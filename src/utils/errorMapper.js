export function mapAuthError(error) {
  if (!error) return null;

  const msg = error.message?.toLowerCase() || "";

  if (msg.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (msg.includes("user already registered")) {
    return "Este e-mail já está cadastrado.";
  }
  if (msg.includes("password should be at least 6 characters")) {
    return "Informe uma senha com pelo menos 6 caracteres.";
  }
  if (msg.includes("email not confirmed")) {
    return "Verifique seu e-mail para confirmar sua conta.";
  }
  if (msg.includes("too many requests")) {
    return "Muitas tentativas. Tente novamente mais tarde.";
  }

  return "Não foi possível realizar a operação. Tente novamente.";
}
