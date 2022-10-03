import { createI18n } from 'vue-i18n'
import en from "@/locales/dictionary/en";
import fr from "@/locales/dictionary/fr";

const i18n = createI18n({
    locale: localStorage.getItem("lang") || "fr",
    fallbackLocale: 'fr',
    messages: { en, fr },
})

export default i18n