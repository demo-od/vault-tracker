/**
 * Currency utilities for detecting and formatting currencies based on user locale
 */

/**
 * Detect the user's currency based on their browser locale
 * Falls back to USD if detection fails
 */
export function detectUserCurrency(): string {
    try {
        const locale = navigator.language || 'en-US';
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: 'USD',
        });
        
        // Extract the currency code from the formatter
        const parts = formatter.formatToParts(1);
        const currencyPart = parts.find(part => part.type === 'currency');
        
        if (currencyPart) {
            // Map common locales to their currency codes
            const localeToCurrency: Record<string, string> = {
                'en-US': 'USD',
                'en-GB': 'GBP',
                'en-CA': 'CAD',
                'en-AU': 'AUD',
                'en-NZ': 'NZD',
                'en-IE': 'EUR',
                'fr-FR': 'EUR',
                'de-DE': 'EUR',
                'es-ES': 'EUR',
                'it-IT': 'EUR',
                'nl-NL': 'EUR',
                'ja-JP': 'JPY',
                'ko-KR': 'KRW',
                'zh-CN': 'CNY',
                'zh-HK': 'HKD',
                'zh-TW': 'TWD',
                'ru-RU': 'RUB',
                'pt-BR': 'BRL',
                'es-MX': 'MXN',
                'fr-CA': 'CAD',
                'de-AT': 'EUR',
                'sv-SE': 'SEK',
                'no-NO': 'NOK',
                'da-DK': 'DKK',
                'pl-PL': 'PLN',
                'tr-TR': 'TRY',
                'ar-SA': 'SAR',
                'he-IL': 'ILS',
                'th-TH': 'THB',
                'id-ID': 'IDR',
                'ms-MY': 'MYR',
                'vi-VN': 'VND',
                'en-SG': 'SGD',
                'en-IN': 'INR',
                'hi-IN': 'INR',
            };
            
            return localeToCurrency[locale] || 'USD';
        }
        
        return 'USD';
    } catch (error) {
        console.error('Failed to detect currency:', error);
        return 'USD';
    }
}

/**
 * Format an amount as currency using the specified currency code
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
    try {
        // Map currency codes to appropriate locales for proper symbol display
        const currencyToLocale: Record<string, string> = {
            'USD': 'en-US',
            'EUR': 'de-DE',
            'GBP': 'en-GB',
            'CAD': 'en-CA',
            'AUD': 'en-AU',
            'JPY': 'ja-JP',
            'CNY': 'zh-CN',
            'INR': 'en-IN',
            'NGN': 'en-NG',
            'KRW': 'ko-KR',
            'BRL': 'pt-BR',
            'MXN': 'es-MX',
            'RUB': 'ru-RU',
            'SEK': 'sv-SE',
            'NOK': 'no-NO',
            'DKK': 'da-DK',
            'PLN': 'pl-PL',
            'TRY': 'tr-TR',
            'ZAR': 'en-ZA',
            'SGD': 'en-SG',
            'HKD': 'zh-HK',
            'CHF': 'de-CH',
        };

        const locale = currencyToLocale[currencyCode] || 'en-US';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (error) {
        console.error('Failed to format currency:', error);
        return `$${amount.toFixed(2)}`;
    }
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string = 'USD'): string {
    try {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        });
        
        const parts = formatter.formatToParts(0);
        const currencyPart = parts.find(part => part.type === 'currency');
        
        return currencyPart?.value || '$';
    } catch (error) {
        console.error('Failed to get currency symbol:', error);
        return '$';
    }
}

/**
 * List of supported currencies
 */
export const SUPPORTED_CURRENCIES = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
];
