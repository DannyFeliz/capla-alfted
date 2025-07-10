import { describe, it, expect } from 'vitest';
import {
    formatNumber,
    cleanNumber,
    calculateWithFees,
    parseExchangeRate,
    validateInputs,
    generateOutput
} from './index.js';

describe('Currency Converter Utility Functions', () => {
    describe('formatNumber', () => {
        it('should format whole numbers without decimal places', () => {
            expect(formatNumber(1000)).toBe('1,000');
            expect(formatNumber(1500)).toBe('1,500');
            expect(formatNumber(250)).toBe('250');
        });

        it('should format numbers with decimals', () => {
            expect(formatNumber(1000.50)).toBe('1,000.50');
            expect(formatNumber(1234.56)).toBe('1,234.56');
            expect(formatNumber(999.99)).toBe('999.99');
        });

        it('should handle zero and negative numbers', () => {
            expect(formatNumber(0)).toBe('0');
            expect(formatNumber(-1000)).toBe('-1,000');
            expect(formatNumber(-1000.50)).toBe('-1,000.50');
        });

        it('should handle very large numbers', () => {
            expect(formatNumber(1000000)).toBe('1,000,000');
            expect(formatNumber(1234567.89)).toBe('1,234,567.89');
        });

        it('should handle small decimal numbers', () => {
            expect(formatNumber(0.01)).toBe('0.01');
            expect(formatNumber(0.99)).toBe('0.99');
        });
    });

    describe('cleanNumber', () => {
        it('should parse valid number strings', () => {
            expect(cleanNumber('1000')).toBe(1000);
            expect(cleanNumber('250')).toBe(250);
            expect(cleanNumber('1.5')).toBe(1.5);
        });

        it('should remove commas from formatted numbers', () => {
            expect(cleanNumber('1,000')).toBe(1000);
            expect(cleanNumber('10,000')).toBe(10000);
            expect(cleanNumber('1,234,567')).toBe(1234567);
        });

        it('should handle decimal numbers with commas', () => {
            expect(cleanNumber('1,000.50')).toBe(1000.50);
            expect(cleanNumber('12,345.67')).toBe(12345.67);
        });

        it('should return undefined for empty or null input', () => {
            expect(cleanNumber('')).toBeUndefined();
            expect(cleanNumber(null)).toBeUndefined();
            expect(cleanNumber(undefined)).toBeUndefined();
        });

        it('should handle invalid number strings', () => {
            expect(cleanNumber('abc')).toBeNaN();
            expect(cleanNumber('12abc')).toBeNaN();
        });
    });

    describe('calculateWithFees', () => {
        it('should calculate fees correctly for standard amounts', () => {
            const result = calculateWithFees(1000);
            
            expect(result.fixedFee).toBe(5);
            expect(result.tax).toBe(1.5); // 1000 * 0.0015
            expect(result.totalDeductions).toBe(6.5);
            expect(result.netAmount).toBe(993.5);
        });

        it('should calculate fees for different amounts', () => {
            const result250 = calculateWithFees(250);
            expect(result250.tax).toBe(0.375); // 250 * 0.0015
            expect(result250.totalDeductions).toBe(5.375);
            expect(result250.netAmount).toBe(244.625);

            const result5000 = calculateWithFees(5000);
            expect(result5000.tax).toBe(7.5); // 5000 * 0.0015
            expect(result5000.totalDeductions).toBe(12.5);
            expect(result5000.netAmount).toBe(4987.5);
        });

        it('should handle small amounts', () => {
            const result = calculateWithFees(10);
            expect(result.tax).toBe(0.015);
            expect(result.totalDeductions).toBe(5.015);
            expect(result.netAmount).toBe(4.985);
        });

        it('should handle zero amount', () => {
            const result = calculateWithFees(0);
            expect(result.tax).toBe(0);
            expect(result.totalDeductions).toBe(5);
            expect(result.netAmount).toBe(-5);
        });
    });

    describe('parseExchangeRate', () => {
        it('should parse valid exchange rate from HTML', () => {
            const mockHtml = '<div class="amt-change">RD$ 62.30</div>';
            const rate = parseExchangeRate(mockHtml);
            expect(rate).toBe(62.30);
        });

        it('should handle different rate formats', () => {
            const mockHtml1 = '<div class="amt-change">RD$ 60.15</div>';
            expect(parseExchangeRate(mockHtml1)).toBe(60.15);

            const mockHtml2 = '<div class="amt-change">RD$65.00</div>';
            expect(parseExchangeRate(mockHtml2)).toBe(65.00);
        });

        it('should throw error when rate element is not found', () => {
            const mockHtml = '<div class="other-class">No rate here</div>';
            expect(() => parseExchangeRate(mockHtml)).toThrow('Could not find exchange rate on the page');
        });

        it('should throw error for invalid rate values', () => {
            const mockHtml1 = '<div class="amt-change">RD$ invalid</div>';
            expect(() => parseExchangeRate(mockHtml1)).toThrow('Invalid exchange rate found');

            const mockHtml2 = '<div class="amt-change">RD$ 0</div>';
            expect(() => parseExchangeRate(mockHtml2)).toThrow('Invalid exchange rate found');

            const mockHtml3 = '<div class="amt-change">RD$ -10</div>';
            expect(() => parseExchangeRate(mockHtml3)).toThrow('Invalid exchange rate found');
        });
    });

    describe('validateInputs', () => {
        it('should validate correct inputs', () => {
            const result = validateInputs('1000', '63.25');
            expect(result.amount).toBe(1000);
            expect(result.bankRate).toBe(63.25);
            expect(result.isValidAmount).toBe(true);
            expect(result.isValidBankRate).toBe(true);
        });

        it('should handle comma-formatted amounts', () => {
            const result = validateInputs('1,000', '63.25');
            expect(result.amount).toBe(1000);
            expect(result.isValidAmount).toBe(true);
        });

        it('should handle missing bank rate', () => {
            const result = validateInputs('250');
            expect(result.amount).toBe(250);
            expect(result.bankRate).toBeUndefined();
            expect(result.isValidAmount).toBe(true);
            expect(result.isValidBankRate).toBe(false);
        });

        it('should invalidate zero or negative amounts', () => {
            const result1 = validateInputs('0');
            expect(result1.isValidAmount).toBe(false);

            const result2 = validateInputs('-100');
            expect(result2.isValidAmount).toBe(false);
        });

        it('should invalidate invalid number strings', () => {
            const result1 = validateInputs('abc');
            expect(result1.isValidAmount).toBe(false);

            const result2 = validateInputs('100', 'invalid');
            expect(result2.isValidAmount).toBe(true);
            expect(result2.isValidBankRate).toBe(false);
        });

        it('should invalidate zero or negative bank rates', () => {
            const result1 = validateInputs('100', '0');
            expect(result1.isValidBankRate).toBe(false);

            const result2 = validateInputs('100', '-5');
            expect(result2.isValidBankRate).toBe(false);
        });
    });

    describe('generateOutput', () => {
        it('should generate output for Capla conversion only', () => {
            const output = generateOutput(1000, 62.30);
            
            expect(output).toHaveLength(1);
            expect(output[0].title).toContain('💱 Capla');
            expect(output[0].title).toContain('1,000 USD');
            expect(output[0].title).toContain('DOP');
            expect(output[0].subtitle).toContain('Fees: $5');
            expect(output[0].subtitle).toContain('Rate: 62.30 DOP');
        });

        it('should generate output with bank comparison', () => {
            const output = generateOutput(1000, 62.30, 63.25);
            
            expect(output).toHaveLength(3);
            
            // Capla conversion
            expect(output[0].title).toContain('💱 Capla');
            
            // Bank conversion
            expect(output[1].title).toContain('🏦 Bank');
            expect(output[1].title).toContain('1,000 USD');
            expect(output[1].subtitle).toContain('No fees');
            expect(output[1].subtitle).toContain('Rate: 63.25 DOP');
            
            // Difference
            expect(output[2].title).toMatch(/📈 Gain|📉 Loss/);
            expect(output[2].subtitle).toBe('Difference between Capla and Bank rates');
        });

        it('should show gain when Capla rate is better', () => {
            // Capla rate higher than bank rate should show gain
            const output = generateOutput(1000, 65.00, 63.00);
            expect(output[2].title).toContain('📈 Gain');
        });

        it('should show loss when bank rate is better', () => {
            // Bank rate higher than Capla rate should show loss  
            const output = generateOutput(1000, 60.00, 65.00);
            expect(output[2].title).toContain('📉 Loss');
        });

        it('should handle small amounts correctly', () => {
            const output = generateOutput(50, 62.30);
            
            expect(output[0].title).toContain('50 USD');
            expect(output[0].subtitle).toContain('Fees: $5');
        });

        it('should format large numbers with commas', () => {
            const output = generateOutput(10000, 62.30);
            
            expect(output[0].title).toContain('10,000 USD');
        });

        it('should not include bank conversion when bank rate is zero', () => {
            const output = generateOutput(1000, 62.30, 0);
            expect(output).toHaveLength(1);
        });

        it('should not include bank conversion when bank rate is negative', () => {
            const output = generateOutput(1000, 62.30, -5);
            expect(output).toHaveLength(1);
        });
    });

    describe('Integration Tests', () => {
        it('should handle complete workflow for simple conversion', () => {
            const { amount, isValidAmount } = validateInputs('250');
            expect(isValidAmount).toBe(true);
            
            const fees = calculateWithFees(amount);
            expect(fees.netAmount).toBe(244.625);
            
            const output = generateOutput(amount, 62.30);
            expect(output).toHaveLength(1);
            expect(output[0].title).toContain('250 USD');
        });

        it('should handle complete workflow with bank comparison', () => {
            const { amount, bankRate, isValidAmount, isValidBankRate } = validateInputs('1,000', '63.25');
            expect(isValidAmount).toBe(true);
            expect(isValidBankRate).toBe(true);
            
            const output = generateOutput(amount, 62.30, bankRate);
            expect(output).toHaveLength(3);
            expect(output[0].title).toContain('💱 Capla');
            expect(output[1].title).toContain('🏦 Bank');
            expect(output[2].title).toMatch(/📈 Gain|📉 Loss/);
        });
    });
}); 