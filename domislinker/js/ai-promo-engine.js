// AI Promo Engine - Multi-language Support
class AIPromoEngine {
    constructor() {
        this.languages = {
            'en': 'English',
            'es': 'Español', 
            'fr': 'Français',
            'de': 'Deutsch',
            'pt': 'Português',
            'it': 'Italiano',
            'ru': 'Русский',
            'zh': '中文',
            'ja': '日本語',
            'ko': '한국어',
            'ar': 'العربية',
            'hi': 'हिन्दी',
            'yo': 'Yorùbá',
            'ig': 'Igbo',
            'ha': 'Hausa'
        };
        
        this.promoTemplates = {
            sale: {
                en: "🔥 {intensity} SALE! {discount}% OFF {product} - {urgency}!",
                es: "🔥 ¡{intensity} OFERTA! {discount}% DE DESCUENTO en {product} - ¡{urgency}!",
                fr: "🔥 {intensity} PROMO! {discount}% DE RÉDUCTION sur {product} - {urgency}!",
                de: "🔥 {intensity} ANGEBOT! {discount}% RABATT auf {product} - {urgency}!",
                yo: "🔥 {intensity} TITAJA! {discount}% DINKU lori {product} - {urgency}!",
                ig: "🔥 {intensity} AHỊA! {discount}% MBELATA na {product} - {urgency}!",
                ha: "🔥 {intensity} SAYARWA! {discount}% RANGWAME akan {product} - {urgency}!"
            },
            launch: {
                en: "🎉 NEW ARRIVAL! Introducing {product} - {cta}!",
                es: "🎉 ¡NUEVA LLEGADA! Presentamos {product} - ¡{cta}!",
                fr: "🎉 NOUVELLE ARRIVÉE! Découvrez {product} - {cta}!",
                de: "🎉 NEUANKUNFT! Entdecken Sie {product} - {cta}!",
                yo: "🎉 OHUN TUNTUN! A gbekalẹ {product} - {cta}!",
                ig: "🎉 IHE ỌHỤRỤ! Anyị na-ewebata {product} - {cta}!",
                ha: "🎉 SABON KAYA! Muna gabatar da {product} - {cta}!"
            },
            event: {
                en: "🎪 {event} is HERE! Join us {date} - {location}!",
                es: "🎪 ¡{event} ESTÁ AQUÍ! Únete a nosotros {date} - ¡{location}!",
                fr: "🎪 {event} EST LÀ! Rejoignez-nous {date} - {location}!",
                de: "🎪 {event} IST DA! Begleiten Sie uns {date} - {location}!",
                yo: "🎪 {event} TI DE! Darapọ mọ wa {date} - {location}!",
                ig: "🎪 {event} ABỊALA! Sonyere anyị {date} - {location}!",
                ha: "🎪 {event} YA ZO! Ku haɗu da mu {date} - {location}!"
            }
        };
        
        this.businessTypes = {
            restaurant: { en: 'Restaurant', es: 'Restaurante', fr: 'Restaurant', yo: 'Ile Ounjẹ', ig: 'Ụlọ Nri', ha: 'Gidan Abinci' },
            retail: { en: 'Retail Store', es: 'Tienda', fr: 'Magasin', yo: 'Ile Titaja', ig: 'Ụlọ Ahịa', ha: 'Kantin' },
            service: { en: 'Service Business', es: 'Negocio de Servicios', fr: 'Entreprise de Services', yo: 'Iṣẹ Iṣẹ', ig: 'Azụmahịa Ọrụ', ha: 'Kasuwancin Hidima' },
            tech: { en: 'Tech Company', es: 'Empresa Tecnológica', fr: 'Entreprise Tech', yo: 'Ile-iṣẹ Imọ-ẹrọ', ig: 'Ụlọ Ọrụ Teknụzụ', ha: 'Kamfanin Fasaha' }
        };
    }

    generatePromo(config) {
        const { businessType, promoType, targetLanguages, customData } = config;
        const promos = {};
        
        targetLanguages.forEach(lang => {
            const template = this.promoTemplates[promoType][lang] || this.promoTemplates[promoType]['en'];
            promos[lang] = this.fillTemplate(template, customData, lang);
        });
        
        return promos;
    }
    
    fillTemplate(template, data, language) {
        let filled = template;
        
        // Replace placeholders with actual data
        Object.keys(data).forEach(key => {
            const value = data[key][language] || data[key]['en'] || data[key];
            filled = filled.replace(new RegExp(`{${key}}`, 'g'), value);
        });
        
        return filled;
    }
    
