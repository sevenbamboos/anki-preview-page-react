import React, {useReducer, useCallback, useEffect} from 'react';
import { GlobalStyle, Title, Container, UploaderWrapper, Splitter } from './styles';
import { Toolbar } from './toolbar/styles';
import {ClearBtn, OutputBtn, FilesBtn} from './toolbar';
import Uploader from './uploader';
import {upload as uploadService, files as filesService, clear as clearService, outputs as outputsService} from './service';
import useTimeTrigger from './utils/time-trigger';
import {InfoDialog, OutputResultSummary, ErrorBar, MessageBar} from './utils/widgets';
import {Files, File} from './files';
import Groups from './groups';
import Cards from './cards';
import * as store from './app-store';
import {version} from '../package.json';
import {MessageAndErrorContext} from './utils/error-message';

function App() {

  const [filesChanged, setFilesChanged] = useTimeTrigger();
  const [state, dispatcher] = useReducer(store.appReducer, store.initState);

  useEffect(() => {
    const abortController = new AbortController();
    const getFiles = async () => {
      try {
        const files = await filesService();
        dispatcher({type: store.SET_FILES, payload: files}); 
      } catch (err) {
        dispatcher({type: store.SET_ERROR, payload: err});
      }
    };
    getFiles();

    return () => abortController.abort();

  }, [filesChanged]);

  const clearFiles = useCallback(async () => {
    try {
      await clearService();
      dispatcher({type: store.CLEAR_ALL_FILES});
      setFilesChanged();
    } catch (err) {
      dispatcher({type: store.SET_ERROR, payload: err});
    }
  }, [setFilesChanged]);

  const output = useCallback(async (fileNames) => {
    if (!fileNames || fileNames.length === 0) {
      dispatcher({type: store.SET_MESSAGE, payload: 'No File to Output'});
      return;
    }

    try {
      const result = await outputsService(fileNames);
      dispatcher({type: store.SET_OUTPUT_RESULT, payload: result});
    } catch (err) {
      dispatcher({type: store.SET_ERROR, payload: err.message});
    }
  }, [])  

  const doUpload = useCallback(async (file) => {
    try {
      await uploadService(file);
      dispatcher({type: store.AFTER_UPLOAD}); 
      setFilesChanged();
    } catch (err) {
      throw err;
    }
  }, [setFilesChanged]);

  const onError = useCallback((err) => {
    dispatcher({type: store.SET_ERROR, payload: err});
  }, []);

  const onMessage = useCallback((msg) => {
    dispatcher({type: store.SET_MESSAGE, payload: msg});
  }, []);

  const onSelectFile = useCallback((file) => {
    dispatcher({type: store.SELECT_FILE, payload: file});
  }, []);

  const onUnSelectFile = useCallback(() => {
    dispatcher({type: store.UNSELECT_FILE});
  }, []);

  const onCheckFile = useCallback((event) => {
    if (event.checked) {
      dispatcher({type: store.CHECK_FILE, payload: event.value});
    } else {
      dispatcher({type: store.UNCHECK_FILE, payload: event.value});
    }
  }, []);

  const onSelectGroup = useCallback((group) => {
    dispatcher({type: store.SELECT_GROUP, payload: group});
  }, []);

  const onUnSelectGroup = useCallback(() => {
    dispatcher({type: store.UNSELECT_GROUP});
  }, []);

  const onClearOutputResult = useCallback(() => {
    dispatcher({type: store.CLEAR_OUTPUT_RESULT});
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    clearFiles();
    return () => abortController.abort();
  }, [clearFiles]);

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
    <Cards group={state.selectedGroup} onClose={onUnSelectGroup} />;

  } else if (state.selectedFile) {
    contents = 
    <Groups fileName={state.selectedFile} onClose={onUnSelectFile} onSelectGroup={onSelectGroup} />;

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
        <MessageAndErrorContext.Provider value={{onMessage, onError}}>

          <Toolbar>
            <UploaderWrapper>
              <Uploader doUpload={doUpload} />
            </UploaderWrapper>
            <FilesBtn files={state.files} />
            <ClearBtn onClear={clearFiles} fileCount={state.files.length} />
            <OutputBtn onOutput={() => output(state.checkedFiles)} />
          </Toolbar>

          { contents }

        </MessageAndErrorContext.Provider>
        {outputResultPop}
      </Container>
      
    </>
  );
}

export default App;
