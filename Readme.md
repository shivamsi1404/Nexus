# Nexus

Video streaming backend built with Node.js, Express and MongoDB.

API covering authentication, video uploads and social features, built to understand how a production-style backend works end to end.

## Features

## Features

- **Authentication:** signup and login with JWT access and refresh tokens, bcrypt password hashing
- **Videos:** file upload with Multer, media storage on Cloudinary
- **Engagement:** likes, dislikes, comments and replies
- **Tweets:** short text posts that users can create, update and delete
- **Subscriptions:** subscribe and unsubscribe to channels, with subscriber and subscription counts
- **Playlists:** create and manage playlists of videos
- **Watch history:** tracks each user's watched videos
- **Data layer:** MongoDB relationships with Mongoose, aggregation pipelines and paginated aggregation queries

## Tech Stack

- **Backend:** Node.js, Express 5
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt
- **Storage:** Multer, Cloudinary

## Getting Started

### Prerequisites

- Node.js
- A MongoDB database (local or Atlas)
- A Cloudinary account

### Installation

```bash
git clone https://github.com/<your-username>/Nexus.git
cd Nexus
npm install
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
PORT=8000
MONGODB_URI=
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Run

```bash
npm run dev
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Create an account |
| POST | `/api/v1/users/login` | Log in |
| ... | ... | ... |

## Roadmap

- [ ] Deploy with Docker, Nginx and HTTPS
- [ ] CI/CD pipeline