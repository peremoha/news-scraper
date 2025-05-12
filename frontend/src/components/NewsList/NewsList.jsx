import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import NewsModal from "../NewsModal/NewsModal";

import { Wrapper, NewsContainer, NewsWrapper, Title, Date, ReadMoreBtn, UserNameWrapper, UserNameText } from './NewsList_Styled'
import { Button } from "../../shared-components/Button/Button_Styled";

const GET_NEWS = gql`
  query GetNews($limit: Int, $offset: Int) {
    allNews(limit: $limit, offset: $offset) {
      id
      title
      body
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
  const role = localStorage.getItem("role"); 
  const username = localStorage.getItem("username");
  const [page, setPage] = useState(1);
  const limit = 7;
  const offset = (page - 1) * limit;

  const { loading, error, data, refetch } = useQuery(GET_NEWS, {
    variables: { limit, offset },
  });

  const [deleteNews] = useMutation(DELETE_NEWS, {
    onCompleted: () => refetch(),
  });

  const handleLogout = () => {
    localStorage.removeItem("role");
    logout();
    navigate("/login"); 
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const openModalForCreate = () => {
    setInitialData(null); 
    setModalOpen(true);
  };

  const openModalForEdit = (news) => {
    setInitialData(news); 
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
    <Wrapper>
      <UserNameWrapper>
        <UserNameText style={{ marginRight: "15px", fontWeight: "bold" }}>
          {role === "admin" ? `admin - ${username}` : username}
        </UserNameText>
        <Button onClick={handleLogout} variant="primary" size="large">
          Logout
        </Button>
      </UserNameWrapper>

      <h1>Welcome to News List - Page {page}</h1>

      {role === "admin" && (
        <Button
          style={{ marginBottom: "10px" }}
          onClick={openModalForCreate}
          variant="primary"
        >
          Add News
        </Button>
      )}

      <NewsContainer>
        {data.allNews.map((news) => (
          <NewsWrapper key={news.id}>
            <Title>{news.title}</Title>
            {/* <div>{news.body}</div> */}
            <Date>
              <strong>Date:</strong> {news.publicationDate}
            </Date>
            <ReadMoreBtn href={news.sourceUrl} target="_blank" rel="noopener noreferrer">
              Read more
            </ReadMoreBtn>

            {role === "admin" && (
              <div style={{ marginTop: "10px" }}>
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => openModalForEdit(news)}
                  variant="primary"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(news.id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </NewsWrapper>
        ))}
      </NewsContainer>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          onClick={handlePrevious}
          disabled={page === 1}
          style={{ marginRight: "10px" }}
          variant="primary"
        >
          Previous
        </Button>
        <Button variant="primary" onClick={handleNext} disabled={data.allNews.length < limit}>
          Next
        </Button>
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={initialData}
        refetch={refetch}
      />
    </Wrapper>
  );
};

export default NewsList;