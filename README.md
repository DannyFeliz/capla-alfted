# Capla Currency Converter - Alfred Workflow

An Alfred workflow that converts USD to Dominican Pesos (DOP) using real-time exchange rates from Capla.

## Features

- 💱 Real-time exchange rates from accapla.com
- 🏦 Compare with bank rates
- 💰 Automatic fee calculation (5% fixed + 0.15% tax)
- 📊 Shows gain/loss compared to bank rates
- 🔢 Supports comma-formatted input numbers

## Usage

### Basic Conversion
```
capla 250
```
Converts 250 USD to DOP using Capla rates with fees calculated.

### Bank Rate Comparison
```
capla 1,000 63.25
```
Converts 1,000 USD and compares Capla rates vs bank rate of 63.25 DOP.

## Testing

This project uses [Vitest](https://vitest.dev/) for comprehensive unit testing.

### Available Test Commands

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:run -- --coverage
```

### Test Coverage

Current test coverage:
- **34 test cases** covering all utility functions
- **100% function coverage**
- **95.45% branch coverage**
- **70% statement coverage** (uncovered lines are Alfred-specific workflow logic)

### Test Structure

Tests are organized by function:
- `formatNumber()` - Number formatting with commas and decimals
- `cleanNumber()` - Input string parsing and comma removal
- `calculateWithFees()` - Fee calculation logic
- `parseExchangeRate()` - HTML parsing for exchange rates
- `validateInputs()` - Input validation
- `generateOutput()` - Alfred output generation
- Integration tests for complete workflows

### Example Test Cases

```javascript
// Number formatting
expect(formatNumber(1000.50)).toBe('1,000.50');
expect(formatNumber(1000)).toBe('1,000');

// Fee calculations
const fees = calculateWithFees(1000);
expect(fees.fixedFee).toBe(5);
expect(fees.tax).toBe(1.5); // 1000 * 0.0015
expect(fees.netAmount).toBe(993.5);

// Input validation
const result = validateInputs('1,000', '63.25');
expect(result.isValidAmount).toBe(true);
expect(result.isValidBankRate).toBe(true);
```

## Project Structure

```
.
├── index.js          # Main workflow logic with exported utility functions
├── index.test.js     # Comprehensive test suite
├── vitest.config.js  # Vitest configuration
├── package.json      # Dependencies and scripts
├── info.plist        # Alfred workflow configuration
└── README.md         # Documentation
```

## Dependencies

- **alfy** - Alfred workflow helper
- **node-html-parser** - HTML parsing for exchange rates
- **vitest** - Testing framework (dev dependency)

## Development

### Adding New Features

1. Write tests first in `index.test.js`
2. Implement functionality in `index.js`
3. Export functions for testing
4. Run tests to ensure coverage

### Fee Structure

- **Fixed Fee**: $5 USD
- **Tax Rate**: 0.15% (0.0015)
- **Total Deductions**: Fixed Fee + Tax
- **Net Amount**: Original Amount - Total Deductions

### Exchange Rate Parsing

The workflow fetches rates from `https://accapla.com/` and parses the HTML element with class `.amt-change` expecting format: `"RD$ 62.30"`. 