import React, {useReducer} from 'react';
import {ClearIcon, OutputIcon, ClearFilesSpan, FilesButton, FilesPop, FilesIcon, FilesPopList, FilesPopListItem, SmallFilesIcon} from './styles';

export const FilesBtn = ({files=[]}) => {
  const [state, dispatcher] = useReducer((state, action) => {
    switch (action.type) {
      case 'MOUSE_OVER': {
        return {...state, show: true, position: action.payload};
      }
      case 'MOUSE_OUT': {
        return {...state, show: false};
      }
      default: {
        return state;
      }
    } 
  }, {show: false, position:[0, 0]});
  const handleMouseOver = (e) => dispatcher({type: 'MOUSE_OVER', payload: [e.clientX, e.clientY]});
  const handleMouseOut = (e) => dispatcher({type: 'MOUSE_OUT'});

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

export const ClearBtn = ({fileCount=0, onClear}) => (
  <button type="button" onClick={onClear} title="Clear">
    <ClearIcon/>
    { !!fileCount && (
      <ClearFilesSpan>
      ({fileCount})
      </ClearFilesSpan>
    )}
  </button>
);

export const OutputBtn = ({onOutput}) => (
  <button type="button" onClick={onOutput} title="Output">
    <OutputIcon/>
  </button>
);