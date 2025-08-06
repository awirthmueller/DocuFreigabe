import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import de from "./translations/de.json";
import { LANGUAGES,DEFAULT_LANGUAGE } from "../data/constants";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, de: { translation: de } },
  lng: localStorage.getItem('system_language'), 
  fallbackLng: DEFAULT_LANGUAGE, // Default language
  interpolation: { escapeValue: false }, // React handles escaping
});

export default i18n;