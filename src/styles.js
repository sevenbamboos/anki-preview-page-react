import styled, { createGlobalStyle  } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 10;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

export const Splitter = styled.hr`
  margin-topper: 5px;
  border-width: 1px;
`;

export const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

export const Container = styled.section`
  padding: 4em;
  padding-top: 20px;
  background: #f9f9f9;
  height: 550px; // FIXME
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  max-width: 960px;
  position: absolute;
`;

export const UploaderWrapper = styled.span`
  flex-grow: 0.7;
`;
