/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IOT_API: string
  readonly VITE_IOT_EXPRESS_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
