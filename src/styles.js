import styled, { createGlobalStyle, keyframes } from 'styled-components';

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
  max-width: 960px  
`;

const leftRight = keyframes`
  40% {
    transform: translate(50px, 0) scale(.7);
    opacity: 1;
    color: #348c04;
  }

  60% {
    color: #0f40ba;
  }

  80% {
    transform: translate(0) scale(2);
    opacity: 0;
  }
  
  100% {
    transform: translate(0) scale(1);
    opacity: 1;
	}
`;

export const ErrorBar = styled.div`
  background: #ffcccc;
  color: black;
  padding: 5px;
  text-align: center;
  width: auto;
  margin-right: auto;
  margin-left:  auto;
  max-width: 300px;
  border-radius: 5px;
  font-size: 10px;

  transform: translate(-50px, 0) scale(.3);
  animation: ${leftRight} .5s forwards;
`;

export const MessageBar = styled.div`
  background: #abd5ea;
  color: black;
  padding: 5px;
  text-align: center;
  width: auto;
  max-width: 300px;
  margin-right: auto;
  margin-left:  auto;
  border-radius: 5px;
  font-size: 10px;

  transform: translate(-50px, 0) scale(.3);
  animation: ${leftRight} .5s forwards;   
`;

export const UploaderWrapper = styled.span`
  flex-grow: 0.7;
`;
