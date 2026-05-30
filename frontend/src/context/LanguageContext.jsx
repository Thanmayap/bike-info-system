import { createContext, useContext, useEffect, useState } from 'react';

const LanguageCtx = createContext(null);
export const useLanguage = () => useContext(LanguageCtx);

const translations = {
  en: {
    // Navbar
    home: "Home",
    bikes: "Bikes",
    compare: "Compare",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    logout: "Logout",
    login: "Login",
    signup: "Sign up",
    searchPlaceholder: "Search bikes...",

    // Hero
    heroTitle: "Find your",
    heroTitlePerfect: "perfect ride",
    heroTitleSub: "Compare. Decide. Ride.",
    heroSubtitle: "Engine specs, mileage, real reviews and side-by-side comparisons — all the data you need to choose your next bike with confidence.",
    searchPrompt: "Search your bike here, e.g. Bajaj Pulsar N160",
    searchBtn: "Search",

    // Featured Tabs
    featuredHeader: "Featured Bikes",
    tabTrending: "TRENDING",
    tabPopular: "POPULAR",
    tabElectric: "ELECTRIC",
    tabUpcoming: "UPCOMING",
    viewAllBikes: "All Featured Bikes >",
    viewAllTrending: "All Trending Bikes >",
    viewAllPopular: "All Popular Bikes >",
    viewAllElectric: "All Electric Bikes >",
    viewAllUpcoming: "All Upcoming Bikes >",

    // Card Details
    onwards: "Onwards",
    exShowroom: "Avg. Ex-Showroom price in",
    checkOnRoadPrice: "Check on-road price",
    featuredBadge: "Featured",

    // City Selection Modal
    selectCity: "Select your City",
    pincodePlaceholder: "Type your Pincode or City",
    detectLocation: "Detect my location",
    popularCities: "Popular Cities",
    detecting: "Detecting location...",
    gpsError: "Unable to detect location. Please select a city manually.",
    locationGranted: "Location detected successfully!",

    // Similar Brands
    similarBrands: "Similar Brands",
    viewBrandBikes: "View all brand models",

    // User Reviews
    userReviewsTitle: "User Reviews",
    userReviewsSubtitle: "3000+ unbiased, verified reviews from bike owners. Know the pros and cons of 200+ bike models from real owners.",
    userReviewsSearch: "Search bike e.g. Bajaj Dominar 400",
    recentlyAddedReviews: "Recently Added Reviews",
    reviewOn: "Review on",

    // Highlights Accordion
    keyHighlights: "Key Highlights",
    engineCapacity: "Engine Capacity",
    mileageArai: "Mileage - ARAI",
    transmission: "Transmission",
    kerbWeight: "Kerb Weight",
    fuelTankCapacity: "Fuel Tank Capacity",
    seatHeight: "Seat Height",
    exploreOther: "Explore Other",
    moreModelsStarting: "more models starting from",
    viewAll: "View All",
    viewAllSpecs: "View All Specifications and Features",
    betterMileageThan: "Better mileage than 62% of street bikes",
    lowerWeightThan: "Lower kerb weight than 64% of street bikes",
    lowerSeatHeightThan: "Lower seat height than 65% of street bikes",
    techLedHeadlight: "LED Headlight",
    techAbs: "Anti-lock Braking System (ABS)",
    techBluetooth: "Bluetooth & Smart Navigation"
  },
  hi: {
    // Navbar
    home: "होम",
    bikes: "बाइक्स",
    compare: "तुलना करें",
    about: "हमारे बारे में",
    contact: "संपर्क करें",
    dashboard: "डैशबोर्ड",
    logout: "लॉगआउट",
    login: "लॉगिन",
    signup: "साइन अप",
    searchPlaceholder: "बाइक्स खोजें...",

    // Hero
    heroTitle: "अपनी",
    heroTitlePerfect: "उत्कृष्ट बाइक",
    heroTitleSub: "तुलना करें। निर्णय लें। सवारी करें।",
    heroSubtitle: "इंजन विनिर्देश, माइलेज, वास्तविक समीक्षाएं और एक साथ तुलना — वह सब जानकारी जो आपको आत्मविश्वास के साथ अपनी अगली बाइक चुनने के लिए चाहिए।",
    searchPrompt: "अपनी बाइक यहाँ खोजें, जैसे बजाज पल्सर N160",
    searchBtn: "खोजें",

    // Featured Tabs
    featuredHeader: "चुनिंदा बाइक्स",
    tabTrending: "ट्रेंडिंग",
    tabPopular: "लोकप्रिय",
    tabElectric: "इलेक्ट्रिक",
    tabUpcoming: "आगामी",
    viewAllBikes: "सभी चुनिंदा बाइक्स >",
    viewAllTrending: "सभी ट्रेंडिंग बाइक्स >",
    viewAllPopular: "सभी लोकप्रिय बाइक्स >",
    viewAllElectric: "सभी इलेक्ट्रिक बाइक्स >",
    viewAllUpcoming: "सभी आगामी बाइक्स >",

    // Card Details
    onwards: "के बाद से",
    exShowroom: "औसत एक्स-शोरूम कीमत",
    checkOnRoadPrice: "ऑन-रोड कीमत जांचें",
    featuredBadge: "चुनिंदा",

    // City Selection Modal
    selectCity: "अपना शहर चुनें",
    pincodePlaceholder: "अपना पिनकोड या शहर दर्ज करें",
    detectLocation: "मेरी स्थिति का पता लगाएं",
    popularCities: "लोकप्रिय शहर",
    detecting: "लोकेशन का पता लगाया जा रहा है...",
    gpsError: "लोकेशन का पता लगाने में असमर्थ। कृपया मैन्युअल रूप से शहर चुनें।",
    locationGranted: "लोकेशन का सफलतापूर्वक पता चल गया है!",

    // Similar Brands
    similarBrands: "समान ब्रांड्स",
    viewBrandBikes: "सभी ब्रांड मॉडल देखें",

    // User Reviews
    userReviewsTitle: "उपयोगकर्ता समीक्षाएं",
    userReviewsSubtitle: "बाइक मालिकों से 3000+ निष्पक्ष, सत्यापित समीक्षाएं। वास्तविक मालिकों से 200+ बाइक मॉडल के फायदे और नुकसान जानें।",
    userReviewsSearch: "बाइक खोजें जैसे बजाज डोमिनार 400",
    recentlyAddedReviews: "हाल ही में जोड़े गए रिव्यू",
    reviewOn: "समीक्षा पर",

    // Highlights Accordion
    keyHighlights: "मुख्य विशेषताएं",
    engineCapacity: "इंजन क्षमता",
    mileageArai: "माइलेज - एआरएआई (ARAI)",
    transmission: "ट्रांसमिशन",
    kerbWeight: "कुल वजन (Kerb Weight)",
    fuelTankCapacity: "ईंधन टैंक क्षमता",
    seatHeight: "सीट की ऊंचाई",
    exploreOther: "अन्य खोजें",
    moreModelsStarting: "अधिक मॉडल शुरूआती कीमत",
    viewAll: "सभी देखें",
    viewAllSpecs: "सभी विनिर्देश और विशेषताएं देखें",
    betterMileageThan: "सड़क बाइकों से 62% बेहतर माइलेज",
    lowerWeightThan: "सड़क बाइकों से 64% कम कुल वजन",
    lowerSeatHeightThan: "सड़क बाइकों से 65% कम सीट की ऊंचाई",
    techLedHeadlight: "एलईडी हेडलाइट (LED)",
    techAbs: "एंटी-लॉक ब्रेकिंग सिस्टम (ABS)",
    techBluetooth: "ब्लूटूथ और स्मार्ट नेविगेशन"
  },
  kn: {
    home: "ಮುಖಪುಟ", bikes: "ಬೈಕುಗಳು", compare: "ಹೋಲಿಸಿ", about: "ಬಗ್ಗೆ", contact: "ಸಂಪರ್ಕ", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", logout: "ಲಾಗೌಟ್", login: "ಲಾಗಿನ್", signup: "ಸೈನ್ ಅಪ್", searchPlaceholder: "ಬೈಕ್ ಹುಡುಕಿ...",
    heroTitle: "ನಿಮ್ಮ", heroTitlePerfect: "ಪರಿಪೂರ್ಣ ಬೈಕ್", heroTitleSub: "ಹೋಲಿಸಿ. ನಿರ್ಧರಿಸಿ. ಸವಾರಿ ಮಾಡಿ.", heroSubtitle: "ಎಂಜಿನ್, ಮೈಲೇಜ್, ಮತ್ತು ವಿಮರ್ಶೆಗಳು - ನಿಮ್ಮ ಮುಂದಿನ ಬೈಕ್ ಆಯ್ಕೆ ಮಾಡಲು ಬೇಕಾದ ಎಲ್ಲವೂ.", searchPrompt: "ನಿಮ್ಮ ಬೈಕ್ ಹುಡುಕಿ, ಉದಾ. Bajaj Pulsar", searchBtn: "ಹುಡುಕಿ",
    featuredHeader: "ವೈಶಿಷ್ಟ್ಯಪೂರ್ಣ ಬೈಕುಗಳು", tabTrending: "ಟ್ರೆಂಡಿಂಗ್", tabPopular: "ಜನಪ್ರಿಯ", tabElectric: "ಎಲೆಕ್ಟ್ರಿಕ್", tabUpcoming: "ಮುಂಬರುವ",
    viewAllBikes: "ಎಲ್ಲಾ ಬೈಕುಗಳು >", viewAllTrending: "ಎಲ್ಲಾ ಟ್ರೆಂಡಿಂಗ್ >", viewAllPopular: "ಎಲ್ಲಾ ಜನಪ್ರಿಯ >", viewAllElectric: "ಎಲ್ಲಾ ಎಲೆಕ್ಟ್ರಿಕ್ >", viewAllUpcoming: "ಎಲ್ಲಾ ಮುಂಬರುವ >",
    onwards: "ನಂತರ", exShowroom: "ಎಕ್ಸ್ ಶೋ ರೂಂ ಬೆಲೆ", checkOnRoadPrice: "ಆನ್-ರೋಡ್ ಬೆಲೆ ಪರಿಶೀಲಿಸಿ", featuredBadge: "ವೈಶಿಷ್ಟ್ಯಪೂರ್ಣ",
    selectCity: "ನಗರ ಆಯ್ಕೆಮಾಡಿ", pincodePlaceholder: "ಪಿನ್ ಕೋಡ್ ಅಥವಾ ನಗರ ಟೈಪ್ ಮಾಡಿ", detectLocation: "ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಿ", popularCities: "ಜನಪ್ರಿಯ ನಗರಗಳು", detecting: "ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...", gpsError: "ಸ್ಥಳ ಪತ್ತೆಹಚ್ಚಲಾಗಲಿಲ್ಲ.", locationGranted: "ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ!",
    similarBrands: "ಹೋಲುವ ಬ್ರಾಂಡ್‌ಗಳು", viewBrandBikes: "ಎಲ್ಲಾ ಮಾದರಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    userReviewsTitle: "ಬಳಕೆದಾರರ ವಿಮರ್ಶೆಗಳು", userReviewsSubtitle: "ಬೈಕ್ ಮಾಲೀಕರಿಂದ 3000+ ನೈಜ ವಿಮರ್ಶೆಗಳು.", userReviewsSearch: "ಬೈಕ್ ಹುಡುಕಿ", recentlyAddedReviews: "ಇತ್ತೀಚಿನ ವಿಮರ್ಶೆಗಳು", reviewOn: "ವಿಮರ್ಶೆ",
    keyHighlights: "ಮುಖ್ಯಾಂಶಗಳು", engineCapacity: "ಎಂಜಿನ್ ಸಾಮರ್ಥ್ಯ", mileageArai: "ಮೈಲೇಜ್", transmission: "ಗೇರ್", kerbWeight: "ತೂಕ", fuelTankCapacity: "ಇಂಧನ ಟ್ಯಾಂಕ್", seatHeight: "ಸೀಟ್ ಎತ್ತರ", exploreOther: "ಇತರೆ ಅನ್ವೇಷಿಸಿ", moreModelsStarting: "ಹೆಚ್ಚು ಮಾದರಿಗಳು", viewAll: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ", viewAllSpecs: "ಎಲ್ಲಾ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ವೀಕ್ಷಿಸಿ"
  },
  te: {
    home: "హోమ్", bikes: "బైక్స్", compare: "పోల్చండి", about: "గురించి", contact: "సంప్రదించండి", dashboard: "డాష్‌బోర్డ్", logout: "లాగౌట్", login: "లాగిన్", signup: "సైన్ అప్", searchPlaceholder: "బైక్ వెతకండి...",
    heroTitle: "మీ", heroTitlePerfect: "ఖచ్చితమైన బైక్", heroTitleSub: "పోల్చండి. నిర్ణయించండి. రైడ్ చేయండి.", heroSubtitle: "ఇంజిన్, మైలేజ్, మరియు సమీక్షలు - తదుపరి బైక్ ఎంచుకోవడానికి కావలసినవి.", searchPrompt: "మీ బైక్ వెతకండి, ఉదా. Bajaj Pulsar", searchBtn: "వెతకండి",
    featuredHeader: "ఫీచర్ చేయబడిన బైక్స్", tabTrending: "ట్రెండింగ్", tabPopular: "పాపులర్", tabElectric: "ఎలక్ట్రిక్", tabUpcoming: "రాబోయేవి",
    viewAllBikes: "అన్ని బైక్స్ >", viewAllTrending: "అన్ని ట్రెండింగ్ >", viewAllPopular: "అన్ని పాపులర్ >", viewAllElectric: "అన్ని ఎలక్ట్రిక్ >", viewAllUpcoming: "అన్ని రాబోయేవి >",
    onwards: "తరువాత", exShowroom: "ఎక్స్-షోరూమ్ ధర", checkOnRoadPrice: "ఆన్-రోడ్ ధర తనిఖీ చేయండి", featuredBadge: "ఫీచర్డ్",
    selectCity: "నగరాన్ని ఎంచుకోండి", pincodePlaceholder: "పిన్‌కోడ్ లేదా నగరాన్ని టైప్ చేయండి", detectLocation: "స్థానాన్ని గుర్తించండి", popularCities: "పాపులర్ నగరాలు", detecting: "గుర్తిస్తోంది...", gpsError: "స్థానాన్ని గుర్తించలేకపోయాము.", locationGranted: "స్థానం గుర్తించబడింది!",
    similarBrands: "సారూప్య బ్రాండ్‌లు", viewBrandBikes: "అన్ని మోడళ్లను చూడండి",
    userReviewsTitle: "వినియోగదారు సమీక్షలు", userReviewsSubtitle: "బైక్ యజమానుల నుండి 3000+ నిజమైన సమీక్షలు.", userReviewsSearch: "బైక్ వెతకండి", recentlyAddedReviews: "ఇటీవల చేర్చిన సమీక్షలు", reviewOn: "సమీక్ష",
    keyHighlights: "ముఖ్యాంశాలు", engineCapacity: "ఇంజిన్ సామర్థ్యం", mileageArai: "మైలేజ్", transmission: "గేర్", kerbWeight: "బరువు", fuelTankCapacity: "ఇంధన ట్యాంక్", seatHeight: "సీటు ఎత్తు", exploreOther: "ఇతర అన్వేషించండి", moreModelsStarting: "మరిన్ని మోడళ్లు", viewAll: "అన్నీ చూడండి", viewAllSpecs: "అన్ని వివరాలు చూడండి"
  },
  ta: {
    home: "முகப்பு", bikes: "பைக்குகள்", compare: "ஒப்பிடுக", about: "பற்றி", contact: "தொடர்பு", dashboard: "டாஷ்போர்டு", logout: "வெளியேறு", login: "உள்நுழை", signup: "பதிவு செய்", searchPlaceholder: "பைக் தேடுக...",
    heroTitle: "உங்கள்", heroTitlePerfect: "சிறந்த பைக்", heroTitleSub: "ஒப்பிடு. முடிவெடு. ஓட்டு.", heroSubtitle: "என்ஜின், மைலேஜ் மற்றும் மதிப்புரைகள் - சிறந்த பைக்கை தேர்வு செய்ய தேவையான அனைத்தும்.", searchPrompt: "உங்கள் பைக்கை தேடுக, எ.கா. Bajaj Pulsar", searchBtn: "தேடுக",
    featuredHeader: "சிறப்பு பைக்குகள்", tabTrending: "பிரபலமானவை", tabPopular: "பிரபலம்", tabElectric: "மின்சாரம்", tabUpcoming: "வரவிருப்பவை",
    viewAllBikes: "அனைத்து பைக்குகள் >", viewAllTrending: "அனைத்து பிரபலமானவை >", viewAllPopular: "அனைத்து பிரபலம் >", viewAllElectric: "அனைத்து மின்சாரம் >", viewAllUpcoming: "அனைத்து வரவிருப்பவை >",
    onwards: "முதல்", exShowroom: "எக்ஸ்-ஷோரூம் விலை", checkOnRoadPrice: "ஆன்-ரோடு விலை சரிபார்க்கவும்", featuredBadge: "சிறப்பு",
    selectCity: "நகரத்தை தேர்ந்தெடுக்கவும்", pincodePlaceholder: "பின்கோடு அல்லது நகரம்", detectLocation: "இருப்பிடத்தை கண்டுபிடி", popularCities: "பிரபல நகரங்கள்", detecting: "கண்டுபிடிக்கிறது...", gpsError: "இருப்பிடத்தை கண்டுபிடிக்க முடியவில்லை.", locationGranted: "இருப்பிடம் கண்டறியப்பட்டது!",
    similarBrands: "ஒத்த பிராண்டுகள்", viewBrandBikes: "அனைத்து மாடல்களையும் காண்க",
    userReviewsTitle: "பயனர் மதிப்புரைகள்", userReviewsSubtitle: "பைக் உரிமையாளர்களிடமிருந்து 3000+ உண்மையான மதிப்புரைகள்.", userReviewsSearch: "பைக் தேடுக", recentlyAddedReviews: "சமீபத்திய மதிப்புரைகள்", reviewOn: "மதிப்புரை",
    keyHighlights: "முக்கிய சிறப்பம்சங்கள்", engineCapacity: "என்ஜின் திறன்", mileageArai: "மைலேஜ்", transmission: "கியர்", kerbWeight: "எடை", fuelTankCapacity: "எரிபொருள் தொட்டி", seatHeight: "இருக்கை உயரம்", exploreOther: "மற்றவை தேடுக", moreModelsStarting: "மேலும் மாடல்கள்", viewAll: "அனைத்தையும் காண்க", viewAllSpecs: "அனைத்து விவரங்களையும் காண்க"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (code) => {
    if (translations[code]) setLang(code);
  };

  return (
    <LanguageCtx.Provider value={{ lang, setLang, t, changeLanguage }}>
      {children}
    </LanguageCtx.Provider>
  );
}
