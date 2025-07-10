# Capla Currency Converter

[![CI](https://github.com/DannyFeliz/capla-alfted/actions/workflows/ci.yml/badge.svg)](https://github.com/DannyFeliz/capla-alfted/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Alfred workflow that converts USD to Dominican Pesos (DOP) using real-time exchange rates from [Capla](https://accapla.com).

![Image](https://github.com/user-attachments/assets/5b0efde9-b3d5-43e6-9180-e164beb69685)

## Installation

**Requirements:** Node.js and npm installed on your system

1. **Download the workflow file:** [Capla.alfredworkflow](https://github.com/DannyFeliz/capla-alfted/blob/main/Capla.alfredworkflow)
2. **Double-click** the file to install it in Alfred
3. **Set permissions** if prompted (Alfred may ask for accessibility permissions)

**Alternative:** Clone this repository and import manually:
```bash
git clone https://github.com/dannyfeliz/capla-currency-converter.git
cd capla-currency-converter
npm install
# Open Alfred Preferences > Workflows > Import
# Select the workflow folder
```

## Usage

**Basic conversion:**
```
capla 250
```

**Compare with bank rate:**
```
capla 1,000 63.25
```

## Features

- 💱 Real-time exchange rates from accapla.com
- 🏦 Bank rate comparison
- 💰 Automatic fee calculation ($5 fixed + 0.15% tax)
- 📊 Shows gain/loss vs bank rates
- 🔢 Comma-formatted input support

## Development

**Test commands:**
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run with coverage report
```

**Linting commands:**
```bash
npm run lint          # Check code quality with oxlint
npm run lint:fix      # Fix auto-fixable linting issues
```

**Adding features:**
1. Write tests in `index.test.js`
2. Implement in `index.js`
3. Export functions for testing
4. Run linting and tests

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Setting up the development environment
- Code style guidelines
- Testing requirements
- Submitting pull requests

## Dependencies

- **alfy** - Alfred workflow helper
- **node-html-parser** - HTML parsing
- **vitest** - Testing framework
- **oxlint** - Fast linter (dev dependency)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 