import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect, useLoaderData, useActionData, useNavigation } from "react-router";
import { supabaseServer } from "~/supabase/supabaseServer";
import ReadOnlyField from "~/components/ReadOnlyField";

// Función para cargar datos del agente específico
export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await supabaseServer.auth.getSession();
  
  if (!session.data.session) {
    throw redirect("/");
  }

  let agent = null;
  
  // Si no es "new", cargar el agente específico
  if (params.id !== "new") {
    const { data, error } = await supabaseServer
      .from('prompt_agentes')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      console.error("Error loading agent:", error);
      throw new Response("Agente no encontrado", { status: 404 });
    }
    
    agent = data;
  }
  
  return { agent };
}

// Función para manejar la creación/actualización de agentes
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await supabaseServer.auth.getSession();
  
  if (!session.data.session) {
    throw redirect("/");
  }

  const formData = await request.formData();
  
  // Obtener todos los campos del formulario
  const desarrollo_id = formData.get("desarrollo_id") as string;
  const rol = formData.get("rol") as string;
  const camino_atencion = formData.get("camino_atencion") as string;
  const uso_multimedia = formData.get("uso_multimedia") as string;
  const cierre = formData.get("cierre") as string;
  const flujo_atencion = formData.get("flujo_atencion") as string;
  const reglas_respuesta = formData.get("reglas_respuesta") as string;
  const faq = formData.get("faq") as string;
  const informacion_proyecto = formData.get("informacion_proyecto") as string;
  const modelos = formData.get("modelos") as string;
  const tutoriales_credito = formData.get("tutoriales_credito") as string;

  // Validar campos requeridos
  if (!desarrollo_id || !rol || !camino_atencion) {
    return {
      error: "Por favor, completa todos los campos requeridos (Nombre, Rol y Camino de Atención)"
    };
  }

  try {
    if (params.id === "new") {
      // Crear nuevo agente
      const { data, error } = await supabaseServer
        .from('prompt_agentes')
        .insert([{
          desarrollo_id,
          rol,
          camino_atencion,
          uso_multimedia: uso_multimedia || null,
          cierre: cierre || null,
          flujo_atencion: flujo_atencion || null,
          reglas_respuesta: reglas_respuesta || null,
          faq: faq || null,
          informacion_proyecto: informacion_proyecto || null,
          modelos: modelos || null,
          tutoriales_credito: tutoriales_credito || null,
          version: 1
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Redirigir al agente creado
      throw redirect(`/agent/${data.id}`);
    } else {
      // Actualizar agente existente
      const { data, error } = await supabaseServer
        .from('prompt_agentes')
        .update({
          desarrollo_id,
          rol,
          camino_atencion,
          uso_multimedia: uso_multimedia || null,
          cierre: cierre || null,
          flujo_atencion: flujo_atencion || null,
          reglas_respuesta: reglas_respuesta || null,
          faq: faq || null,
          informacion_proyecto: informacion_proyecto || null,
          modelos: modelos || null,
          tutoriales_credito: tutoriales_credito || null,
          version: (formData.get("current_version") as string) ? 
            parseInt(formData.get("current_version") as string) + 1 : 1
        })
        .eq('id', params.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: "Agente actualizado correctamente"
      };
    }
  } catch (error) {
    console.error("Error saving agent:", error);
    return {
      error: "Error al guardar el agente. Intenta de nuevo."
    };
  }
}

export default function AgentFormPage() {
  const { agent } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ error?: string; success?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const isNew = !agent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-card rounded-2xl shadow-dark-lg p-4 lg:p-6 border border-dark-600">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          {isNew ? "Agente no encontrado" : `Agente: ${agent.desarrollo_id}`}
        </h1>
        <p className="text-dark-300 text-sm lg:text-base">
          {isNew 
            ? "El agente solicitado no existe o no tienes permisos para verlo" 
            : "Información detallada del agente de inteligencia artificial"
          }
        </p>
      </div>

      {/* Información del Agente */}
      {!isNew && (
        <div className="bg-gradient-card rounded-2xl shadow-dark-lg p-4 lg:p-8 border border-dark-600">
        <div className="space-y-3">
          {/* Campo Nombre del Agente */}
          <ReadOnlyField
            label="Nombre del Agente"
            value={agent?.desarrollo_id}
            placeholder="No se ha asignado un nombre al agente"
          />

          {/* Campo Rol */}
          <ReadOnlyField
            label="Rol del Agente"
            value={agent?.rol}
            placeholder="No se ha definido el rol del agente"
          />

          {/* Campo Camino de Atención */}
          <ReadOnlyField
            label="Camino de Atención"
            value={agent?.camino_atencion}
            placeholder="No se ha definido el camino de atención"
          />

          {/* Campo Uso Multimedia */}
          <ReadOnlyField
            label="Uso Multimedia"
            value={agent?.uso_multimedia}
            placeholder="No se han definido instrucciones de multimedia"
          />

          {/* Campo Cierre */}
          <ReadOnlyField
            label="Cierre"
            value={agent?.cierre}
            placeholder="No se han definido instrucciones de cierre"
          />

          {/* Campo Flujo de Atención */}
          <ReadOnlyField
            label="Flujo de Atención"
            value={agent?.flujo_atencion}
            placeholder="No se ha definido el flujo de atención"
          />

          {/* Campo Reglas de Respuesta */}
          <ReadOnlyField
            label="Reglas de Respuesta"
            value={agent?.reglas_respuesta}
            placeholder="No se han definido reglas de respuesta"
          />

          {/* Campo FAQ */}
          <ReadOnlyField
            label="Preguntas Frecuentes (FAQ)"
            value={agent?.faq}
            placeholder="No se han definido preguntas frecuentes"
          />

          {/* Campo Información del Proyecto */}
          <ReadOnlyField
            label="Información del Proyecto"
            value={agent?.informacion_proyecto}
            placeholder="No se ha definido información del proyecto"
          />

          {/* Campo Modelos */}
          <ReadOnlyField
            label="Modelos"
            value={agent?.modelos}
            placeholder="No se han definido modelos de IA"
          />

          {/* Campo Tutoriales de Crédito */}
          <ReadOnlyField
            label="Tutoriales de Crédito"
            value={agent?.tutoriales_credito}
            placeholder="No se han definido tutoriales de crédito"
          />
        </div>

          {/* Mensajes de estado */}
          {actionData?.error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-6">
              <p className="text-red-300">{actionData.error}</p>
            </div>
          )}

          {actionData?.success && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-6">
              <p className="text-green-300">{actionData.success}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6 border-t border-dark-600">
            <button
              disabled
              className="flex-1 bg-gradient-button text-white font-semibold py-3 px-6 rounded-lg opacity-50 cursor-not-allowed transition-all duration-200"
            >
              <div className="flex items-center justify-center">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar Agente
              </div>
            </button>

            <a
              href="/dashboard"
              className="px-6 py-3 bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white rounded-lg transition-colors duration-200 text-center"
            >
              Volver al Dashboard
            </a>
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay agente */}
      {isNew && (
        <div className="bg-gradient-card rounded-2xl shadow-dark-lg p-8 border border-dark-600 text-center">
          <div className="text-dark-400 mb-6">
            <svg
              className="w-16 h-16 mx-auto mb-4"
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
            <p className="text-lg">No se encontró el agente solicitado</p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center bg-gradient-button text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al Dashboard
          </a>
        </div>
      )}
    </div>
  );
}
