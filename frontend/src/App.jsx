import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import IssueList from './components/IssueList'
import AddIssueForm from './components/AddIssueForm'

function App() {
  const [issues, setIssues] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch issues from backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/issues')
      .then(res => res.json())
      .then(data => {
        setIssues(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load issues')
        setLoading(false)
      })
  }, [])

  // Filter issues based on search query
  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (issue.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Add new issue to backend
  const addIssue = (newIssue) => {
    fetch('http://127.0.0.1:5000/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIssue)
    })
      .then(res => res.json())
      .then(data => {
        setIssues([...issues, { ...newIssue, id: data.id }])
        setShowAddForm(false)
      })
      .catch(() => setError('Failed to add issue'))
  }
  const deleteIssue = (id) => {
  fetch(`http://127.0.0.1:5000/api/issues/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(() => {
      setIssues(issues.filter(issue => issue.id !== id));
    })
    .catch(() => setError('Failed to delete issue'));
};
const editIssue = (id, updatedIssue) => {
  fetch(`http://127.0.0.1:5000/api/issues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedIssue)
  })
    .then(res => res.json())
    .then(() => {
      setIssues(issues.map(issue =>
        issue.id === id ? { ...issue, ...updatedIssue } : issue
      ));
    })
    .catch(() => setError('Failed to update issue'));
};

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
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Issue'}
          </button>
        </div>

        {showAddForm && (
          <AddIssueForm 
            onAddIssue={addIssue}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {loading ? (
          <p>Loading issues...</p>
        ) : error ? (
          <p style={{color: 'red'}}>{error}</p>
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