    getIntensityWords(language) {
        const intensities = {
            en: ['MEGA', 'SUPER', 'ULTIMATE', 'FLASH', 'MASSIVE'],
            es: ['MEGA', 'SÚPER', 'DEFINITIVA', 'RELÁMPAGO', 'MASIVA'],
            fr: ['MÉGA', 'SUPER', 'ULTIME', 'ÉCLAIR', 'MASSIVE'],
            yo: ['NLA', 'PATAKI', 'AGBARA', 'YARA', 'TOBI'],
            ig: ['NNUKWU', 'UKWU', 'KACHASỊ', 'NGWA NGWA', 'BURU IBU'],
            ha: ['BABBA', 'MANYAN', 'MAFI GIRMA', 'SAURI', 'KATON']
        };
        
        return intensities[language] || intensities['en'];
    }
    
    getUrgencyPhrases(language) {
        const urgencies = {
            en: ['Limited Time', 'Today Only', 'While Supplies Last', 'Don\'t Miss Out'],
            es: ['Tiempo Limitado', 'Solo Hoy', 'Hasta Agotar Existencias', 'No Te Lo Pierdas'],
            fr: ['Temps Limité', 'Aujourd\'hui Seulement', 'Jusqu\'à Épuisement', 'Ne Ratez Pas'],
            yo: ['Akoko Die', 'Oni Nikan', 'Titi Oja Ba Tan', 'Maṣe Padanu'],
            ig: ['Oge Ole Ole', 'Taa Naanị', 'Ruo Mgbe Ngwongwo Gwụrụ', 'Atụfula Ya'],
            ha: ['Lokaci Kaɗan', 'Yau Kaɗai', 'Har Kayayyaki Su Ƙare', 'Kada Ka Rasa']
        };
        
        return urgencies[language] || urgencies['en'];
    }
    
    optimizeForPlatform(promo, platform) {
        const limits = {
            twitter: 280,
            instagram: 2200,
            facebook: 63206,
            whatsapp: 4096,
            sms: 160,
            email: 50000
        };
        
        const limit = limits[platform] || 1000;
        
        if (promo.length > limit) {
            return promo.substring(0, limit - 3) + '...';
        }
        
        return promo;
    }
    
    addEmojisAndFormatting(promo, style = 'modern') {
        const styles = {
            modern: {
                prefix: '✨',
                suffix: '🚀',
                emphasis: '💫'
            },
            classic: {
                prefix: '🎯',
                suffix: '📢',
                emphasis: '⭐'
            },
            fun: {
                prefix: '🎉',
                suffix: '🎊',
                emphasis: '🔥'
            }
        };
        
        const selectedStyle = styles[style] || styles.modern;
        
        return `${selectedStyle.prefix} ${promo} ${selectedStyle.suffix}`;
    }
    
    generateMultiLanguageSet(businessData) {
        const { 
            businessName, 
            businessType, 
            promotion, 
            targetLanguages = ['en', 'es', 'fr'],
            platforms = ['instagram', 'facebook', 'twitter']
        } = businessData;
        
        const results = {};
        
        targetLanguages.forEach(lang => {
            results[lang] = {};
            
            platforms.forEach(platform => {
                const promoData = {
                    product: { [lang]: businessName },
                    discount: promotion.discount || '50',
                    intensity: this.getIntensityWords(lang)[0],
                    urgency: this.getUrgencyPhrases(lang)[0]
                };
                
                const basePromo = this.generatePromo({
                    businessType,
                    promoType: promotion.type || 'sale',
                    targetLanguages: [lang],
                    customData: promoData
                });
                
                const optimized = this.optimizeForPlatform(basePromo[lang], platform);
                const formatted = this.addEmojisAndFormatting(optimized, promotion.style || 'modern');
                
                results[lang][platform] = formatted;
            });
        });
        
        return results;
    }
}

// Usage Example
const promoEngine = new AIPromoEngine();

// Generate multi-language promos
const businessData = {
    businessName: 'DomisLink Properties',
    businessType: 'retail',
    promotion: {
        type: 'sale',
        discount: '30',
        style: 'modern'
    },
    targetLanguages: ['en', 'es', 'fr', 'yo', 'ig', 'ha'],
    platforms: ['instagram', 'facebook', 'twitter', 'whatsapp']
};

const multiLanguagePromos = promoEngine.generateMultiLanguageSet(businessData);
console.log('Generated Promos:', multiLanguagePromos);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPromoEngine;
} else if (typeof window !== 'undefined') {
    window.AIPromoEngine = AIPromoEngine;
}