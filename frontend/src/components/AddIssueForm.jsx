import { useState } from 'react'
//import './AddIssueForm.css'

function AddIssueForm({ onAddIssue, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    solution: '',
    language: 'JavaScript',
    tags: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const languages = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'React', 
    'Node.js', 'PHP', 'Ruby', 'Go', 'Rust', 'TypeScript'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution is required'
    }
    
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newIssue = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    onAddIssue(newIssue)
    setIsSubmitting(false)
  }

  return (
    <div className="add-issue-form-container">
      <form className="add-issue-form" onSubmit={handleSubmit}>
        <h3>Add New Debugging Issue</h3>
        
        <div className="form-group">
          <label htmlFor="title">Issue Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={errors.title ? 'error' : ''}
            placeholder="Brief description of the issue"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="language">Programming Language *</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Problem Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={errors.description ? 'error' : ''}
            placeholder="Detailed description of the problem you encountered"
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="solution">Solution *</label>
          <textarea
            id="solution"
            name="solution"
            value={formData.solution}
            onChange={handleInputChange}
            className={errors.solution ? 'error' : ''}
            placeholder="How you solved this issue"
            rows="4"
          />
          {errors.solution && <span className="error-message">{errors.solution}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags * (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className={errors.tags ? 'error' : ''}
            placeholder="e.g. react, hooks, state, debugging"
          />
          {errors.tags && <span className="error-message">{errors.tags}</span>}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Issue'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddIssueForm
