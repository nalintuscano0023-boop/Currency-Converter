class CurrencyAPI {
    constructor() {
        this.cache = {};
        this.cacheTime = 5 * 60 * 1000; 
    }

    
    async getExchangeRates(baseCurrency) {
        const cacheKey = `rates_${baseCurrency}`;
        
        
        if (this.cache[cacheKey]) {
            const cachedData = this.cache[cacheKey];
            if (Date.now() - cachedData.timestamp < this.cacheTime) {
                console.log(`Cache hit for ${baseCurrency}`);
                return cachedData.data;
            }
        }

        try {
            const url = `${CONFIG.API_ENDPOINTS.EXCHANGE_RATE}/${baseCurrency}`;
            console.log(`Fetching rates from: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.rates) {
                throw new Error('No rates data in response');
            }
            
            // Cache the result
            this.cache[cacheKey] = {
                data: data.rates,
                timestamp: Date.now()
            };

            console.log(`Successfully fetched rates for ${baseCurrency}`);
            return data.rates;
        } catch (error) {
            console.error('Error fetching exchange rates:', error.message);
            throw error;
        }
    }

    
    async convertCurrency(amount, fromCurrency, toCurrency) {
        try {
            const rates = await this.getExchangeRates(fromCurrency);
            const rate = rates[toCurrency];
            
            if (!rate) {
                throw new Error('Currency not supported');
            }

            return {
                amount: parseFloat(amount),
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                rate: rate,
                convertedAmount: (parseFloat(amount) * rate).toFixed(2),
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Conversion error:', error);
            throw error;
        }
    }

    
    async getMultipleRates(currencies) {
        try {
            const ratesPromises = currencies.map(curr => 
                this.getExchangeRates(curr).catch(() => ({}))
            );
            const allRates = await Promise.all(ratesPromises);
            
            return Object.assign({}, ...allRates);
        } catch (error) {
            console.error('Error fetching multiple rates:', error);
            throw error;
        }
    }

    
    calculateRateChange(newRate, oldRate) {
        if (!oldRate) return 0;
        return ((newRate - oldRate) / oldRate * 100).toFixed(2);
    }

    
    isValidCurrency(code) {
        return code in CONFIG.CURRENCIES;
    }

    
    clearCache() {
        this.cache = {};
    }
}


const currencyAPI = new CurrencyAPI();
