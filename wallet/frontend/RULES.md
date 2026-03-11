# Swiss Crypto Ramp - Rules & Guidelines

## Architecture Rules
- REST API backend using Express.js
- Frontend built with Streamlit (Python)
- Multi-database: MongoDB + MySQL
- Swiss jurisdiction compliance

## Coding Rules
1. **Authentication**: JWT-based with bcrypt password hashing
2. **API**: RESTful endpoints with proper HTTP status codes
3. **Database**: 
   - MongoDB: Transactions, logs
   - MySQL: Users, wallets
4. **Error Handling**: Proper try-catch blocks with error responses

## Streamlit Cloud Rules
- Use environment variables for API URLs
- Handle connection errors gracefully
- Keep session state for user authentication
- Use proper form validation

## Security Rules
- Never expose JWT secrets
- Validate all user inputs
- Use HTTPS in production
- Implement CORS properly

## Payment Rules
- Minimum transaction: 100 CHF
- Ramp On fee: 1%
- Ramp Off fee: 1.5%
- Supported: BTC, ETH, USDT
- Fiat currency: CHF (Swiss Franc)
