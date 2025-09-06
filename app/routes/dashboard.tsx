import { Link, Form } from "react-router";

export default function DashboardPage() {

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-gradient-card rounded-2xl shadow-dark-lg p-8 border border-dark-600">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1"></div>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </button>
          </Form>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            ¡Bienvenido al Panel de Agentes IA!
          </h1>
          <p className="text-dark-300 text-lg mb-8">
            Gestiona tus agentes de inteligencia artificial de forma eficiente y profesional
          </p>
          
          {/* Botón principal para crear agente */}
          <Link
            to="/agent/new"
            className="inline-flex items-center bg-gradient-button text-white font-semibold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-200 text-lg shadow-dark-lg"
          >
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Crear Nuevo Agente
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-card rounded-xl shadow-dark-lg p-6 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 bg-accent-600/20 rounded-lg">
              <svg
                className="w-6 h-6 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-dark-300">Agentes Activos</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-card rounded-xl shadow-dark-lg p-6 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-dark-300">Versiones Guardadas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-card rounded-xl shadow-dark-lg p-6 border border-dark-600">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-dark-300">Interacciones Hoy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-gradient-card rounded-2xl shadow-dark-lg p-6 lg:p-8 border border-dark-600">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Link
            to="/agent/new"
            className="flex items-center p-4 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors duration-200 group"
          >
            <div className="p-2 bg-accent-600/20 rounded-lg group-hover:bg-accent-600/30 transition-colors duration-200">
              <svg
                className="w-5 h-5 text-accent-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-white">Crear Agente</h3>
              <p className="text-sm text-dark-300">Configura un nuevo agente de IA</p>
            </div>
          </Link>

          <Link
            to="/modulo2"
            className="flex items-center p-4 bg-dark-700/50 hover:bg-dark-700 rounded-lg transition-colors duration-200 group"
          >
            <div className="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors duration-200">
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-white">Módulo 2</h3>
              <p className="text-sm text-dark-300">Accede a funcionalidades adicionales</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
