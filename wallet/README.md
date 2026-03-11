# Swiss Crypto Ramp 🏦

Sistema de compra y venta de criptomonedas (Ramp On/Off) con sede en Suiza.

## Características

- **Ramp On**: Compra criptomonedas con CHF (Franco Suizo)
- **Ramp Off**: Vende criptomonedas por CHF
- **Multi-moneda**: BTC, ETH, USDT
- **Backend**: Node.js + Express (REST API)
- **Frontend**: Streamlit (Python)
- **Bases de datos**:
  - MongoDB (transacciones y logs)
  - MySQL (usuarios y wallets)
- **Contenedores**: Docker + Docker Compose

## Estructura del Proyecto

```
├── backend/
│   ├── src/
│   │   ├── config/       # Configuración de BD
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── models/       # Modelos de datos
│   │   ├── routes/       # Rutas API
│   │   ├── middleware/   # Auth middleware
│   │   └── index.js      # Entry point
│   └── package.json
├── frontend/
│   ├── app.py           # App Streamlit
│   ├── requirements.txt
│   └── .streamlit/config.toml
├── docker-compose.yml
└── README.md
```

## Uso con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## Servicios

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Backend API | 3000 | REST API |
| Frontend | 8501 | Web UI Streamlit |
| MongoDB | 27017 | Base de datos NoSQL |
| MySQL | 3306 | Base de datos relacional |

## Endpoints API

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/profile` - Perfil de usuario

### Transacciones
- `POST /api/transactions/ramp-on` - Comprar crypto
- `POST /api/transactions/ramp-off` - Vender crypto
- `GET /api/transactions` - Historial de transacciones
- `GET /api/transactions/rates` - Tasas de cambio

## Desarrollo Local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
pip install -r requirements.txt
streamlit run app.py
```

## Notas

- Moneda fiat: CHF (Franco Suizo)
- Cumplimiento normativo suizo
- Tasas: 1% (Ramp On), 1.5% (Ramp Off)
