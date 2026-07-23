const COLOR_STUDIO_LOCALES = [
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "pl", name: "Polski" },
  { code: "da", name: "Dansk" },
  { code: "de", name: "Deutsch" },
  { code: "ru", name: "Русский" },
  { code: "fr", name: "Français" },
  { code: "fr-CA", name: "Français (Canada)" },
  { code: "zh-Hant", name: "繁體中文" },
  { code: "fi", name: "Suomi" },
  { code: "ko", name: "한국어" },
  { code: "nl", name: "Nederlands" },
  { code: "ca", name: "Català" },
  { code: "zh-Hans", name: "简体中文" },
  { code: "cs", name: "Čeština" },
  { code: "hr", name: "Hrvatski" },
  { code: "ro", name: "Română" },
  { code: "mr", name: "मराठी" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "bn", name: "বাংলা" },
  { code: "nb", name: "Norsk" },
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "pt-PT", name: "Português (Portugal)" },
  { code: "ja", name: "日本語" },
  { code: "sv", name: "Svenska" },
  { code: "sk", name: "Slovenčina" },
  { code: "sl", name: "Slovenščina" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "th", name: "ไทย" },
  { code: "tr", name: "Türkçe" },
  { code: "ur", name: "اردو" },
  { code: "uk", name: "Українська" },
  { code: "es-MX", name: "Español (México)" },
  { code: "es-ES", name: "Español (España)" },
  { code: "he", name: "עברית" },
  { code: "el", name: "Ελληνικά" },
  { code: "hu", name: "Magyar" },
  { code: "it", name: "Italiano" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "en-CA", name: "English (Canada)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "en-US", name: "English (US)" }
];

const STATIC_LOCALE_CODE = "zh-Hans";
const TRANSLATED_LOCALE_CODES = new Set(
  COLOR_STUDIO_LOCALES.map(({ code }) => code).filter(
    (code) => code !== STATIC_LOCALE_CODE
  )
);
const COLOR_STUDIO_TRANSLATIONS = window.COLOR_STUDIO_TRANSLATIONS ?? {};

const availableLocaleCodes = new Map(
  COLOR_STUDIO_LOCALES.map((locale) => [locale.code.toLowerCase(), locale.code])
);

function matchLocale(language) {
  if (!language) return null;

  const normalized = language.replace("_", "-").toLowerCase();
  if (availableLocaleCodes.has(normalized)) {
    return availableLocaleCodes.get(normalized);
  }

  if (
    normalized === "zh" ||
    normalized.startsWith("zh-cn") ||
    normalized.startsWith("zh-sg") ||
    normalized.startsWith("zh-hans")
  ) {
    return "zh-Hans";
  }

  if (
    normalized.startsWith("zh-tw") ||
    normalized.startsWith("zh-hk") ||
    normalized.startsWith("zh-mo") ||
    normalized.startsWith("zh-hant")
  ) {
    return "zh-Hant";
  }

  if (normalized === "no" || normalized.startsWith("no-") || normalized.startsWith("nn")) {
    return "nb";
  }

  if (normalized === "iw" || normalized.startsWith("iw-")) return "he";
  if (normalized === "in" || normalized.startsWith("in-")) return "id";
  if (normalized === "pt" || normalized.startsWith("pt-")) {
    return normalized.startsWith("pt-br") ? "pt-BR" : "pt-PT";
  }
  if (normalized === "fr-ca") return "fr-CA";
  if (normalized === "es-mx") return "es-MX";
  if (normalized === "es" || normalized.startsWith("es-")) return "es-ES";
  if (normalized === "en-au") return "en-AU";
  if (normalized === "en-ca") return "en-CA";
  if (normalized === "en-gb") return "en-GB";
  if (normalized === "en" || normalized.startsWith("en-")) return "en-US";

  const baseLanguage = normalized.split("-")[0];
  const baseMatch = COLOR_STUDIO_LOCALES.find(
    (locale) => locale.code.toLowerCase() === baseLanguage
  );
  return baseMatch?.code ?? null;
}

function preferredLocale() {
  const urlLocale = new URLSearchParams(window.location.search).get("lang");
  const matchedUrlLocale = matchLocale(urlLocale);
  if (matchedUrlLocale) return matchedUrlLocale;

  const browserLanguages =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const language of browserLanguages) {
    const match = matchLocale(language);
    if (match) return match;
  }

  return "en-US";
}

function addLocaleToLink(link, localeCode) {
  const url = new URL(link.getAttribute("href"), window.location.href);
  url.searchParams.set("lang", localeCode);
  link.href = url.href;
}

