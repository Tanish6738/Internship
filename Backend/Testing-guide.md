# API Testing Guide with Postman

This guide provides instructions on how to test the various API endpoints of the E-commerce backend application using Postman. It includes environment setup, test data, and expected responses for each endpoint.

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [User API Tests](#user-api-tests)
3. [Product API Tests](#product-api-tests)
4. [Transaction API Tests](#transaction-api-tests)

## Environment Setup

### Setting up Environment Variables in Postman

1. Create a new Environment in Postman
2. Add the following variables:

| Variable | Initial Value | Description |
|----------|--------------|-------------|
| `baseUrl` | `http://localhost:3000` | Base URL for the API |
| `token` | Empty | JWT token for authenticated requests |
| `userId` | Empty | Current user ID |
| `productId` | Empty | Product ID for testing |
| `orderId` | Empty | Order/Transaction ID for testing |
| `adminToken` | Empty | JWT token for admin user |

### Setting up Environment Variables for the Backend

Create a `.env` file in the root directory of the backend with the following variables:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_for_jwt
NODE_ENV=development
```

## User API Tests

### 1. Register a New User

**Endpoint:** `POST {{baseUrl}}/api/users/register`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
- Status code: `201`
- JSON Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "sample_id",
    "username": "testuser",
    "email": "test@example.com",
    "isAdmin": false,
    "orderHistory": []
  },
  "token": "jwt_token"
}
```

**Postman Tests Script:**
```javascript
// Save token for future requests
if (pm.response.code === 201) {
    pm.environment.set("token", pm.response.json().token);
    pm.environment.set("userId", pm.response.json().user._id);
}
```

### 2. Login User

**Endpoint:** `POST {{baseUrl}}/api/users/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
- Status code: `200`
- JSON Response:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "sample_id",
    "username": "testuser",
    "email": "test@example.com",
    "isAdmin": false
  },
  "token": "jwt_token"
}
```

**Postman Tests Script:**
```javascript
// Save token for future requests
if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().token);
    pm.environment.set("userId", pm.response.json().user._id);
}
```

### 3. Register Admin User

**Endpoint:** `POST {{baseUrl}}/api/users/register`

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

**Expected Response:**
- Status code: `201`

**After Registration:**
- Use MongoDB shell or a database GUI tool to update the user to have admin privileges:
```javascript
db.users.updateOne({email: "admin@example.com"}, {$set: {isAdmin: true}})
```

**Then Log in as admin and save the token:**
```javascript
// After successful admin login
if (pm.response.code === 200) {
    pm.environment.set("adminToken", pm.response.json().token);
}
```

### 4. Get All Users (Admin Only)

**Endpoint:** `GET {{baseUrl}}/api/users`

**Headers:**
- Authorization: `Bearer {{adminToken}}`

**Expected Response:**
- Status code: `200`
- JSON Response: Array of user objects

### 5. Get User by ID

**Endpoint:** `GET {{baseUrl}}/api/users/{{userId}}`

**Headers:**
- Authorization: `Bearer {{token}}`

**Expected Response:**
- Status code: `200`
- JSON Response: User object

### 6. Update User

**Endpoint:** `PUT {{baseUrl}}/api/users/{{userId}}`

**Headers:**
- Authorization: `Bearer {{token}}`

**Request Body:**
```json
{
  "username": "updatedtestuser",
  "email": "updated@example.com",
  "password": "NewPassword123!",
  "currentPassword": "Password123!"
}
```

**Expected Response:**
- Status code: `200`
- JSON Response: 
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "sample_id",
    "username": "updatedtestuser",
    "email": "updated@example.com"
  }
}
```

### 7. Get User Order History

**Endpoint:** `GET {{baseUrl}}/api/users/{{userId}}/orders`

**Headers:**
- Authorization: `Bearer {{token}}`

**Expected Response:**
- Status code: `200`
- JSON Response: Array of order objects

### 8. Delete User

**Endpoint:** `DELETE {{baseUrl}}/api/users/{{userId}}`

**Headers:**
- Authorization: `Bearer {{token}}`

**Expected Response:**
- Status code: `200`
- JSON Response: 
```json
{
  "message": "User deleted successfully"
}
```

## Product API Tests

### 1. Create New Product (Admin Only)

**Endpoint:** `POST {{baseUrl}}/api/products`

**Headers:**
- Authorization: `Bearer {{adminToken}}`

**Request Body:**
```json
{
  "name": "Test Product",
  "description": "This is a test product",
  "price": 99.99,
  "category": "electronics",
  "stock": 50,
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
}
```

**Expected Response:**
- Status code: `201`
- JSON Response:
```json
{
  "message": "Product registered successfully",
  "product": {
    "_id": "sample_product_id",
    "name": "Test Product",
    "description": "This is a test product",
    "price": 99.99,
    "category": "electronics",
    "stock": 50,
    "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Postman Tests Script:**
```javascript
// Save product ID for future requests
if (pm.response.code === 201) {
    pm.environment.set("productId", pm.response.json().product._id);
}
```

### 2. Get All Products

**Endpoint:** `GET {{baseUrl}}/api/products`

**Query Parameters (optional):**
- page: 1 (default)
- limit: 10 (default)
- category: "electronics"
- minPrice: 10
- maxPrice: 100

**Expected Response:**
- Status code: `200`
- JSON Response:
```json
{
  "products": [
    {
      "_id": "sample_product_id",
      "name": "Test Product",
      "description": "This is a test product",
      "price": 99.99,
      "category": "electronics",
      "stock": 50,
      "images": ["https://example.com/img1.jpg"]
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 3. Get Product by ID

**Endpoint:** `GET {{baseUrl}}/api/products/{{productId}}`

**Expected Response:**
- Status code: `200`
- JSON Response: Product object

### 4. Search Products

**Endpoint:** `GET {{baseUrl}}/api/products/search?query=test`

**Expected Response:**
- Status code: `200`
- JSON Response: Array of matching products

### 5. Get Products by Category

**Endpoint:** `GET {{baseUrl}}/api/products/category/electronics`

**Expected Response:**
- Status code: `200`
- JSON Response: Array of products in the specified category

### 6. Update Product (Admin Only)

**Endpoint:** `PUT {{baseUrl}}/api/products/{{productId}}`

**Headers:**
- Authorization: `Bearer {{adminToken}}`

**Request Body:**
```json
{
  "name": "Updated Test Product",
  "price": 79.99,
  "stock": 100
}
```

**Expected Response:**
- Status code: `200`
- JSON Response:
```json
{
  "message": "Product updated successfully",
  "product": {
    "_id": "sample_product_id",
    "name": "Updated Test Product",
    "description": "This is a test product",
    "price": 79.99,
    "category": "electronics",
    "stock": 100
  }
}
```

### 7. Delete Product (Admin Only)

**Endpoint:** `DELETE {{baseUrl}}/api/products/{{productId}}`

**Headers:**
- Authorization: `Bearer {{adminToken}}`

**Expected Response:**
- Status code: `200`
- JSON Response:
```json
{
  "message": "Product deleted successfully"
}
```

## Transaction API Tests

### 1. Create Transaction (Order)

**Endpoint:** `POST {{baseUrl}}/api/orders`

**Headers:**
- Authorization: `Bearer {{token}}`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "{{productId}}",
      "quantity": 2,
      "priceAtPurchase": 99.99
    }
  ],
  "totalAmount": 199.98,
  "paymentMethod": "Credit Card",
  "shippingAddress": {
    "street": "123 Test St",
    "city": "Test City",
    "state": "Test State",
    "country": "Test Country",
    "zipCode": "12345",
    "phone": "123-456-7890"
  }
}
```

**Expected Response:**
- Status code: `201`
- JSON Response:
```json
{
  "message": "Order placed successfully",
  "transaction": {
    "_id": "sample_transaction_id",
    "userId": "sample_user_id",
    "items": [
      {
        "productId": "sample_product_id",
        "quantity": 2,
        "priceAtPurchase": 99.99
      }
    ],
    "totalAmount": 199.98,
    "status": "pending",
    "paymentMethod": "Credit Card",
    "shippingAddress": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "Test State",
      "country": "Test Country",
      "zipCode": "12345",
      "phone": "123-456-7890"
    }
  }
}
```

**Postman Tests Script:**
```javascript
// Save order ID for future requests
if (pm.response.code === 201) {
    pm.environment.set("orderId", pm.response.json().transaction._id);
}
```

### 2. Get All Transactions (Admin Only)

**Endpoint:** `GET {{baseUrl}}/api/orders`

**Headers:**
- Authorization: `Bearer {{adminToken}}`

**Query Parameters (optional):**
- page: 1
- limit: 10
- status: "pending"

**Expected Response:**
- Status code: `200`
- JSON Response:
```json
{
  "transactions": [
    {
      "_id": "sample_transaction_id",
      "userId": {
        "_id": "sample_user_id",
        "username": "testuser",
        "email": "test@example.com"
      },
      "items": [
        {
          "productId": {
            "_id": "sample_product_id",
            "name": "Test Product",
            "price": 99.99
          },
          "quantity": 2,
          "priceAtPurchase": 99.99
        }
      ],
      "totalAmount": 199.98,
      "status": "pending",
      "paymentMethod": "Credit Card",
      "shippingAddress": {
        "street": "123 Test St",
        "city": "Test City",
        "state": "Test State",
        "country": "Test Country",
        "zipCode": "12345",
        "phone": "123-456-7890"
      },
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### 3. Get Transaction by ID

**Endpoint:** `GET {{baseUrl}}/api/orders/{{orderId}}`

**Headers:**
- Authorization: `Bearer {{token}}`

**Expected Response:**
- Status code: `200`
- JSON Response: Transaction object

### 4. Get User's Transactions

**Endpoint:** `GET {{baseUrl}}/api/orders/my-orders`

**Headers:**
- Authorization: `Bearer {{token}}`

**Expected Response:**
- Status code: `200`
- JSON Response: Array of transactions made by the user

### 5. Update Transaction Status (Admin Only)

**Endpoint:** `PUT {{baseUrl}}/api/orders/{{orderId}}/status`

**Headers:**
- Authorization: `Bearer {{adminToken}}`

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Expected Response:**
- Status code: `200`
- JSON Response:
```json
{
  "message": "Transaction status updated successfully",
  "transaction": {
    "_id": "sample_transaction_id",
    "status": "shipped"
  }
}
```

## Common Error Responses

### Authentication Errors
- **No Token**: Status 401, `{ "message": "Not authorized, no token provided" }`
- **Invalid Token**: Status 401, `{ "message": "Not authorized, invalid token" }`
- **Not Admin**: Status 403, `{ "message": "Not authorized as admin" }`

### User Errors
- **User Exists**: Status 400, `{ "message": "User already exists" }`
- **Invalid Credentials**: Status 400, `{ "message": "Invalid credentials" }`
- **User Not Found**: Status 404, `{ "message": "User not found" }`

### Product Errors
- **Product Not Found**: Status 404, `{ "message": "Product not found" }`
- **Invalid Product Data**: Status 400, `{ "message": "Error details..." }`

### Transaction Errors
- **Transaction Not Found**: Status 404, `{ "message": "Transaction not found" }`
- **Invalid Status**: Status 400, `{ "message": "Invalid status" }`
- **Not Enough Stock**: Status 400, `{ "message": "Not enough stock for Product X. Available: Y" }`

## Setting up a Postman Collection

1. Create a new Postman Collection named "E-commerce API"
2. Create folders for each endpoint group: Users, Products, Transactions
3. Create requests for each endpoint in their respective folders
4. Add environment variables
5. Add test scripts to automatically set variables
6. Use the example request bodies and expected responses from this guide

## Exporting the Collection

1. Click on the three dots next to the collection name
2. Select "Export"
3. Choose "Collection v2.1" format
4. Save the file
5. Share with team members

## Importing the Collection

1. Click on "Import" in Postman
2. Select the exported collection file
3. Import the environment file as well
4. Set your local environment variables

## Automated Testing Workflow

1. Register a user
2. Login to get a valid token
3. Create a product (as admin)
4. Place an order
5. View order details
6. Update order status (as admin)
7. Check updated order
8. Run the full collection to ensure all endpoints are working correctly