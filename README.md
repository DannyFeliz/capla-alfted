# Capla Currency Converter

Alfred workflow that converts USD to Dominican Pesos (DOP) using real-time exchange rates from Capla.

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

**Adding features:**
1. Write tests in `index.test.js`
2. Implement in `index.js`
3. Export functions for testing
4. Run tests

## Dependencies

- **alfy** - Alfred workflow helper
- **node-html-parser** - HTML parsing
- **vitest** - Testing framework 