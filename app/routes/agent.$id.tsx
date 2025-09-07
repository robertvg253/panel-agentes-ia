import { type LoaderFunctionArgs, type ActionFunctionArgs, redirect, useLoaderData, useActionData, useNavigation } from "react-router";
import { supabaseServer } from "~/supabase/supabaseServer";
import { useState, useEffect } from "react";
import Toast from "~/components/Toast";
import { useToast } from "~/hooks/useToast";

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

// Función para manejar la actualización de agentes
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await supabaseServer.auth.getSession();
  
  if (!session.data.session) {
    throw redirect("/");
  }

  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;

  if (actionType === "update") {
    // Obtener todos los campos del formulario (sin desarrollo_id que no es editable)
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

    // Validar campos requeridos (sin desarrollo_id)
    if (!rol || !camino_atencion) {
      return {
        error: "Por favor, completa todos los campos requeridos (Rol y Camino de Atención)"
      };
    }

    try {
      // Obtener el registro actual para conocer la versión
      const { data: currentAgent, error: fetchError } = await supabaseServer
        .from('prompt_agentes')
        .select('version')
        .eq('id', params.id)
        .single();

      if (fetchError) {
        console.error("Error fetching current agent:", fetchError);
        throw fetchError;
      }

      const newVersion = (currentAgent.version || 0) + 1;
      console.log(`🔄 Actualizando agente ${params.id} a versión ${newVersion}`);

      // Actualizar el registro principal (sin desarrollo_id que no es editable)
      const { data: updatedAgent, error: updateError } = await supabaseServer
        .from('prompt_agentes')
        .update({
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
          version: newVersion
        })
        .eq('id', params.id)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating agent:", updateError);
        throw updateError;
      }

      console.log("✅ Agente actualizado exitosamente");

      // Obtener el usuario de la sesión
      const userId = session.data.session.user.id;
      const userEmail = session.data.session.user.email;
      
      console.log("👤 Usuario autenticado:", {
        id: userId,
        email: userEmail
      });

      // Verificar si el usuario existe en la tabla users
      let userExists = null;
      const { data: existingUser, error: userCheckError } = await supabaseServer
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        console.error("Error verificando usuario:", userCheckError);
      } else if (existingUser) {
        userExists = existingUser;
      }

      console.log("🔍 Usuario existe en tabla users:", !!userExists);

      // Si el usuario no existe, crearlo automáticamente
      if (!userExists) {
        console.log("👤 Creando usuario en tabla users...");
        const { data: newUser, error: createUserError } = await supabaseServer
          .from('users')
          .insert([{
            id: userId,
            email: userEmail,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (createUserError) {
          console.error("❌ Error creando usuario:", createUserError);
        } else {
          console.log("✅ Usuario creado exitosamente:", newUser);
          userExists = newUser;
        }
      }

      // Crear registro en el historial
      const historyData = {
        agente_id: params.id,
        edited_by: userExists ? userId : null, // Solo usar el ID si existe en la tabla users
        version: newVersion,
        rol,
        camino_atencion,
        uso_multimedia: uso_multimedia || null,
        cierre: cierre || null,
        flujo_atencion: flujo_atencion || null,
        reglas_respuesta: reglas_respuesta || null,
        faq: faq || null,
        informacion_proyecto: informacion_proyecto || null,
        modelos: modelos || null,
        tutoriales_credito: tutoriales_credito || null
        // updated_at se maneja automáticamente por la BD con default now()
      };

      console.log("📝 Insertando en historial:", historyData);

      const { data: historyResult, error: historyError } = await supabaseServer
        .from('agentes_historial')
        .insert([historyData])
        .select();

      if (historyError) {
        console.error("❌ Error al guardar en historial:", historyError);
        throw new Error(`Error al guardar historial: ${historyError.message}`);
      }

      console.log("✅ Historial guardado exitosamente:", historyResult);

      return {
        success: "Agente actualizado correctamente",
        agent: updatedAgent,
        version: newVersion
      };
    } catch (error) {
      console.error("❌ Error updating agent:", error);
      return {
        error: error instanceof Error ? error.message : "Error al guardar el agente. Intenta de nuevo."
      };
    }
  }

  return { error: "Acción no válida" };
}

