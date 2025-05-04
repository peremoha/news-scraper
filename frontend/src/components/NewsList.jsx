import React from "react";
import { useQuery, gql } from "@apollo/client";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Переходимо на сторінку логіну
  };

  const { loading, error, data } = useQuery(GET_NEWS);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={handleLogout} style={{ float: "right", margin: "10px" }}>
        Logout
      </button>
      <h1>Welcome to News List</h1>
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