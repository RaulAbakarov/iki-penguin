import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/answer.css'

function AnswerQuestions() {
  const navigate = useNavigate()
  const { getQuestionsForMe, markAnswered, getAnswer, questions } = useApp()
  const { t } = useLanguage()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [questionsToAnswer, setQuestionsToAnswer] = useState([])

  useEffect(() => {
    setQuestionsToAnswer(getQuestionsForMe())
  }, [questions])

  const currentQuestion = questionsToAnswer[currentIndex]

  const handleSelectAnswer = (index) => {
    if (showResult) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    markAnswered(currentQuestion.id, index)
  }

  const handleNext = () => {
    if (currentIndex < questionsToAnswer.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // All done
      setCurrentIndex(questionsToAnswer.length)
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  // No questions available
  if (questionsToAnswer.length === 0) {
    return (
      <div className="answer-page">
        <div className="answer-container">
          <div className="no-questions">
            <p className="calm-message">{t('noQuestionsWaiting')}</p>
            <button className="back-button" onClick={handleBack}>
              {t('goBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // All questions answered
  if (currentIndex >= questionsToAnswer.length) {
    return (
      <div className="answer-page">
        <div className="answer-container">
          <div className="all-done">
            <p className="calm-message">{t('thatsAll')}</p>
            <button className="back-button" onClick={handleBack}>
              {t('goBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="answer-page">
      <div className="answer-container">
        <button className="back-link" onClick={handleBack}>
          {t('back')}
        </button>

        <div className="question-card">
          <p className="question-text">{currentQuestion.text}</p>

          <div className="choices">
            {currentQuestion.choices.map((choice, index) => {
              let className = 'choice-button'
              
              if (showResult) {
                if (index === currentQuestion.correctIndex) {
                  className += ' correct'
                } else if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
                  className += ' selected-wrong'
                }
              }

              return (
                <button
                  key={index}
                  className={className}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className="result-section">
              <p className="result-message">
                {selectedAnswer === currentQuestion.correctIndex 
                  ? t('correctAnswer') 
                  : t('wrongAnswer')}
              </p>
              
              {currentQuestion.explanation && (
                <div className="explanation">
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}

              <button className="next-button" onClick={handleNext}>
                {currentIndex < questionsToAnswer.length - 1 
                  ? t('nextQuestion') 
                  : t('finish')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnswerQuestions
