import React, {useState} from 'react';
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

  const [selected, setSelected] = useState(true);

  const handleCheck = (e) => {
    setSelected(e.target.checked ? true : false);
    onCheck({checked: e.target.checked, value: file});
  };

  return (
    <FileItem>
      <FileItemLink onClick={() => onSelect(file)}>
      {file}
      </FileItemLink>
      <FileItemCheck type="checkbox" checked={selected} onChange={handleCheck} />
    </FileItem>
  );
};