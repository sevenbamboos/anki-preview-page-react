import React from 'react';
import * as ls from './styles';
import { GroupData } from '../types';
import { Link } from 'react-router-dom';

type FilescrumbProps = {
  isLink?: boolean
};

function Filescrumb({isLink=false}: FilescrumbProps) {
  if (isLink) {
    return (
      <Link to='/files'>
        <ls.BreadcrumbButton>
          <ls.FilesIcon/>
          <ls.BreadcrumbSpan>Files</ls.BreadcrumbSpan>
        </ls.BreadcrumbButton>
      </Link>
    );
  } else {
    return (
      <ls.BreadcrumbSpan>(Files)</ls.BreadcrumbSpan>
    );
  }
}

type FilecrumbProps = {
  file: string,
  isLink?: boolean
};

function Filecrumb({file, isLink=false}: FilecrumbProps) {
  if (isLink) {
    return (
      <Link to='/groups'>
        <ls.BreadcrumbButton>
          <ls.GroupsIcon />
          <ls.BreadcrumbSpan>{file}</ls.BreadcrumbSpan>
        </ls.BreadcrumbButton>
      </Link>
    );
  } else {
    return (
      <ls.BreadcrumbSpan>({file})</ls.BreadcrumbSpan>
    );
  }
}

type GroupcrumbProps = {
  group: GroupData,
  isLink?: boolean
};

function Groupcrumb({group, isLink=false}: GroupcrumbProps) {
  if (isLink) {
    return (
      <Link to='/group'>
        <ls.BreadcrumbSpan>
          {group.name}
        </ls.BreadcrumbSpan>
      </Link>
    );
  } else {
    return (
      <ls.BreadcrumbSpan>({group.name})</ls.BreadcrumbSpan>
    );
  }
}

type BreadcrumbProps = {
  files: string[],
  selectedFile?: string,
  selectedGroup: GroupData | null
};

export default function Breadcrumb({files, selectedFile, selectedGroup}: BreadcrumbProps) {

  if (selectedGroup && selectedFile && files.length > 0) {
    return (
      <ls.BreadcrumbSection>
        <ls.ArrowRightIcon />
        <Filescrumb isLink />
        <ls.ArrowRightIcon />
        <Filecrumb file={selectedFile} isLink />
        <ls.ArrowRightIcon />
        <Groupcrumb group={selectedGroup} />
      </ls.BreadcrumbSection>
    );
  
  } else if (!selectedGroup && selectedFile && files.length > 0) {
    return (
      <ls.BreadcrumbSection>
        <ls.ArrowRightIcon />
        <Filescrumb isLink />
        <ls.ArrowRightIcon />
        <Filecrumb file={selectedFile} />
      </ls.BreadcrumbSection>
    );

  } else if (!selectedGroup && !selectedFile && files.length > 0) {
    return (
      <React.Fragment></React.Fragment>
    );

  } else {
    return (
      <React.Fragment></React.Fragment>
    );
  }


}