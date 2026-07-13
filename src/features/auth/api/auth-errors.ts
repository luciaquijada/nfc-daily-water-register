import { AuthError } from '@supabase/supabase-js'

// Traduce errores de Supabase Auth a mensajes accionables en español.
// Nunca expone el mensaje técnico crudo del proveedor.
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'invalid_credentials':
        return 'Correo o contraseña incorrectos.'
      case 'email_not_confirmed':
        return 'Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.'
      case 'user_already_exists':
      case 'email_exists':
        return 'Ya existe una cuenta con este correo.'
      case 'weak_password':
        return 'La contraseña es demasiado débil. Usa al menos 8 caracteres.'
      case 'same_password':
        return 'La nueva contraseña debe ser distinta de la anterior.'
      case 'over_email_send_rate_limit':
      case 'over_request_rate_limit':
        return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
      case 'validation_failed':
        return 'Revisa los datos introducidos.'
      default:
        return 'No se ha podido completar la acción. Inténtalo de nuevo.'
    }
  }

  // Errores de red u otros no controlados.
  return 'Comprueba tu conexión y vuelve a intentarlo.'
}
