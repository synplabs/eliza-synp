/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PRIVY_APP_ID: string;
    // Ajoutez vos autres variables d'environnement ici
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
