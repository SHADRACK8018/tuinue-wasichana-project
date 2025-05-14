# backend/app/__init__.py

from dotenv import load_dotenv
import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from .db import db
from .extensions import bcrypt, login_manager
from config import Config, TestConfig

# Dynamically load the appropriate .env file based on FLASK_ENV
env_file = '.env.test' if os.environ.get('FLASK_ENV') == 'testing' else '.env'
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), env_file))

# Import routes
from .routes.auth_routes import auth_bp
from .routes.story_routes import story_bp
from .routes.charity_routes import charity_bp
from .routes.donation_routes import donation_bp
from .routes.donor_routes import donor_bp
from .routes.inventory_routes import inventory_bp
from .routes.beneficiary_routes import beneficiary_bp
from .routes.admin_routes import admin_bp

# Import models for migration
from .models import Donor, Donation, User, Charity, Story, Inventory

migrate = Migrate()

def create_app(config_class=None):
    app = Flask(__name__, static_folder='static', static_url_path='/static')

    # Determine config class if not provided
    if not config_class:
        if os.environ.get('FLASK_ENV') == 'testing':
            config_class = TestConfig
        else:
            config_class = Config

    # Apply the configuration
    app.config.from_object(config_class)

    print("Using DB URI:", app.config.get('SQLALCHEMY_DATABASE_URI'))

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    bcrypt.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(donor_bp, url_prefix='/donors')
    app.register_blueprint(donation_bp, url_prefix='/donations')
    app.register_blueprint(charity_bp, url_prefix='/charities')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(story_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(beneficiary_bp)

    @app.route('/')
    def index():
        return 'API is working!'

    return app

# Create app instance
app = create_app()
