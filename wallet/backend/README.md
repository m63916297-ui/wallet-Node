# Swiss Crypto Ramp - Backend API 🏦

## Descripción

API REST completa del sistema Swiss Crypto Ramp, construida con Node.js y Express. Gestiona autenticación, transacciones, configuración de la plataforma y conexión a múltiples bases de datos.

---

## 📋 Tabla de Contenidos

1. [Arquitectura](#arquitectura)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Tecnologías](#tecnologías)
4. [Base de Datos](#base-de-datos)
5. [Modelos de Datos](#modelos-de-datos)
6. [API Endpoints](#api-endpoints)
7. [Configuración](#configuración)
8. [Instalación](#instalación)
9. [Uso](#uso)
10. [Configuración de Variables](#configuración-de-variables)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                            │
│                    Node.js + Express                        │
│                      Puerto: 3000                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐    │
│  │   Auth      │  │ Transactions│  │    Settings     │    │
│  │ Controller  │  │ Controller  │  │   Controller    │    │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘    │
│         │                │                   │             │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐    │
│  │   Routes    │  │   Routes    │  │    Routes      │    │
│  │   /auth     │  │/transactions│  │   /settings    │    │
│  └─────────────┘  └─────────────┘  └─────────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │    MySQL     │    │  CoinGecko   │
│   :27017     │    │    :3306     │    │    (API)     │
│              │    │              │    │              │
│ - Settings   │    │ - Users      │    │ - Prices     │
│ - Transactions│   │ - Wallets    │    │ - Rates      │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── mongodb.js          # Conexión MongoDB
│   │   └── mysql.js            # Conexión MySQL (Sequelize)
│   │
│   ├── controllers/
│   │   ├── authController.js   # Lógica de autenticación
│   │   ├── transactionController.js  # Lógica de transacciones
│   │   └── settingController.js # Lógica de configuración
│   │
│   ├── models/
│   │   ├── index.js            # Modelos combinados
│   │   ├── User.js            # Modelo User (MySQL)
│   │   ├── Wallet.js          # Modelo Wallet (MySQL)
│   │   ├── Transaction.js    # Modelo Transaction (MongoDB)
│   │   └── Setting.js        # Modelo Setting (MongoDB)
│   │
│   ├── routes/
│   │   ├── auth.js            # Rutas /api/auth
│   │   ├── transactions.js    # Rutas /api/transactions
│   │   └── settings.js       # Rutas /api/settings
│   │
│   ├── middleware/
│   │   └── auth.js            # Middleware JWT
│   │
│   └── index.js               # Punto de entrada
│
├── .env                       # Variables de entorno
├── package.json               # Dependencias
└── README.md                  # Este archivo
```

---

## 🛠️ Tecnologías

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web |
| **Mongoose** | 8.0.0 | ODM MongoDB |
| **Sequelize** | 6.35.0 | ORM MySQL |
| **MySQL2** | 3.6.0 | Driver MySQL |
| **jsonwebtoken** | 9.0.2 | Autenticación JWT |
| **bcryptjs** | 2.4.3 | Hash de contraseñas |
| **axios** | 1.6.0 | Cliente HTTP |
| **helmet** | 7.1.0 | Seguridad headers |
| **cors** | 2.8.5 | CORS |
| **dotenv** | 16.3.1 | Variables de entorno |

---

## 💾 Base de Datos

### MongoDB (NoSQL)

**Propósito**: Transacciones y Configuración

#### Colección: `transactions`
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
  paymentMethod: String,
  walletAddress: String,
  bankDetails: Object,
  transactionHash: String,
  exchangeRate: Number,
  fees: Number,
  metadata: Mixed,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Colección: `settings`
```javascript
{
  _id: ObjectId,
  key: String (unique, uppercase),
  value: Mixed,
  category: "GENERAL" | "CRYPTO" | "PAYMENT" | "FEES" | "LIMITS" | "API" | "SECURITY",
  description: String,
  isPublic: Boolean,
  isEditable: Boolean,
  dataType: "STRING" | "NUMBER" | "BOOLEAN" | "JSON",
  createdAt: Date,
  updatedAt: Date
}
```

### MySQL (Relacional)

**Propósito**: Usuarios y Wallets

#### Tabla: `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | ID usuario |
| email | VARCHAR(255) | Email único |
| password | VARCHAR(255) | Hash bcrypt |
| firstName | VARCHAR(100) | Nombre |
| lastName | VARCHAR(100) | Apellido |
| phoneNumber | VARCHAR(50) | Teléfono |
| country | VARCHAR(100) | País |
| kycStatus | ENUM | Estado KYC |
| kycLevel | INT | Nivel KYC |
| isActive | BOOLEAN | Cuenta activa |
| lastLogin | DATETIME | Último login |
| swissResident | BOOLEAN | Residente suizo |
| createdAt | DATETIME | Fecha creación |
| updatedAt | DATETIME | Fecha actualización |

#### Tabla: `wallets`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | ID wallet |
| userId | INT (FK) | ID usuario |
| currency | VARCHAR(10) | BTC, ETH, USDT |
| address | VARCHAR(255) | Dirección crypto |
| balance | DECIMAL(20,8) | Balance |
| isActive | BOOLEAN | Activa |
| label | VARCHAR(100) | Etiqueta |

---

## 🔌 API Endpoints

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

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Perfil usuario | JWT |

#### Registro
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.ch",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+41791234567",
  "swissResident": true
}

Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.ch",
    "firstName": "John",
    "lastName": "Doe",
    "kycStatus": "PENDING"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.ch",
  "password": "password123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {...}
}
```

---

### Transacciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/transactions/ramp-on` | Comprar crypto | JWT |
| POST | `/api/transactions/ramp-off` | Vender crypto | JWT |
| GET | `/api/transactions` | Listar transacciones | JWT |
| GET | `/api/transactions/:id` | Ver transacción | JWT |
| GET | `/api/transactions/rates` | Tasas cambio | JWT |

#### Ramp On (Comprar)
```bash
POST /api/transactions/ramp-on
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "cryptoCurrency": "BTC",
  "paymentMethod": "BANK_TRANSFER",
  "walletAddress": "bc1q..."
}

Response (201):
{
  "message": "Ramp On transaction created",
  "transaction": {
    "id": "...",
    "type": "RAMP_ON",
    "amount": 0.022,
    "amountFiat": 1000,
    "status": "PENDING",
    "exchangeRate": 45000
  }
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
  "walletAddress": "bc1q...",
  "bankDetails": {
    "bankName": "UBS AG",
    "iban": "CH12..."
  }
}
```

#### Tasas de Cambio
```bash
GET /api/transactions/rates?currencies=bitcoin,ethereum,tether
Authorization: Bearer <token>

Response:
{
  "bitcoin": {"chf": 45000, "usd": 50000, "eur": 46000},
  "ethereum": {"chf": 2800, "usd": 3100, "eur": 2850},
  "tether": {"chf": 0.92, "usd": 1.00, "eur": 0.98}
}
```

---

### Configuración (Settings)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/settings` | Todos los settings | JWT |
| GET | `/api/settings/public` | Settings públicos | No |
| GET | `/api/settings/:key` | Un setting | JWT |
| POST | `/api/settings` | Crear setting | JWT |
| PUT | `/api/settings/:key` | Actualizar setting | JWT |
| DELETE | `/api/settings/:key` | Eliminar setting | JWT |
| GET | `/api/settings/init` | Inicializar defaults | JWT |

#### Obtener Todos los Settings
```bash
GET /api/settings
Authorization: Bearer <token>

Response:
{
  "settings": {
    "GENERAL": [
      {
        "key": "PLATFORM_NAME",
        "value": "Swiss Crypto Ramp",
        "description": "Nombre de la plataforma",
        "dataType": "STRING",
        "isEditable": true
      }
    ],
    "FEES": [...],
    "LIMITS": [...]
  },
  "total": 12
}
```

#### Obtener Settings Públicos
```bash
GET /api/settings/public

Response:
{
  "PLATFORM_NAME": "Swiss Crypto Ramp",
  "FIAT_CURRENCY": "CHF",
  "SUPPORTED_CRYPTOS": ["BTC", "ETH", "USDT"],
  "RAMP_ON_FEE": 1.0,
  "RAMP_OFF_FEE": 1.5,
  "MIN_TRANSACTION_AMOUNT": 100,
  "MAX_TRANSACTION_AMOUNT": 50000
}
```

#### Actualizar Setting
```bash
PUT /api/settings/RAMP_ON_FEE
Authorization: Bearer <token>
Content-Type: application/json

{
  "value": 1.5
}

Response:
{
  "message": "Setting updated successfully",
  "setting": {
    "key": "RAMP_ON_FEE",
    "value": 1.5,
    "category": "FEES"
  }
}
```

#### Crear Nuevo Setting
```bash
POST /api/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "NEW_FEATURE",
  "value": true,
  "category": "GENERAL",
  "description": "Nueva funcionalidad",
  "dataType": "BOOLEAN",
  "isPublic": true,
  "isEditable": true
}
```

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```bash
# ====================
# SERVIDOR
# ====================
PORT=3000
NODE_ENV=development

# ====================
# MONGODB
# ====================
MONGODB_URI=mongodb://localhost:27017/swiss_crypto_ramp

# ====================
# MYSQL
# ====================
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=swiss_crypto_ramp

# ====================
# SQL (Desarrollo)
# ====================
SQL_DATABASE=./database.sqlite

# ====================
# JWT
# ====================
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# ====================
# API EXTERNA
# ====================
CRYPTO_API_URL=https://api.coingecko.com/api/v3
```

---

## 💻 Instalación

### Requisitos Previos
- Node.js 18+
- MongoDB 7.0+
- MySQL 8.0+

### Pasos

```bash
# 1. Navegar al directorio backend
cd wallet/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Iniciar servidor (desarrollo)
npm run dev

# o producción
npm start
```

---

## 🚀 Uso

### Desarrollo
```bash
npm run dev
# Servidor en http://localhost:3000
```

### Producción
```bash
npm start
# Servidor en puerto configurado (default: 3000)
```

### Docker
```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f backend
```

---

## 📊 Settings por Defecto

| Key | Valor | Categoría | Descripción |
|-----|-------|-----------|-------------|
| PLATFORM_NAME | Swiss Crypto Ramp | GENERAL | Nombre plataforma |
| PLATFORM_COUNTRY | Switzerland | GENERAL | País sede |
| FIAT_CURRENCY | CHF | GENERAL | Moneda fiat |
| SUPPORTED_CRYPTOS | [BTC, ETH, USDT] | CRYPTO | Criptos soportadas |
| RAMP_ON_FEE | 1.0 | FEES | Comisión compra (%) |
| RAMP_OFF_FEE | 1.5 | FEES | Comisión venta (%) |
| MIN_TRANSACTION_AMOUNT | 100 | LIMITS | Mínimo CHF |
| MAX_TRANSACTION_AMOUNT | 50000 | LIMITS | Máximo CHF |
| KYC_ENABLED | true | SECURITY | Verificación KYC |
| MAINTENANCE_MODE | false | GENERAL | Mantenimiento |
| CRYPTO_API_URL | coingecko | API | API de precios |
| PAYMENT_METHODS | [BANK_TRANSFER, CREDIT_CARD] | PAYMENT | Métodos pago |

---

## 🔒 Seguridad

- **JWT**: Tokens con expiración de 7 días
- **Bcrypt**: Hash de contraseñas con salt rounds 10
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configurado para permitir orígenes específicos
- **Validación**: Express-validator en inputs

---

## 📝 Notas

- Los settings se inicializan automáticamente al iniciar el servidor
- Los settings con `isPublic: true` son accesibles sin auth
- Los settings con `isEditable: false` no pueden modificarse via API
- Las transacciones usan MongoDB para flexibilidad
- Usuarios y wallets usan MySQL para integridad referencial

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2026  
**Jurisdicción**: Suiza 🇨🇭
