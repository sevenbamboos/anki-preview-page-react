import React, {useReducer, useCallback, useEffect} from 'react';
import { GlobalStyle, Title, Container, MessageBar, ErrorBar, UploaderWrapper, Splitter } from './styles';
import { Toolbar } from './toolbar/styles';
import Uploader from './uploader';
import {ClearBtn, OutputBtn, FilesBtn} from './toolbar';
import {upload as uploadService, files as filesService, clear as clearService, outputs as outputsService} from './service';
import useTimeTrigger from './utils/time-trigger';
import {Files, File} from './files';
import Groups from './groups';
import Cards from './cards';
import {InfoDialog, OutputResultSummary} from './utils/widgets';
import {version} from '../package.json';

const initState = {
  message: null, 
  error: null, 
  files: [],
  selectedFile: null,
  selectedGroup: null,
  checkedFiles: [],
  outputResult: null,
};

const SET_FILES = 'SET_FILES';
const SET_MESSAGE = 'SET_MESSAGE';
const SET_ERROR = 'SET_ERROR';
const SELECT_FILE = 'SELECT_FILE';
const UNSELECT_FILE = 'UNSELECT_FILE';
const SELECT_GROUP = 'SELECT_GROUP';
const UNSELECT_GROUP = 'UNSELECT_GROUP';
const CHECK_FILE = 'CHECK_FILE';
const UNCHECK_FILE = 'UNCHECK_FILE';
const UNCHECK_ALL_FILE = 'UNCHECK_ALL_FILE';
const SET_OUTPUT_RESULT = 'SET_OUTPUT_RESULT';
const CLEAR_OUTPUT_RESULT = 'CLEAR_OUTPUT_RESULT';

