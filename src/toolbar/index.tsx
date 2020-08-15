import React, {useReducer} from 'react';
import {ClearIcon, OutputIcon, ClearFilesSpan, FilesButton, FilesPop, FilesIcon, FilesPopList, FilesPopListItem, SmallFilesIcon, ReloadIcon, ReloadButton} from './styles';

type FilesBtnProps = {
  files: string[]
};

type FilesBtnState = {
  show: boolean,
  position: [number, number]
};

type FilesBtnAction = {
  type: 'MOUSE_OVER',
  payload: [number, number]
} | {
  type: 'MOUSE_OUT',
};

export const FilesBtn = ({files=[]}: FilesBtnProps) => {
  const [state, dispatcher] = useReducer((state: FilesBtnState, action: FilesBtnAction): FilesBtnState => {
    switch (action.type) {
      case 'MOUSE_OVER': {
        return {...state, show: true, position: action.payload};
      }
      case 'MOUSE_OUT': {
        return {...state, show: false, position: [0, 0]};
      }
      default: {
        return state;
      }
    } 
  }, {show: false, position:[0, 0]});

  const handleMouseOver = (e: MouseEvent) => dispatcher({type: 'MOUSE_OVER', payload: [e.clientX, e.clientY]});
  const handleMouseOut = (e: MouseEvent) => dispatcher({type: 'MOUSE_OUT'});

  return (
    <FilesButton onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
      <FilesIcon/>
      { files.length > 0 && (
        <FilesPop show={state.show} position={state.position}>
          <FilesPopList>
            {files.map(f => (
              <FilesPopListItem key={f}>
                <SmallFilesIcon/>
                {f}
              </FilesPopListItem>
            ))}
          </FilesPopList>
        </FilesPop>
      )}
    </FilesButton>
  );
};

type ReloadBtnProps = {
  onReload: () => void
};

export const ReloadBtn = ({onReload}: ReloadBtnProps) => (
  <ReloadButton type="button" onClick={onReload} title="Reload">
    <ReloadIcon/>
    Reload
  </ReloadButton>
);

type ClearBtnProps = {
  fileCount: number,
  onClear: () => void
};

export const ClearBtn = ({fileCount=0, onClear}: ClearBtnProps) => (
  <button type="button" onClick={onClear} title="Clear">
    <ClearIcon/>
    { !!fileCount && (
      <ClearFilesSpan>
      ({fileCount})
      </ClearFilesSpan>
    )}
  </button>
);

type OutputBtnProps = {
  onOutput: () => void
};

export const OutputBtn = ({onOutput}: OutputBtnProps) => (
  <button type="button" onClick={onOutput} title="Output">
    <OutputIcon/>
  </button>
);