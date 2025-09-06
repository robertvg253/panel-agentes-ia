import { useState } from "react";
import { Link, useLocation, Form } from "react-router";

interface MobileMenuProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  agents?: Array<{
    id: string;
    desarrollo_id: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ user, agents = [], isOpen, onClose }: MobileMenuProps) {
  const [isAgentsExpanded, setIsAgentsExpanded] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isAgentActive = (agentId: string) => {
    return location.pathname === `/agent/${agentId}`;
  };

  const handleLinkClick = () => {
    onClose(); // Cerrar el menú al hacer clic en un enlace
  };

  return (
    <>
      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Menú móvil */}
      <div className={`
        fixed top-0 left-0 h-screen w-3/4 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out
        lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header del menú móvil */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              Panel de Agentes IA
            </h1>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="text-sm text-gray-300 mt-2">
            <p className="font-medium">
              {user.user_metadata?.full_name || "Usuario"}
            </p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto bg-gray-900">
          <ul className="space-y-2">
            {/* Dashboard */}
            <li>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                  />
                </svg>
                Dashboard
              </Link>
            </li>

            {/* Módulo 2 */}
            <li>
              <Link
                to="/modulo2"
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive("/modulo2")
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-3"
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
                Módulo 2
              </Link>
            </li>

            {/* Agentes - Expandible */}
            <li>
              <button
                onClick={() => setIsAgentsExpanded(!isAgentsExpanded)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3"
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
                  Agentes
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isAgentsExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Lista de Agentes */}
              {isAgentsExpanded && (
                <ul className="ml-6 mt-2 space-y-1">
                  {agents.length > 0 ? (
                    agents.map((agent) => (
                      <li key={agent.id}>
                        <Link
                          to={`/agent/${agent.id}`}
                          onClick={handleLinkClick}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                            isAgentActive(agent.id)
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 mr-2"
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
                          {agent.desarrollo_id}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-gray-500">
                      No hay agentes creados
                    </li>
                  )}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Footer - Cerrar Sesión */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
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
      </div>
    </>
  );
}
