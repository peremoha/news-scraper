import json
import pika
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


def scrape_ask_news(query):
    """
    Збирає новини з ask.com.
    Args:
        query (str): Пошуковий запит.

    Returns:
        list: Список новин [{title: ..., body: ..., publication_date: ..., source_url: ...}]
    """
    # Ініціалізація веб-драйвера
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    try:
        # Відкриття сайту ask.com
        driver.get("https://www.ask.com/")

        # Очікуємо появи поля пошуку
        wait = WebDriverWait(driver, 10)
        search_box = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "search-box")))

        # Виконуємо пошук
        search_box.send_keys(query)
        search_box.send_keys(Keys.RETURN)

        # Очікуємо завантаження результатів
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "results")))

        # Збираємо всі результати
        results = driver.find_elements(By.CLASS_NAME, "result")

        # Обробляємо результати скрапінгу
        scraped_news = []
        for result in results:
            try:
                # Заголовок і посилання
                title_element = result.find_element(By.CLASS_NAME, "result-title-link")
                title = title_element.text
                source_url = title_element.get_attribute("href")

                # Текст новини
                body = ""
                try:
                    body_element = result.find_element(By.CLASS_NAME, "result-abstract")
                    body = body_element.text
                except:
                    pass

                # Фейкова дата (можна додати реальну, якщо доступна на сайті)
                publication_date = "2023-04-28"

                # Додаємо новину до списку
                scraped_news.append({
                    "title": title,
                    "body": body,
                    "publication_date": publication_date,
                    "source_url": source_url
                })
            except Exception as e:
                print(f"Помилка обробки результату: {e}")
                continue

        return scraped_news

    finally:
        # Закриваємо браузер
        driver.quit()


def send_to_rabbitmq(queue_name, data):
    """
    Надсилає дані у чергу RabbitMQ.

    Args:
        queue_name (str): Назва черги.
        data (list): Дані у вигляді списку словників.
    """
    # Підключення до RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()

    # Створюємо чергу (якщо вона ще не існує)
    channel.queue_declare(queue=queue_name)

    # Конвертуємо дані у формат JSON перед відправкою
    json_data = json.dumps(data)
    channel.basic_publish(exchange='', routing_key=queue_name, body=json_data)

    print(f"[x] Дані відправлені у чергу '{queue_name}'")

    # Закриваємо з'єднання
    connection.close()


# Головна функція
if __name__ == "__main__":
    # Пошуковий запит для новин
    search_query = "Latest news"

    # Виконуємо скрапінг
    scraped_news = scrape_ask_news(search_query)

    print("Зібрані новини:")
    for item in scraped_news:
        print(f"Заголовок: {item['title']}")
        print(f"Текст: {item['body']}")
        print(f"Дата публікації: {item['publication_date']}")
        print(f"Посилання: {item['source_url']}")
        print("-" * 80)

    # Надсилаємо новини в RabbitMQ
    send_to_rabbitmq(queue_name="news_queue", data=scraped_news)