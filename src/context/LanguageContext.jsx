import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, languageNames } from '../i18n/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'cv_language'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const t = useCallback((key, params = {}) => {
    let text = translations[language]?.[key] || translations['en']?.[key] || key
    
    // Replace parameters like {target} with actual values
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param])
    })
    
    return text
  }, [language])

  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguage(lang)
    }
  }, [])

  const value = {
    language,
    changeLanguage,
    t,
    languages: Object.keys(translations),
    languageNames
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
