# backend/seed.py
import os
from app import app, db, Issue

def ensure_db_folder():
    uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if uri.startswith("sqlite:///"):
        db_file = uri.replace("sqlite:///", "")
    elif uri.startswith("sqlite:////"):
        db_file = uri.replace("sqlite:////", "/")
    else:
        db_file = os.path.join(os.path.abspath(os.path.dirname(__file__)), "instance", "issues.db")

    folder = os.path.dirname(db_file)
    os.makedirs(folder, exist_ok=True)
    return db_file

def seed_data(force=True):
    db_file = ensure_db_folder()
    print("Seeding using DB file:", db_file)

    with app.app_context():
        if not force and Issue.query.first():
            print("⚠️ Database already has data, skipping seeding.")
            return

        # CAUTION — this drops existing tables (dev only)
        db.drop_all()
        db.create_all()

        demo_issues = [
            {
                "title": "Python TypeError: 'int' object is not subscriptable",
                "description": "Occurs when you try to index into an integer.",
                "solution": "Check your variable type. Ensure it's a list/string before using [].",
                "language": "Python",
                "tags": ["Python", "TypeError", "Debugging"]
            },
            {
                "title": "React useState not updating immediately",
                "description": "setState is asynchronous, so logs may show old values.",
                "solution": "Use useEffect or check updated state inside render.",
                "language": "React",
                "tags": ["React", "useState", "State Management"]
            },
            {
                "title": "Node.js: Port already in use",
                "description": "Server fails to start because port (e.g. 5000) is already bound.",
                "solution": "Find the process using the port and kill it, or use a different port.",
                "language": "Node.js",
                "tags": ["Node.js", "Server", "Ports"]
            },
            {
                "title": "Java NullPointerException",
                "description": "Happens when calling a method on a null object reference.",
                "solution": "Check for null before using the object; use Optional if possible.",
                "language": "Java",
                "tags": ["Java", "NullPointerException", "Debugging"]
            }
        ]

        # convert tags list -> comma-separated string before inserting
        for item in demo_issues:
            tags_val = item.get("tags", [])
            if isinstance(tags_val, list):
                tags_val = ",".join(tags_val)
            issue = Issue(
                title=item["title"],
                description=item["description"],
                solution=item.get("solution"),
                language=item.get("language"),
                tags=tags_val
            )
            db.session.add(issue)

        db.session.commit()
        print("✅ Seeded database with demo issues.")

if __name__ == "__main__":
    seed_data(force=True)
