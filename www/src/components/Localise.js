import React from 'react';
import useGlobalSlice from '../services/useGlobalSlice'

const nodeReducer = (object, key) => object[key] || '';

const getTranslation = (nodeString, translations) => {
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

export const parseTranslation = (nodeString, variables, translations) => {
    let translation = getTranslation(nodeString, translations);
    translation = replaceVariables(translation, variables);
    return translation;
};

const Localised = React.memo(({ node, variables, translations, dangerouslySetInnerHTML }) => {
    const translation = parseTranslation(node, variables, translations);
    if (!dangerouslySetInnerHTML) {
        return <React.Fragment>{translation}</React.Fragment>;
    }
    return <span dangerouslySetInnerHTML={{ __html: translation }} />;
});

export default function Localise({node, variables, dangerouslySetInnerHTML = false}){
    const [translations] = useGlobalSlice('translations')
    return <Localised node={node} variables={variables} translations={translations} dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
};

export async function fetchTranslation (langCode = 'es') {
    let response = await fetch(`${process.env.PUBLIC_URL}/locales/${langCode}.json`)
    if(response) return await response.json();
    return {}
}
