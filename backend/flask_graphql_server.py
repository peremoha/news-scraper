from flask import Flask
from flask_graphql import GraphQLView
from graphene import ObjectType, Schema, String, Field, List, NonNull, Int
from db.models import News
from db.database import Session

class NewsType(ObjectType):
    id = Int()
    title = String()
    body = String()
    publication_date = String()
    source_url = String()

class Query(ObjectType):
    all_news = List(NewsType)

    def resolve_all_news(parent, info):
        session = Session()
        return session.query(News).all()

class Mutation(ObjectType):
    pass  # Додайте мутації, якщо потрібно

schema = Schema(query=Query)

app = Flask(__name__)
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)

if __name__ == "__main__":
    app.run(debug=True)