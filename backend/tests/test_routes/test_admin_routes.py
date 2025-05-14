import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from backend.app import create_app
from backend.app.extensions import db

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_admin_routes_access(client):
    # Example test for admin route access
    response = client.get('/admin/some_endpoint')
    assert response.status_code in (200, 401, 403)  # depending on auth setup
