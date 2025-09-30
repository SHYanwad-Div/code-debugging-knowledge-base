import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# --- App setup ---
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Compute absolute paths based on this file location (prevents backend/backend issues)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)  # ensure folder exists

DB_PATH = os.path.join(INSTANCE_DIR, "issues.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# --- Models ---
class Issue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=True)
    language = db.Column(db.String(50), nullable=True)
    # store tags as a comma-separated string in DB, convert to array in API
    tags = db.Column(db.String(200), nullable=True)

# --- Routes ---
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
    data = request.json or {}
    tags = ''
    if isinstance(data.get('tags'), list):
        tags = ','.join(data.get('tags', []))
    elif isinstance(data.get('tags'), str):
        tags = data.get('tags', '')
    issue = Issue(
        title=data.get('title', '') or 'Untitled',
        description=data.get('description', '') or '',
        solution=data.get('solution'),
        language=data.get('language'),
        tags=tags
    )
    db.session.add(issue)
    db.session.commit()
    return jsonify({'id': issue.id}), 201

@app.route('/api/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    data = request.json or {}
    issue = Issue.query.get_or_404(issue_id)
    issue.title = data.get('title', issue.title)
    issue.description = data.get('description', issue.description)
    issue.solution = data.get('solution', issue.solution)
    issue.language = data.get('language', issue.language)
    if 'tags' in data:
        if isinstance(data['tags'], list):
            issue.tags = ','.join(data['tags'])
        else:
            issue.tags = data.get('tags')
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

# --- Create tables but do not seed data here ---
# We create tables on import so the app works when run; seeding should be handled by seed.py
with app.app_context():
    db.create_all()

# --- Run server (only if executed directly) ---
if __name__ == "__main__":
    print("Using DB file:", DB_PATH)
    app.run(debug=True, port=5000)
