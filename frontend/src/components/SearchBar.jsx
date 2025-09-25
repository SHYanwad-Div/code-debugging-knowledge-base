import { useState } from 'react'
import './SearchBar.css'

function SearchBar({ searchQuery, onSearchChange }) {
  const [inputValue, setInputValue] = useState(searchQuery)

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    onSearchChange(value)
  }

  const handleClear = () => {
    setInputValue('')
    onSearchChange('')
  }

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search debugging issues by title, description, or tags..."
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button 
            className="clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="search-info">
          Searching for: <strong>"{searchQuery}"</strong>
        </p>
      )}
    </div>
  )
}

export default SearchBar
