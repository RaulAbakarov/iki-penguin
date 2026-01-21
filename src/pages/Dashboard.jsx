import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/dashboard.css'

// September 16, 2025 - the day we first met
const START_DATE = new Date('2025-09-16T00:00:00')

function calculateTimeSince(startDate) {
  const now = new Date()
  const diff = now - startDate
  
  const seconds = Math.floor(diff / 1000) % 60
  const minutes = Math.floor(diff / (1000 * 60)) % 60
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  // Calculate months and remaining days
  const months = Math.floor(totalDays / 30.44) // Average days per month
  const days = Math.floor(totalDays % 30.44)
  
  return { months, days, hours, minutes, seconds }
}

function Dashboard() {
  const navigate = useNavigate()
  const { identity, clearIdentity, getQuestionsForMe, getMyQuestions, loading, refreshData, isOnline, messages, sendMessage, streak } = useApp()
  const { t } = useLanguage()
  const [timeSince, setTimeSince] = useState(calculateTimeSince(START_DATE))
  const [message, setMessage] = useState('Fuck you')
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('Fuck you')

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(calculateTimeSince(START_DATE))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSendLove = () => {
    sendMessage(message)
  }

  const handleEditClick = () => {
    setEditValue(message)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      setMessage(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const formatMessageTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <p className="loading-text">{t('loading')}</p>
        </div>
      </div>
    )
  }

  const questionsForMe = getQuestionsForMe()
  const myQuestions = getMyQuestions()

  const handleSwitchIdentity = () => {
    clearIdentity()
    navigate('/')
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="current-identity">
          {t('youAre')} <strong>{identity}</strong>
          {isOnline && <span className="online-badge">●</span>}
        </span>
        <div className="header-actions">
          {isOnline && (
            <button 
              className="refresh-button"
              onClick={refreshData}
              title="Refresh"
            >
              ↻
            </button>
          )}
          <button 
            className="switch-button"
            onClick={handleSwitchIdentity}
          >
            {t('switch')}
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="relationship-timer">
          <p className="timer-label">{t('togetherSince')}</p>
          <div className="timer-display">
            <span className="timer-value">{timeSince.months}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{String(timeSince.days).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{String(timeSince.hours).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{String(timeSince.minutes).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-value">{String(timeSince.seconds).padStart(2, '0')}</span>
          </div>
          <div className="timer-labels">
            <span>{t('months')}</span>
            <span>{t('days')}</span>
            <span>{t('hours')}</span>
            <span>{t('min')}</span>
            <span>{t('sec')}</span>
          </div>
        </div>

        {/* Streak Display */}
        <div className="streak-display">
          <div className="streak-flame">
            <span className="flame-icon">🔥</span>
            <span className="flame-icon flame-2">🔥</span>
            <span className="flame-icon flame-3">🔥</span>
          </div>
          <div className="streak-info">
            <span className="streak-count">{streak.count}</span>
            <span className="streak-label">{t('dayStreak')}</span>
          </div>
        </div>

        <div className="dashboard-options">
          <button 
            className="dashboard-option"
            onClick={() => navigate('/answer')}
          >
            <span className="option-title">{t('answerQuestions')}</span>
            {questionsForMe.length > 0 && (
              <span className="option-hint">
                {questionsForMe.length} {t('waitingForYou')}
              </span>
            )}
            {questionsForMe.length === 0 && (
              <span className="option-hint muted">
                {t('noNewQuestions')}
              </span>
            )}
          </button>

          <button 
            className="dashboard-option"
            onClick={() => navigate('/ask')}
          >
            <span className="option-title">{t('askQuestion')}</span>
            <span className="option-hint">
              {t('writeFor')} {identity === 'Atilla' ? 'Raul' : 'Atilla'}
            </span>
          </button>

          {myQuestions.length > 0 && (
            <button 
              className="dashboard-option secondary"
              onClick={() => navigate('/manage')}
            >
              <span className="option-title">{t('manageMyQuestions')}</span>
              <span className="option-hint">
                {myQuestions.length} {t('questionsCreated')}
              </span>
            </button>
          )}
        </div>

        {/* Message Button Section */}
        <div className="love-section">
          {isEditing ? (
            <div className="love-edit">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="love-input"
                autoFocus
                placeholder="Enter your message..."
              />
              <button className="love-save-btn" onClick={handleSaveEdit}>✓</button>
              <button className="love-cancel-btn" onClick={handleCancelEdit}>✕</button>
            </div>
          ) : (
            <div className="love-buttons">
              <button className="love-button" onClick={handleSendLove}>
                <span className="love-word">{message}</span>
              </button>
              <button className="love-edit-btn" onClick={handleEditClick}>✎</button>
            </div>
          )}
        </div>

        {/* Messages Section */}
        {messages.length > 0 && (
          <div className="messages-section">
            <h3 className="messages-title">{t('messages')}</h3>
            <div className="messages-list">
              {messages.map(msg => (
                <div key={msg.id} className={`message-item ${msg.sender === identity ? 'sent' : 'received'}`}>
                  <span className="message-sender">{msg.sender}</span>
                  <span className="message-text">{msg.text}</span>
                  <span className="message-time">{formatMessageTime(msg.createdAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
