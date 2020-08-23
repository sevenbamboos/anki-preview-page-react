import styled from 'styled-components';
import {Close} from '@styled-icons/material';
import {SearchAlt} from '@styled-icons/boxicons-regular/SearchAlt';

export const SearchIcon = styled(SearchAlt)`
  width: 12px;
  margin-right: 5px;
`;

export const CloseIcon = styled(Close)`
  color: black;
  width: 12px;
`;

export const SearchContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  max-width: 960px;
`;

export const SearchHeading = styled.h2`
  background-color: #abd5ea;
  color: #333;
  font-size: 18px;
  line-height: 30px;
  margin: 0;
  padding-left: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;

  label {
    font-size: 12px;
    position: relative;

    input {
      margin-left: 5px;
      font-size: 12px;
    }

    button {
      position: absolute;
      top: 0px;
      right: 2px;
      text-decoration: none;
      color: initial;
      background: none!important;
      border: none;
      outline: none;
      padding: 0!important;
      cursor: pointer;          
    }
  };

`;

export const ControlButton = styled.button`
  font-size: 12px;
  margin: 5px;
`;

export const ResultList = styled.div`
  font-size: 13px;
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

export const ResultItem = styled.div`
  border-bottom: #777 1px solid;
  padding-left: 20px;
  line-height: 30px;
  &:hover{
    background: #eeeeee;
  }
`;

