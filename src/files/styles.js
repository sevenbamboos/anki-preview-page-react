import styled from 'styled-components';
import {Reload} from '@styled-icons/ionicons-outline/Reload';
import {BurstNew} from '@styled-icons/foundation/BurstNew';
import {DoneAll} from '@styled-icons/material-outlined/DoneAll';

export const BurstNewIcon = styled(BurstNew)`
  width: 25px;
`;

export const DoneAllIcon = styled(DoneAll)`
  width: 18px;
`;

export const ReloadIcon = styled(Reload)`
  width: 10px;
`;

export const FilesContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left:  auto;
  width: 500px;
  max-width: 960px;
`;

export const FilesHeading = styled.h2`
  background-color: #abd5ea;
  color: #333;
  font-size: 18px;
  line-height: 30px;
  margin: 0;
  padding-left: 10px;
  counter-reset: file-item;
  border-radius: 5px;
`;

export const FileList = styled.div`
  font-size: 13px;
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

export const FileItem = styled.div`
  border-bottom: #777 1px solid;
  padding-left: 20px;
  line-height: 30px;
  &:hover{
    background: #eeeeee;
  }

  &:before{
    content: counter(file-item);
    counter-increment: file-item;
    font-family: arial;
    color:#666;
    font: bold;
    font-size: 1.5em;
    margin-right: .5em;
    grid-area: index;
  }  

  display: grid;
  grid-template-columns: 0.2fr 1fr 1fr 1fr 0.6fr 0.2fr;
  grid-template-rows: 0.5fr 1fr;
  gap: 1px 1px;
  grid-template-areas:
    "index file file file time check"
    ". meta meta meta meta ."
`;

export const FileItemLink = styled.a`
  text-decoration: underline;
  &:hover{
    cursor: pointer;
  }

  grid-area: file;

`;

export const FileItemCheck = styled.input`
  margin: 8px 20px;
  grid-area: check;
`;

export const FileMetaSpan = styled.span`
  font-size: 10px;
  margin-left: 3px;
  margin-right: 3px;
  grid-area: meta;
`;

export const FileGroupMetaSpan = styled.span`
  font-size: 10px;
  margin-left: 3px;
  margin-right: 3px;
  grid-area: meta;

  display: grid;
  grid-template-columns: 0.1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px 1px;
  grid-template-areas:
    "newLabel newCards"
    "label cards"
`;

export const GroupMetaLabel = styled.label`
  font-size: 10px;
  ${props => props.isNew ? "grid-area: newLabel;" : "grid-area: label;"}
`;

export const GroupMetaSpan = styled.span`
  font-size: 10px;
  font-weight: ${props => props.isNew ? "800" : "500"};
  margin-left: 3px;
  margin-right: 3px;
  color: ${props => props.isNew ? "rgb(219, 112, 147, 0.9)" : "rgb(0, 0, 0, 0.8)"};

`;

export const FileMetaReloadLink = styled.a`
  margin-left: 5px;
  padding: 5px;
  padding-right: 20px;

  &:hover{
    cursor: pointer;
    background: #abd5ea;
  }
`;

export const FileUploadTimeSpan = styled.span`
  font-size: 10px;
  margin-left: 3px;
  font-style: italic;
  grid-area: time;
`;
