import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      welcome: "Bienvenue à l'Église Éthiopienne Orthodoxe Tewahedo de Toulouse",
      finance: {
        title: "Gestion financière",
        transactions: "Transactions",
        reports: "Rapports",
      },
    },
  },
  am: {
    translation: {
      welcome: "በቱሉዝ የኢትዮጵያ ኦርቶዶካስ ተዋሕዶ ቤተ ክርስቲያን ይቀበሉ",
      finance: {
        title: "ገንዘብ አስተዳደር",
        transactions: "ግብይቶች",
        reports: "ዘገናዎች",
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr", // default
    fallbackLng: "fr",
    interpolation: { escapeValue: false }
  });

export default i18n;
