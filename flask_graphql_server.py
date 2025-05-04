from flask import Flask
from flask_graphql import GraphQLView
from graphql import GraphQLError
from graphene import ObjectType, String, Schema, NonNull, Field, List, Mutation, Int
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from sqlalchemy import create_engine, Column, String as SQLString, Integer
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

# SQLAlchemy база даних
DATABASE_URL = "sqlite:///scraper_results.db"
engine = create_engine(DATABASE_URL, future=True)  # Сумісність із SQLAlchemy 2.x
Base = declarative_base()
Session = scoped_session(sessionmaker(bind=engine, future=True))

# SQLAlchemy модель новини
class NewsModel(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(SQLString, nullable=False)
    body = Column(SQLString, nullable=True)
    publication_date = Column(SQLString, nullable=False)
    source_url = Column(SQLString, nullable=False)

# Створення таблиць (якщо ще не створені)
Base.metadata.create_all(engine)

# GraphQL SQLAlchemy об'єкт
class News(SQLAlchemyObjectType):
    class Meta:
        model = NewsModel
        interfaces = ()

# GraphQL Query
class Query(ObjectType):
    all_news = List(News)
    news_by_id = Field(News, id=NonNull(Int))

    def resolve_all_news(parent, info):
        session = Session()
        return session.query(NewsModel).all()

    def resolve_news_by_id(parent, info, id):
        session = Session()
        news = session.query(NewsModel).filter(NewsModel.id == id).first()
        if not news:
            raise GraphQLError("Новину не знайдено!")
        return news

# GraphQL Mutations
class CreateNews(Mutation):
    class Arguments:
        title = NonNull(String)
        body = String()
        publication_date = NonNull(String)
        source_url = NonNull(String)

    news = Field(lambda: News)

    def mutate(parent, info, title, body=None, publication_date=None, source_url=None):
        session = Session()
        new_news = NewsModel(title=title, body=body, publication_date=publication_date, source_url=source_url)
        session.add(new_news)
        session.commit()
        return CreateNews(news=new_news)

class UpdateNews(Mutation):
    class Arguments:
        id = NonNull(Int)
        title = String()
        body = String()
        publication_date = String()
        source_url = String()

    news = Field(lambda: News)

    def mutate(parent, info, id, title=None, body=None, publication_date=None, source_url=None):
        session = Session()
        news = session.query(NewsModel).filter(NewsModel.id == id).first()
        if not news:
            raise GraphQLError("Новину не знайдено!")

        # Оновлюємо поля, якщо вони надані
        if title:
            news.title = title
        if body:
            news.body = body
        if publication_date:
            news.publication_date = publication_date
        if source_url:
            news.source_url = source_url

        session.commit()
        return UpdateNews(news=news)

class DeleteNews(Mutation):
    class Arguments:
        id = NonNull(Int)

    ok = String()

    def mutate(parent, info, id):
        session = Session()
        news = session.query(NewsModel).filter(NewsModel.id == id).first()
        if not news:
            raise GraphQLError("Новину не знайдено!")

        session.delete(news)
        session.commit()
        return DeleteNews(ok="Новину успішно видалено!")

class Mutation(ObjectType):
    create_news = CreateNews.Field()
    update_news = UpdateNews.Field()
    delete_news = DeleteNews.Field()

# Головна схема GraphQL
schema = Schema(query=Query, mutation=Mutation)

# Flask-сервер
app = Flask(__name__)
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)  # graphiql=True для зручності в UI
)

if __name__ == "__main__":
    print("GraphQL-сервер запущено на http://127.0.0.1:5000/graphql")
    app.run(debug=True)