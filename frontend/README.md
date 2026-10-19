# WOW Burger — Frontend

React + Vite frontend for the WOW Burger digital menu and admin system.

## Tech Stack
- React 18
- Vite 5
- Tailwind CSS 3
- React Router v6
- Axios
- React Hot Toast
- Lucide React (icons)

## Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

App runs at: http://localhost:3000

## Mock Credentials (dev mode)

| Role       | Email                          | Password    |
|------------|-------------------------------|-------------|
| Superadmin | superadmin@wowburger.com      | password123 |
| Admin      | bole@wowburger.com            | password123 |

## Routes

### Public
| Route                          | Page              |
|-------------------------------|-------------------|
| `/`                           | → redirect /branch/1 |
| `/branch/:branchId`           | Menu page         |
| `/branch/:branchId/checkout`  | Checkout          |
| `/login`                      | Login             |

### Admin (protected)
| Route               | Page               | Role         |
|--------------------|--------------------|--------------|
| `/admin`           | Dashboard          | Admin+       |
| `/admin/products`  | Products CRUD      | Admin+       |
| `/admin/orders`    | Orders management  | Admin+       |
| `/admin/categories`| Categories CRUD    | Superadmin   |
| `/admin/branches`  | Branches CRUD      | Superadmin   |
| `/admin/users`     | Users CRUD         | Superadmin   |

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=true   # set to false when backend is ready
```

## Switching from Mock to Real API

1. Set `VITE_USE_MOCK=false` in `.env`
2. Set `VITE_API_URL` to your backend URL
3. Restart the dev server

All services in `src/services/` will automatically switch to real API calls.
