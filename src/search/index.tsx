import React, { useCallback, useState, useEffect} from 'react';
import * as ls from './styles';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { buildIndex, searchIndex, selectResults, selectSearchStatus, selectTerms, SearchTerm } from './search-slice';
import { selectCard } from '../groups/groups-slice';
import * as types from '../types';
import { cardHasError, cardHasQA } from '../card/card-store';

type SearchProps = {
  latestTerms: string[],
};

type TermProps = {
  term: SearchTerm
}

const Term = ({term}: TermProps) => {
  return (
    <button>{term.keyword} ({term.count})</button>
  );
};

type ResultItemProps = {
  card: types.CardData
};

const ResultItem = ({card}: ResultItemProps) => {
  return (
    <ls.ResultCard>
      {card.forBasic && card.basicData &&
        <CardBasicSection basicData={card.basicData} />
      }
      {/* {card.forCloze && card.clozeData &&
        <CardClozeSection clozeData={card.clozeData} />
      } */}
      <footer>{card.tags}</footer>
    </ls.ResultCard>
  );
};

const CardBasicSection = ({basicData}: {basicData: types.EQA}) => {

  if (cardHasError(basicData)) {
    return <span>error</span>
  }

  return (
    <>
      {/* <span>{basicData.question}</span> */}
      <span>{basicData.answer}</span>
    </>
  );
};

const CardClozeSection = ({clozeData}: {clozeData: types.EQA}) => {
  if (cardHasError(clozeData)) {
    return <span>error</span>
  }

  return (
    <>
      <span>{clozeData.question}</span>
      <span>{clozeData.answer}</span>
    </>
  );
};

const CardSourceSection = ({source}: {source:string}) => (
  <span>{source}</span>
);

export default ({latestTerms=[]}: SearchProps) => {

  const history = useHistory();
  const dispatch = useDispatch();

  const [term, setTerm] = useState('');

  const onClose = useCallback(() => history.goBack(), [history]);
  
  const onSearch = useCallback((_) => {
    if (term && term.length > 1) {
      const keywords = term.split(' ');
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
  const terms = useSelector(selectTerms);
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
    resultSection = <ls.ResultCardContainer>
      {results.map(result => {
        const {fileName, groupName, cardIndex} = result;
        const cardData = card(fileName, groupName, cardIndex);
        const key = fileName+groupName+cardIndex;
        if (cardData) {
          return <ResultItem card={cardData} /> 
        } else {
          return <ls.ResultCard key={key}>{result.fileName}, {result.groupName}, {result.cardIndex}</ls.ResultCard>;
        }
      })}
    </ls.ResultCardContainer>;
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

      <ls.TermList>
        {terms.map(term => (
          <Term term={term} />
        ))}
      </ls.TermList>

      <ls.ResultList>
        {resultSection}
      </ls.ResultList>
    </ls.SearchContainer>
  );  
};
