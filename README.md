# Flabby Chubby

A simple Flappy Bird-inspired game crafted with modern web technologies.


Play now: https://flabby.swninja.dev


## 🚀 Tech Stack

### Frontend
- Vue 3 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- UnoCSS for atomic CSS
- Vue Sonner for toast notifications
- TanStack Table for data tables
- DayJS for date handling

### Backend
- Fastify for the server framework
- TypeScript
- Drizzle ORM for database operations
- PostgreSQL as the database
- Zod for schema validation

## 🛠️ Project Structure

```
flabby-chubby/
├── flabby-chubby-fe/    # Frontend Vue application
├── flabby-chubby-be/    # Backend Fastify server
└── Dockerfile           # Docker configuration
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- PNPM package manager
- PostgreSQL database

### Frontend Setup
```bash
cd flabby-chubby-fe
pnpm install
pnpm dev
```

### Backend Setup
```bash
cd flabby-chubby-be
pnpm install
# Set up your .env file with necessary configurations
pnpm dev
```

### Database Setup
```bash
cd flabby-chubby-be
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run migrations
pnpm db:studio    # Launch Drizzle Studio for database management
```

## 🐳 Docker Deployment

The project includes Docker configuration for containerized deployment:

```bash
docker build -t flabby-chubby .
docker run -p 80:80 flabby-chubby
```

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=your_backend_url
```

### Backend (.env)
```
DATABASE_URL=your_database_connection_string
PORT=your_preferred_port
```

## 📝 Development Commands

### Frontend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Backend
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm db:studio` - Launch database management UI

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.
