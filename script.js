let elements = {};

function initDOMElements() {
    elements = {
        fromCurrency: document.getElementById("fromCurrency"),
        toCurrency: document.getElementById("toCurrency"),
        amount: document.getElementById("amount"),
        convertBtn: document.getElementById("convert"),
        swapBtn: document.getElementById("swap"),
        result: document.getElementById("result"),
        exchangeRate: document.getElementById("exchangeRate"),
        historicalData: document.getElementById("historicalData"),
        loader: document.getElementById("loader"),
        aiResult: document.getElementById("aiResult"),
        aiTrend: document.getElementById("aiTrend"),
        aiPrediction: document.getElementById("aiPrediction"),
        themeBtn: document.getElementById("themeBtn"),
        voiceType: document.getElementById("voiceType"),
        aiSpeakBtn: document.getElementById("aiSpeakBtn"),
        recentList: document.getElementById("recentList"),
        clearHistory: document.getElementById("clearHistory"),
        favoritesList: document.getElementById("favoritesList"),
        convertedAmount: document.getElementById("convertedAmount"),
        langBtns: document.querySelectorAll(".lang-btn")
    };
}


let state = {
    currentLanguage: 'en',
    exchangeRates: {},
    rateHistory: [],
    loading: false
};


function init() {
    initDOMElements();
    populateCurrencies();
    loadStoredSettings();
    attachEventListeners();
    loadRecentConversions();
    loadFavorites();
    loadVoices();
    
    const activeBtn = document.querySelector(`[data-lang="${state.currentLanguage}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function populateCurrencies() {
    const fragment = document.createDocumentFragment();
    
    Object.entries(CONFIG.CURRENCIES).forEach(([code, name]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${code} - ${name}`;
        fragment.appendChild(option.cloneNode(true));
    });

    elements.fromCurrency.innerHTML = '';
    elements.toCurrency.innerHTML = '';
    elements.fromCurrency.appendChild(fragment.cloneNode(true));
    elements.toCurrency.appendChild(fragment);

    elements.fromCurrency.value = CONFIG.DEFAULT_FROM;
    elements.toCurrency.value = CONFIG.DEFAULT_TO;
}

function loadVoices() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
            aiSpeech.getAvailableVoices();
        };
        aiSpeech.getAvailableVoices();
    }
}


function attachEventListeners() {
    if (!elements.convertBtn) return; 
    
    elements.convertBtn.addEventListener('click', handleConvert);
    elements.swapBtn.addEventListener('click', handleSwap);
    elements.themeBtn.addEventListener('click', handleThemeToggle);
    elements.aiSpeakBtn.addEventListener('click', handleAISpeak);
    elements.clearHistory.addEventListener('click', handleClearHistory);
    
    
    elements.langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.currentTarget.dataset.lang;
            if (lang) switchLanguage(lang);
        });
    });

    
    elements.amount.addEventListener('change', handleConvert);
    elements.amount.addEventListener('input', handleConvert);
    elements.fromCurrency.addEventListener('change', handleConvert);
    elements.toCurrency.addEventListener('change', handleConvert);
}


async function handleConvert() {
    const amount = parseFloat(elements.amount.value);
    const fromCurrency = elements.fromCurrency.value;
    const toCurrency = elements.toCurrency.value;

    if (!amount || amount <= 0) {
        elements.result.textContent = '⚠️ ' + translate('Invalid Amount');
        elements.convertedAmount.textContent = '0';
        return;
    }

    if (fromCurrency === toCurrency) {
        elements.convertedAmount.textContent = amount.toFixed(2);
        elements.result.textContent = `${amount} ${fromCurrency} = ${amount.toFixed(2)} ${fromCurrency}`;
        elements.exchangeRate.textContent = '1:1 (Same Currency)';
        return;
    }

    showLoader(true);

    try {
        const conversion = await currencyAPI.convertCurrency(amount, fromCurrency, toCurrency);
        
        elements.convertedAmount.textContent = conversion.convertedAmount;
        elements.result.textContent = 
            `💱 ${conversion.amount} ${fromCurrency} = ${conversion.convertedAmount} ${toCurrency}`;
        
        elements.exchangeRate.textContent = 
            `📊 ${translate('Exchange Rate')}: 1 ${fromCurrency} = ${conversion.rate.toFixed(4)} ${toCurrency}`;

        
        generateAIAnalysis(conversion.rate);

        
        saveConversion(conversion);

        
        const voiceType = elements.voiceType?.value || 'male-en';
        if (elements.aiSpeakBtn?.classList.contains('active')) {
            try {
                await aiSpeech.speakConversion(
                    conversion.amount,
                    fromCurrency,
                    conversion.convertedAmount,
                    toCurrency,
                    voiceType
                );
            } catch (speechError) {
                console.error('Speech error:', speechError);
            }
        }
    } catch (error) {
        elements.result.textContent = '❌ ' + translate('API Error') + ': ' + error.message;
        elements.convertedAmount.textContent = 'Error';
        console.error('Conversion error:', error);
    } finally {
        showLoader(false);
    }
}


