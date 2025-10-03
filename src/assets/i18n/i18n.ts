import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ptBR from "./translations/ptBR.json";

i18n.use(initReactI18next).init({
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    "pt-BR": ptBR,    
  },
}); 

export default i18n;
