import { translations } from "@/services/localization";
import { I18n } from "i18n-js";
import { useEffect, useState } from "react";
import * as Localization from 'expo-localization';

export default function useTranslations() {
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    const [i18n, setI18n] = useState<I18n | null>(null);

    useEffect(() => {
        const i18nInstance = new I18n(translations);
        i18nInstance.locale = locale;
        setI18n(i18nInstance);
    }, [locale]);
    
    return { t: i18n? i18n.t.bind(i18n) : (key: string) => key, setLocale };
}