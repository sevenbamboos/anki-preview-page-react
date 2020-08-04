import styled from 'styled-components';

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

export const FileList = styled.ul`
  font-size: 13px;
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`;

export const FileItem = styled.li`
  border-bottom: #777 1px solid;
  padding-left: 20px;
  line-height: 30px;
  display: flex;

  &:hover{
    cursor: pointer;
    text-decoration: underline;
  }

  &:before{
    content: counter(file-item);
    counter-increment: file-item;
    font-family: arial;
    color:#666;
    font: bold;
    font-size: 1.5em;
    margin-right: .5em;
  }  
`;

export const FileItemLink = styled.a`
  text-decoration: none;
  flex-grow: 10;
`;

export const FileItemCheck = styled.input`
  margin: 8px 20px;
`;

export const FileUploadTimeSpan = styled.span`
  font-size: 10px;
  font-style: italic;
`;
