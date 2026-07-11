# Contributing to RecruitIQ

Thank you for your interest in contributing to RecruitIQ! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Standards](#code-standards)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a feature branch from `main`
5. Make your changes
6. Submit a pull request

## Development Workflow

1. Ensure your `main` branch is up to date
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit regularly
4. Push your branch and open a pull request

## Branch Naming

Use the following prefixes:

| Prefix | Purpose |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code refactoring |
| `test/` | Test additions or updates |
| `chore/` | Maintenance tasks |

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(auth): add JWT authentication middleware
fix(api): resolve candidate search pagination issue
docs(architecture): update system architecture diagram
```

## Pull Requests

- Provide a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Request review from at least one team member

## Code Standards

- Follow ESLint configuration for both frontend and backend
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features and bug fixes

---

Questions? Open an issue or reach out to the maintainers.
