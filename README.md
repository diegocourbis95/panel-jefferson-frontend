# Panel Jefferson Frontend

SPA React/Vite para el Panel Jefferson. Consume exclusivamente el backend FastAPI; no se conecta directamente a Supabase.

## Ejecutar localmente

```bash
cd panel-jefferson-frontend
npm install
copy .env.example .env
npm run dev
```

Vite servirá la aplicación en `http://localhost:5173`. El backend ya usa ese origen como valor por defecto de `CORS_ALLOWED_ORIGIN`, así que no es necesario cambiarlo para desarrollo local. Si eliges otro host o puerto, configura exactamente ese origen en el `.env` del backend y reinicia su servicio.

## Variables de entorno

En `.env` define:

```ini
VITE_API_URL=http://187.77.241.244:8004
VITE_INTERNAL_API_KEY=pega_aqui_la_internal_api_key_del_backend
```

No se codifica ninguna URL ni API key en los componentes.

## Nota de seguridad

Una variable `VITE_*` se incorpora al bundle de una SPA y, por tanto, la API key **no queda secreta** frente a quien pueda usar la aplicación. Es una limitación conocida y aceptada temporalmente para este uso interno y personal. La solución correcta a mediano plazo es sustituir esta autenticación por Supabase Auth con un login real y tokens de usuario de vida limitada.

## Comprobaciones

```bash
npm run build
```

La aplicación incluye rutas `/dashboard`, `/cobranza`, `/clientes`, `/calendario` y `/tareas`. En móvil la navegación se convierte en una barra inferior; no requiere Capacitor todavía.
