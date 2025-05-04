import json
import pika
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.orm import declarative_base, sessionmaker

# Налаштування бази даних за допомогою SQLAlchemy
DATABASE_URL = "sqlite:///scraper_results.db"  # SQLite база даних
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Модель для збереження новин у базу даних
class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)  # Заголовок новини
    body = Column(String, nullable=True)  # Текст новини
    publication_date = Column(String, nullable=False)  # Дата публікації
    source_url = Column(String, nullable=False)  # Посилання на джерело

# Створення таблиці в базі даних
Base.metadata.create_all(engine)

# Налаштування сесії SQLAlchemy
Session = sessionmaker(bind=engine)
session = Session()

def save_to_database(data):
    """
    Зберігає отримані дані у базу даних.
    Args:
        data (list): Список новин [{title: ..., body: ..., publication_date: ..., source_url: ...}]
    """
    for item in data:
        # Створюємо новий запис для кожної новини
        news = News(
            title=item["title"],  # Заголовок
            body=item.get("body"),  # Текст новини (може бути None)
            publication_date=item["publication_date"],  # Дата публікації
            source_url=item["source_url"],  # Лінк на джерело
        )
        session.add(news)

    # Фіксуємо зміни в базі
    session.commit()
    print("[x] Новини успішно збережено до бази даних")

def callback(ch, method, properties, body):
    """
    Обробляє повідомлення з RabbitMQ.
    Args:
        ch: Канал
        method: Delivery method
        properties: Властивості повідомлення (headers, тощо)
        body: Тіло повідомлення (дані)
    """
    print("[x] Отримано повідомлення з черги")

    # Перетворюємо JSON-дані зі строки в Python-об'єкт
    try:
        data = json.loads(body)

        # Перевірка, чи передається список новин
        if isinstance(data, list):
            save_to_database(data)
        else:
            print("[!] Неправильний формат повідомлення (очікується список новин). Пропущено.")
    except Exception as e:
        print(f"[!] Помилка під час обробки повідомлення: {e}")

    # Підтверджуємо оброблене повідомлення
    ch.basic_ack(delivery_tag=method.delivery_tag)

def start_consumer():
    """
    Запускає RabbitMQ consumer для читання даних з черги.
    """
    # Підключення до RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    # Декларуємо чергу (якщо вона ще не створена)
    channel.queue_declare(queue="news_queue")

    print("[*] Очікуємо повідомлень у черзі 'news_queue'. Натисніть CTRL+C для виходу.")

    # Встановлюємо callback для отримання повідомлень з черги
    channel.basic_consume(queue="news_queue", on_message_callback=callback)

    # Запускаємо отримання повідомлень
    channel.start_consuming()

if __name__ == "__main__":
    start_consumer()