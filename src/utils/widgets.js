import React from 'react';
import * as ls from './styles';
import useTouchAndHide from './touch-hide';

export function InfoDialog({show, children, onClose}) {
  return (
    <ls.PopUpContainer 
      show={show}
    >
      {children}
      <ls.PopUpControl>
        <button onClick={onClose}>OK</button>
      </ls.PopUpControl>
    </ls.PopUpContainer>
  );
}

export function OutputResultSummary({ignoredGroups, groups, basicCards, clozeCards}) {
  return (
    <ls.OutputResultTable>
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
    </ls.OutputResultTable>
  );
}

export function ErrorBar({children}) {
  const [visible] = useTouchAndHide(2000, children);
  return (
    <ls.ErrorBarDiv visible={visible}>
      {children}
    </ls.ErrorBarDiv>
  );
}

export function MessageBar({children}) {
  const [visible] = useTouchAndHide(2000, children);
  return (
    <ls.MessageBarDiv visible={visible}>
      {children}
    </ls.MessageBarDiv>
  );
}