function generateAIAnalysis(currentRate) {
    
    const previousRate = state.rateHistory[0]?.rate || currentRate;
    const rateChange = ((currentRate - previousRate) / previousRate * 100).toFixed(2);

    let trend = '';
    let trendSymbol = '';
    let color = '';

    if (rateChange > 1) {
        trend = translate('Increasing');
        trendSymbol = '📈';
        color = 'green';
    } else if (rateChange < -1) {
        trend = translate('Decreasing');
        trendSymbol = '📉';
        color = 'red';
    } else {
        trend = translate('Stable');
        trendSymbol = '➡️';
        color = 'orange';
    }

    elements.aiTrend.textContent = `${trendSymbol} ${trend} (${rateChange}%)`;
    elements.aiTrend.style.color = color;

    
    let predicted = currentRate;
    let prediction = '';

    if (rateChange > 0) {
        predicted = (currentRate * 1.02).toFixed(4); 
        prediction = `📈 Likely to increase to ${predicted}`;
    } else {
        predicted = (currentRate * 0.98).toFixed(4); 
        prediction = `📉 Likely to decrease to ${predicted}`;
    }

    elements.aiPrediction.textContent = `🤖 ${translate('Predicted Rate')}: ${prediction}`;
    elements.aiResult.textContent = `✨ AI suggests monitoring this pair closely`;
}


function handleSwap() {
    [elements.fromCurrency.value, elements.toCurrency.value] = 
    [elements.toCurrency.value, elements.fromCurrency.value];
    handleConvert();
}

function handleThemeToggle() {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
    
    const isDark = document.body.classList.contains("dark");
    elements.themeBtn.textContent = isDark ? "🌙 Dark Mode" : "☀️ Light Mode";
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
}

function showLoader(show) {
    elements.loader.style.display = show ? 'block' : 'none';
    state.loading = show;
}

function translate(key) {
    const translations = state.currentLanguage === 'en' 
        ? CONFIG.ENGLISH_TRANSLATION 
        : CONFIG.HINDI_TRANSLATION;
    
    return translations[key] || key;
}

function switchLanguage(lang) {
    state.currentLanguage = lang;
    localStorage.setItem(CONFIG.STORAGE_KEYS.LANGUAGE, lang);
    
    
    elements.langBtns.forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`[data-lang="${lang}"]`);
    if (btn) btn.classList.add('active');
    
    
    updateUILanguage();
    handleConvert();
}

function updateUILanguage() {
    
    console.log('Language changed to:', state.currentLanguage);
}


async function handleAISpeak() {
    const voiceType = elements.voiceType.value;
    elements.aiSpeakBtn.classList.toggle('active');
    
    if (elements.aiSpeakBtn.classList.contains('active')) {
        const text = elements.aiTrend.textContent || 'AI Analysis ready';
        await aiSpeech.speak(text, voiceType);
    }
}


function saveConversion(conversion) {
    state.rateHistory.unshift({
        ...conversion,
        timestamp: new Date().toLocaleTimeString()
    });

    
    if (state.rateHistory.length > CONFIG.HISTORY_LIMIT) {
        state.rateHistory.pop();
    }

    
    localStorage.setItem(
        CONFIG.STORAGE_KEYS.HISTORY,
        JSON.stringify(state.rateHistory)
    );

    updateRecentConversions();
}

function loadRecentConversions() {
    const history = localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY);
    state.rateHistory = history ? JSON.parse(history) : [];
    updateRecentConversions();
}

function updateRecentConversions() {
    elements.recentList.innerHTML = state.rateHistory
        .slice(0, 5)
        .map(conv => `
            <div class="recent-item">
                <span>${conv.amount} ${conv.fromCurrency} → ${conv.convertedAmount} ${conv.toCurrency}</span>
                <small>${conv.timestamp}</small>
            </div>
        `)
        .join('');
}

function handleClearHistory() {
    if (confirm('Clear all history?')) {
        state.rateHistory = [];
        localStorage.removeItem(CONFIG.STORAGE_KEYS.HISTORY);
        updateRecentConversions();
    }
}

function loadFavorites() {
    const favorites = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
    const favoritesList = favorites ? JSON.parse(favorites) : [];
    
    elements.favoritesList.innerHTML = favoritesList
        .map((fav, idx) => `
            <button class="favorite-item" data-fav-index="${idx}">
                ${fav.from} → ${fav.to}
            </button>
        `)
        .join('');
    
    
    elements.favoritesList.querySelectorAll('.favorite-item').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            if (favoritesList[idx]) {
                setFavorite(favoritesList[idx].from, favoritesList[idx].to);
            }
        });
    });
}

function setFavorite(from, to) {
    elements.fromCurrency.value = from;
    elements.toCurrency.value = to;
    handleConvert();
}


function loadStoredSettings() {
    
    const theme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
    if (theme === 'light') {
        document.body.classList.toggle("light");
        document.body.classList.toggle("dark");
        elements.themeBtn.textContent = "☀️ Light Mode";
    }

    
    const language = localStorage.getItem(CONFIG.STORAGE_KEYS.LANGUAGE) || 'en';
    state.currentLanguage = language;
}


document.addEventListener('DOMContentLoaded', init);
