# Spotify Stats Dashboard 🎵

![License](https://img.shields.io/badge/License-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-13-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-18.x-green) 

A modern, interactive dashboard to explore your Spotify listening habits. Visualize your top tracks through connecting to Spotify's API.

LIVE DEPLOYMENT: https://spotifyapi-omega.vercel.app/

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- View your **Top Tracks** and **Top Artists**.
- Spotify OAuth 2.0 login flow for secure authentication.
- Real-time data fetching from Spotify API.
- Responsive, visually stunning **cyberpunk / art-deco style UI**.
- Particle effects background with radial glow and noise texture.
- Client-side caching of access tokens using `localStorage`.

---

## Installation

1. Clone the repo:

git clone https://github.com/your-username/spotify-stats-dashboard.git

cd spotify-stats-dashboard


2. Install dependencies:

npm install


3. Run the development server:



npm run dev


The app should now be running at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the root of the project with the following:



NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret


---

## Usage

1. Click the **Login with Spotify** button.
2. Authorize the app to access your Spotify account.
3. Navigate to the **Your Top Tracks** page to see your top tracks.
4. Use the interactive dashboard to explore your listening habits.

---

## Folder Structure


```
spotify-stats-dashboard/
├─ app/
│ ├─ page.tsx # Main landing page
│ ├─ dashboard/ # Top Tracks & Artists pages
├─ components/
│ ├─ SpotifyLoginButton.tsx
├─ pages/api/spotify/
│ ├─ top-tracks.ts
│ ├─ callback.ts
├─ styles/
│ ├─ globals.css
├─ .gitignore
├─ package.json
└─ README.md
```

---

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
