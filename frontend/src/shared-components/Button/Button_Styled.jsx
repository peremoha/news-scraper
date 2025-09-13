import styled, { css } from 'styled-components';

export const Button = styled.button`
  display: inline-block;
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  padding: ${(props) => props.size === 'large' ? '12px 24px' : props.size === 'small' ? '6px 12px' : '10px 20px'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  /* Base Colors */
  ${(props) =>
    props.variant === 'primary' &&
    css`
      background-color: #007bff;
      color: #fff;

      &:hover {
        background-color: #0056b3;
      }

      &:active {
        transform: scale(0.98);
      }
    `}

  ${(props) =>
    props.variant === 'secondary' &&
    css`
      background-color: #6c757d;
      color: #fff;

      &:hover {
        background-color: #5a6268;
      }

      &:active {
        transform: scale(0.98);
      }
    `}

  ${(props) =>
    props.variant === 'danger' &&
    css`
      background-color: #dc3545;
      color: #fff;

      &:hover {
        background-color: #bd2130;
      }

      &:active {
        transform: scale(0.98);
      }
    `}

  ${(props) =>
    props.variant === 'success' &&
    css`
      background-color: #28a745;
      color: #fff;

      &:hover {
        background-color: #218838;
      }

      &:active {
        transform: scale(0.98);
      }
    `}

  ${(props) =>
    props.disabled &&
    css`
      background-color: #e0e0e0;
      color: #a0a0a0;
      cursor: not-allowed;
      transform: none;

      &:hover {
        background-color: #e0e0e0;
      }
    `}
`;
