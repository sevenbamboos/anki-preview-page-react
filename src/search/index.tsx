import React, { useCallback, useState, useEffect} from 'react';
import * as ls from './styles';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { keepTerms, buildIndex, searchIndex, selectResults, selectSearchStatus } from './search-slice';
import { selectCard } from '../groups/groups-slice';
import * as types from '../types';

type SearchProps = {
  latestTerms: string[],
};

export default ({latestTerms=[]}: SearchProps) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const [term, setTerm] = useState('');

  const onClose = useCallback(() => history.goBack(), [history]);
  
  const onSearch = useCallback((_) => {
    if (term && term.length > 1) {
      const keywords = term.split(' ');
      dispatch(keepTerms(keywords));
      dispatch(searchIndex({keywords}));
    }
  }, [dispatch, term]);

  const onSearchEnter = useCallback((event) => {
    if (event.key === 'Enter') {
      onSearch(event);
    }  
  }, [onSearch]);

  const searchStatus = useSelector(selectSearchStatus);
  const results = useSelector(selectResults);
  const card = useSelector(selectCard);

  useEffect(() => {
    dispatch(buildIndex())
  }, [dispatch]);

  let resultSection;
  if (searchStatus === types.statusLoading) {
    resultSection = <h4>Loading...</h4>;
  } else if (searchStatus === types.statusFailed) {
    resultSection = <h4>Search error</h4>;
  } else if (results && results.length) {
    resultSection = <ol>
      {results.map(result => {
        const {fileName, groupName, cardIndex} = result;
        const cardData = card(fileName, groupName, cardIndex);
        const key = fileName+groupName+cardIndex;
        if (cardData) {
          return <li key={key}>{cardData.source}</li>
        } else {
          return <li key={key}>{result.fileName}, {result.groupName}, {result.cardIndex}</li>;
        }
      })}
    </ol>;
  } else if (!results || !results.length) {
    resultSection = <h4>No results</h4>;
  }

  return (
    <ls.SearchContainer>
      <ls.SearchHeading>
        <span>
          <label htmlFor='searchInput'>
            Search
            <input name='searchInput' 
              type='text' 
              size={40}
              minLength={2}
              placeholder='search keywords'
              value={term} 
              onChange={(event) => setTerm(event.target.value)}
              onKeyDown={onSearchEnter}>
            </input>
            <button onClick={onSearch}><ls.SearchIcon/></button>
          </label>
        </span>
        <ls.ControlButton 
          onClick={onClose}
          title="Close">
            <ls.CloseIcon/>    
        </ls.ControlButton>        
      </ls.SearchHeading>

      <ls.ResultList>
        {resultSection}
      </ls.ResultList>
    </ls.SearchContainer>
  );  
};
