import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useLocalization = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const handleLanguageChange = (lng: string) => setLanguage(lng);
        i18n.on('languageChanged', handleLanguageChange);
        return () => i18n.off('languageChanged', handleLanguageChange);
    }, [i18n]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return { t, language, changeLanguage };
};

export default useLocalization;