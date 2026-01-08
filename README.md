# Me-API & Playground

Hey! 👋 Welcome to my full-stack playground. This project is basically a dynamic portfolio I built to experiment with connecting a robust **Node/Express** backend to a modern **React** frontend. It's fully dynamic—meaning I can update my profile, skills, and projects directly through an API (or the shiny new UI I just added 😉).

## � What's Under the Hood?

I wanted to keep things clean but powerful:

- **Backend**: Built with **Node.js & Express** + **TypeScript** because I like my code type-safe.
- **Database**: **MongoDB** (via Mongoose) handles all the data storage.
- **Frontend**: A fast **Vite + React** app styled with **Tailwind CSS**. I used **Lucide** for icons because they just look better.
- **API**: It's a RESTful setup. I can fetch my profile, update details, and even search through my projects based on skills.

## 🚀 How to Run It

If you want to poke around or fork it, here's how to get it running locally:

### 1. Fire up the Backend
First, jump into the backend folder and install the dependencies:

```bash
cd backend
npm install
```

You'll need a `.env` file in the `backend` root. Just create one and add your MongoDB string:
```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
```

Then start the server:
```bash
npm run dev
```

### 2. Launch the Frontend
Open a new terminal, head to the frontend, and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

That's it! The app should be live on `http://localhost:5173` (or whatever port Vite picked).

## ✨ Cool Stuff You Can Do

- **View Profile**: It loads my info dynamically from the DB.
- **Search Projects**: Type in a skill (like "React" or "Docker") to filter my projects.
- **Edit Mode**: I added a secret(ish) edit button in the UI so I can tweak my heatmap and details without touching the DB directly.
- **Live Status**: The UI actually checks if the backend is alive and shows a "Status: UP" indicator.

Feel free to explore the code! 🚀
