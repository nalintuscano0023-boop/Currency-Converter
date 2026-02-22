class AITextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.currentVoice = 'male-en';
        this.isEnabled = true;
    }

    
    speak(text, voiceType = 'male-en') {
        
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        if (voiceType === 'male-en') {
            utterance.lang = 'en-US';
            utterance.pitch = CONFIG.VOICE_SETTINGS.MALE_EN.pitch;
            utterance.rate = CONFIG.VOICE_SETTINGS.MALE_EN.rate;
            utterance.volume = 1.0;
        } else if (voiceType === 'female-hi') {
            utterance.lang = 'hi-IN';
            utterance.pitch = CONFIG.VOICE_SETTINGS.FEMALE_HI.pitch;
            utterance.rate = CONFIG.VOICE_SETTINGS.FEMALE_HI.rate;
            utterance.volume = 1.0;
        }

        
        const voices = this.synth.getVoices();
        const selectedVoice = this.findVoice(voices, utterance.lang, voiceType);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        this.synth.speak(utterance);

        return new Promise((resolve) => {
            utterance.onend = () => resolve();
            utterance.onerror = (e) => {
                console.error('Speech error:', e);
                resolve();
            };
        });
    }

    
    findVoice(voices, lang, voiceType) {
        if (!voices || voices.length === 0) return null;
        
        if (voiceType === 'male-en') {
            
            const maleVoices = voices.filter(v => 
                v.lang.startsWith('en-') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david'))
            );
            if (maleVoices.length) return maleVoices[0];
            
            
            return voices.find(v => v.lang.startsWith('en-')) || voices[0];
        } else if (voiceType === 'female-hi') {
            
            const femaleVoices = voices.filter(v => 
                v.lang.startsWith('hi-') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira'))
            );
            if (femaleVoices.length) return femaleVoices[0];
            
            
            const hindiVoice = voices.find(v => v.lang.startsWith('hi-'));
            if (hindiVoice) return hindiVoice;
            
            
            return voices.find(v => v.lang.startsWith('en-')) || voices[0];
        }
        
        return voices.find(v => v.lang.startsWith(lang)) || voices[0];
    }

    
    async speakConversion(amount, fromCurrency, convertedAmount, toCurrency, voiceType) {
        if (!this.isEnabled) return;

        let text = '';
        if (voiceType === 'male-en') {
            text = `${amount} ${fromCurrency} equals ${convertedAmount} ${toCurrency}`;
        } else if (voiceType === 'female-hi') {
            text = `${amount} ${fromCurrency} बराबर है ${convertedAmount} ${toCurrency}`;
        }

        await this.speak(text, voiceType);
    }

    
    async speakAnalysis(trend, rate, voiceType) {
        if (!this.isEnabled) return;

        let text = '';
        if (voiceType === 'male-en') {
            text = `AI Analysis: The exchange rate ${trend}. Current rate is ${rate}`;
        } else if (voiceType === 'female-hi') {
            text = `कृत्रिम बुद्धिमत्ता विश्लेषण: विनिमय दर ${trend}। वर्तमान दर है ${rate}`;
        }

        await this.speak(text, voiceType);
    }

    
    async speakError(error, voiceType) {
        if (!this.isEnabled) return;

        let text = '';
        if (voiceType === 'male-en') {
            text = `Error: ${error}`;
        } else if (voiceType === 'female-hi') {
            text = `त्रुटि: ${error}`;
        }

        await this.speak(text, voiceType);
    }

    
    async speakWarning(warning, voiceType) {
        if (!this.isEnabled) return;

        let text = '';
        if (voiceType === 'male-en') {
            text = `Warning: ${warning}`;
        } else if (voiceType === 'female-hi') {
            text = `चेतावनी: ${warning}`;
        }

        await this.speak(text, voiceType);
    }

    
    
    getAvailableVoices() {
        return this.synth.getVoices();
    }

    
    stop() {
        this.synth.cancel();
    }

    
    isSupported() {
        return 'speechSynthesis' in window;
    }

    
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }
}


const aiSpeech = new AITextToSpeech();


if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        aiSpeech.getAvailableVoices();
    };
}
