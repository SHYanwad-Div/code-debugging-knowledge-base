import { useState, useEffect, useRef } from 'react'
import './App.css'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import IssueList from './components/IssueList'
import AddIssueForm from './components/AddIssueForm'
console.log('VITE_API_BASE =', import.meta.env.VITE_API_BASE)

// Use Vite env var with fallback
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000/api'
fetch(`${API_BASE}/issues`)
  .then(r => r.json())
  .then(data => console.log('issues', data))

function App() {
  const [issues, setIssues] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  // ref to track mounted state to avoid setting state after unmount
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // Fetch issues from backend
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}/issues`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (mounted.current) {
          setIssues(data || [])
          setLoading(false)
        }
      })
      .catch(err => {
        console.error('Error fetching issues:', err)
        if (mounted.current) {
          setError('Failed to load issues')
          setLoading(false)
        }
      })
  }, [])

  // Filter issues based on search query
  const filteredIssues = issues.filter(issue =>
    (issue.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (issue.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((issue.tags || []).some?.(tag => (tag || '').toLowerCase().includes(searchQuery.toLowerCase())))
  )

  // Add new issue to backend (validates tags -> array)
  const addIssue = async (newIssue) => {
    setError(null)

    // Basic validation
    if (!newIssue.title || !newIssue.description) {
      setError('Title and Description are required')
      return
    }

    // ensure tags is an array
    const payload = {
      ...newIssue,
      tags: Array.isArray(newIssue.tags) ? newIssue.tags : (typeof newIssue.tags === 'string' ? newIssue.tags.split(',').map(t=>t.trim()).filter(Boolean) : [])
    }

    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      // optimistic UI: append server id
      const created = { ...payload, id: data.id }
      setIssues(prev => [...prev, created])
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to add issue:', err)
      setError('Failed to add issue')
    } finally {
      if (mounted.current) setSaving(false)
    }
  }

  const deleteIssue = async (id) => {
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/issues/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setIssues(prev => prev.filter(issue => issue.id !== id))
    } catch (err) {
      console.error('Failed to delete issue:', err)
      setError('Failed to delete issue')
    }
  }

  const editIssue = async (id, updatedIssue) => {
    setError(null)
    // normalize tags before sending
    const payload = {
      ...updatedIssue,
      tags: Array.isArray(updatedIssue.tags) ? updatedIssue.tags : (typeof updatedIssue.tags === 'string' ? updatedIssue.tags.split(',').map(t=>t.trim()).filter(Boolean) : [])
    }

    try {
      const res = await fetch(`${API_BASE}/issues/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // update local list
      setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, ...payload } : issue))
    } catch (err) {
      console.error('Failed to update issue:', err)
      setError('Failed to update issue')
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="search-section">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <button
            className="add-issue-btn"
            onClick={() => setShowAddForm(s => !s)}
            aria-pressed={showAddForm}
            disabled={saving}
          >
            {showAddForm ? 'Cancel' : saving ? 'Saving…' : 'Add New Issue'}
          </button>
        </div>

        {showAddForm && (
          <AddIssueForm
            onAddIssue={addIssue}
            onCancel={() => setShowAddForm(false)}
            saving={saving}
          />
        )}

        {loading ? (
          <p>Loading issues...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <IssueList
            issues={filteredIssues}
            searchQuery={searchQuery}
            onDelete={deleteIssue}
            onEdit={editIssue}
          />
        )}
      </main>
    </div>
  )
}

export default App
