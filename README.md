# RecruitIQ

> AI-Powered Intelligent Recruitment Platform

RecruitIQ is a modern, full-stack recruitment management platform that leverages artificial intelligence to streamline and enhance the hiring process.

---

## Repository Structure

```
RecruitIQ/
│
├── frontend/          # React application (UI, components, routing, assets)
├── backend/           # Express application (API, AI, database, auth, storage)
├── docs/              # Project documentation organized by engineering phase
│
├── README.md          # Project overview (this file)
├── LICENSE            # MIT License
├── CHANGELOG.md       # Version history and release notes
├── CONTRIBUTING.md    # Contribution guidelines
├── .gitignore         # Git ignore rules
├── package.json       # Root workspace configuration
└── .env.example       # Environment variable template
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB

### Installation

```bash
# Clone the repository
git clone https://github.com/JinayShah10/RecruitIQ.git
cd RecruitIQ

# Install all dependencies (frontend + backend)
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only the frontend development server |
| `npm run dev:backend` | Start only the backend development server |
| `npm run build` | Build both applications for production |
| `npm run lint` | Run linting across the entire project |
| `npm test` | Run tests across the entire project |

## Documentation

Detailed documentation is available in the [`docs/`](./docs) directory, organized by engineering phase:

| Document | Description |
|---|---|
| [Project Overview](./docs/00_Project_Overview.md) | High-level project summary |
| [Project Plan](./docs/01_Project_Plan.md) | Planning and timeline |
| [Requirements](./docs/02_Requirements.md) | Functional and non-functional requirements |
| [User Research](./docs/03_User_Research.md) | User personas and research findings |
| [Product Specification](./docs/04_Product_Specification.md) | Detailed product specification |
| [System Architecture](./docs/05_System_Architecture.md) | System design and architecture |
| [Database Design](./docs/06_Database_Design.md) | Database schema and design decisions |
| [API Design](./docs/07_API_Design.md) | API endpoints and contracts |
| [AI Architecture](./docs/08_AI_Architecture.md) | AI/ML modules and integration |
| [Frontend Architecture](./docs/09_Frontend_Architecture.md) | Frontend structure and patterns |
| [Backend Architecture](./docs/10_Backend_Architecture.md) | Backend structure and patterns |
| [UI/UX Design](./docs/11_UI_UX_Design.md) | Design system and user experience |
| [Development Roadmap](./docs/12_Development_Roadmap.md) | Sprint plan and milestones |
| [Testing Strategy](./docs/13_Testing_Strategy.md) | Testing approach and coverage |
| [Deployment Guide](./docs/14_Deployment_Guide.md) | Deployment and infrastructure |
| [Future Roadmap](./docs/15_Future_Roadmap.md) | Long-term vision and features |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| AI | Google Gemini API |
| Authentication | JWT |
| Storage | Cloudinary |
| Deployment | Vercel (Frontend), Render (Backend) |

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">Built with ❤️ by <a href="https://github.com/JinayShah10">Jinay Shah</a></p>