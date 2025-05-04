import React from "react";
import { useQuery, gql } from "@apollo/client";

// Запит для отримання всіх новин
const GET_NEWS = gql`
query {
  allNews(limit: 5, offset: 0) {
    id
    title
    publicationDate
    sourceUrl
  }
}
`;

const NewsList = () => {
  console.log(useQuery(GET_NEWS))
  const { loading, error, data } = useQuery(GET_NEWS);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.allNews.map((news) => (
        <div key={news.id} style={{ marginBottom: "20px" }}>
          <h2>{news.title}</h2>
          <p><strong>Date:</strong> {news.publicationDate}</p>
          <p>{news.body}</p>
          <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsList;