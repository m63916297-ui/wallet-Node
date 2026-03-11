# Swiss Crypto Ramp 🏦

## Sistema de Compra y Venta de Criptomonedas - Suiza

Plataforma profesional de **Ramp On/Off** (entrada/salida de criptomonedas) con sede en Suiza, construida con arquitectura moderna y mejores prácticas de desarrollo.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Tecnologías Utilizadas](#tecnologías-utilizadas)
5. [Base de Datos](#base-de-datos)
6. [API REST Endpoints](#api-rest-endpoints)
7. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
8. [Desarrollo Local](#desarrollo-local)
9. [Despliegue con Docker](#despliegue-con-docker)
10. [Despliegue en Streamlit Cloud](#despliegue-en-streamlit-cloud)
11. [Funcionalidades](#funcionalidades)
12. [Seguridad](#seguridad)
13. [Licencia](#licencia)

---

## 📖 Descripción General

**Swiss Crypto Ramp** es una plataforma financiera que permite a usuarios en Suiza comprar y vender criptomonedas utilizando Francos Suizos (CHF). El sistema cumple con las regulaciones financieras suizas y ofrece una experiencia de usuario profesional.

### Tipos de Transacciones

| Tipo | Descripción | Comisiones |
|------|-------------|------------|
| **Ramp On** | Comprar criptomonedas con CHF | 1% |
| **Ramp Off** | Vender criptomonedas por CHF | 1.5% |

### Criptomonedas Soportadas

- **BTC** - Bitcoin
- **ETH** - Ethereum
- **USDT** - Tether (Stablecoin)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                     (Streamlit - Python)                         │
│                  http://localhost:8501                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                 │
│                  (Node.js + Express)                            │
│                  http://localhost:3000                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │    MySQL     │    │  CoinGecko   │
│  (Transac-   │    │   (Users &   │    │     API      │
│   ciones)    │    │   Wallets)   │    │   (Rates)    │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Patrón de Arquitectura

El sistema sigue una arquitectura **REST** con separación clara de responsabilidades:

- **Capa de Presentación**: Streamlit (Python)
- **Capa de Negocio**: Controllers en Node.js
- **Capa de Datos**: Modelos Mongoose/Sequelize
- **Capa de Seguridad**: Middleware JWT

---

## 📁 Estructura del Proyecto

```
wallet/
├── backend/                        # API REST (Node.js)
│   ├── src/
│   │   ├── config/
│   │   │   ├── mongodb.js         # Configuración MongoDB
│   │   │   └── mysql.js          # Configuración MySQL
│   │   ├── controllers/
│   │   │   ├── authController.js # Lógica de autenticación
│   │   │   └── transactionController.js # Lógica de transacciones
│   │   ├── models/
│   │   │   ├── index.js          # Modelos combinados
│   │   │   ├── Transaction.js    # Modelo MongoDB (transacciones)
│   │   │   ├── User.js           # Modelo MySQL (usuarios)
│   │   │   └── Wallet.js         # Modelo MySQL (billeteras)
│   │   ├── routes/
│   │   │   ├── auth.js           # Rutas de autenticación
│   │   │   └── transactions.js    # Rutas de transacciones
│   │   ├── middleware/
│   │   │   └── auth.js           # Middleware JWT
│   │   └── index.js              # Punto de entrada
│   ├── .env                      # Variables de entorno
│   └── package.json               # Dependencias Node.js
│
├── frontend/                      # Interfaz (Streamlit)
│   ├── app.py                    # Aplicación principal
│   ├── requirements.txt           # Dependencias Python
│   ├── .streamlit/
│   │   └── config.toml           # Configuración Streamlit
│   ├── SKILLS.md                 # Habilidades del sistema
│   ├── RULES.md                  # Reglas de negocio
│   └── STREAMLIT_CLOUD.md        # Guía de despliegue cloud
│
├── docker-compose.yml            # Orquestación de contenedores
├── Dockerfile.backend            # Imagen Docker backend
├── Dockerfile.frontend           # Imagen Docker frontend
└── README.md                      # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web |
| **Mongoose** | 8.0.0 | ODM MongoDB |
| **Sequelize** | 6.35.0 | ORM MySQL |
| **MySQL2** | 3.6.0 | Driver MySQL |
| **JWT** | 9.0.2 | Autenticación |
| **Bcryptjs** | 2.4.3 | Hash de contraseñas |
| **Axios** | 1.6.0 | HTTP Client |
| **Helmet** | 7.1.0 | Seguridad headers |
| **CORS** | 2.8.5 | Cross-origin |
| **Dotenv** | 16.3.1 | Variables de entorno |

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Streamlit** | 1.28+ | Framework UI |
| **Python** | 3.11+ | Lenguaje |
| **Requests** | 2.31.0 | HTTP Client |
| **Python-dotenv** | 1.0.0 | Variables de entorno |

### Infraestructura

| Tecnología | Uso |
|------------|-----|
| **Docker** | Contenedores |
| **Docker Compose** | Orquestación |
| **MongoDB** | Base de datos documentos |
| **MySQL** | Base de datos relacional |

---

## 💾 Base de Datos

### MongoDB (Transacciones)

Colección: `transactions`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "RAMP_ON" | "RAMP_OFF",
  cryptoCurrency: "BTC" | "ETH" | "USDT",
  amount: Number,
  amountFiat: Number,
  fiatCurrency: "CHF",
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED",
  paymentMethod: "BANK_TRANSFER" | "CREDIT_CARD" | "CRYPTO_WALLET",
  walletAddress: String,
  bankDetails: {
    accountNumber: String,
    iban: String,
    swift: String,
    bankName: String
  },
  transactionHash: String,
  exchangeRate: Number,
  fees: Number,
  metadata: Mixed,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MySQL (Usuarios y Wallets)

#### Tabla: users

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Primary key |
| email | VARCHAR(255) | Email único |
| password | VARCHAR(255) | Hash bcrypt |
| firstName | VARCHAR(100) | Nombre |
| lastName | VARCHAR(100) | Apellido |
| phoneNumber | VARCHAR(50) | Teléfono |
| country | VARCHAR(100) | País (default: Switzerland) |
| kycStatus | ENUM | Estado KYC |
| kycLevel | INT | Nivel KYC |
| isActive | BOOLEAN | Cuenta activa |
| lastLogin | DATETIME | Último login |
| swissResident | BOOLEAN | Residente suizo |

#### Tabla: wallets

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Primary key |
| userId | INT | FK users |
| currency | VARCHAR(10) | BTC, ETH, USDT |
| address | VARCHAR(255) | Dirección crypto |
| balance | DECIMAL(20,8) | Balance |
| isActive | BOOLEAN | Activa |
| label | VARCHAR(100) | Etiqueta |

---

## 🔌 API REST Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/profile` | Obtener perfil |

#### Registro
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.ch",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+41791234567",
  "swissResident": true
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.ch",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.ch",
    "firstName": "John",
    "lastName": "Doe",
    "kycStatus": "PENDING",
    "kycLevel": 0
  }
}
```

### Transacciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/transactions/ramp-on` | Comprar crypto |
| POST | `/api/transactions/ramp-off` | Vender crypto |
| GET | `/api/transactions` | Listar transacciones |
| GET | `/api/transactions/:id` | Ver transacción |
| GET | `/api/transactions/rates` | Tasas de cambio |

#### Ramp On (Comprar)
```bash
POST /api/transactions/ramp-on
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "cryptoCurrency": "BTC",
  "paymentMethod": "BANK_TRANSFER",
  "walletAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
}
```

#### Ramp Off (Vender)
```bash
POST /api/transactions/ramp-off
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 0.01,
  "cryptoCurrency": "BTC",
  "walletAddress": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "bankDetails": {
    "bankName": "UBS AG",
    "iban": "CH1231231231234567890"
  }
}
```

#### Tasas de Cambio
```bash
GET /api/transactions/rates?currencies=bitcoin,ethereum,tether

Response:
{
  "bitcoin": { "chf": 45000, "usd": 50000, "eur": 46000 },
  "ethereum": { "chf": 2800, "usd": 3100, "eur": 2850 },
  "tether": { "chf": 0.92, "usd": 1.00, "eur": 0.98 }
}
```

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servicio |

```bash
GET /api/health

Response:
{
  "status": "ok",
  "service": "Swiss Crypto Ramp API",
  "timestamp": "2026-03-11T12:00:00.000Z"
}
```

---

## ⚙️ Configuración de Variables de Entorno

### Backend (.env)

```bash
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/swiss_crypto_ramp

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=swiss_crypto_ramp

# SQLite (desarrollo)
SQL_DATABASE=./database.sqlite

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Crypto
CRYPTO_API_URL=https://api.coingecko.com/api/v3
```

### Frontend (Streamlit Secrets)

```toml
# .streamlit/secrets.toml
[secrets]
API_BASE_URL = "https://your-backend-api.com/api"
```

---

## 💻 Desarrollo Local

### Requisitos Previos

- Node.js 18+
- Python 3.11+
- MongoDB (local o Atlas)
- MySQL 8.0+

### Instalación Backend

```bash
# Navegar al directorio backend
cd wallet/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor
npm run dev
```

### Instalación Frontend

```bash
# Navegar al directorio frontend
cd wallet/frontend

# Crear entorno virtual (opcional)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar secrets
mkdir -p .streamlit
echo '[secrets]
API_BASE_URL = "http://localhost:3000/api"' > .streamlit/secrets.toml

# Iniciar aplicación
streamlit run app.py
```

### Verificación

| Servicio | URL |
|----------|-----|
| Backend API | http://localhost:3000/api/health |
| Frontend | http://localhost:8501 |

---

## 🐳 Despliegue con Docker

### Construcción y Ejecución

```bash
# Navegar al directorio del proyecto
cd wallet

# Construir imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver estado de servicios
docker-compose ps

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Servicios Docker

| Servicio | Puerto | Imagen |
|----------|--------|--------|
| Frontend | 8501 | streamlit |
| Backend | 3000 | node:18-alpine |
| MongoDB | 27017 | mongo:7.0 |
| MySQL | 3306 | mysql:8.0 |

### Datos Persistentes

Los volúmenes Docker mantienen los datos:

- `mongo_data` - Datos MongoDB
- `mysql_data` - Datos MySQL

---

## ☁️ Despliegue en Streamlit Cloud

### Pasos para Desplegar

1. **Preparar Repositorio**
   ```bash
   # Estructura requerida en GitHub
   wallet/
   ├── frontend/
   │   ├── app.py
   │   ├── requirements.txt
   │   ├── .streamlit/
   │   │   └── config.toml
   │   ├── SKILLS.md
   │   ├── RULES.md
   │   └── STREAMLIT_CLOUD.md
   ```

2. **Conectar a Streamlit Cloud**
   - Ir a https://share.streamlit.io
   - Iniciar sesión con GitHub
   - Seleccionar repositorio

3. **Configurar Despliegue**
   - **Main file path**: `wallet/frontend/app.py`
   - **Python version**: `3.11`

4. **Configurar Secrets**
   En Settings > Secrets:
   ```toml
   [secrets]
   API_BASE_URL = "https://tu-backend-production.onrender.com/api"
   ```

5. **Desplegar**

### Backend en Producción

Opciones recomendadas para el backend:

| Servicio | URL | Notas |
|----------|-----|-------|
| **Render** | render.com | Gratis, easy setup |
| **Railway** | railway.app | Muy bueno |
| **Fly.io** | fly.io | Edge deployment |
| **DigitalOcean** | digitalocean.com | Droplet |

### Configuración Render (Ejemplo)

1. Crear cuenta en render.com
2. New Web Service
3. Conectar GitHub
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Agregar Environment Variables

---

## ✨ Funcionalidades

### Usuario

- [x] Registro con email y contraseña
- [x] Inicio de sesión seguro
- [x] Perfil de usuario
- [x] Billeteras por defecto (BTC, ETH, USDT)
- [x] Historial de transacciones

### Transacciones

- [x] Ramp On (comprar crypto)
- [x] Ramp Off (vender crypto)
- [x] Tasas de cambio en tiempo real
- [x] Cálculo automático de comisiones
- [x] Estado de transacción en tiempo real

### Monitoreo

- [x] Health check endpoint
- [x] Logs de transacciones
- [x] Manejo de errores

---

## 🔒 Seguridad

### Implementaciones de Seguridad

1. **Autenticación JWT**
   - Tokens con expiración de 7 días
   - Headers Authorization: Bearer

2. **Hash de Contraseñas**
   - Bcrypt con salt rounds: 10
   - Nunca se almacenan contraseñas en texto plano

3. **Validación de Entrada**
   - Express-validator para sanitización
   - Validación de emails, contraseñas, etc.

4. **Headers de Seguridad**
   - Helmet.js para headers HTTP seguros
   - CORS configurado

5. **Variables de Entorno**
   - Secrets nunca en código fuente
   - JWT_SECRET obligatorio en producción

### Buenas Prácticas Recomendadas

- Usar HTTPS en producción
- Implementar 2FA
- Rate limiting en API
- Logging de auditoría
- KYC/AML compliance

---

## 📝 Notas Adicionales

### Comisiones

| Operación | Comisión |
|-----------|----------|
| Ramp On | 1% |
| Ramp Off | 1.5% |
| Depósito CHF | Gratis |
| Retirada CHF | Según banco |

### Límites

| Tipo | Mínimo | Máximo |
|------|--------|--------|
| Ramp On | 100 CHF | 50,000 CHF |
| Ramp Off | 0.001 BTC | Según KYC |

### Moneda Fiat

- **Principal**: CHF (Franco Suizo)
- Compatible con EUR, USD (futuro)

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

---

## 📞 Soporte

Para consultas técnicas:
- Email: support@swisscryptoramp.ch
- Web: https://swisscryptoramp.ch

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2026  
**Jurisdicción**: Suiza 🇨🇭
