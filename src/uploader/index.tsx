
import React, {useState, useCallback, useEffect} from 'react';
import {LoadingIndicator, FileInput} from './styles';
import { useDispatch } from 'react-redux';
import { onError as onErrorAction, onMessage as onMessageAction } from '../app/app-slice';

type UploaderProps = {
  doUpload: (file: File) => Promise<void>;
};

type UploaderFile = File | null;

function Uploader({doUpload}: UploaderProps) {

  const dispatch = useDispatch();

  const [file, setFile] = useState<UploaderFile>(null);
  const [isUploading, setUploading] = useState(false);

  const onUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    try {
      await doUpload(file);
      dispatch(onMessageAction('Upload Successfully'));
    } catch(err) {
      dispatch(onErrorAction(String(err)));
    } finally {
      setUploading(false);
      setFile(null);
    }
  }, [file, doUpload, dispatch]);

  useEffect(() => {
    onUpload();
  }, [onUpload]);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      {isUploading ? (
        <LoadingIndicator>Loading...</LoadingIndicator>
      ) : (
        <FileInput type="file" onChange={selectFile} />
      )}
    </>
  );
}

export default Uploader;