export const i18n = {
  locales: [
    {
      lang: "en",
      image: "https://cdn-icons-png.flaticon.com/128/9906/9906532.png",
    },
  ],
  defaultLocale: "en",
};

export type I18nConfig = typeof i18n;
export type Locale = I18nConfig["locales"][number];
