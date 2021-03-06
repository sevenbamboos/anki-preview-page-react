function getTotalPage(totalCount: number, itemsPerPage: number) {
  return Math.ceil(totalCount/itemsPerPage);
}

function getPage(
  totalCount: number, 
  itemsPerPage: number, 
  currentPage: number, 
  wantedPage: number) 
  : [null|string, number] {
  if (wantedPage < 1) return ['No Previous Pages', currentPage];

  const totalPage = getTotalPage(totalCount, itemsPerPage);
  if (wantedPage > totalPage) return ['No More Pages', currentPage];

  return [null, wantedPage];
}

function getItemsOnPage<T>(
  items: T[], 
  itemsPerPage: number, 
  page: number) 
  : [string, []] | [null, T[]] {
  let pageStart = itemsPerPage * (page-1);
  let pageEnd = pageStart + itemsPerPage;

  if (pageStart > items.length-1 || pageEnd <= 0) {
    return ['No result', []];
  } else {
    pageStart = Math.max(pageStart, 0);
    pageEnd = Math.min(pageEnd, items.length);
    return [null, items.slice(pageStart, pageEnd)];
  }
}

export type NavigateToPageSuccessResult<T,K> = {
  message: string,
  page: number,
  currentItems: T[] 
};

export function navigateToPage<T,K>(
  itemsPerPage: number, 
  currentPageSupplier: () => number, 
  itemsSupplier: () => T[], 
  pageFunc: (x: number) => number, 
  messageFunc: (x: number) => string,
  errorConsumer: (e: string) => K,
  successConsumer: (result: NavigateToPageSuccessResult<T,K>) => K
  ) : K {

  const currentPage = currentPageSupplier();
  const wantedPage = pageFunc(currentPage);
  const items = itemsSupplier();
  const [error, page] = getPage(items.length, itemsPerPage, currentPage, wantedPage);
  if (error) {
    return errorConsumer(error);
  } else {
    const [errorForItems, itemsOnPage] = getItemsOnPage(items, itemsPerPage, page);
    if (errorForItems) {
      return errorConsumer(errorForItems);
    } else {
      return successConsumer({message: messageFunc(page), page, currentItems: itemsOnPage});
    }
  }  
}

export type ResetPageSuccessResult<T, K> = {
  items: T[],
  currentItems: T[],
  page: number,
  totalPage: number
};

export type ResetPageErrorResult<T, K> = ResetPageSuccessResult<T, K> & {
  error: string
};

export function resetPage<T, K>(
  itemsSupplier: () => T[], 
  itemsPerPage: number,
  errorConsumer: (error: ResetPageErrorResult<T, K>) => K,
  successConsumer: (result: ResetPageSuccessResult<T, K>) => K
  ) : K {

  const items = itemsSupplier();
  const page = 1 // reset to the first page;
  const totalPage = getTotalPage(items.length, itemsPerPage);
  const [error, itemsOnPage] = getItemsOnPage(items, itemsPerPage, page);
  if (error) {
    return errorConsumer({error, items, currentItems: itemsOnPage, page, totalPage});
  } else {
    return successConsumer({items, currentItems: itemsOnPage, page, totalPage});
  }  
}