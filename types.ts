export interface SecretNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface SecretPhoto {
  id: string;
  dataUrl: string; // Base64 string
  name: string;
  createdAt: number;
}

export interface VaultSettings {
  pin: string;
  isSetup: boolean;
}

export enum VaultTab {
  NOTES = 'NOTES',
  PHOTOS = 'PHOTOS',
  SETTINGS = 'SETTINGS'
}