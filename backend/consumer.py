import json
import pika
from db.database import Session
from db.models import News

def save_to_database(data):
    """
    Зберігає новини в базу даних.
    """
    session = Session()
    for item in data:
        news = News(
            title=item["title"],
            body=item.get("body", ""),
            publication_date=item["publication_date"],
            source_url=item["source_url"]
        )
        session.add(news)
    session.commit()
    print("[x] Новини збережено в базу даних")

def callback(ch, method, properties, body):
    """
    Обробляє повідомлення RabbitMQ.
    """
    print("[x] Отримано повідомлення")
    data = json.loads(body)
    save_to_database(data)
    ch.basic_ack(delivery_tag=method.delivery_tag)

def start_consumer():
    """
    Запускає RabbitMQ Consumer.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue="news_queue")
    channel.basic_consume(queue="news_queue", on_message_callback=callback)
    print("[*] Очікування повідомлень")
    channel.start_consuming()

if __name__ == "__main__":
    start_consumer()