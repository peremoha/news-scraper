import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import { ModalOverlay, ModalContainer, Form, ModalTitle, Field, ButtonContainer } from './NewsModal_Styled'

import Button from '../../shared-components/Button/Button'

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
        <ModalOverlay>
            <ModalContainer >
                <Form onSubmit={handleSubmit} >
                    <ModalTitle>{isEdit ? "Edit News" : "Add News"}</ModalTitle>
                    <Field >
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Field>
                    <Field >
                        <label>Body:</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                    </Field>
                    <Field >
                        <label>Publication Date:</label>
                        <input
                            type="date"
                            value={publicationDate}
                            onChange={(e) => setPublicationDate(e.target.value)}
                            required
                        />
                    </Field>
                    <Field >
                        <label>Source URL:</label>
                        <input
                            type="url"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            required
                        />
                    </Field>
                    <ButtonContainer >
                        <Button variant="danger" type="button" onClick={onClose} >
                            Cancel
                        </Button>
                        <Button variant="success" type="submit" >
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </ButtonContainer>
                </Form>
            </ModalContainer>
        </ModalOverlay>

    );
};

export default NewsModal;