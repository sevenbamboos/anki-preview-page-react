import React, {useState, ReactNode} from 'react';
import { FilesContainer, FilesHeading, FileList, FileItem, FileItemLink, FileItemCheck } from './styles';

type FilesProps = {
  children: ReactNode
};

export const Files = ({children}: FilesProps) => {
  return (
    <FilesContainer>
      <FilesHeading>Files</FilesHeading>
      <FileList>
        {children}
      </FileList>
    </FilesContainer>
  );  
};

type CheckEvent = {
  checked: boolean,
  value: string
};

type FileProps = {
  file: string,
  onSelect: (f: string) => void,
  onCheck: (evt: CheckEvent) => void
};

export const File = ({file, onSelect, onCheck}: FileProps) => {

  const [selected, setSelected] = useState(true);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
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