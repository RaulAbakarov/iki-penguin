import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import '../styles/landing.css'

function Landing() {
  const navigate = useNavigate()
  const { selectIdentity, identity, loading } = useApp()
  const { t } = useLanguage()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && identity) {
      navigate('/dashboard')
    }
  }, [identity, loading, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const input = nickname.trim().toLowerCase()
    
    if (input === 'atilla') {
      selectIdentity('Atilla')
      navigate('/dashboard')
    } else if (input === 'raul') {
      selectIdentity('Raul')
      navigate('/dashboard')
    } else {
      setError('Invalid nickname')
    }
  }

  const handleInputChange = (e) => {
    setNickname(e.target.value)
    if (error) setError('')
  }

  // Show nothing while loading or redirecting
  if (loading || identity) {
    return null
  }

  return (
    <div className="landing">
      <div className="landing-content">
        <p className="landing-message">{t('landingMessage')}</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="nickname-input"
            placeholder={t('enterNickname')}
            value={nickname}
            onChange={handleInputChange}
            autoFocus
          />
          {error && <p className="login-error">{t('invalidNickname')}</p>}
          <button type="submit" className="login-button">
            {t('enter')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Landing
