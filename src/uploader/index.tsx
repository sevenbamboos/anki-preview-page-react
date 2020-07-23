
import React, {useState, useCallback, useEffect, useContext} from 'react';
import {LoadingIndicator, FileInput} from './styles';
import {MessageAndErrorContext} from '../utils/error-message';

type UploaderProps = {
  doUpload: (file: File) => Promise<void>;
};

type UploaderFile = File | null;

function Uploader({doUpload}: UploaderProps) {
  const [file, setFile] = useState<UploaderFile>(null);
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