function applyCommonTranslations(common) {
  const brand = document.querySelector(".brand");
  const brandName = document.querySelector(".brand-name");
  const brandTagline = document.querySelector(".brand-tagline");
  const navigation = document.querySelector(".primary-nav");
  const navigationLinks = navigation?.querySelectorAll("a") ?? [];
  const languageLabel = document.querySelector(".language-control label");
  const languageSelect = document.querySelector("[data-language-select]");
  const footerCopyright = document.querySelector(".site-footer > span");
  const footerLinks = document.querySelectorAll(".site-footer .footer-links a[data-locale-link]");

  if (brand) brand.setAttribute("aria-label", common.homeAriaLabel);
  if (brandName) brandName.textContent = common.brandName;
  if (brandTagline) brandTagline.textContent = common.tagline;
  if (navigation) navigation.setAttribute("aria-label", common.primaryNavigationLabel);
  if (navigationLinks[0]) navigationLinks[0].textContent = common.privacyPolicy;
  if (navigationLinks[1]) navigationLinks[1].textContent = common.termsOfUse;
  if (navigationLinks[2]) navigationLinks[2].textContent = common.support;
  if (languageLabel) languageLabel.textContent = common.language;
  if (languageSelect) languageSelect.setAttribute("aria-label", common.languageSelectLabel);
  if (footerCopyright) footerCopyright.textContent = common.copyright;
  if (footerLinks[0]) footerLinks[0].textContent = common.footerPrivacy;
  if (footerLinks[1]) footerLinks[1].textContent = common.footerTerms;
  if (footerLinks[2]) footerLinks[2].textContent = common.footerSupport;
}

function applyPageTranslation(translation) {
  const pageCode = document.body.dataset.page;
  const page = translation.pages[pageCode];
  const pageContent = document.querySelector("[data-page-content]");

  if (!page || !pageContent) {
    throw new Error(`Missing translation for page: ${pageCode ?? "unknown"}`);
  }

  document.title = page.documentTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", page.metaDescription);

  applyCommonTranslations(translation.common);
  pageContent.innerHTML = page.content;
}

async function loadTranslation(localeCode) {
  if (localeCode === STATIC_LOCALE_CODE) {
    return { effectiveLocaleCode: STATIC_LOCALE_CODE, translation: null };
  }

  const effectiveLocaleCode = TRANSLATED_LOCALE_CODES.has(localeCode)
    ? localeCode
    : "en-US";
  const translation = COLOR_STUDIO_TRANSLATIONS[effectiveLocaleCode];
  if (!translation) {
    throw new Error(`Missing bundled translation: ${effectiveLocaleCode}`);
  }
  return { effectiveLocaleCode, translation };
}

async function initializeLocalePicker() {
  const requestedLocaleCode = preferredLocale();
  const requestedLocale = COLOR_STUDIO_LOCALES.find(
    (item) => item.code === requestedLocaleCode
  );
  const select = document.querySelector("[data-language-select]");

  let effectiveLocaleCode = STATIC_LOCALE_CODE;
  let translation = null;

  try {
    const loaded = await loadTranslation(requestedLocaleCode);
    effectiveLocaleCode = loaded.effectiveLocaleCode;
    translation = loaded.translation;
    if (translation) applyPageTranslation(translation);
  } catch (error) {
    console.error("Unable to load the requested language.", error);
    if (requestedLocaleCode !== "en-US") {
      try {
        const fallback = await loadTranslation("en-US");
        effectiveLocaleCode = fallback.effectiveLocaleCode;
        translation = fallback.translation;
        if (translation) applyPageTranslation(translation);
      } catch (fallbackError) {
        console.error("Unable to load the English fallback.", fallbackError);
      }
    }
  }

  document.documentElement.lang = effectiveLocaleCode;
  document.documentElement.dir = translation?.dir ?? "ltr";

  if (select) {
    select.innerHTML = COLOR_STUDIO_LOCALES.map(
      (item) =>
        `<option value="${item.code}"${item.code === requestedLocaleCode ? " selected" : ""}>${item.name}</option>`
    ).join("");

    select.addEventListener("change", () => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("lang", select.value);
      window.location.assign(nextUrl);
    });
  }

  document.querySelectorAll("[data-locale-link]").forEach((link) => {
    addLocaleToLink(link, requestedLocaleCode);
  });

  const localeStatus = document.querySelector("[data-locale-status]");
  if (localeStatus) {
    if (requestedLocaleCode === effectiveLocaleCode) {
      localeStatus.hidden = true;
    } else {
      localeStatus.hidden = false;
      localeStatus.textContent = translation
        ? translation.common.fallbackStatus.replace(
            "{locale}",
            requestedLocale?.name ?? requestedLocaleCode
          )
        : `已选择 ${requestedLocale?.name ?? requestedLocaleCode}。当前显示简体中文。`;
    }
  }
}

initializeLocalePicker();
