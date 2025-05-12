import json
import pika
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

def scrape_news(query):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    try:
        driver.get("https://www.ask.com/")
        wait = WebDriverWait(driver, 10)
        search_box = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "search-box")))
        search_box.send_keys(query)
        search_box.send_keys(Keys.RETURN)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "results")))
        results = driver.find_elements(By.CLASS_NAME, "result")
        scraped_news = []
        for result in results:
            try:
                title_element = result.find_element(By.CLASS_NAME, "result-title-link")
                title = title_element.text
                source_url = title_element.get_attribute("href")
                body = ""
                try:
                    body_element = result.find_element(By.CLASS_NAME, "result-abstract")
                    body = body_element.text
                except:
                    pass
                publication_date = "2023-04-28"
                scraped_news.append({
                    "title": title,
                    "body": body,
                    "publication_date": publication_date,
                    "source_url": source_url
                })
            except Exception as e:
                print(f"Помилка: {e}")
                continue
        return scraped_news
    finally:
        driver.quit()

def send_to_rabbitmq(queue_name, data):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name)
    json_data = json.dumps(data)
    channel.basic_publish(exchange='', routing_key=queue_name, body=json_data)
    connection.close()

if __name__ == "__main__":
    search_query = "Breaking news"
    scraped_news = scrape_news(search_query)
    send_to_rabbitmq(queue_name="news_queue", data=scraped_news)