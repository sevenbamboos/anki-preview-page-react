import React from 'react';
import { FilesContainer, FilesHeading, FileList, FileItem, FileItemLink, FileItemCheck } from './styles';

export const Files = ({children}) => {
  return (
    <FilesContainer>
      <FilesHeading>Files</FilesHeading>
      <FileList>
        {children}
      </FileList>
    </FilesContainer>
  );  
};

export const File = ({file, onSelect, onCheck}) => {

  const handleCheck = (e) => {
    onCheck({checked: e.target.value, value: file});
  };

  return (
    <FileItem>
      <FileItemLink onClick={() => onSelect(file)}>
      {file}
      </FileItemLink>
      <FileItemCheck type="checkbox" value="checked" onClick={handleCheck} />
    </FileItem>
  );
};