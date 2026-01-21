import { useLanguage } from '../context/LanguageContext'
import './LanguageSelector.css'

function LanguageSelector() {
  const { language, changeLanguage, languages, languageNames } = useLanguage()

  return (
    <div className="language-selector">
      <select 
        value={language} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        {languages.map(lang => (
          <option key={lang} value={lang}>
            {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
