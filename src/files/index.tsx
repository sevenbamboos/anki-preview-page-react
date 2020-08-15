import React, {useState, ReactNode} from 'react';
import { 
  FilesContainer, 
  FilesHeading, 
  FileList, 
  FileItem, 
  FileItemLink, 
  FileItemCheck, 
  FileUploadTimeSpan, 
  FileMetaSpan, 
  FileGroupMetaSpan, 
  ReloadIcon, 
  FileMetaReloadLink, 
  GroupMetaSpan, 
  GroupMetaLabel,
  BurstNewIcon,
  DoneAllIcon
} from './styles';
import { useSelector } from 'react-redux';
import { 
  selectGroupsByFile
} from '../groups/groups-slice';
import { GroupData } from '../types';

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
  onCheck: (evt: CheckEvent) => void,
  children?: ReactNode
};

export const File = ({file, onSelect, onCheck, children}: FileProps) => {

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
      {children}
    </FileItem>
  );
};

type FileMetaCardsInfoProp = {
  groups: GroupData[],
  isNew?: boolean
}

const FileMetaCardsInfo = ({groups, isNew}: FileMetaCardsInfoProp) => {

  const summary = {
    basicCards: 0,
    clozeCards: 0,
    errorCards: 0,
  };

  groups.reduce((stat, group) => {
    group.previewCards.reduce((stat, card) => {
      stat.basicCards += card.forBasic ? 1 : 0;
      stat.clozeCards += card.forCloze ? 1 : 0;
      stat.errorCards += card.error ? 1 : 0;
      return stat;
    }, stat);

    return stat;
  }, summary);
  
  const totalCards = summary.basicCards + summary.clozeCards + summary.errorCards;
  const groupInfo = `${groups.length} Groups`;
  let cardInfo = '';
  if (summary.clozeCards) {
    cardInfo += ` ${summary.clozeCards} Cloze`;
  }
  if (summary.basicCards) {
    cardInfo += ` + ${summary.basicCards} Basic`;
  }
  if (summary.errorCards) {
    cardInfo += ` + ${summary.errorCards} Error`;
  }
  cardInfo += ` = ${totalCards} Cards`;

  const info = `${groupInfo}, ${cardInfo}`;

  return (
    <GroupMetaSpan isNew={isNew}>{info}</GroupMetaSpan>
  );
};

type FileMetaInfoProp = {
  file: string
  onReload: (f:string) => void 
}

export const FileMetaInfo = ({file, onReload}: FileMetaInfoProp) => {
  const groups = useSelector(selectGroupsByFile(file));

  if (!groups || !groups.length) {
    return (
      <FileMetaSpan>
        Not parsed yet...
        <FileMetaReloadLink onClick={() => onReload(file)}>
          <ReloadIcon/> Parse
        </FileMetaReloadLink>
      </FileMetaSpan>
    );
  }

  const newGroups = groups.filter(x => x.new);

  return (
    <FileGroupMetaSpan>
      <GroupMetaLabel isNew><BurstNewIcon /></GroupMetaLabel>
      <FileMetaCardsInfo groups={newGroups} isNew></FileMetaCardsInfo>
      <GroupMetaLabel><DoneAllIcon /></GroupMetaLabel>
      <FileMetaCardsInfo groups={groups}></FileMetaCardsInfo>
    </FileGroupMetaSpan>
  );
};

type FileUploadTimeProps = {
  dateIOSString: string
};

export const FileUploadTime = ({dateIOSString}: FileUploadTimeProps) => (
  <FileUploadTimeSpan>
    {new Date(dateIOSString).toLocaleTimeString()}
  </FileUploadTimeSpan>
);