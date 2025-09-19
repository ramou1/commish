// src/types/profile.ts

export type ProfileType = 'usuario' | 'empresa' | 'admin';

export interface Profile {
  type: ProfileType;
  name: string;
  description: string;
  icon: string;
}

export const PROFILE_TYPES: Record<ProfileType, Profile> = {
  usuario: {
    type: 'usuario',
    name: 'Usuário',
    description: 'Visão individual de comissões',
    icon: '👤'
  },
  empresa: {
    type: 'empresa',
    name: 'Empresa',
    description: 'Gestão de equipe e comissões',
    icon: '🏢'
  },
  admin: {
    type: 'admin',
    name: 'Administrador',
    description: 'Controle total da plataforma',
    icon: '⚙️'
  }
};
