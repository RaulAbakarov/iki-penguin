import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/ask.css'

function AskQuestion() {
  const navigate = useNavigate()
  const { addQuestion, getOppositeIdentity } = useApp()
  const { t } = useLanguage()

  const [text, setText] = useState('')
  const [choices, setChoices] = useState(['', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [saved, setSaved] = useState(false)

  const targetName = getOppositeIdentity()

  const handleAddChoice = () => {
    setChoices(prev => [...prev, ''])
  }

  const handleRemoveChoice = (index) => {
    if (choices.length <= 2) return
    
    setChoices(prev => prev.filter((_, i) => i !== index))
    
    // Adjust correct index if needed
    if (correctIndex >= index && correctIndex > 0) {
      setCorrectIndex(prev => prev - 1)
    }
  }

  const handleChoiceChange = (index, value) => {
    setChoices(prev => prev.map((c, i) => i === index ? value : c))
  }

  const isValid = () => {
    if (!text.trim()) return false
    if (choices.some(c => !c.trim())) return false
    if (choices.length < 2) return false
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isValid()) return

    addQuestion({
      text: text.trim(),
      choices: choices.map(c => c.trim()),
      correctIndex,
      explanation: explanation.trim() || null
    })

    setSaved(true)
    
    // Reset form after short delay
    setTimeout(() => {
      setText('')
      setChoices(['', ''])
      setCorrectIndex(0)
      setExplanation('')
      setSaved(false)
    }, 2000)
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  return (
    <div className="ask-page">
      <div className="ask-container">
        <button className="back-link" onClick={handleBack}>
          {t('back')}
        </button>

        <h1 className="page-title">{t('askTitle', { target: targetName })}</h1>

        {saved ? (
          <div className="saved-message">
            <p>{t('questionSaved')}</p>
          </div>
        ) : (
          <form className="question-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="question-text">{t('yourQuestion')}</label>
              <textarea
                id="question-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t('whatToAsk')}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>{t('choices')}</label>
              <p className="form-hint">{t('selectCorrectAnswer')}</p>
              
              <div className="choices-list">
                {choices.map((choice, index) => (
                  <div key={index} className="choice-input-row">
                    <input
                      type="radio"
                      name="correct"
                      checked={correctIndex === index}
                      onChange={() => setCorrectIndex(index)}
                      className="correct-radio"
                    />
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) => handleChoiceChange(index, e.target.value)}
                      placeholder={`${t('choice')} ${index + 1}`}
                      className="choice-input"
                    />
                    {choices.length > 2 && (
                      <button
                        type="button"
                        className="remove-choice"
                        onClick={() => handleRemoveChoice(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="add-choice-button"
                onClick={handleAddChoice}
              >
                {t('addAnotherChoice')}
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="explanation">
                {t('explanation')} <span className="optional">({t('optional')})</span>
              </label>
              <textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={t('whyCorrect')}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={!isValid()}
            >
              {t('saveQuestion')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AskQuestion
