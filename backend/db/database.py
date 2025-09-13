from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

DATABASE_URL = "sqlite:///db/scraper_results.db"
engine = create_engine(DATABASE_URL, future=True)
Session = scoped_session(sessionmaker(bind=engine, future=True))