import { translations } from "@/services/localization";
import { I18n } from "i18n-js";
import { useState } from "react";
import * as Localization from 'expo-localization';

export default function useTranslations() {
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    const i18n = new I18n(translations);
    if (locale !== null)
        i18n.locale = locale;
    
    return i18n;
}