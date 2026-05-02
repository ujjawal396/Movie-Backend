# 🎬 Movie Booking Backend System

A production-grade backend system for a movie ticket booking platform, built with Node.js, Express, and MongoDB. This system handles end-to-end booking lifecycle including show management, seat reservation, payments, and asynchronous notifications.

---

## 🚀 Features

### 🎭 Show Management
- Create, update, delete movie shows
- Each show contains:
  - Theatre
  - Movie
  - Timing
  - Total seats
  - Booked seats

---

### 🎟️ Booking System
- Users can create bookings for a show
- Atomic seat reservation (no overbooking)
- Concurrency-safe booking logic

---

### 💳 Payment System
- Payment lifecycle:
  - `PROCESSING → SUCCESSFUL / CANCELLED / EXPIRED`
- Automatic booking expiry after 5 minutes
- Seat rollback on failure or expiry

---

### 🔁 Idempotency
- Prevent duplicate bookings using `idempotencyKey`
- Ensures safe retries from frontend

---

### ⚡ Concurrency Control
- Atomic MongoDB update prevents race conditions
- Multiple users booking simultaneously handled safely

---

### 📧 Notification Service
- Separate notification service using REST API
- Email notifications via Nodemailer
- Cron-based retry system for failed emails
- Fully asynchronous (non-blocking)

---

## 🧠 System Design Highlights

### ✅ Atomic Seat Reservation
Uses MongoDB `$expr` + `$inc` to ensure:
- No overselling
- Safe concurrent booking

---

### ✅ Async Notification System
- Booking success triggers notification API
- Notification stored as "ticket"
- Cron job processes pending notifications

---

### ✅ Resilience
- Payment failure → seats released
- Notification failure → retried via cron

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Nodemailer
- Node-cron
- Axios

---

## 📁 Project Structure

project-root/
│
├── controllers/
├── services/
├── models/
├── middlewares/
├── routes/
│
├── notification-service/
│   ├── cron/
│   ├── services/
│   ├── models/
│   ├── controllers/
│
├── utils/
├── config/
