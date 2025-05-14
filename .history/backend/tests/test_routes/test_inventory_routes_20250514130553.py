import pytest
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

def test_inventory_routes_access(client):
    # Example test for inventory route access
    response = client.get('/inventory/some_endpoint')
    assert response.status_code in (200, 401, 403)  # depending on auth setup
