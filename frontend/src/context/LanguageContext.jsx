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

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageCtx.Provider value={{ lang, setLang, t, toggleLanguage }}>
      {children}
    </LanguageCtx.Provider>
  );
}
