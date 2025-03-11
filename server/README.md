# Restaurant Management System API

This is a RESTful API for a restaurant management system built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Menu management
- Order processing
- User management

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd restaurant-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit the .env file with your configuration
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Menu Items
- `GET /api/v1/menu` - Get all menu items
- `POST /api/v1/menu` - Create a new menu item (Admin/Manager)
- `GET /api/v1/menu/:id` - Get a single menu item
- `PUT /api/v1/menu/:id` - Update a menu item (Admin/Manager)
- `DELETE /api/v1/menu/:id` - Delete a menu item (Admin/Manager)

### Orders
- `GET /api/v1/orders` - Get all orders (User: only their orders, Admin: all orders)
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders/:id` - Get a single order
- `PUT /api/v1/orders/:id` - Update an order status
- `DELETE /api/v1/orders/:id` - Cancel an order (Admin/Manager)

### Users (Admin only)
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/:id` - Get a single user
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

## License

[ISC](LICENSE)