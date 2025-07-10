import alfy from 'alfy';
import { parse } from 'node-html-parser';

const [amountInput, bankRateInput] = alfy.input.split(' ');

// Format number with commas and show 2 decimal places only when not .00
const formatNumber = (number) => {
    // First format with 2 decimal places
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);

    // Only remove .00 if it exists at the end
    return formatted.endsWith('.00') ? formatted.slice(0, -3) : formatted;
};

// Remove commas from input and convert to number
const cleanNumber = (str) => str ? Number(str.replace(/,/g, '')) : undefined;

// Calculate fees and final amount
const calculateWithFees = (amount) => {
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

// Validate if input is a valid number
const amount = cleanNumber(amountInput);
const bankRate = cleanNumber(bankRateInput);
const isValidAmount = !isNaN(amount) && amount > 0;
const isValidBankRate = bankRate !== undefined && !isNaN(bankRate) && bankRate > 0;

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

        // Parse the HTML
        const root = parse(response);
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

        const { netAmount, tax, fixedFee, totalDeductions } = calculateWithFees(amount);
        const caplaConversion = netAmount * rate;
        
        const output = [{
            title: `� Capla: ${formatNumber(amount)} USD = ${formatNumber(caplaConversion)} DOP`,
            subtitle: `Fees: $${fixedFee} + $${formatNumber(tax)} tax = -$${formatNumber(totalDeductions)} | Rate: ${formatNumber(rate)} DOP`,
            arg: formatNumber(caplaConversion)
        }];

        // Only add bank conversion if a valid bank rate is provided
        if (isValidBankRate) {
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
        
        alfy.output(output);
    } catch (error) {
        alfy.output([{
            title: 'Error fetching exchange rates',
            subtitle: error.message || 'Please try again later',
            valid: false
        }]);
    }
}