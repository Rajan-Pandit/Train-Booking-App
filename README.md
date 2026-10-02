# Train Booking App

A train booking application with a React frontend and an Express/MongoDB backend. Users can search trains by route and travel date, review availability, and manage bookings.

## Requirements

- Node.js and npm
- MongoDB running locally or a MongoDB connection URI

## Setup

Install the backend and frontend dependencies from the project root:

```powershell
cd train-booking-backend
npm install
cd ..\train-booking-frontend
npm install
cd ..
```

Create `train-booking-backend/.env` with the following settings:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/train_booking
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
PORT=5000
```

Use your MongoDB provider's connection URI if you are not running MongoDB locally. Keep `.env` private and do not commit real secrets.

## Seed Train Data

The train seeder loads the sample trains from `train-booking-backend/seeders/trainSeeder.js`. It is not run automatically when the backend starts.

```powershell
cd train-booking-backend
npm run seed
```

**Warning:** seeding deletes all existing train documents before inserting the sample data. Run it only when that is intended. The backend `.env` file and a reachable MongoDB database are required.

## Run the App

Start the backend in one terminal:

```powershell
cd train-booking-backend
npm start
```

Start the frontend in another terminal:

```powershell
cd train-booking-frontend
npm start
```

The API runs at `http://localhost:5000/api` by default. Create React App opens the frontend at `http://localhost:3000`.

To use a different API address, set `REACT_APP_API_URL` in `train-booking-frontend/.env`, for example:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Restart the frontend after changing its environment settings.

## Train Search

Train search uses the database records, not the seeder file directly. Search requires a source, destination, and ISO-formatted journey date. The backend matches station codes when present, supports journeys between stops listed in a train's route (in travel order), and filters by the selected class when provided. Results are limited to trains operating on the selected weekday.

The station picker combines stations returned by the backend with a public station list, so internet access may be needed to load the additional station suggestions. A station can appear in suggestions without having a matching train in the seeded database.

## API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check that the API is running |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Sign in |
| `GET` | `/trains/search?source=...&destination=...&date=YYYY-MM-DD` | Search trains; optional `class` query parameter |
| `GET` | `/trains/stations` | List stations from stored trains |
| `GET` | `/trains/:trainNumber` | Get train details |
| `GET` | `/trains/:trainNumber/availability?date=YYYY-MM-DD&class=3AC` | Check class availability |
| `POST` | `/bookings` | Create a booking (authentication required) |
| `GET` | `/bookings/:pnr` | Get a booking by PNR (authentication required) |
| `GET` | `/bookings/user/:userId` | List a user's bookings (authentication required) |
| `PUT` | `/bookings/:pnr/cancel` | Cancel a booking (authentication required) |

## Tests and Build

Run the frontend test runner:

```powershell
cd train-booking-frontend
npm test
```

Create a production frontend build:

```powershell
cd train-booking-frontend
npm run build
```

The backend currently has no configured automated test suite.