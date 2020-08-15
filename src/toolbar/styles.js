import styled from 'styled-components';
import {DeleteSweep, Create} from '@styled-icons/material';
import {FileCode} from '@styled-icons/fa-regular';
import {Reload} from '@styled-icons/ionicons-outline/Reload';

export const ReloadIcon = styled(Reload)`
  width: 12px;
  margin-right: 5px;
`;

export const FilesIcon = styled(FileCode)`
  width: 10px;
`;

export const SmallFilesIcon = styled(FileCode)`
  width: 6px;
  padding-right: 2px;
`;

export const ClearIcon = styled(DeleteSweep)`
  color: palevioletred;
  width: 15px;
`;

export const FilesPop = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  left: ${props => props.position ? (props.position[0]+10) + 'px' : '400px'};
  top: ${props => props.position ? (props.position[1]+10) + 'px' : '100px'};
  width: auto;
  height: auto;
  padding: 5px;
  background-color: rgb(216, 247, 81, 0.8);
  z-index: 100;
  font-size: 10px;
  border-radius: 5px;
`;

export const FilesPopList = styled.ul`
  list-style-type: none;
  text-align: left;
  padding-left: 2px;
  margin: 0px;
`;

export const FilesPopListItem = styled.li`
  padding: 2px;
`;

export const FilesButton = styled.button`

`;

export const ReloadButton = styled.button`
  font-size: 11px;
  padding-top: 2px;
`;

export const ClearFilesSpan = styled.span`
  font-size: 11px;
  padding: 2px;
`;

export const OutputIcon = styled(Create)`
  color: blue;
  width: 15px;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: space-around;
`;
