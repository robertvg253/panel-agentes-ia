import { useFetcher } from "react-router";

interface LoginFormProps {
  error?: string;
}

export default function LoginForm({ error }: LoginFormProps) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="min-h-screen bg-custom-bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Tarjeta del formulario */}
        <div className="bg-custom-card-bg rounded-2xl shadow-deep-dark p-8 border border-custom-border">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-custom-text-light mb-2">
              Panel de Agentes IA
            </h1>
            <p className="text-custom-text-muted">
              Inicia sesión para acceder al panel de control
            </p>
          </div>

          {/* Formulario */}
          <fetcher.Form 
            method="post" 
            className="space-y-6"
          >
            {/* Campo Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-custom-text-muted mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-custom-card-bg-light border border-custom-border rounded-lg text-custom-text-light placeholder-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Campo Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-custom-text-muted mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-custom-card-bg-light border border-custom-border rounded-lg text-custom-text-light placeholder-custom-text-muted focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-button-accent text-custom-text-light font-semibold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-custom-accent focus:ring-offset-2 focus:ring-offset-custom-bg-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-custom-text-light mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </fetcher.Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-custom-text-muted text-sm">
              Panel de gestión de agentes de inteligencia artificial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
