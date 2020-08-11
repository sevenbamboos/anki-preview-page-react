import React, {useReducer, useCallback} from 'react';
import { GlobalStyle, Title, Container, UploaderWrapper, Splitter } from './styles';
import { Toolbar } from './toolbar/styles';
import {ClearBtn, OutputBtn, FilesBtn} from './toolbar';
import Uploader from './uploader';
import {
  upload as uploadService, 
  outputs as outputsService
} from './service';
import Breadcrumb from './utils/breadcrumb';
import {InfoDialog, OutputResultSummary, ErrorBar, MessageBar} from './utils/widgets';
import {Files, File, FileUploadTime} from './files';
import Groups from './groups';
import Cards from './cards';
import * as store from './app/app-store';
import {version} from '../package.json';
import {
  Switch,
  Route,
  // Link,
  Redirect,
  useHistory
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { GroupData } from './types';
import { 
  selectAllFiles, 
  selectAllFileIds, 
  selectAllCheckedFiles,
  fetchFiles as fetchFilesAction, 
  clearFiles as clearFilesAction,
  fileChecked as fileCheckedAction,
  fileUnchecked as fileUncheckedAction,
  FileData, 
} from './files/files-slice';

import {
  selectSelectedGroups,
  reset as resetGroupsAction,
  fetchGroups as fetchGroupsAction,
} from './groups/groups-slice';

import {
  selectError,
  selectMessage
} from './app/app-slice';

function App() {

  const [state, dispatcher] = useReducer(store.appReducer, store.initState);
  const history = useHistory();

  const dispatch = useDispatch();

  const gotoFiles = useCallback(() => history.push('/files'), [history]);
  const gotoGroups = useCallback(() => history.push('/groups'), [history]);
  const gotoGroup = useCallback(() => history.push('/group'), [history]);
  const gotoHome = useCallback(() => history.push('/'), [history]);

  const filesFromReduxStore = useSelector(selectAllFiles);
  const fileIdsFromReduxStore = useSelector(selectAllFileIds);
  const checkedFileIdsFromReduxStore = useSelector(selectAllCheckedFiles);
  const selectedGroupsFromReduxStore = useSelector(selectSelectedGroups);

  const clearFiles = useCallback(async () => {
    dispatch(clearFilesAction());
    gotoHome();
  }, [gotoHome, dispatch]);

  const output = useCallback(async (fileNames) => {
    if (!fileNames || fileNames.length === 0) {
      dispatcher({type: store.SET_MESSAGE, payload: 'No File to Output'});
      return;
    }

    try {
      const result = await outputsService(fileNames);
      dispatch(resetGroupsAction());
      dispatch(clearFilesAction());
      dispatcher({type: store.SET_OUTPUT_RESULT, payload: result});
      gotoHome();
    } catch (err) {
      dispatcher({type: store.SET_ERROR, payload: err.message});
    }
  }, [gotoHome, dispatch])  

  const doUpload = useCallback(async (file) => {
    try {
      await uploadService(file);
      dispatch(fetchFilesAction());
      gotoFiles();
    } catch (err) {
      throw err;
    }
  }, [gotoFiles, dispatch]);

  const onSelectFile = useCallback((file) => {
    dispatch(fetchGroupsAction({fileName: file, history}));
  }, [dispatch, history]);

  const onUnSelectFile = useCallback(() => {
    dispatcher({type: store.UNSELECT_FILE});
    gotoFiles();
  }, [gotoFiles]);

  const onCheckFile = useCallback((event) => {
    if (event.checked) {
      dispatch(fileCheckedAction(event.value));
    } else {
      dispatch(fileUncheckedAction(event.value));
    }
  }, [dispatch]);

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

  let outputResultPop = null;
  if (state.outputResult) {
    outputResultPop = (
      <InfoDialog show onClose={onClearOutputResult}>
        <OutputResultSummary {...state.outputResult} />
      </InfoDialog>
    );
  }

  const errorFromReduxStore = useSelector(selectError);
  const messageFromReduxStore = useSelector(selectMessage);
  let topBar;
  if (errorFromReduxStore) {
    topBar = <ErrorBar>{errorFromReduxStore}</ErrorBar>;
  } else if (messageFromReduxStore) {
    topBar = <MessageBar>{messageFromReduxStore}</MessageBar>;
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

  const renderGroups = (file: string | undefined) => {
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
          <Toolbar>
            <UploaderWrapper>
              <Uploader doUpload={doUpload} />
            </UploaderWrapper>
            <FilesBtn files={fileIdsFromReduxStore} />
            <ClearBtn onClear={clearFiles} fileCount={fileIdsFromReduxStore.length} />
            <OutputBtn onOutput={() => output(checkedFileIdsFromReduxStore)} />
          </Toolbar>

          <Breadcrumb files={fileIdsFromReduxStore} selectedFile={selectedGroupsFromReduxStore} selectedGroup={state.selectedGroup} />

          <Switch>
            <Route path='/group' render={() => renderGroup(state.selectedGroup)} />
            <Route path='/groups' render={() => renderGroups(selectedGroupsFromReduxStore)} />
            <Route path='/files' render={() => renderFiles(filesFromReduxStore)} />
            <Route path='/'><Splitter /></Route>
            <Redirect to='/' />
          </Switch>

        {outputResultPop}
      </Container>
      
    </>
  );
}

export default App;
