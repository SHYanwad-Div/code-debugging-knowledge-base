from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import request

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///issues.db'
db = SQLAlchemy(app)

class Issue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=True)
    language = db.Column(db.String(50), nullable=True)  # New field
    tags = db.Column(db.String(200), nullable=True)     # Store as comma-separated string
    
@app.route('/api/issues', methods=['GET'])
def get_issues():
    issues = Issue.query.all()
    return jsonify([
        {
            'id': issue.id,
            'title': issue.title,
            'description': issue.description,
            'solution': issue.solution,
            'language': issue.language,
            'tags': issue.tags.split(',') if issue.tags else []
        } for issue in issues
    ])

@app.route('/api/issues', methods=['POST'])
def add_issue():
    data = request.json
    tags = ','.join(data.get('tags', [])) if isinstance(data.get('tags'), list) else ''
    issue = Issue(
        title=data['title'],
        description=data['description'],
        solution=data.get('solution'),
        language=data.get('language'),
        tags=tags
    )
    db.session.add(issue)
    db.session.commit()
    return jsonify({'id': issue.id}), 201

@app.route('/api/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    data = request.json
    issue = Issue.query.get_or_404(issue_id)
    issue.title = data.get('title', issue.title)
    issue.description = data.get('description', issue.description)
    issue.solution = data.get('solution', issue.solution)
    db.session.commit()
    return jsonify({'msg': 'updated'})

@app.route('/api/issues/<int:issue_id>', methods=['DELETE'])
def delete_issue(issue_id):
    issue = Issue.query.get_or_404(issue_id)
    db.session.delete(issue)
    db.session.commit()
    return jsonify({'msg': 'deleted'})
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status":"ok", "msg": "Backend running"})
tables_created = False

@app.before_request
def create_tables_once():
    global tables_created
    if not tables_created:
        db.create_all()
        if Issue.query.count() == 0:
            db.session.add(Issue(
                title="Example: Python ImportError",
                description="ImportError: No module named 'flask'",
                solution="Run: pip install flask",
                language="Python",
                tags="python,import,error"
            ))
            db.session.commit()
        tables_created = True
        
if __name__ == "__main__":
    app.run(debug=True, port=5000)
    