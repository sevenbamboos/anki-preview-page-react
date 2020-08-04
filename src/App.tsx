import React, {useReducer, useCallback, useEffect} from 'react';
import { GlobalStyle, Title, Container, UploaderWrapper, Splitter } from './styles';
import { Toolbar } from './toolbar/styles';
import {ClearBtn, OutputBtn, FilesBtn} from './toolbar';
import Uploader from './uploader';
import {
  upload as uploadService, 
  // files as filesService, 
  // clear as clearService, 
  outputs as outputsService
} from './service';
import useTimeTrigger from './utils/time-trigger';
import Breadcrumb from './utils/breadcrumb';
import {InfoDialog, OutputResultSummary, ErrorBar, MessageBar} from './utils/widgets';
import {Files, File, FileUploadTime} from './files';
import Groups from './groups';
import Cards from './cards';
import * as store from './app-store';
import {version} from '../package.json';
import {MessageAndErrorContext, toError} from './utils/error-message';
import {
  Switch,
  Route,
  // Link,
  Redirect,
  useHistory
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GroupData } from './types';
import { selectAllFiles, selectAllFileIds, fetchFiles as fetchFilesAction, clearFiles as clearFilesAction, FileData } from './files/files-slice';

function App() {

  const [filesChanged, setFilesChanged] = useTimeTrigger();
  const [state, dispatcher] = useReducer(store.appReducer, store.initState);
  const history = useHistory();

  const dispatch = useDispatch();

  const gotoFiles = useCallback(() => history.push('/files'), [history]);
  const gotoGroups = useCallback(() => history.push('/groups'), [history]);
  const gotoGroup = useCallback(() => history.push('/group'), [history]);
  const gotoHome = useCallback(() => history.push('/files'), [history]);

  useEffect(() => {
    const abortController = new AbortController();
    // const getFiles = async () => {
    //   try {
    //     const files = await filesService();
    //     dispatcher({type: store.SET_FILES, payload: files}); 
    //   } catch (err) {
    //     dispatcher({type: store.SET_ERROR, payload: toError(err)});
    //   }
    // };
    // getFiles();
    dispatch(fetchFilesAction());

    return () => abortController.abort();

  }, [filesChanged, dispatch]);

  const clearFiles = useCallback(async () => {
    try {
      dispatch(clearFilesAction());
      // await clearService();
      dispatcher({type: store.CLEAR_ALL_FILES});
      setFilesChanged();
      gotoHome();
    } catch (err) {
      dispatcher({type: store.SET_ERROR, payload: toError(err)});
    }
  }, [setFilesChanged, gotoHome, dispatch]);

  const output = useCallback(async (fileNames) => {
    if (!fileNames || fileNames.length === 0) {
      dispatcher({type: store.SET_MESSAGE, payload: 'No File to Output'});
      return;
    }

    try {
      const result = await outputsService(fileNames);
      dispatcher({type: store.SET_OUTPUT_RESULT, payload: result});
      gotoHome();
    } catch (err) {
      dispatcher({type: store.SET_ERROR, payload: err.message});
    }
  }, [gotoHome])  

  const doUpload = useCallback(async (file) => {
    try {
      await uploadService(file);
      dispatcher({type: store.AFTER_UPLOAD}); 
      setFilesChanged();
      gotoFiles();
    } catch (err) {
      throw err;
    }
  }, [setFilesChanged, gotoFiles]);

  const onError = useCallback((err) => {
    dispatcher({type: store.SET_ERROR, payload: toError(err)});
  }, []);

  const onMessage = useCallback((msg) => {
    dispatcher({type: store.SET_MESSAGE, payload: msg});
  }, []);

  const onSelectFile = useCallback((file) => {
    dispatcher({type: store.SELECT_FILE, payload: file});
    gotoGroups();
  }, [gotoGroups]);

  const onUnSelectFile = useCallback(() => {
    dispatcher({type: store.UNSELECT_FILE});
    gotoFiles();
  }, [gotoFiles]);

  const onCheckFile = useCallback((event) => {
    if (event.checked) {
      dispatcher({type: store.CHECK_FILE, payload: event.value});
    } else {
      dispatcher({type: store.UNCHECK_FILE, payload: event.value});
    }
  }, []);

  const onSelectGroup = useCallback((group) => {
    dispatcher({type: store.SELECT_GROUP, payload: group});
    gotoGroup();
  }, [gotoGroup]);

  const onUnSelectGroup = useCallback(() => {
    dispatcher({type: store.UNSELECT_GROUP});
    gotoGroups();
  }, [gotoGroups]);

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

  const renderGroup = (group: GroupData | null) => {
    if (!group) {
      return (
        <section><h3>No group contents</h3></section>
      );
    } else {
      return (
        <Cards group={group} onClose={onUnSelectGroup} />
      );
    }
  };

  const renderGroups = (file: string | null) => {
    if (!file) {
      return (
        <section><h3>No groups</h3></section>
      );
    } else {
      return (
        <Groups fileName={file} onClose={onUnSelectFile} onSelectGroup={onSelectGroup} />
      );
    }
  };

  const filesFromReduxStore = useSelector(selectAllFiles);
  const fileIdsFromReduxStore = useSelector(selectAllFileIds);

  const renderFiles = (files: FileData[]) => {
    if (files.length === 0) {
      return (
        <section><h3>No files</h3></section>
      );
    } else {
      return (
        <Files>
          {files.map(f =>
            <File key={f.id} file={f.id} onSelect={onSelectFile} onCheck={onCheckFile}>
              <FileUploadTime dateIOSString={f.created}/>
            </File>
          )}
        </Files>
      );
    }
  };

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
            <ClearBtn onClear={clearFiles} fileCount={fileIdsFromReduxStore.length} />
            <OutputBtn onOutput={() => output(state.checkedFiles)} />
          </Toolbar>

          <Breadcrumb files={state.files} selectedFile={state.selectedFile} selectedGroup={state.selectedGroup} />

          <Switch>
            <Route path='/group' render={() => renderGroup(state.selectedGroup)} />
            <Route path='/groups' render={() => renderGroups(state.selectedFile)} />
            <Route path='/files' render={() => renderFiles(filesFromReduxStore)} />
            <Route path='/'><Splitter /></Route>
            <Redirect to='/' />
          </Switch>
        </MessageAndErrorContext.Provider>

        {outputResultPop}
      </Container>
      
    </>
  );
}

export default App;
