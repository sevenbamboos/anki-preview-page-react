function getTotalPage(totalCount, itemsPerPage) {
  return Math.ceil(totalCount/itemsPerPage);
}

function getPage(totalCount, itemsPerPage, currentPage, wantedPage) {
  if (wantedPage < 1) return ['No Previous Pages', currentPage];

  const totalPage = getTotalPage(totalCount, itemsPerPage);
  if (wantedPage > totalPage) return ['No More Pages', currentPage];

  return [null, wantedPage];
}

function getItemsOnPage(items, itemsPerPage, page) {
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

export function navigateToPage(
  itemsPerPage, 
  currentPageSupplier, 
  itemsSupplier, 
  pageFunc, 
  messageSupplier,
  errorConsumer,
  successConsumer /* {message, page, currentItems} */
  ) {

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
      return successConsumer({message: messageSupplier(page), page, currentItems: itemsOnPage});
    }
  }  
}

export function resetPage(
  itemsSupplier, 
  itemsPerPage,
  errorConsumer, /* {error, items, currentItems, page, totalPage} */
  successConsumer /* {items, currentItems, page, totalPage} */  
  ) {

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