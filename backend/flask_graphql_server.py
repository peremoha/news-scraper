from flask import Flask
from flask_cors import CORS  # Дозволяє міждоменні запити
from flask_graphql import GraphQLView
from graphene import ObjectType, Schema, String, List, Field, Int, Mutation
from db.database import Session  # Підключення до бази даних
from db.models import News       # Модель таблиці "новини"


# GraphQL тип для новин
class NewsType(ObjectType):
    id = Int()
    title = String()
    body = String()
    publication_date = String()
    source_url = String()


# Запити (Query)
class Query(ObjectType):
    # Отримання всіх новин
    all_news = List(NewsType)

    def resolve_all_news(parent, info):
        session = Session()
        return session.query(News).all()

    # Отримання конкретної новини за ID
    news_by_id = Field(NewsType, id=Int(required=True))

    def resolve_news_by_id(parent, info, id):
        session = Session()
        return session.query(News).filter(News.id == id).first()


# Мутації (Mutation)
class CreateNews(Mutation):
    class Arguments:
        title = String(required=True)
        body = String()
        publication_date = String(required=True)
        source_url = String(required=True)

    news = Field(NewsType)

    def mutate(parent, info, title, body, publication_date, source_url):
        session = Session()
        new_news = News(
            title=title,
            body=body,
            publication_date=publication_date,
            source_url=source_url
        )
        session.add(new_news)
        session.commit()
        return CreateNews(news=new_news)


class UpdateNews(Mutation):
    class Arguments:
        id = Int(required=True)
        title = String()
        body = String()
        publication_date = String()
        source_url = String()

    news = Field(NewsType)

    def mutate(parent, info, id, title=None, body=None, publication_date=None, source_url=None):
        session = Session()
        news = session.query(News).filter(News.id == id).first()

        if not news:
            raise Exception("News item not found!")

        if title:
            news.title = title
        if body:
            news.body = body
        if publication_date:
            news.publication_date = publication_date
        if source_url:
            news.source_url = source_url

        session.commit()
        return UpdateNews(news=new_news)


class DeleteNews(Mutation):
    class Arguments:
        id = Int(required=True)

    ok = String()

    def mutate(parent, info, id):
        session = Session()
        news = session.query(News).filter(News.id == id).first()

        if not news:
            raise Exception("News item not found!")

        session.delete(news)
        session.commit()
        return DeleteNews(ok="News item deleted successfully!")


class Mutation(ObjectType):
    create_news = CreateNews.Field()
    update_news = UpdateNews.Field()
    delete_news = DeleteNews.Field()


# Створення схеми GraphQL
schema = Schema(query=Query, mutation=Mutation)

# Створення Flask-додатка
app = Flask(__name__)

# Налаштування CORS
CORS(app, origins=["http://localhost:3000"])  # Дозволяє крос-доменні запити із React

# Додавання GraphQL View
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)  # graphiql=True додає інтерактивний GraphQL Playground
)

if __name__ == "__main__":
    app.run(debug=True)