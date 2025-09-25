import IssueCard from './IssueCard'
//import './IssueList.css'

function IssueList({ issues, searchQuery, onDelete, onEdit }) { // <-- add onEdit here
  if (issues.length === 0) {
    return (
      <div className="issue-list-empty">
        {searchQuery ? (
          <div className="no-results">
            <h3>No issues found</h3>
            <p>No debugging issues match your search for "{searchQuery}"</p>
            <p>Try different keywords or add a new issue.</p>
          </div>
        ) : (
          <div className="no-issues">
            <h3>No issues yet</h3>
            <p>Start building your debugging knowledge base by adding your first issue!</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="issue-list">
      <div className="issue-list-header">
        <h2>
          {searchQuery 
            ? `Found ${issues.length} issue${issues.length !== 1 ? 's' : ''}`
            : `All Issues (${issues.length})`
          }
        </h2>
      </div>
      
      <div className="issue-cards-container">
        {issues.map(issue => (
          <IssueCard 
            key={issue.id} 
            issue={issue}
            searchQuery={searchQuery}
            onDelete={onDelete}
            onEdit={onEdit} 
          />
        ))}
      </div>
    </div>
  )
}

export default IssueList