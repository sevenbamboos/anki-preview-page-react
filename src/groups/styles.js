import styled from 'styled-components';
import cardsPNG from '../cards.png';
import {Close} from '@styled-icons/material';

export const CloseIcon = styled(Close)`
  color: black;
  width: 15px;
`;

export const GroupsContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  max-width: 960px;
`;

export const GroupsHeading = styled.h2`
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

export const GroupsHeadingText = styled.span`
  font-size: 12px;
`;

export const GroupsShowNewOnly = styled.label`
  font-size: 12px;
  display: flex;
`;

export const GroupsShowNewOnlyCheckBox = styled.input`
  margin-top: 8px;
`;

export const GroupsButton = styled.button`
  font-size: 12px;
  margin: 5px;
`;

export const GroupList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 400px;
  margin: 10px;
`;

export const GroupCount = styled.div`
  font-size: 10px;
`;

export const GroupNewDiv = styled.div`
  font-size: 10px;
  color: red;
`;

export const GroupItem = styled.div`
  background-image: url(${cardsPNG});
  background-size: 50px 50px;
  background-position: right bottom;
  background-repeat: no-repeat;
  width: 50px;
  height: 90px;
  padding: 10px 40px 10px 10px;
  margin: 5px 10px 5px 10px;
  background-color: ${props => props.isNew ? "rgb(219, 112, 147, 0.2)" : "rgb(0,0,0,0)"};

  &:hover{
    cursor: pointer;
    background-color: rgb(200, 200, 200, 0.5);
  }
`;
