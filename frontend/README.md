# Lucid Analytics Frontend

Dashboard de métricas para Meta Ads + LucidBot.

## 🚀 Deploy en Vercel

1. Sube este repositorio a GitHub
2. Ve a [vercel.com](https://vercel.com) e importa el repo
3. Configura las variables de entorno:
   - `VITE_API_URL`: URL de tu API backend
   - `VITE_META_APP_ID`: ID de tu app de Meta (para OAuth)
4. Deploy automático

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear archivo de entorno
cp .env.example .env

# Editar .env con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura

```
src/
├── components/     # Componentes reutilizables
├── context/        # Contextos de React (Auth)
├── pages/          # Páginas de la aplicación
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Connect.jsx
│   ├── Settings.jsx
│   └── Admin.jsx
├── utils/          # Utilidades (API client)
├── App.jsx         # Router principal
├── main.jsx        # Entry point
└── index.css       # Estilos globales
```

## 🔐 Sistema de Acceso

- Los usuarios necesitan un **código de invitación** para registrarse
- Los códigos se generan desde el panel de Admin
- Cada código tiene usos limitados y fecha de expiración

## 📊 Funcionalidades

- **Dashboard**: Métricas de Meta Ads + LucidBot combinadas
- **Conexiones**: Vincular cuentas de Meta y LucidBot
- **Admin**: Gestionar usuarios y códigos de invitación
- **Settings**: Configuración de perfil y contraseña

## 🛠 Stack

- React 18 + Vite
- React Router DOM
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (iconos)
