import alfy from 'alfy';
import { parse } from 'node-html-parser';

// Export utility functions for testing
export const formatNumber = (number) => {
    // First format with 2 decimal places
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);

    // Only remove .00 if it exists at the end
    return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted;
};

// Remove commas from input and convert to number
export const cleanNumber = (str) => str ? Number(str.replace(/,/g, '')) : undefined;

// Calculate fees and final amount
export const calculateWithFees = (amount) => {
    const FIXED_FEE = 5; // $5 USD fixed fee
    const TAX_RATE = 0.0015; // 0.15% tax rate

    const tax = amount * TAX_RATE;
    const totalDeductions = FIXED_FEE + tax;
    const netAmount = amount - totalDeductions;

    return {
        tax,
        fixedFee: FIXED_FEE,
        totalDeductions,
        netAmount
    };
};

// Parse exchange rate from HTML content
export const parseExchangeRate = (htmlContent) => {
    const root = parse(htmlContent);
    const rateElement = root.querySelector('.amt-change');
    
    if (!rateElement) {
        throw new Error('Could not find exchange rate on the page');
    }

    // Extract and clean the rate (format: "RD$ 62.30")
    const rateText = rateElement.text.trim();
    const rate = Number(rateText.replace('RD$', '').trim());
    
    if (isNaN(rate) || rate <= 0) {
        throw new Error('Invalid exchange rate found');
    }

    return rate;
};

// Validate input parameters
export const validateInputs = (amountInput, bankRateInput) => {
    const amount = cleanNumber(amountInput);
    const bankRate = cleanNumber(bankRateInput);
    const isValidAmount = !isNaN(amount) && amount > 0;
    const isValidBankRate = bankRate !== undefined && !isNaN(bankRate) && bankRate > 0;

    return {
        amount,
        bankRate,
        isValidAmount,
        isValidBankRate
    };
};

// Generate output items for Alfred
export const generateOutput = (amount, caplaRate, bankRate = null) => {
    const { netAmount, tax, fixedFee, totalDeductions } = calculateWithFees(amount);
    const caplaConversion = netAmount * caplaRate;
    
    const output = [{
        title: `💱 Capla: ${formatNumber(amount)} USD = ${formatNumber(caplaConversion)} DOP`,
        subtitle: `Fees: $${fixedFee} + $${formatNumber(tax)} tax = -$${formatNumber(totalDeductions)} | Rate: ${formatNumber(caplaRate)} DOP`,
        arg: formatNumber(caplaConversion)
    }];

    // Only add bank conversion if a valid bank rate is provided
    if (bankRate && bankRate > 0) {
        const bankConversion = amount * bankRate;
        const difference = caplaConversion - bankConversion;
        
        output.push({
            title: `🏦 Bank: ${formatNumber(amount)} USD = ${formatNumber(bankConversion)} DOP`,
            subtitle: `No fees | Rate: ${formatNumber(bankRate)} DOP`,
            arg: formatNumber(bankConversion)
        });

        // Add difference as a third option
        const gainLossEmoji = difference > 0 ? '📈 Gain' : '📉 Loss';
        output.push({
            title: `${gainLossEmoji}: ${formatNumber(difference)} DOP`,
            subtitle: 'Difference between Capla and Bank rates',
            arg: formatNumber(difference)
        });
    }
    
    return output;
};

// Main workflow logic (only runs when alfy.input is available)
if (alfy.input !== undefined) {
    const [amountInput, bankRateInput] = alfy.input.split(' ');
    const { amount, bankRate, isValidAmount, isValidBankRate } = validateInputs(amountInput, bankRateInput);

    if (!amountInput) {
        alfy.output([{
            title: 'Enter an amount to convert',
            subtitle: 'Example: "1,000" or "1,000 63.25" (with optional bank rate)',
            valid: false
        }]);
    } else if (!isValidAmount) {
        alfy.output([{
            title: 'Please enter a valid number',
            subtitle: 'Example: "1,000" or "1,000 63.25" (with optional bank rate)',
            valid: false
        }]);
    } else if (bankRateInput && !isValidBankRate) {
        alfy.output([{
            title: 'Please enter a valid bank rate as second argument',
            subtitle: 'Example: "1,000 63.25"',
            valid: false
        }]);
    } else {
        try {
            // Fetch the HTML content from accapla.com
            const response = await alfy.fetch('https://accapla.com/', { 
                json: false
            });

            const rate = parseExchangeRate(response);
            const output = generateOutput(amount, rate, isValidBankRate ? bankRate : null);
            
            alfy.output(output);
        } catch (error) {
            alfy.output([{
                title: 'Error fetching exchange rates',
                subtitle: error.message || 'Please try again later',
                valid: false
            }]);
        }
    }
}