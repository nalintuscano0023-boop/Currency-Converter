const CONFIG = {
    
    API_ENDPOINTS: {
        EXCHANGE_RATE: 'https://api.exchangerate-api.com/v4/latest',
        HISTORICAL: 'https://api.exchangerate-api.com/v4/latest'
    },

    
    CURRENCIES: {
        USD: "United States Dollar 🇺🇸",
        INR: "Indian Rupee 🇮🇳",
        EUR: "Euro 🇪🇺",
        GBP: "British Pound 🇬🇧",
        JPY: "Japanese Yen 🇯🇵",
        CAD: "Canadian Dollar 🇨🇦",
        AUD: "Australian Dollar 🇦🇺",
        CHF: "Swiss Franc 🇨🇭",
        CNY: "Chinese Yuan 🇨🇳",
        AED: "UAE Dirham 🇦🇪",
        SAR: "Saudi Riyal 🇸🇦",
        SGD: "Singapore Dollar 🇸🇬",
        HKD: "Hong Kong Dollar 🇭🇰",
        MXN: "Mexican Peso 🇲🇽",
        KRW: "South Korean Won 🇰🇷",
        BRL: "Brazilian Real 🇧🇷",
        RUB: "Russian Ruble 🇷🇺",
        ZAR: "South African Rand 🇿🇦",
        MYR: "Malaysian Ringgit 🇲🇾",
        THB: "Thai Baht 🇹🇭"
    },

    
    HINDI_TRANSLATION: {
        "Converting": "रूपांतरण",
        "Convert Now": "अभी रूपांतरण करें",
        "Exchange Rate": "विनिमय दर",
        "AI Analysis": "AI विश्लेषण",
        "Rate Trend": "दर प्रवृत्ति",
        "Predicted Rate": "अनुमानित दर",
        "Recent Conversions": "हाल के रूपांतरण",
        "Clear History": "इतिहास साफ करें",
        "Favorite Pairs": "पसंदीदा जोड़ी",
        "Invalid Amount": "अमान्य राशि",
        "API Error": "API त्रुटि",
        "Increasing": "बढ़ रहा है",
        "Decreasing": "घट रहा है",
        "Stable": "स्थिर"
    },

    
    ENGLISH_TRANSLATION: {
        "Converting": "Converting",
        "Convert Now": "Convert Now",
        "Exchange Rate": "Exchange Rate",
        "AI Analysis": "AI Analysis",
        "Rate Trend": "Rate Trend",
        "Predicted Rate": "Predicted Rate",
        "Recent Conversions": "Recent Conversions",
        "Clear History": "Clear History",
        "Favorite Pairs": "Favorite Pairs",
        "Invalid Amount": "Invalid Amount",
        "API Error": "API Error",
        "Increasing": "Increasing",
        "Decreasing": "Decreasing",
        "Stable": "Stable"
    },

    
    STORAGE_KEYS: {
        HISTORY: 'currencyHistory',
        FAVORITES: 'currencyFavorites',
        THEME: 'currencyTheme',
        LANGUAGE: 'currencyLanguage'
    },

    
    DEFAULT_FROM: 'USD',
    DEFAULT_TO: 'INR',
    DEFAULT_AMOUNT: 1,
    HISTORY_LIMIT: 10,

    
    VOICE_SETTINGS: {
        MALE_EN: {
            language: 'en-US',
            pitch: 1.0,
            rate: 0.9,
            gender: 'male'
        },
        FEMALE_HI: {
            language: 'hi-IN',
            pitch: 1.3,
            rate: 0.8,
            gender: 'female'
        }
    }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
