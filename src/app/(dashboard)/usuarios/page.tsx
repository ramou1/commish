// src/app/(dashboard)/usuarios/page.tsx
'use client'

import { Suspense } from 'react';
import UsuariosView from '@/views/admin/UsuariosView';

export default function UsuariosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <UsuariosView />
    </Suspense>
  );
}

