
# 🛒 E-Commerce Application

A full-stack e-commerce web application built using **Spring Boot**, **React**, **MySQL**, and **Stripe**.
It supports authentication, role-based access control, cart management, order processing, and online payments.

---

## 🚀 Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Security (JWT)
* Spring Data JPA
* MySQL
* Stripe API

### Frontend

* React
* Redux Toolkit
* Axios
* Stripe JS

---

## ✨ Features

* User registration & login (JWT authentication)
* Role-based access (USER / ADMIN)
* Product listing and details
* Admin product management (CRUD)
* Shopping cart functionality
* Order placement & order history
* Stripe payment integration
* Swagger API documentation

---

## ⚙️ Backend Setup

1. Make sure Java 17 and MySQL are installed.
2. Create `application.properties` inside:

```
backend/ecommerce/src/main/resources/
```

Example:

```properties
server.port=8081

spring.datasource.url=jdbc:mysql://localhost:3306/ecom
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

app.jwt.secret=YOUR_SECRET_KEY
stripe.secret.key=YOUR_STRIPE_SECRET_KEY
```

3. Run backend:

```bash
cd backend/ecommerce
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8081
```

Swagger UI:

```
http://localhost:8081/swagger-ui.html
```

---

## ⚙️ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🧪 Stripe Test Card

Use this test card for payments:

```
4242 4242 4242 4242
Any future date
Any CVC
Any ZIP
```

---

## 📌 Roles

### USER

* Browse products
* Add to cart
* Checkout
* View orders

### ADMIN

* Manage products
* Manage users
* View all orders

---

## 📄 Note

This project is built for learning purposes.