// Definir los campos del agente con sus etiquetas (sin desarrollo_id que no es editable)
const agentFields = [
  { key: 'rol', label: 'Rol del Agente', icon: '🎭' },
  { key: 'camino_atencion', label: 'Camino de Atención', icon: '🛤️' },
  { key: 'uso_multimedia', label: 'Uso Multimedia', icon: '🎬' },
  { key: 'cierre', label: 'Cierre', icon: '🔚' },
  { key: 'flujo_atencion', label: 'Flujo de Atención', icon: '🔄' },
  { key: 'reglas_respuesta', label: 'Reglas de Respuesta', icon: '📋' },
  { key: 'faq', label: 'Preguntas Frecuentes', icon: '❓' },
  { key: 'informacion_proyecto', label: 'Información del Proyecto', icon: '📊' },
  { key: 'modelos', label: 'Modelos', icon: '🤖' },
  { key: 'tutoriales_credito', label: 'Tutoriales de Crédito', icon: '💳' },
];

// Componente para campos editables
interface EditableFieldProps {
  fieldKey: string;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (fieldKey: string, value: string) => void;
  placeholder?: string;
}

function EditableField({ fieldKey, label, value, isEditing, onChange, placeholder }: EditableFieldProps) {
  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <label className="block text-xs font-medium text-custom-text-muted mb-2 flex-shrink-0">
          {label}
        </label>
        <textarea
          name={fieldKey}
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="flex-1 w-full bg-custom-card-bg border border-custom-border rounded-lg p-4 text-custom-text-light text-sm placeholder-custom-text-muted focus:ring-2 focus:ring-custom-accent focus:border-transparent resize-none overflow-y-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <label className="block text-xs font-medium text-custom-text-muted mb-2 flex-shrink-0">
        {label}
      </label>
      <div className="flex-1 bg-custom-card-bg border border-custom-border rounded-lg p-4 overflow-y-auto">
        {value ? (
          <div className="whitespace-pre-wrap text-custom-text-light text-sm leading-relaxed">
            {value}
          </div>
        ) : (
          <div className="text-custom-text-muted text-sm italic">
            {placeholder || "No hay contenido disponible para este campo"}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentFormPage() {
  const { agent } = useLoaderData<typeof loader>();
  const actionData = useActionData<{ error?: string; success?: string; agent?: any; version?: number }>();
  const navigation = useNavigation();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [selectedField, setSelectedField] = useState('rol');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  const isNew = !agent;
  const isSubmitting = navigation.state === "submitting";

  // Inicializar formData cuando se carga el agente
  useEffect(() => {
    if (agent) {
      const initialData: Record<string, string> = {};
      agentFields.forEach(field => {
        initialData[field.key] = agent[field.key as keyof typeof agent] || '';
      });
      setFormData(initialData);
    }
  }, [agent]);

  // Detectar cambios en el formulario
  useEffect(() => {
    if (agent && isEditing) {
      const hasFormChanges = agentFields.some(field => {
        const currentValue = agent[field.key as keyof typeof agent] || '';
        const formValue = formData[field.key] || '';
        return currentValue !== formValue;
      });
      setHasChanges(hasFormChanges);
    }
  }, [formData, agent, isEditing]);

  // Manejar respuestas del servidor
  useEffect(() => {
    if (actionData?.success) {
      setIsEditing(false);
      setHasChanges(false);
      showSuccess(`Agente actualizado exitosamente (v${actionData.version || 'N/A'})`);
      // Recargar la página para obtener los datos actualizados
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (actionData?.error) {
      showError(actionData.error);
    }
  }, [actionData, showSuccess, showError]);

  // Manejar cambios en los campos
  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Manejar el modo de edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar datos originales
    if (agent) {
      const originalData: Record<string, string> = {};
      agentFields.forEach(field => {
        originalData[field.key] = agent[field.key as keyof typeof agent] || '';
      });
      setFormData(originalData);
    }
    setHasChanges(false);
  };

  if (isNew) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-custom-card-bg rounded-2xl shadow-deep-dark p-8 border border-custom-border text-center max-w-md">
          <div className="text-custom-text-muted mb-6">
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
            className="inline-flex items-center bg-gradient-button-accent text-custom-text-light font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200"
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
      </div>
    );
  }

  const selectedFieldData = agentFields.find(field => field.key === selectedField);
  const selectedValue = agent?.[selectedField as keyof typeof agent] || '';

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-custom-card-bg border-b border-custom-border p-4 lg:p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-custom-text-light mb-1">
              {agent.desarrollo_id}
            </h1>
            <p className="text-sm lg:text-base text-custom-text-muted">
              Agente de Inteligencia Artificial
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-custom-accent text-custom-text-light hover:opacity-90 rounded-lg transition-all duration-200 text-sm lg:text-base font-medium"
                >
                   Editar
                </button>
                <a
                  href="/dashboard"
                  className="px-4 py-2 bg-custom-card-bg-light text-custom-text-muted hover:bg-custom-hover-bg hover:text-custom-text-light rounded-lg transition-colors duration-200 text-sm lg:text-base"
                >
                  ← Volver
                </a>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-custom-card-bg-light text-custom-text-muted hover:bg-custom-hover-bg hover:text-custom-text-light rounded-lg transition-colors duration-200 text-sm lg:text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="agent-form"
                  disabled={!hasChanges || isSubmitting}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base font-medium ${
                    hasChanges && !isSubmitting
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Contenido Principal - Doble Columna */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Columna Izquierda - Navegación de Campos (25% en desktop, 100% en móvil) */}
        <div className="w-full lg:w-1/4 bg-custom-card-bg border-b lg:border-b-0 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 p-3 lg:p-4 border-b border-custom-border">
            <h2 className="text-xs font-semibold text-custom-text-light">
              Campos del Agente
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-0">
                {agentFields.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => setSelectedField(field.key)}
                    className={`w-full text-left transition-all duration-200 ${
                      selectedField === field.key
                        ? 'bg-custom-card-bg-light text-custom-text-light p-2 lg:p-3'
                        : 'text-custom-text-muted hover:bg-custom-hover-bg hover:text-custom-text-light rounded-lg p-2 lg:p-3'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-xs mr-2 lg:mr-3">{field.icon}</span>
                      <span className="text-xs font-medium truncate">
                        {field.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Columna Derecha - Área de Contenido (75% en desktop, 100% en móvil) */}
        <div className="w-full lg:w-3/4 flex flex-col bg-custom-card-bg-light overflow-hidden">
          <div className="flex-shrink-0 p-3 lg:p-4">
            <h3 className="text-base lg:text-lg font-semibold text-custom-text-light flex items-center">
              <span className="mr-2 lg:mr-3">{selectedFieldData?.icon}</span>
              {selectedFieldData?.label}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 lg:p-6">
            <form id="agent-form" method="post" className="h-full">
              <input type="hidden" name="actionType" value="update" />
              {/* Campos ocultos para todos los datos del formulario */}
              {agentFields.map(field => (
                <input
                  key={field.key}
                  type="hidden"
                  name={field.key}
                  value={formData[field.key] || ''}
                />
              ))}
              <EditableField
                fieldKey={selectedField}
                label={selectedFieldData?.label || ''}
                value={isEditing ? (formData[selectedField] || '') : (selectedValue || '')}
                isEditing={isEditing}
                onChange={handleFieldChange}
                placeholder={`Ingresa el contenido para ${selectedFieldData?.label}`}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Toast de notificaciones */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
}