function App() {

  const [filesChanged, setFilesChanged] = useTimeTrigger();

  useEffect(() => {
    const getFiles = async () => {
      try {
        const files = await filesService();
        dispatcher({type: SET_FILES, payload: files}); 
      } catch (err) {
        dispatcher({type: SET_ERROR, payload: err});
      }
    };
    getFiles();
  }, [filesChanged]);

  const clearFiles = useCallback(async () => {
    try {
      await clearService();
      dispatcher({type: SET_MESSAGE, payload: 'Files cleared'});
      dispatcher({type: UNSELECT_GROUP}); 
      dispatcher({type: UNSELECT_FILE}); 
      dispatcher({type: UNCHECK_ALL_FILE}); 
      setFilesChanged();
    } catch (err) {
      dispatcher({type: SET_ERROR, payload: err});
    }
  }, [setFilesChanged]);

  const output = useCallback(async (fileNames) => {
    if (!fileNames || fileNames.length === 0) {
      dispatcher({type: SET_MESSAGE, payload: 'No File to Output'});
      return;
    }

    try {
      const result = await outputsService(fileNames);
      dispatcher({type: SET_OUTPUT_RESULT, payload: result});
      dispatcher({type: UNCHECK_ALL_FILE});
    } catch (err) {
      dispatcher({type: SET_ERROR, payload: err.message});
    }
  }, [])  

  useEffect(() => {
    clearFiles();
  }, [clearFiles]);

  const [state, dispatcher] = useReducer((st, action) => {
    switch (action.type) {
      case SET_MESSAGE: {
        return {...st, error: null, message: action.payload};
      }
      case SET_ERROR: {
        return {...st, message: null, error: action.payload};
      }
      case SET_FILES: {
        return {...st, files: action.payload};
      }
      case SELECT_FILE: {
        return {...st, selectedFile: action.payload};
      }
      case UNSELECT_FILE: {
        return {...st, selectedFile: null};
      }
      case SELECT_GROUP: {
        return {...st, selectedGroup: action.payload};
      }
      case UNSELECT_GROUP: {
        return {...st, selectedGroup: null};
      }
      case CHECK_FILE: {
        const file = action.payload;
        const checkedFiles = st.checkedFiles;
        const foundIndex = checkedFiles.findIndex((x) => x === file);
        if (foundIndex !== -1) {
          return st;
        } else {
          return {...st, checkedFiles: [...checkedFiles, file]};
        }
      }
      case UNCHECK_FILE: {
        const file = action.payload;
        const checkedFiles = st.checkedFiles;
        const foundIndex = checkedFiles.findIndex((x) => x === file);
        if (foundIndex !== -1) {
          return st;
        } else {
          const newCheckedFiles = [...checkedFiles].splice(foundIndex, 1);
          return {...st, checkedFiles: [...newCheckedFiles]};
        }
      }
      case UNCHECK_ALL_FILE: {
          return {...st, checkedFiles: []};
      }
      case SET_OUTPUT_RESULT: {
          return {...st, outputResult: action.payload};
      }
      case CLEAR_OUTPUT_RESULT: {
          return {...st, outputResult: null};
      }
      default: {
        throw new Error(`Unknown action type ${action.type}`);
      }
    }
  }, initState);

  const doUpload = useCallback(async (file) => {
    try {
      await uploadService(file);
      dispatcher({type: UNSELECT_GROUP}); 
      dispatcher({type: UNSELECT_FILE}); 
      setFilesChanged();
    } catch (err) {
      throw err;
    }
  }, [setFilesChanged]);

  //TODO put error and message into context provider
  const onError = useCallback((err) => {
    dispatcher({type: SET_ERROR, payload: err});
  }, []);

  const onMessage = useCallback((msg) => {
    dispatcher({type: SET_MESSAGE, payload: msg});
  }, []);

  const onSelectFile = useCallback((file) => {
    dispatcher({type: SELECT_FILE, payload: file});
  }, []);

  const onUnSelectFile = useCallback(() => {
    dispatcher({type: UNSELECT_FILE});
  }, []);

  const onCheckFile = useCallback((event) => {
    if (event.checked) {
      dispatcher({type: CHECK_FILE, payload: event.value});
    } else {
      dispatcher({type: UNCHECK_FILE, payload: event.value});
    }
  }, []);

  const onSelectGroup = useCallback((group) => {
    dispatcher({type: SELECT_GROUP, payload: group});
  }, []);

  const onUnSelectGroup = useCallback(() => {
    dispatcher({type: UNSELECT_GROUP});
  }, []);

  const onClearOutputResult = useCallback(() => {
    dispatcher({type: CLEAR_OUTPUT_RESULT});
  }, []);

  let outputResultPop = null;
  if (state.outputResult) {
    outputResultPop = (
      <InfoDialog show onClose={onClearOutputResult}>
        <OutputResultSummary {...state.outputResult} />
      </InfoDialog>
    );
  }

  let topBar;
  if (state.error) {
    topBar = <ErrorBar>{state.error}</ErrorBar>;
  } else if (state.message) {
    topBar = <MessageBar>{state.message}</MessageBar>;
  } else {
    topBar = <MessageBar>version {version}</MessageBar>;
  }

  let contents = <Splitter />;
  if (state.selectedGroup) {
    contents = 
    <Cards
      group={state.selectedGroup}
      onError={onError}
      onMessage={onMessage}
      onClose={onUnSelectGroup} />

  } else if (state.selectedFile) {
    contents = 
    <Groups 
      fileName={state.selectedFile} 
      onError={onError} 
      onMessage={onMessage} 
      onClose={onUnSelectFile} 
      onSelectGroup={onSelectGroup} />;

  } else if (state.files.length > 0) {
    contents = 
    <Files>
      {state.files.map(f =>
        <File key={f} file={f} onSelect={onSelectFile} onCheck={onCheckFile}/>
      )}
    </Files>;
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        {topBar}
        <Title>Anki Previewer</Title>
        <Toolbar>
          <UploaderWrapper>
            <Uploader 
              doUpload={doUpload} 
              onMessage={onMessage} 
              onError={onError} 
            />
          </UploaderWrapper>
          <FilesBtn files={state.files} />
          <ClearBtn onClear={clearFiles} fileCount={state.files.length} />
          <OutputBtn onOutput={() => output(state.checkedFiles)} />
        </Toolbar>

        { contents }

      </Container>
      {outputResultPop}
    </>
  );
}

export default App;
