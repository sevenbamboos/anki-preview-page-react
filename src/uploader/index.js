
import React, {useState, useCallback, useEffect} from 'react';
import {LoadingIndicator} from './styles';

function Uploader({doUpload, onMessage, onError}) {
  const [file, setFile] = useState(null);
  const [isUploading, setUploading] = useState(false);

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
        <input type="file" onChange={selectFile} />
      )}
    </>
  );
}

export default Uploader;