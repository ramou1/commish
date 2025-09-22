// src/app/(dashboard)/layout.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Calculator, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  X,
  Bell,
  LogOut,
  ChevronDown,
  UserIcon
} from 'lucide-react';
import { User } from '@/types/user';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ProfileSelector } from '@/components/ui/profile-selector';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  {
    id: 'agenda',
    label: 'Agenda',
    href: '/agenda',
    icon: Calendar,
  },
  {
    id: 'orcamento',
    label: 'Orçamento',
    href: '/orcamento',
    icon: Calculator,
    disabled: true,
  },
  {
    id: 'clientes',
    label: 'Clientes',
    href: '/clientes',
    icon: Users,
    disabled: true,
  },
  {
    id: 'contratos',
    label: 'Contratos',
    href: '/contratos',
    icon: FileText,
    disabled: true,
  },
  {
    id: 'cadastros',
    label: 'Cadastros',
    href: '/cadastros',
    icon: Settings,
    disabled: true,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se o usuário está logado
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Função para extrair apenas o primeiro nome
  const getFirstName = (fullName: string) => {
    if (!fullName) return 'Usuário';
    return fullName.split(' ')[0];
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar para desktop */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col flex-1 bg-white border-r border-gray-100">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-100">
            {!sidebarCollapsed && (
              <h1 className="text-lg font-semibold tracking-tight text-gray-900">Commish</h1>
            )}
          </div>

          {/* Menu de navegação */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  href={item.disabled ? '#' : item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      item.disabled
                        ? 'text-gray-400'
                        : isActive
                        ? 'text-gray-700'
                        : 'text-gray-500 group-hover:text-gray-700'
                    } ${sidebarCollapsed ? '' : 'mr-3'}`}
                  />
                  {!sidebarCollapsed && (
                    <span>{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Informações do usuário */}
          <div className="flex-shrink-0 p-3 border-t border-gray-100">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-gray-600" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.nome || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar para mobile */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/25"
              onClick={closeSidebar}
            />

            {/* Sidebar */}
            <div className="relative flex flex-col w-80 bg-white">
              {/* Header com botão fechar */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                <h1 className="text-lg font-semibold tracking-tight text-gray-900">Commish</h1>
                <button
                  onClick={closeSidebar}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu de navegação */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.disabled ? '#' : item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.disabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={(e) => {
                        if (item.disabled) {
                          e.preventDefault();
                        } else {
                          closeSidebar();
                        }
                      }}
                    >
                      <Icon
                        className={`mr-3 h-4 w-4 ${
                          item.disabled
                            ? 'text-gray-400'
                            : isActive
                            ? 'text-gray-700'
                            : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Informações do usuário */}
              <div className="flex-shrink-0 p-3 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.nome || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Botões do menu */}
            <div className="flex items-center space-x-2">
              {/* Botão do menu mobile */}
              <button
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Breadcrumb */}
            <div className="flex-1 hidden lg:block">
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {pathname.replace('/', '') || 'Dashboard'}
              </h1>
            </div>

            {/* Ações do header */}
            <div className="flex items-center space-x-4">
              {/* Seletor de perfil */}
              <ProfileSelector />

              {/* Notificações */}
              <button className="text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Menu do usuário */}
              <div className="relative group">
                <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {getFirstName(user.nome)}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {/* Dropdown do usuário */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-100 shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Configurações
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      </div>
    </ProfileProvider>
  );
}