import React from 'react';
import {PopUpContainer, PopUpControl, OutputResultTable} from './styles';

export function InfoDialog({show, children, onClose}) {
  return (
    <PopUpContainer 
      show={show}
    >
      {children}
      <PopUpControl>
        <button onClick={onClose}>OK</button>
      </PopUpControl>
    </PopUpContainer>
  );
}

export function OutputResultSummary({ignoredGroups, groups, basicCards, clozeCards}) {
  return (
    <OutputResultTable>
      <thead>
        <tr>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Groups</td>
          <td>{groups.join(',')}</td>
        </tr>
        <tr>
          <td>Basic Cards</td>
          <td>{basicCards.length}</td>
        </tr>
        <tr>
          <td>Cloze Cards</td>
          <td>{clozeCards.length}</td>
        </tr>
        <tr>
          <td>Ignored</td>
          <td>{ignoredGroups.length}</td>
        </tr>
      </tbody>
    </OutputResultTable>
  );
}