import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

// GraphQL мутації
const CREATE_NEWS = gql`
  mutation CreateNews($title: String!, $body: String, $publicationDate: String!, $sourceUrl: String!) {
    createNews(title: $title, body: $body, publicationDate: $publicationDate, sourceUrl: $sourceUrl) {
      news {
        id
        title
      }
    }
  }
`;

const UPDATE_NEWS = gql`
  mutation UpdateNews($id: Int!, $title: String, $body: String, $publicationDate: String, $sourceUrl: String) {
    updateNews(id: $id, title: $title, body: $body, publicationDate: $publicationDate, sourceUrl: $sourceUrl) {
      news {
        id
        title
      }
    }
  }
`;

const NewsModal = ({ isOpen, onClose, initialData, refetch }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [publicationDate, setPublicationDate] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");

    const [isEdit, setIsEdit] = useState(false); // Чи це режим редагування?

    const [createNews] = useMutation(CREATE_NEWS, {
        onCompleted: () => {
            refetch();
            onClose();
        },
    });

    const [updateNews] = useMutation(UPDATE_NEWS, {
        onCompleted: () => {
            refetch();
            onClose();
        },
    });

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setBody(initialData.body || "");
            setPublicationDate(initialData.publicationDate || "");
            setSourceUrl(initialData.sourceUrl || "");
            setIsEdit(true);
        } else {
            setTitle("");
            setBody("");
            setPublicationDate("");
            setSourceUrl("");
            setIsEdit(false);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            updateNews({ variables: { id: initialData.id, title, body, publicationDate, sourceUrl } });
        } else {
            createNews({ variables: { title, body, publicationDate, sourceUrl } });
        }
    };

    if (!isOpen) return null;

    return (
        <div style={modalStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2>{isEdit ? "Edit News" : "Add News"}</h2>
                <div style={fieldStyle}>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div style={fieldStyle}>
                    <label>Body:</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                </div>
                <div style={fieldStyle}>
                    <label>Publication Date:</label>
                    <input
                        type="date"
                        value={publicationDate}
                        onChange={(e) => setPublicationDate(e.target.value)}
                        required
                    />
                </div>
                <div style={fieldStyle}>
                    <label>Source URL:</label>
                    <input
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        required
                    />
                </div>
                <div style={{ textAlign: "right" }}>
                    <button type="button" onClick={onClose} style={buttonStyle}>
                        Cancel
                    </button>
                    <button type="submit" style={buttonStyle}>
                        {isEdit ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
};

const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    borderRadius: "10px",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
};

const fieldStyle = {
    marginBottom: "15px",
};

const buttonStyle = {
    padding: "10px 15px",
    marginLeft: "10px",
    cursor: "pointer",
};

export default NewsModal;