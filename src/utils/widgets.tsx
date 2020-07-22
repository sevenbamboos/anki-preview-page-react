import React, {ReactNode} from 'react';
import * as ls from './styles';
import useTouchAndHide from './touch-hide';

type InfoDialogProps = {
  show: boolean,
  children: ReactNode,
  onClose: () => void
};

export function InfoDialog({show, children, onClose}: InfoDialogProps) {
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

type OutputResultSummaryProps = {
  basicCards: string[],
  clozeCards: string[],
  groups: string[],
};

export function OutputResultSummary({groups, basicCards, clozeCards}: OutputResultSummaryProps) {
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
          <td>Group Names</td>
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
      </tbody>
    </ls.OutputResultTable>
  );
}

type ErrorBarProps = {
  children: ReactNode,
};

export function ErrorBar({children}: ErrorBarProps) {
  const [visible] = useTouchAndHide(2000, children);
  return (
    <ls.ErrorBarDiv visible={visible}>
      {children}
    </ls.ErrorBarDiv>
  );
}

type MessageBarProps = {
  children: ReactNode,
};

export function MessageBar({children}: MessageBarProps) {
  const [visible] = useTouchAndHide(2000, children);
  return (
    <ls.MessageBarDiv visible={visible}>
      {children}
    </ls.MessageBarDiv>
  );
}