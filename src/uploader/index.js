
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {LoadingIndicator, FileInput} from './styles';
import {MessageAndErrorContext} from '../utils/error-message';

function Uploader({doUpload}) {
  const [file, setFile] = useState(null);
  const [isUploading, setUploading] = useState(false);
  const {onMessage, onError} = useContext(MessageAndErrorContext);

  const onUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    try {
      await doUpload(file);
      onMessage('Upload Successfully');
    } catch(err) {
      onError(err);
    } finally {
      setUploading(false);
      setFile(null);
    }
  }, [file, doUpload, onMessage, onError]);

  useEffect(() => {
    onUpload();
  }, [onUpload]);

  const selectFile = (event) => {
    setFile(event.target.files[0]);
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