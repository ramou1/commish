// src/app/(dashboard)/agenda/page.tsx
'use client'

import { useProfile } from '@/contexts/ProfileContext';
import AgendaViewVendedor from '@/views/vendedor/AgendaView';
import AgendaViewEmpresa from '@/views/empresa/AgendaView';
import AgendaViewAdmin from '@/views/admin/AgendaView';

export default function AgendaPage() {
  const { currentProfile } = useProfile();

  // Renderizar a visualização baseada no perfil atual
  switch (currentProfile) {
    case 'vendedor':
      return <AgendaViewVendedor />;
    case 'empresa':
      return <AgendaViewEmpresa />;
    case 'admin':
      return <AgendaViewAdmin />;
    default:
      return <AgendaViewVendedor />;
  }
}