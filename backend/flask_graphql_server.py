import bcrypt
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from graphene import ObjectType, Schema, String, List, Field, Int, Mutation
from db.database import Session
from db.models import News, User  # Таблиця новин та таблиця користувачів

# -------------------------------
# Flask Application Setup
# -------------------------------
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "df7G8w70rbyLSz7dQkZLfZK9DHyoX85AvFRGKDqS6rEf550u"
jwt = JWTManager(app)
CORS(app, origins=["http://localhost:3000"])

# -------------------------------
# GraphQL Types and Queries
# -------------------------------
class NewsType(ObjectType):
    id = Int()
    title = String()
    body = String()
    publication_date = String()
    source_url = String()


# Запити (Query)
class Query(ObjectType):
    # Отримання всіх новин із пагінацією
    all_news = List(
        NewsType,
        limit=Int(),
        offset=Int()
    )

    @jwt_required()  # Додаємо авторизацію
    def resolve_all_news(parent, info, limit=None, offset=None):
        session = Session()
        query = session.query(News)

        # Додаємо обмеження (пагінацію)
        if limit is not None:
            query = query.limit(limit)
        if offset is not None:
            query = query.offset(offset)

        return query.all()

# -------------------------------
# GraphQL Mutations (News CRUD)
# -------------------------------
class CreateNews(Mutation):
    class Arguments:
        title = String(required=True)
        body = String()
        publication_date = String(required=True)
        source_url = String(required=True)

    news = Field(NewsType)

    @jwt_required()  # Додаємо авторизацію
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

        # Перевіряємо, чи існує запис у базі
        existing_news = session.query(News).filter(News.id == id).first()
        if not existing_news:
            raise Exception(f"News item with ID {id} not found!")

        # Оновлення полів, якщо вони передані
        if title is not None:
            existing_news.title = title.strip()  # Очистка від пробілів
        if body is not None:
            existing_news.body = body.strip()
        if publication_date is not None:
            existing_news.publication_date = publication_date.strip()
        if source_url is not None:
            existing_news.source_url = source_url.strip()

        # Збереження змін
        session.commit()

        return UpdateNews(news=existing_news)
    
class DeleteNews(Mutation):
    class Arguments:
        id = Int(required=True)

    ok = String()

    def mutate(parent, info, id):
        session = Session()

        # Перевіряємо, чи існує запис у базі
        existing_news = session.query(News).filter(News.id == id).first()
        if not existing_news:
            raise Exception(f"News item with ID {id} not found!")

        # Видаляємо запис
        session.delete(existing_news)
        session.commit()

        return DeleteNews(ok=f"News item with ID {id} deleted successfully!")
class Mutation(ObjectType):
    create_news = CreateNews.Field()
    update_news = UpdateNews.Field()
    delete_news = DeleteNews.Field()

schema = Schema(query=Query, mutation=Mutation)
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)

# -------------------------------
# Authentication Endpoints
# -------------------------------
@app.route("/register", methods=["POST"])
def register():
    session = Session()
    data = request.json
    username = data.get("username")
    password = data.get("password")  # Отримуємо пароль для хешування

    if session.query(User).filter(User.username == username).first():
        return jsonify({"msg": "Username already exists"}), 400

    # Хешуємо пароль
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # Зберігаємо хешований пароль у базу даних
    new_user = User(username=username, password=hashed_password.decode("utf-8"))
    session.add(new_user)
    session.commit()

    return jsonify({"msg": "User registered successfully!"}), 200


@app.route("/login", methods=["POST"])
def login():
    session = Session()
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = session.query(User).filter(User.username == username).first()
    if not user:
        return jsonify({"msg": "Invalid username or password"}), 401

    # Перевіряємо пароль шляхом порівняння з хешем
    if not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200


if __name__ == "__main__":
    app.run(debug=True)