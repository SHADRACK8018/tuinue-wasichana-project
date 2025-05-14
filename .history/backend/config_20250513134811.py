import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:4321@localhost:5432/tuinue'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret')

class TestConfig(Config):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:4321@localhost:5432/tuinue_test'
    SQLALCHEMY_ECHO = False 

