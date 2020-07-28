import styled from 'styled-components';
import {NavigateNext, NavigateBefore, FirstPage, LastPage, Close} from '@styled-icons/material';

export const CloseIcon = styled(Close)`
  color: black;
  width: 15px;
`;

export const FirstPageIcon = styled(FirstPage)`
  color: black;
  width: 15px;
`;

export const LastPageIcon = styled(LastPage)`
  color: black;
  width: 15px;
`;

export const PreviousPageIcon = styled(NavigateBefore)`
  color: black;
  width: 15px;
`;

export const NextPageIcon = styled(NavigateNext)`
  color: black;
  width: 15px;
`;

export const CardsContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  max-width: 960px;
`;

export const CardsHeading = styled.h2`
  background-color: #abd5ea;
  color: #333;
  font-size: 18px;
  line-height: 30px;
  margin: 0;
  padding: 2px 10px 2px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
`;

export const CardsControl = styled.div`
  background-color: rgb(200, 200, 200, 0.5);
  color: #333;
  font-size: 12px;
  line-height: 30px;
  margin: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
`;

export const CardsHeadingText = styled.span`
  font-size: 12px;
`;

export const CardsButton = styled.button`
  font-size: 12px;
  margin: 5px;
`;

export const CardPageSpan = styled.span`
  display: flex;
`;

export const CardPageProgress = styled.progress`
  margin: 5px;
  height: 20px;
`;

export const CardItem = styled.div`
  width: 500px;
  height: 350px;
  outline: 1px solid #ddd;
`;
