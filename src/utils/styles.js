import styled, {keyframes, css} from 'styled-components';
import {NavigateNext, NavigateBefore, FirstPage, LastPage} from '@styled-icons/material';
import {FileCode} from '@styled-icons/fa-regular';
import {CreditCard} from '@styled-icons/boxicons-regular/CreditCard';
import {ArrowRight} from '@styled-icons/material-sharp/ArrowRight';

export const ArrowRightIcon = styled(ArrowRight)`
  height: 20px;
  padding: 5px 0px;
`;

export const FilesIcon = styled(FileCode)`
  height: 10px;
  padding-right: 3px;
`;

export const GroupsIcon = styled(CreditCard)`
  height: 10px;
  padding-right: 3px;
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

export const PopUpContainer = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  left: ${props=> props.left ? props.left : '50px'};
  top: ${props=> props.top ? props.top : '100px'};
  width: ${props=> props.width ? props.width : '300px'};
  height: ${props=> props.height ? props.height : '200px'};
  padding: 150px 120px 20px 120px;
  background-color: rgb(200, 200, 200, 0.7);
  z-index: 200;
  font-size: 12px;
  border-radius: 5px;
`;

export const PopUpControl = styled.div`
  position: absolute;
  bottom 20px;
  width: 50%;
  display: flex;
  justify-content: space-evenly;
`;

export const OutputResultTable = styled.table`
  width: 100%;
  height: 75%;
  padding: 10px;

  & td {
    border: 0.5px solid black;
  }
`;

const comeOutSlowly = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

const comeOutSlowlyAnimation = css`
  animation: 2s ${comeOutSlowly} forwards;
`;

export const ErrorBarDiv = styled.div`
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

  ${props => props.visible ? 'visibility: visible;' : comeOutSlowlyAnimation};
`;

export const MessageBarDiv = styled.div`
  background: #ddd;
  color: black;
  padding: 5px;
  text-align: center;
  width: auto;
  max-width: 300px;
  margin-right: auto;
  margin-left:  auto;
  border-radius: 5px;
  font-size: 10px;

  ${props => props.visible ? 'visibility: visible;' : comeOutSlowlyAnimation};
`;

export const PaginatorControl = styled.div`
  background-color: rgb(200, 200, 200, 0.5);
  color: #333;
  font-size: 12px;
  line-height: 30px;
  margin: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  padding: 3px;
`;

export const PaginatorButton = styled.button`
  font-size: 12px;
  margin: 5px;
`;

export const PaginatorPageSpan = styled.span`
  display: flex;
`;

export const PaginatorPageProgress = styled.progress`
  margin: 5px;
  height: 20px;
`;

export const BreadcrumbSection = styled.section`
  color: #333;
  font-size: 11px;
  line-height: 30px;
  margin: 10px 0px;
  display: flex;
  justify-content: flex-start;
  padding: 3px;
  border-bottom: solid;
  border-top: solid;
  border-width: thin;
  border-radius: 3px;

  &:before {
    content: "Nav Bar";
  }
`;

export const BreadcrumbButton = styled.button`
  font-size: 11px;
  margin: 5px;
  border-width: 1px;
  border-radius: 8px;
  padding: 3px 10px;
  background: #abd5ea;
`;

export const BreadcrumbSpan = styled.span`
  margin-left: 3px;
`;