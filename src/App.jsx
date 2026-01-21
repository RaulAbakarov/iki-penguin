import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { useLanguage } from './context/LanguageContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import AnswerQuestions from './pages/AnswerQuestions'
import AskQuestion from './pages/AskQuestion'
import ManageQuestions from './pages/ManageQuestions'
import LanguageSelector from './components/LanguageSelector'

function ProtectedRoute({ children }) {
  const { identity, loading } = useApp()
  const { t } = useLanguage()
  
  // Wait for initial load to complete
  if (loading) {
    return (
      <div className="app-loading">
        <p>{t('loading')}</p>
      </div>
    )
  }
  
  return identity ? children : <Navigate to="/" />
}

function App() {
  return (
    <div className="app">
      <LanguageSelector />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/answer" 
          element={<ProtectedRoute><AnswerQuestions /></ProtectedRoute>} 
        />
        <Route 
          path="/ask" 
          element={<ProtectedRoute><AskQuestion /></ProtectedRoute>} 
        />
        <Route 
          path="/manage" 
          element={<ProtectedRoute><ManageQuestions /></ProtectedRoute>} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
