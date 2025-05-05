import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NewsModal from "./NewsModal";

// GraphQL-запити та мутації
const GET_NEWS = gql`
  query GetNews($limit: Int, $offset: Int) {
    allNews(limit: $limit, offset: $offset) {
      id
      title
      publicationDate
      sourceUrl
    }
  }
`;

const DELETE_NEWS = gql`
  mutation DeleteNews($id: Int!) {
    deleteNews(id: $id) {
      ok
    }
  }
`;

const NewsList = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Отримуємо роль із LocalStorage
  const [page, setPage] = useState(1);
  const limit = 7;
  const offset = (page - 1) * limit;

  const { loading, error, data, refetch } = useQuery(GET_NEWS, {
    variables: { limit, offset },
  });

  const [deleteNews] = useMutation(DELETE_NEWS, {
    onCompleted: () => refetch(),
  }); // Видалення новин з перезапитом

  const handleLogout = () => {
    localStorage.removeItem("role");
    logout();
    navigate("/login"); // Переходимо на сторінку логіну
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const openModalForCreate = () => {
    setInitialData(null); // Немає початкових даних (додавання)
    setModalOpen(true);
  };

  const openModalForEdit = (news) => {
    setInitialData(news); // Передаємо початкові дані для редагування
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteNews({ variables: { id } });
  };

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleNext = () => {
    if (data.allNews.length === limit) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ float: "right", margin: "10px" }}>
        Logout
      </button>
      <h1>Welcome to News List - Page {page}</h1>

      {/* Кнопка для додавання новин (тільки для admin) */}
      {role === "admin" && (
        <button
          style={{ marginBottom: "10px", padding: "5px 10px" }}
          onClick={openModalForCreate}
        >
          Add News
        </button>
      )}

      <div>
        {data.allNews.map((news) => (
          <div key={news.id} style={{ marginBottom: "20px" }}>
            <h2>{news.title}</h2>
            <p>
              <strong>Date:</strong> {news.publicationDate}
            </p>
            <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer">
              Read more
            </a>

            {/* Кнопки для редагування та видалення (тільки для admin) */}
            {role === "admin" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  style={{ marginRight: "10px", padding: "5px 10px" }}
                  onClick={() => openModalForEdit(news)}
                >
                  Edit
                </button>
                <button
                  style={{ padding: "5px 10px" }}
                  onClick={() => handleDelete(news.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <button onClick={handleNext} disabled={data.allNews.length < limit}>
          Next
        </button>
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={initialData}
        refetch={refetch}
      />
    </div>
  );
};

export default NewsList;