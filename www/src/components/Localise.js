import {useCallback, useEffect} from 'react';
import config from "../config";
import useGlobalSlice from "../services/useGlobalSlice";

const nodeReducer = (object, key) => object[key] || '';

const getTranslationValue = (nodeString, translations) => {
  const node = nodeString.split('.');
  return (
    (translations && node.reduce(nodeReducer, translations)) ||
    nodeString
  );
};

const replaceVariables = (translation, variables) => {
  let replaced = `${translation}`;
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const value = variables[key];
      replaced = replaced.replace(`{{${key}}}`, value);
    }
  }
  return replaced;
};

const parseTranslation = (nodeString, variables, translations) => {
  let translation = getTranslationValue(nodeString, translations);
  translation = replaceVariables(translation, variables);
  return translation;
};

const languages = {}
export async function fetchTranslation(langCode = 'es') {
  if(langCode in languages) return languages[langCode];
  if(!languages.fetching){
    let ret = {};
    languages.fetching = true;
    let response = await fetch(`${process.env.PUBLIC_URL}/locales/${langCode}.json`)
    if (response) {
      const translations = await response.json();
      languages[langCode] = translations;
      ret = translations;
    }
    delete languages.fetching;
    return ret;
  }
}

function getLanguage(langCode) {
  const {availableLanguages} = config;
  return availableLanguages.find(lang => lang.value === langCode)
}

function getFallbackLanguage() {
  const navigatorLanguage = window.navigator.language.substr(0, 2);
  let fallbackLanguage = getLanguage(navigatorLanguage) || config.availableLanguages[0];

  try {
    const languageFromLS = localStorage.getItem(config.LANGUAGE_KEY);
    return JSON.parse(languageFromLS) || fallbackLanguage;
  } catch (ignore) {
    return fallbackLanguage;
  }
}

export function useTranslations() {
  const [translations, setTranslations] = useGlobalSlice('translations')
  const [language, setLanguage] = useGlobalSlice('language');

  const updateLanguage = useCallback(async newLanguage => {
    try {
      const translation = await fetchTranslation(newLanguage.value);
      localStorage.setItem(config.LANGUAGE_KEY, JSON.stringify(newLanguage))
      setTranslations(translation);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setTranslations({});
    }
    // eslint-disable-next-line
  }, [])

  const getTranslation = useCallback((nodeString, variables) => {
    return parseTranslation(nodeString, variables, translations)
  }, [translations])

  useEffect(() => {
    if (language) {
      updateLanguage(language)
    } else {
      const fallbackLanguage = getFallbackLanguage();
      updateLanguage(fallbackLanguage)
    }
  }, [updateLanguage, language])


  return {language: language || getFallbackLanguage(), setLanguage, translations, getTranslation}
}
