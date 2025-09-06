import { type LoaderFunctionArgs, redirect, Outlet, useLoaderData } from "react-router";
import { supabaseServer } from "~/supabase/supabaseServer";
import Layout from "~/components/Layout";

// Función para verificar autenticación en todas las rutas del layout
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await supabaseServer.auth.getSession();
  
  // Si no está autenticado, redirigir al login
  if (!session.data.session) {
    throw redirect("/");
  }

  // Obtener agentes para el sidebar
  console.log("🔍 Intentando cargar agentes desde la base de datos...");
  
  // Primero, probemos una consulta más amplia para ver qué hay en la tabla
  const { data: allData, error: allDataError } = await supabaseServer
    .from('prompt_agentes')
    .select('*')
    .limit(10);
  
  if (allDataError) {
    console.error("❌ Error al cargar todos los datos:", allDataError);
  } else {
    console.log("📊 Todos los datos en la tabla:", allData);
    console.log("📊 Cantidad total de registros:", allData?.length || 0);
  }
  
  // Ahora la consulta original
  const { data: agents, error: agentsError } = await supabaseServer
    .from('prompt_agentes')
    .select('id, desarrollo_id')
    .order('updated_at', { ascending: false });
  
  if (agentsError) {
    console.error("❌ Error al cargar agentes:", agentsError);
  } else {
    console.log("✅ Agentes cargados exitosamente:", agents);
    console.log("✅ Cantidad de agentes:", agents?.length || 0);
  }
  
  return {
    user: session.data.session.user,
    agents: agents || []
  };
}

export default function LayoutRoute() {
  const { user, agents } = useLoaderData<typeof loader>();
  
  return <Layout user={user} agents={agents}><Outlet /></Layout>;
}
