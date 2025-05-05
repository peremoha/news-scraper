import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
    font-family: Arial, sans-serif;
    color: #333;
  }
`;

export const UserNameWrapper = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 10px; 
    padding: 10px 15px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
`

export const UserNameText = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

export const NewsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

export const NewsWrapper = styled.div`
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const Title = styled.h2`
  font-family: Arial, sans-serif;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

export const Date = styled.p`
  font-family: Arial, sans-serif;
  font-size: 14px;
  margin-bottom: 15px;
  color: #666;
`;

export const ReadMoreBtn = styled.a`
  display: inline-block;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
`;