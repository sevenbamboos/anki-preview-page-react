import React from 'react';
import * as ls from './styles';

export default function Paginator({pageIndex, totalPage, onFirst, onPrev, onNext, onLast}) {

  return (
    <ls.PaginatorControl>
    <ls.PaginatorButton onClick={onFirst} title="First Page">
        <ls.FirstPageIcon/>
    </ls.PaginatorButton>
    <ls.PaginatorButton onClick={onPrev} title="Previous Page">
        <ls.PreviousPageIcon/>
    </ls.PaginatorButton>
    <ls.PaginatorPageSpan>
      Page {pageIndex} 
      <ls.PaginatorPageProgress value={pageIndex-1} max={totalPage-1}>{pageIndex-1}</ls.PaginatorPageProgress> 
      {totalPage}
    </ls.PaginatorPageSpan>
    <ls.PaginatorButton onClick={onNext} title="Next Page">
        <ls.NextPageIcon/>
    </ls.PaginatorButton>
    <ls.PaginatorButton onClick={onLast} title="Last Page">
        <ls.LastPageIcon/>
    </ls.PaginatorButton>
  </ls.PaginatorControl>    
  );

}