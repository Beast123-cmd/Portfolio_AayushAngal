# Aayush Angal - Portfolio Website

A modern, responsive, and animated portfolio website built with React.js, TypeScript, Tailwind CSS, and Framer Motion. Showcasing machine learning projects, web development work, and hardware prototyping.

## 🚀 Tech Stack

- **React.js 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **React Hook Form + Zod** - Form validation
- **Recharts** - Interactive data visualization
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon set

## ✨ Features

- 🎨 **Modern Design** - Clean, professional UI with glassmorphism effects
- 🌓 **Dark/Light Mode** - Smooth theme switching with persistent preference
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Smooth Animations** - Framer Motion for delightful interactions
- 🎯 **Project Filtering** - Filter projects by category
- 📊 **Interactive Charts** - Radar chart for skills visualization
- ✉️ **Contact Form** - Validated form with Zod schema
- 🔍 **SEO Optimized** - Proper meta tags and semantic HTML
- ♿ **Accessible** - WCAG compliant components

## 📁 Project Structure

```
src/
├── assets/              # Images and static assets
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── About.tsx
│   ├── AnimatedSkillsChart.tsx
│   ├── Contact.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectFilter.tsx
│   ├── Projects.tsx
│   ├── Resume.tsx
│   ├── ThemeToggle.tsx
│   └── Timeline.tsx
├── data/               # Data files
│   ├── experience.ts
│   ├── projects.ts
│   └── skills.ts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx
├── index.css          # Global styles & design system
└── main.tsx
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm installed ([Download Node.js](https://nodejs.org/))
- Git installed

### Steps

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 📝 Customization

### Update Personal Information

1. **Data Files** - Edit content in `src/data/`:
   - `projects.ts` - Add/edit your projects
   - `experience.ts` - Update education and work experience
   - `skills.ts` - Modify skill levels and categories

2. **Contact Email** - Update in `src/components/ContactForm.tsx`:
```typescript
const mailtoLink = `mailto:your-email@example.com?...`;
```

3. **Social Links** - Edit in `src/components/Contact.tsx`

4. **Images** - Replace images in `src/assets/` with your own

5. **SEO Meta Tags** - Update in `index.html`

### Design System

All colors, gradients, and styles are defined in `src/index.css` using CSS custom properties:

```css
:root {
  --primary: 195 100% 39%;    /* Cyan blue */
  --secondary: 24 95% 53%;     /* Orange */
  --accent: 189 94% 43%;       /* Light cyan */
  /* ... more variables */
}
```

Update these values to customize the color scheme.

## 🚀 Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Features

### Color Palette
- **Primary**: Cyan blue (#0094C6)
- **Secondary**: Vibrant orange (#F97316)
- **Accent**: Light cyan (#20B2AA)
- **Background**: White / Dark navy
- **Foreground**: Dark gray / Light gray

### Typography
- **Font**: Inter (Google Fonts)
- **Heading weights**: 600-800
- **Body weights**: 400-500

### Animations
- Fade in on scroll
- Smooth hover effects
- Staggered list animations
- Page transitions
- Theme toggle animation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Contact

**Aayush Angal**
- GitHub: [@aayushangal](https://github.com/aayushangal)
- LinkedIn: [aayushangal](https://linkedin.com/in/aayushangal)
- Email: aayush@example.com

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
