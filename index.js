import alfy from 'alfy';

const [amountInput, bankRateInput] = alfy.input.split(' ');

// Format number with commas and only show decimals if not .00
const formatNumber = (number) => {
    // First format with 2 decimal places
    const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);

    // Remove .00 if present
    return formatted.replace(/\.00$/, '');
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
        // Fetch the raw HTML content
        const response = await alfy.fetch('https://www.moneycorps.com.do/', { 
            json: false
        });

        // Extract the JSON data from the HTML
        const jsonMatch = response.match(/{\s*"monedas":\s*\[\s*{\s*"nombre":\s*"[^"]+",\s*"compra":\s*"[^"]+",\s*"venta":\s*"[^"]+"\s*},\s*{\s*"nombre":\s*"[^"]+",\s*"compra":\s*"[^"]+",\s*"venta":\s*"[^"]+"\s*}\s*\]\s*}/);
        
        if (!jsonMatch) {
            throw new Error('Could not find exchange rates in the page');
        }

        const data = JSON.parse(jsonMatch[0]);
        const usdRate = data.monedas.find(currency => currency.nombre === 'USD');

        if (!usdRate) {
            throw new Error('Could not find USD exchange rate');
        }

        const { netAmount, tax, fixedFee, totalDeductions } = calculateWithFees(amount);
        const caplaConversion = netAmount * Number(usdRate.compra);
        
        const output = [{
            title: `💰 Capla: ${formatNumber(amount)} USD = ${formatNumber(caplaConversion)} DOP`,
            subtitle: `Fees: $${fixedFee} + $${formatNumber(tax)} tax = -$${formatNumber(totalDeductions)} | Rate: ${usdRate.compra} DOP`,
            arg: formatNumber(caplaConversion)
        }];

        // Only add bank conversion if a valid bank rate is provided
        if (isValidBankRate) {
            const bankConversion = amount * bankRate;
            const difference = caplaConversion - bankConversion;
            
            output.push({
                title: `🏦 Bank: ${formatNumber(amount)} USD = ${formatNumber(bankConversion)} DOP`,
                subtitle: `No fees | Rate: ${bankRate} DOP`,
                arg: formatNumber(bankConversion)
            });

            // Add difference as a third option
            output.push({
                title: `${difference > 0 ? '📈 Gain' : '📉 Loss'}: ${formatNumber(Math.abs(difference))} DOP`,
                subtitle: 'Difference between Capla and Bank rates',
                arg: formatNumber(Math.abs(difference))
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