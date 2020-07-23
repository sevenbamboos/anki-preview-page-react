import http from './http-common';
import { GroupData, OutputResult } from '../types';

export const groups = async (fileName: string): Promise<GroupData[]> => {
  return http.get('/groups', { params: {fileName} })
    .then(x => x.data)
    .catch(err => {
      throw err;
    });
};

export const outputs = async (fileNames: string[]): Promise<OutputResult> => {
  return http.post('/outputs', { files: fileNames, question: '' })
    .then(x => x.data)
    .catch(err => {
      throw err;
    });
};

export const files = async (): Promise<string[]> => {
  return http.get('/files')
    .then(x => x.data)
    .catch(err => { throw err;})
};

export const clear = async () => {
  return http.get('/clear')
    .then(x => x.data)
    .catch(err => { throw err;})
};

export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return http.post('/upload', formData, {
    headers: {
      "Content-type": "multipart/form-data"
    }
  }).catch(err => {

    if (err.request && err.request.response) {
      const response = JSON.parse(err.request.response);
      if (response && response.status && response.message) {
        const status = response.status;
        if (status === 404 || status === 500) {
          throw response.message;
        }
      }
    }
    throw err;
  });
};