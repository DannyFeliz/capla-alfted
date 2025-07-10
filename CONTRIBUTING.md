# Contributing to Capla Currency Converter

Thank you for your interest in contributing to the Capla Currency Converter! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/capla-alfted.git
   cd capla-alfted
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Setup

### Requirements
- Node.js 22.x or higher
- npm
- Alfred 5 (for testing the workflow)

### Available Scripts
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage
npm run lint          # Check code quality
npm run lint:fix      # Fix auto-fixable issues
```

## Making Changes

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Development Guidelines
- **Write tests first** - Follow TDD practices
- **Add tests** for any new functionality
- **Export functions** from `index.js` for testing
- **Run linting** before committing
- **Maintain test coverage** above 90%

### 3. Code Style
- Use **single quotes** for strings
- Use **template literals** for string interpolation
- Add **JSDoc comments** for complex functions
- Follow existing code formatting

### 4. Testing
- All tests must pass: `npm run test:run`
- Maintain high test coverage: `npm run test:coverage`
- Test the Alfred workflow manually if possible

### 5. Linting
- Code must pass linting: `npm run lint`
- Fix any auto-fixable issues: `npm run lint:fix`

## Submitting Changes

1. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add: new feature for bank rate comparison"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub

## Pull Request Guidelines

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Link to issues** if applicable
- **Tests included** for new functionality
- **CI checks passing** (linting + tests)

## Issue Reporting

When reporting issues, please include:
- Alfred version
- macOS version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages if any

## Feature Requests

- Check existing issues first
- Describe the use case
- Explain why it would be useful
- Consider implementation complexity

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment
- Follow GitHub's community guidelines

## Questions?

Feel free to open an issue for questions or join discussions in existing issues.

Thanks for contributing! 🎉 