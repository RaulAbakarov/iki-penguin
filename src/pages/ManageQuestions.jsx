import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/manage.css'

function ManageQuestions() {
  const navigate = useNavigate()
  const { getMyQuestions, updateQuestion, deleteQuestion, toggleQuestionActive, getPartnerAnswer, getOppositeIdentity } = useApp()
  const { t } = useLanguage()
  
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const myQuestions = getMyQuestions()

  const handleBack = () => {
    navigate('/dashboard')
  }

  const startEditing = (question) => {
    setEditingId(question.id)
    setEditForm({
      text: question.text,
      choices: [...question.choices],
      correctIndex: question.correctIndex,
      explanation: question.explanation || ''
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const handleChoiceChange = (index, value) => {
    setEditForm(prev => ({
      ...prev,
      choices: prev.choices.map((c, i) => i === index ? value : c)
    }))
  }

  const handleAddChoice = () => {
    setEditForm(prev => ({
      ...prev,
      choices: [...prev.choices, '']
    }))
  }

  const handleRemoveChoice = (index) => {
    if (editForm.choices.length <= 2) return
    
    setEditForm(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
      correctIndex: prev.correctIndex >= index && prev.correctIndex > 0 
        ? prev.correctIndex - 1 
        : prev.correctIndex
    }))
  }

  const isEditValid = () => {
    if (!editForm) return false
    if (!editForm.text.trim()) return false
    if (editForm.choices.some(c => !c.trim())) return false
    if (editForm.choices.length < 2) return false
    return true
  }

  const saveEdit = (id) => {
    if (!isEditValid()) return

    updateQuestion(id, {
      text: editForm.text.trim(),
      choices: editForm.choices.map(c => c.trim()),
      correctIndex: editForm.correctIndex,
      explanation: editForm.explanation.trim() || null
    })

    cancelEditing()
  }

  const handleDelete = (id) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteQuestion(id)
    }
  }

  return (
    <div className="manage-page">
      <div className="manage-container">
        <button className="back-link" onClick={handleBack}>
          {t('back')}
        </button>

        <h1 className="page-title">{t('yourQuestions')}</h1>

        {myQuestions.length === 0 ? (
          <p className="no-questions-text">{t('noQuestionsYet')}</p>
        ) : (
          <div className="questions-list">
            {myQuestions.map(question => (
              <div key={question.id} className={`question-item ${!question.active ? 'inactive' : ''}`}>
                {editingId === question.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>{t('question')}</label>
                      <textarea
                        value={editForm.text}
                        onChange={(e) => handleEditFormChange('text', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label>{t('choices')}</label>
                      <div className="choices-list">
                        {editForm.choices.map((choice, index) => (
                          <div key={index} className="choice-input-row">
                            <input
                              type="radio"
                              name="edit-correct"
                              checked={editForm.correctIndex === index}
                              onChange={() => handleEditFormChange('correctIndex', index)}
                            />
                            <input
                              type="text"
                              value={choice}
                              onChange={(e) => handleChoiceChange(index, e.target.value)}
                              className="choice-input"
                            />
                            {editForm.choices.length > 2 && (
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
                        {t('addChoice')}
                      </button>
                    </div>

                    <div className="form-group">
                      <label>{t('explanationOptional')}</label>
                      <textarea
                        value={editForm.explanation}
                        onChange={(e) => handleEditFormChange('explanation', e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="edit-actions">
                      <button 
                        className="save-button"
                        onClick={() => saveEdit(question.id)}
                        disabled={!isEditValid()}
                      >
                        {t('save')}
                      </button>
                      <button 
                        className="cancel-button"
                        onClick={cancelEditing}
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="question-preview">
                      <p className="question-text">{question.text}</p>
                      <div className="choices-preview">
                        {question.choices.map((choice, index) => (
                          <span 
                            key={index} 
                            className={`choice-tag ${index === question.correctIndex ? 'correct' : ''}`}
                          >
                            {choice}
                          </span>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className="explanation-preview">"{question.explanation}"</p>
                      )}
                      {(() => {
                        const partnerAnswer = getPartnerAnswer(question.id)
                        const partnerName = getOppositeIdentity()
                        if (!partnerAnswer) {
                          return (
                            <div className="partner-answer-status not-answered">
                              <span className="status-icon">⏳</span>
                              <span>{partnerName} {t('hasntAnsweredYet')}</span>
                            </div>
                          )
                        }
                        const isCorrect = partnerAnswer.selectedIndex === question.correctIndex
                        const selectedChoice = question.choices[partnerAnswer.selectedIndex]
                        return (
                          <div className={`partner-answer-status ${isCorrect ? 'answered-correct' : 'answered-wrong'}`}>
                            <span className="status-icon">{isCorrect ? '✓' : '✗'}</span>
                            <span>
                              {partnerName} {t('answered')} "<strong>{selectedChoice}</strong>" — {isCorrect ? t('correct') : t('incorrect')}
                            </span>
                          </div>
                        )
                      })()}
                    </div>

                    <div className="question-actions">
                      <button 
                        className="action-button"
                        onClick={() => startEditing(question)}
                      >
                        {t('edit')}
                      </button>
                      <button 
                        className="action-button"
                        onClick={() => toggleQuestionActive(question.id)}
                      >
                        {question.active ? t('deactivate') : t('activate')}
                      </button>
                      <button 
                        className="action-button delete"
                        onClick={() => handleDelete(question.id)}
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageQuestions
