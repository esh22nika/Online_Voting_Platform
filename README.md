# DeshKaVote - Online Voting Platform

## Project Overview

DeshKaVote is a secure, cloud-ready electronic voting system built to facilitate accessible and transparent elections. This project demonstrates a modern implementation of a voting architecture, focusing on data integrity, real-time concurrency, and secure user authentication.

Designed with scalability in mind, the platform moves beyond simple CRUD operations to incorporate asynchronous processing and real-time socket connections, making it suitable for scenarios requiring immediate feedback and high availability.

## Technical Architecture

This project leverages a robust tech stack chosen for performance and reliability.

### Backend & Infrastructure
* **Language:** Python 3.9+
* **Framework:** Django 5.2 (Latest stable release)
* **Database:** PostgreSQL (Production instance hosted on Supabase)
* **Asynchronous Server:** Daphne (ASGI) for handling concurrent connections
* **Task Queue:** Celery for handling background processes and offloading heavy tasks

### Real-Time & Caching
* **WebSockets:** Django Channels for maintaining persistent connections
* **Message Broker:** Redis for channel layers and Celery task brokerage
* **Caching:** Redis for high-performance session storage and data caching

### Frontend
* **Structure:** HTML5 & Django Templating Engine
* **Styling:** Custom CSS3 (Responsive design)
* **Interactivity:** Vanilla JavaScript for socket handling and DOM manipulation

## Key Features

### 1. Secure Authentication & Verification
The system abandons traditional passwords for a more secure, One-Time Password (OTP) login flow.
* **Email OTP:** Integrated SMTP services to deliver dynamic OTPs directly to voter email addresses.
* **Identity Verification:** Support for uploading verification documents (Aadhar/PAN) during the registration phase.
* **Session Security:** Encrypted server-side sessions stored in Redis with strict expiry limits.

### 2. Real-Time Election Monitoring
A key differentiator of this platform is the live results dashboard.
* **Live Updates:** Utilizes WebSockets to push vote counts to the frontend instantly without requiring page refreshes.
* **Concurrency:** Capable of handling multiple simultaneous updates efficiently via the ASGI interface.

### 3. Comprehensive Election Management
* **Admin Dashboard:** A centralized interface for election officials to create elections, manage candidates, and set strict voting windows (start and end times).
* **Double-Vote Prevention:** Rigorous backend checks ensure that a unique voter identity can cast a ballot only once per election cycle.

## Installation & Setup

To run this project locally, ensure you have Python installed and a Redis server running.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/esh22nika/E-Voting-Platform.git](https://github.com/esh22nika/E-Voting-Platform.git)
    cd E-Voting-Platform
    ```

2.  **Set up the environment**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Configure Environment Variables**
    Ensure you have your `.env` file or environment variables set for:
    * Database URL (or use local SQLite/Postgres)
    * Redis URL (default: localhost:6379)
    * Email Host Credentials

4.  **Run Migrations**
    ```bash
    python manage.py migrate
    ```

5.  **Start the Application**
    Since this project uses Channels, you should run it with an ASGI interface:
    ```bash
    python manage.py runserver
    ```
    *Note: Ensure your local Redis server is running before starting the app.*

## Future Roadmap

* **Blockchain Integration:** To create an immutable ledger for vote auditing.
* **Face Recognition:** Integration with AWS Rekognition for biometric voter authentication.
* **Mobile App:** Development of a dedicated mobile interface using React Native.
