import {useState, useEffect} from 'react';
import config from "../config";

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

export async function fetchTranslation(langCode = 'es') {
  let response = await fetch(`${process.env.PUBLIC_URL}/locales/${langCode}.json`)
  if (response) return await response.json();
  return {}
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
  const [translations, setTranslations] = useState({notloaded: true})
  const fallbackLanguage = getFallbackLanguage();
  const [language, setLanguage] = useState(fallbackLanguage);

  async function updateLanguage(language) {
    try {
      const translation = await fetchTranslation(language.value);
      localStorage.setItem(config.LANGUAGE_KEY, JSON.stringify(language))
      setTranslations(translation);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setTranslations({});
    }
  }

  function getTranslation(nodeString, variables) {
    return parseTranslation(nodeString, variables, translations)
  }

  useEffect(() => {
    if (language) {
      updateLanguage(language)
    }
  }, [language])


  return {language, setLanguage, translations, getTranslation}
}
