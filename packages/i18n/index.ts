// =============================================
// DOMISLINK i18n - MULTI-LANGUAGE SUPPORT
// AI speaks in user's browser language
// =============================================

// Supported Languages
export const LANGUAGES = {
  en: { name: 'English', native: 'English', flag: '🇬🇧' },
  fr: { name: 'French', native: 'Français', flag: '🇫🇷' },
  ar: { name: 'Arabic', native: 'العربية', flag: '🇸🇦', rtl: true },
  zh: { name: 'Chinese', native: '中文', flag: '🇨🇳' },
  es: { name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  pt: { name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  de: { name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  it: { name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  ru: { name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  ja: { name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  ko: { name: 'Korean', native: '한국어', flag: '🇰🇷' },
  hi: { name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  sw: { name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  ha: { name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
  yo: { name: 'Yoruba', native: 'Yorùbá', flag: '🇳🇬' },
  ig: { name: 'Igbo', native: 'Igbo', flag: '🇳🇬' },
  pcm: { name: 'Nigerian Pidgin', native: 'Naija', flag: '🇳🇬' },
  am: { name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹' },
  zu: { name: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
  af: { name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
} as const

export type LanguageCode = keyof typeof LANGUAGES

// Detect browser language
export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'en'
  
  const browserLang = navigator.language?.split('-')[0] || 'en'
  return (browserLang in LANGUAGES) ? browserLang as LanguageCode : 'en'
}

// Get language direction (for Arabic, etc.)
export function getLanguageDirection(lang: LanguageCode): 'ltr' | 'rtl' {
  return LANGUAGES[lang]?.rtl ? 'rtl' : 'ltr'
}

// AI Translation Prompt Helper
export function getAILanguagePrompt(targetLang: LanguageCode): string {
  const langName = LANGUAGES[targetLang]?.native || 'English'
  
  return `IMPORTANT: Respond ONLY in ${langName} (${targetLang}). 
  All your responses, explanations, and conversations must be in ${langName}.
  If the user writes in another language, still respond in ${langName}.
  Be natural and fluent in ${langName}, using appropriate idioms and expressions.`
}

// Common UI translations (expandable)
export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    search: 'Search',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    dashboard: 'Dashboard',
    settings: 'Settings',
    home: 'Home',
    listings: 'Listings',
    providers: 'Service Providers',
    flights: 'Flights',
    courses: 'Courses',
    wallet: 'Wallet',
    community_not_found: 'Your community is not listed? Create it!',
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    share: 'Share',
    post: 'Post',
    comment: 'Comment',
    like: 'Like',
  },
  fr: {
    welcome: 'Bienvenue',
    search: 'Rechercher',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    home: 'Accueil',
    listings: 'Annonces',
    providers: 'Prestataires',
    flights: 'Vols',
    courses: 'Cours',
    wallet: 'Portefeuille',
    community_not_found: 'Votre communauté n\'est pas listée ? Créez-la !',
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    success: 'Succès !',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    share: 'Partager',
    post: 'Publier',
    comment: 'Commenter',
    like: 'J\'aime',
  },
  ar: {
    welcome: 'مرحبا',
    search: 'بحث',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات',
    home: 'الرئيسية',
    listings: 'القوائم',
    providers: 'مقدمي الخدمات',
    flights: 'الرحلات',
    courses: 'الدورات',
    wallet: 'المحفظة',
    community_not_found: 'مجتمعك غير مدرج؟ أنشئه!',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ ما',
    success: 'نجاح!',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    share: 'مشاركة',
    post: 'نشر',
    comment: 'تعليق',
    like: 'إعجاب',
  },
  zh: {
    welcome: '欢迎',
    search: '搜索',
    login: '登录',
    register: '注册',
    logout: '退出',
    dashboard: '仪表板',
    settings: '设置',
    home: '首页',
    listings: '房源',
    providers: '服务商',
    flights: '航班',
    courses: '课程',
    wallet: '钱包',
    community_not_found: '您的社区未列出？创建它！',
    loading: '加载中...',
    error: '出了点问题',
    success: '成功！',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    share: '分享',
    post: '发布',
    comment: '评论',
    like: '喜欢',
  },
  // Add more languages as needed...
  es: { welcome: 'Bienvenido', search: 'Buscar', login: 'Iniciar sesión', register: 'Registrarse', logout: 'Cerrar sesión', dashboard: 'Panel', settings: 'Configuración', home: 'Inicio', listings: 'Listados', providers: 'Proveedores', flights: 'Vuelos', courses: 'Cursos', wallet: 'Cartera', community_not_found: '¿Tu comunidad no está listada? ¡Créala!', loading: 'Cargando...', error: 'Algo salió mal', success: '¡Éxito!', save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar', view: 'Ver', share: 'Compartir', post: 'Publicar', comment: 'Comentar', like: 'Me gusta' },
  pt: { welcome: 'Bem-vindo', search: 'Pesquisar', login: 'Entrar', register: 'Cadastrar', logout: 'Sair', dashboard: 'Painel', settings: 'Configurações', home: 'Início', listings: 'Anúncios', providers: 'Fornecedores', flights: 'Voos', courses: 'Cursos', wallet: 'Carteira', community_not_found: 'Sua comunidade não está listada? Crie-a!', loading: 'Carregando...', error: 'Algo deu errado', success: 'Sucesso!', save: 'Salvar', cancel: 'Cancelar', delete: 'Excluir', edit: 'Editar', view: 'Ver', share: 'Compartilhar', post: 'Postar', comment: 'Comentar', like: 'Curtir' },
  de: { welcome: 'Willkommen', search: 'Suchen', login: 'Anmelden', register: 'Registrieren', logout: 'Abmelden', dashboard: 'Dashboard', settings: 'Einstellungen', home: 'Startseite', listings: 'Angebote', providers: 'Anbieter', flights: 'Flüge', courses: 'Kurse', wallet: 'Brieftasche', community_not_found: 'Ihre Gemeinde ist nicht aufgeführt? Erstellen Sie sie!', loading: 'Wird geladen...', error: 'Etwas ist schief gelaufen', success: 'Erfolg!', save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', edit: 'Bearbeiten', view: 'Ansehen', share: 'Teilen', post: 'Posten', comment: 'Kommentieren', like: 'Gefällt mir' },
  it: { welcome: 'Benvenuto', search: 'Cerca', login: 'Accedi', register: 'Registrati', logout: 'Esci', dashboard: 'Cruscotto', settings: 'Impostazioni', home: 'Home', listings: 'Annunci', providers: 'Fornitori', flights: 'Voli', courses: 'Corsi', wallet: 'Portafoglio', community_not_found: 'La tua comunità non è elencata? Creala!', loading: 'Caricamento...', error: 'Qualcosa è andato storto', success: 'Successo!', save: 'Salva', cancel: 'Annulla', delete: 'Elimina', edit: 'Modifica', view: 'Visualizza', share: 'Condividi', post: 'Pubblica', comment: 'Commenta', like: 'Mi piace' },
  ru: { welcome: 'Добро пожаловать', search: 'Поиск', login: 'Войти', register: 'Регистрация', logout: 'Выйти', dashboard: 'Панель', settings: 'Настройки', home: 'Главная', listings: 'Объявления', providers: 'Поставщики', flights: 'Рейсы', courses: 'Курсы', wallet: 'Кошелек', community_not_found: 'Ваше сообщество не указано? Создайте его!', loading: 'Загрузка...', error: 'Что-то пошло не так', success: 'Успех!', save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Редактировать', view: 'Просмотр', share: 'Поделиться', post: 'Опубликовать', comment: 'Комментарий', like: 'Нравится' },
  ja: { welcome: 'ようこそ', search: '検索', login: 'ログイン', register: '登録', logout: 'ログアウト', dashboard: 'ダッシュボード', settings: '設定', home: 'ホーム', listings: '物件', providers: 'サービス提供者', flights: 'フライト', courses: 'コース', wallet: 'ウォレット', community_not_found: 'あなたのコミュニティがリストにありませんか？作成してください！', loading: '読み込み中...', error: '問題が発生しました', success: '成功！', save: '保存', cancel: 'キャンセル', delete: '削除', edit: '編集', view: '表示', share: '共有', post: '投稿', comment: 'コメント', like: 'いいね' },
  ko: { welcome: '환영합니다', search: '검색', login: '로그인', register: '가입', logout: '로그아웃', dashboard: '대시보드', settings: '설정', home: '홈', listings: '목록', providers: '서비스 제공자', flights: '항공편', courses: '코스', wallet: '지갑', community_not_found: '커뮤니티가 목록에 없나요? 만드세요!', loading: '로딩 중...', error: '문제가 발생했습니다', success: '성공!', save: '저장', cancel: '취소', delete: '삭제', edit: '편집', view: '보기', share: '공유', post: '게시', comment: '댓글', like: '좋아요' },
  hi: { welcome: 'स्वागत है', search: 'खोजें', login: 'लॉगिन', register: 'साइन अप', logout: 'लॉगआउट', dashboard: 'डैशबोर्ड', settings: 'सेटिंग्स', home: 'होम', listings: 'लिस्टिंग', providers: 'सेवा प्रदाता', flights: 'उड़ानें', courses: 'कोर्स', wallet: 'वॉलेट', community_not_found: 'आपका समुदाय सूचीबद्ध नहीं है? इसे बनाएं!', loading: 'लोड हो रहा है...', error: 'कुछ गलत हो गया', success: 'सफलता!', save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', edit: 'संपादित करें', view: 'देखें', share: 'साझा करें', post: 'पोस्ट', comment: 'टिप्पणी', like: 'पसंद' },
  sw: { welcome: 'Karibu', search: 'Tafuta', login: 'Ingia', register: 'Jisajili', logout: 'Toka', dashboard: 'Dashibodi', settings: 'Mipangilio', home: 'Nyumbani', listings: 'Orodha', providers: 'Watoa Huduma', flights: 'Ndege', courses: 'Kozi', wallet: 'Mkoba', community_not_found: 'Jamii yako haijaorodheshwa? Iunde!', loading: 'Inapakia...', error: 'Kuna kosa', success: 'Imefanikiwa!', save: 'Hifadhi', cancel: 'Ghairi', delete: 'Futa', edit: 'Hariri', view: 'Tazama', share: 'Shiriki', post: 'Chapisha', comment: 'Maoni', like: 'Penda' },
  ha: { welcome: 'Barka da zuwa', search: 'Bincika', login: 'Shiga', register: 'Yi rajista', logout: 'Fita', dashboard: 'Dashboard', settings: 'Saituna', home: 'Gida', listings: 'Jerin', providers: 'Masu Bayarwa', flights: 'Jiragen sama', courses: 'Darussa', wallet: 'Jakar kuɗi', community_not_found: 'Ba a jera al\'ummar ku ba? Ƙirƙiro ta!', loading: 'Ana lodi...', error: 'Wani abu ya faru', success: 'Nasara!', save: 'Ajiye', cancel: 'Soke', delete: 'Share', edit: 'Gyara', view: 'Duba', share: 'Raba', post: 'Aika', comment: 'Sharhi', like: 'So' },
  yo: { welcome: 'Ẹ ku abọ', search: 'Wa', login: 'Wọle', register: 'Forúkọsílẹ̀', logout: 'Jade', dashboard: 'Dasibọọdu', settings: 'Ètò', home: 'Ilé', listings: 'Àkọsílẹ̀', providers: 'Olùpèsè', flights: 'Ọkọ̀ òfurufú', courses: 'Ẹ̀kọ́', wallet: 'Àpamọ́wọ́', community_not_found: 'Àwùjọ rẹ kò sí? Ṣẹ̀dá rẹ̀!', loading: 'Ń ṣiṣẹ́...', error: 'Àṣìṣe kan ṣẹlẹ̀', success: 'Aṣeyọrí!', save: 'Tọ́jú', cancel: 'Fagilé', delete: 'Pa', edit: 'Ṣàtúnṣe', view: 'Wo', share: 'Pín', post: 'Firanṣẹ́', comment: 'Ọ̀rọ̀', like: 'Fẹ́ràn' },
  ig: { welcome: 'Nnọọ', search: 'Chọọ', login: 'Banye', register: 'Debanye aha', logout: 'Pụọ', dashboard: 'Dashboard', settings: 'Nhazi', home: 'Ụlọ', listings: 'Ndepụta', providers: 'Ndị na-enye', flights: 'Ụgbọ elu', courses: 'Ihe ọmụmụ', wallet: 'Akpa ego', community_not_found: 'Obodo gị adịghị? Mepụta ya!', loading: 'Na-ebu...', error: 'Ihe mere', success: 'Ọ ga-adị mma!', save: 'Chekwa', cancel: 'Kagbuo', delete: 'Hichapụ', edit: 'Dezie', view: 'Lee', share: 'Kekọrịta', post: 'Zipu', comment: 'Nkọwa', like: 'Masị' },
  pcm: { welcome: 'You don come', search: 'Find', login: 'Enter', register: 'Join', logout: 'Comot', dashboard: 'Dashboard', settings: 'Settings', home: 'House', listings: 'List', providers: 'People wey dey help', flights: 'Fly', courses: 'Learn', wallet: 'Money', community_not_found: 'Your area no dey? Create am!', loading: 'E dey load...', error: 'Wahala dey', success: 'E don work!', save: 'Keep', cancel: 'Cancel', delete: 'Remove', edit: 'Change', view: 'Look', share: 'Share', post: 'Post', comment: 'Talk', like: 'Like' },
  am: { welcome: 'እንኳን ደህና መጣህ', search: 'ፈልግ', login: 'ግባ', register: 'ተመዝገብ', logout: 'ውጣ', dashboard: 'ዳሽቦርድ', settings: 'ቅንብሮች', home: 'መነሻ', listings: 'ዝርዝሮች', providers: 'አቅራቢዎች', flights: 'በረራዎች', courses: 'ትምህርቶች', wallet: 'ቦርሳ', community_not_found: 'ማህበረሰብህ አልተዘረዘረም? ፍጠረው!', loading: 'በመጫን ላይ...', error: 'ስህተት ተፈጠረ', success: 'ተሳክቷል!', save: 'አስቀምጥ', cancel: 'ሰርዝ', delete: 'ሰርዝ', edit: 'አርትዕ', view: 'ተመልከት', share: 'አጋራ', post: 'ለጥፍ', comment: 'አስተያየት', like: 'ወደድኩት' },
  zu: { welcome: 'Siyakwamukela', search: 'Sesha', login: 'Ngena', register: 'Bhalisa', logout: 'Phuma', dashboard: 'Idashbhodi', settings: 'Izilungiselelo', home: 'Ikhaya', listings: 'Uhlu', providers: 'Abahlinzeki', flights: 'Izindiza', courses: 'Izifundo', wallet: 'Isikhwama', community_not_found: 'Umphakathi wakho awukho? Wudale!', loading: 'Iyalayisha...', error: 'Kukhona iphutha', success: 'Impumelelo!', save: 'Gcina', cancel: 'Khansela', delete: 'Susa', edit: 'Hlela', view: 'Buka', share: 'Yabelana', post: 'Thumela', comment: 'Phawula', like: 'Thanda' },
  af: { welcome: 'Welkom', search: 'Soek', login: 'Teken in', register: 'Registreer', logout: 'Teken uit', dashboard: 'Paneelbord', settings: 'Instellings', home: 'Tuis', listings: 'Lyste', providers: 'Verskaffers', flights: 'Vlugte', courses: 'Kursusse', wallet: 'Beursie', community_not_found: 'Jou gemeenskap is nie gelys nie? Skep dit!', loading: 'Laai...', error: 'Iets het verkeerd gegaan', success: 'Sukses!', save: 'Stoor', cancel: 'Kanselleer', delete: 'Verwyder', edit: 'Wysig', view: 'Bekyk', share: 'Deel', post: 'Plaas', comment: 'Kommentaar', like: 'Hou van' },
}

// Translation hook helper
export function t(lang: LanguageCode, key: string): string {
  return translations[lang]?.[key] || translations.en[key] || key
}

// Export package
export default {
  LANGUAGES,
  detectBrowserLanguage,
  getLanguageDirection,
  getAILanguagePrompt,
  translations,
  t,
}
