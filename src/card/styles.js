import styled from 'styled-components';
import {Markdown} from '@styled-icons/fa-brands/Markdown';
import {QuestionAnswer} from '@styled-icons/material/QuestionAnswer';
import {CheckSquare} from '@styled-icons/boxicons-solid/CheckSquare';
import {PriceTag} from '@styled-icons/entypo/PriceTag';

export const TagIcon = styled(PriceTag)`
  color: black;
  width: 12px;
  margin-right: 4px;
`;

export const SourceIcon = styled(Markdown)`
  color: black;
  width: 15px;
`;

export const BasicIcon = styled(QuestionAnswer)`
  color: black;
  width: 12px;
`;

export const ClozeIcon = styled(CheckSquare)`
  color: black;
  width: 15px;
`;

export const CardContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  height: 350px;
  max-width: 960px;
`;

export const CardTab = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  max-width: 960px;
  padding: 20px;
  display: ${props => props.shouldDisplay ? 'block' : 'none'};
`;

export const CardTabHeading = styled.h2`
  background-color: #abd5ea;
  color: #333;
  font-size: 18px;
  line-height: 30px;
  margin: 0;
  padding-left: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
`;

export const CardControl = styled.div`
  font-size: 12px;
  overflow: hidden;
  background-color: #f1f1f1;  
`;

export const CardButton = styled.button`
  font-size: 12px;
  background-color: ${props => props.isActive ? '#ddd' : 'inherit'};
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 10px;
  transition: 0.3s;

  &:hover{
    cursor: pointer;
    background-color: #ddd;
  }  
`;

export const CardButtonText = styled.span`
  padding: 0px 2px;
`;

export const TagsContainer = styled.div`
  margin-right: 50px;
  max-width: 800px;
  padding-left: 20px;
  display: flex;
  position: relative;
  top: 50px;
`;

export const TagsHeading = styled.h4`
  font-size: 13px;
  margin-right: 5px;
`;

export const TagItem = styled.div`
  border-radius: 5px;
  font-size: 10px;
  background-color: #ddd;
  margin: 12px 5px;
  padding: 5px 8px;
`;

export const FlashCardError = styled.div`
  margin-right: 50px;
  max-width: 900px;
  border: red;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
`;

export const FlashCard = styled.div`
  margin-right: 50px;
  max-width: 900px;
  display: ${props => props.show ? 'block' : 'none'};
  border: #ddd;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
`;

export const FlashCardContent = styled.div`
  padding: 5px;
  min-height: 150px;
  user-select: none;
`;

export const FlashCardTitle = styled.div`
  padding: 5px;
  float: right;
  font-size: 12px;

  &:before{
    content: 'Click to switch';
    margin-right: .5em;
    text-decoration: underline;
    cursor: pointer;
  }   
`;

