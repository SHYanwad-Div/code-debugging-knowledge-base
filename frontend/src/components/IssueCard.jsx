import { useState } from 'react'
//import './IssueCard.css'

function IssueCard({ issue, searchQuery, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: issue.title,
    description: issue.description,
    solution: issue.solution,
    language: issue.language || '',
    tags: (issue.tags || []).join(', ')
  })

  const highlightText = (text, query) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="highlight">{part}</mark>
      ) : part
    )
  }

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f7df1e',
      'Python': '#3776ab',
      'Java': '#ed8b00',
      'C++': '#00599c',
      'React': '#61dafb',
      'Node.js': '#339933'
    }
    return colors[language] || '#6c757d'
  }

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    // Convert tags string to array
    const updated = {
      ...editData,
      tags: editData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    }
    onEdit(issue.id, updated)
    setIsEditing(false)
  }

  return (
    <div className="issue-card">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-issue-form">
          <input
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            placeholder="Title"
            required
          />
          <input
            name="language"
            value={editData.language}
            onChange={handleEditChange}
            placeholder="Language"
          />
          <input
            name="tags"
            value={editData.tags}
            onChange={handleEditChange}
            placeholder="Tags (comma separated)"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            placeholder="Description"
            required
          />
          <textarea
            name="solution"
            value={editData.solution}
            onChange={handleEditChange}
            placeholder="Solution"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <div className="issue-card-header">
            <h3 className="issue-title">
              {highlightText(issue.title, searchQuery)}
            </h3>
            <div className="issue-meta">
              {issue.language && (
                <span 
                  className="language-badge"
                  style={{ backgroundColor: getLanguageColor(issue.language) }}
                >
                  {issue.language}
                </span>
              )}
            </div>
          </div>
          <div className="issue-description">
            <p>{highlightText(issue.description, searchQuery)}</p>
          </div>
          <div className="issue-tags">
            {(issue.tags || []).map(tag => (
              <span key={tag} className="tag">
                {highlightText(tag, searchQuery)}
              </span>
            ))}
          </div>
          <div className="issue-actions">
            <button 
              className="toggle-solution-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide Solution' : 'Show Solution'}
            </button>
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              style={{ marginLeft: '1rem', background: '#ffc107', color: '#222' }}
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={() => onDelete(issue.id)}
              style={{ marginLeft: '1rem', background: '#dc3545', color: '#fff' }}
            >
              Delete
            </button>
          </div>
          {isExpanded && (
            <div className="issue-solution">
              <h4>Solution:</h4>
              <p>{issue.solution}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default IssueCard