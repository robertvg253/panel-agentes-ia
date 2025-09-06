import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";

interface LayoutProps {
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
}

export default function Layout({ user, agents = [] }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header móvil con botón hamburguesa */}
      <header className="lg:hidden bg-gradient-card border-b border-dark-600 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">Panel de Agentes IA</h1>
        <HamburgerButton 
          isOpen={isMobileMenuOpen} 
          onClick={toggleMobileMenu} 
        />
      </header>

      {/* Sidebar para desktop */}
      <div className="hidden lg:block">
        <Sidebar user={user} agents={agents} />
      </div>
      
      {/* Menú móvil */}
      <MobileMenu 
        user={user} 
        agents={agents} 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col">
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
