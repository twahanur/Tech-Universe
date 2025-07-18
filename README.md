
# 🌌 Tech Universe

**Tech Universe** is a modern, fully responsive course-selling platform built with React, Tailwind CSS, and DaisyUI. It allows users to browse and purchase premium tech courses, while mentors/trainers can upload their own courses and monitor their performance.

🔗 **Live Site:** [https://tech-universe-seven.vercel.app](https://tech-universe-seven.vercel.app)

---

## 🚀 Features

### 🧑‍🎓 For Learners:
- Browse available tech courses
- Watch course preview videos via YouTube embed
- Secure authentication via **Clerk**
- Purchase courses using **Stripe**
- Access and manage purchased courses from a personal dashboard

### 👨‍🏫 For Mentors:
- Login/register as a mentor
- Upload new courses with detailed info
- View how many students purchased each course
- Monitor total number of courses uploaded

### 🌐 General Features:
- React + Vite-based fast development environment
- Beautiful UI styled using **Tailwind CSS** + **DaisyUI**
- Route-based structure using **React Router DOM**
- Fully responsive across devices
- Clean user interface and smooth UX

---

## 🧰 Tech Stack

| Feature        | Library/Service        |
|----------------|------------------------|
| Frontend       | React, Vite            |
| Styling        | Tailwind CSS, DaisyUI  |
| Routing        | React Router DOM       |
| Auth           | Clerk                  |
| Payment        | Stripe                 |
| Video Embed    | React YouTube          |

---

## 📂 Project Structure

```
Tech-Universe/
├── public/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/             # Routes like Home, Courses, Dashboard
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── context/           # Auth/App context
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── daisy.config.js
└── vite.config.js
```

---

## 🔐 Authentication

**Clerk** handles authentication:

- Email/password login and signup
- Session management
- Role-based access (learner vs. trainer)

Environment variable example:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_public_key
```

---

## 💳 Payment System

**Stripe** is used for secure checkout and course purchases:

- Integrated Stripe Checkout
- Real-time transaction handling
- Displays purchased course data

Stripe key example:

```env
VITE_STRIPE_PUBLIC_KEY=your_public_key
```

---

## 📹 Course Preview

Courses can include a YouTube preview video using the `react-youtube` package.

---

## ⚙️ Getting Started

```bash
# Clone the repository
git clone https://github.com/twahanur/Tech-Universe.git

# Go into the project directory
cd Tech-Universe

# Install dependencies
npm install

# Run the app in development mode
npm run dev
```

> Don’t forget to set up your `.env` file for Clerk and Stripe keys.

---

## 📈 Future Features

- Course reviews and ratings
- Admin dashboard for platform-wide stats
- Certification on course completion
- Search and filter functionality
- Dark mode support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Twahanur Rahman**

- 🖥 [Portfolio](https://twahanur.vercel.app)
- 📧 [twahanur.info@gmail.com](mailto:twahanur.info@gmail.com)
- 🐙 [GitHub](https://github.com/twahanur)

---

## 🌟 Show Your Support

If you like this project, consider giving it a ⭐ on GitHub and sharing it with your network!
