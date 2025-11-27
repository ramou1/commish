// src/app/(dashboard)/agenda/page.tsx
'use client'

import { useProfile } from '@/contexts/ProfileContext';
import AgendaViewUsuario from '@/views/usuario/AgendaView';
import AgendaViewEmpresa from '@/views/empresa/AgendaView';
import AgendaViewAdmin from '@/views/admin/AgendaView';

export default function AgendaPage() {
  const { currentProfile } = useProfile();

  // Renderizar a visualização baseada no perfil atual
  switch (currentProfile) {
    case 'vendedor':
      return <AgendaViewUsuario />;
    case 'empresa':
      return <AgendaViewEmpresa />;
    case 'admin':
      return <AgendaViewAdmin />;
    default:
      return <AgendaViewUsuario />;
  }
}