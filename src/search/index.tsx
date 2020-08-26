import React, { useCallback, useState, useEffect} from 'react';
import * as ls from './styles';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { buildIndex, searchIndex, selectResults, selectSearchStatus, selectTerms, SearchTerm } from './search-slice';
import { selectCard } from '../groups/groups-slice';
import * as types from '../types';
import { cardHasError } from '../card/card-store';

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
  score: number,
  term: string,
  card: types.CardData,
  id: string
};

const ResultItem = ({card, term, score, id}: ResultItemProps) => {
  const tags = card.tags.split(' ');
  const tagStr = tags.length ? tags[tags.length-1] : card.tags;
  return (
    <ls.ResultCard>
      {card.forBasic && card.basicData &&
        <CardBasicSection basicData={card.basicData} term={term} key={id} score={score} />
      }
      <footer>{tagStr}</footer>
    </ls.ResultCard>
  );
};

const CardBasicSection = ({basicData, term, score}: {basicData: types.EQA, term: string, score: number}) => {

  if (cardHasError(basicData)) {
    return <span>error</span>
  }

  const answerParts = basicData.answer.split(term).map((part, index, array) => {

    const scoreMark = score < 100 ? <ls.QuestionIcon title={String(score)} /> : null;

    const termPart = part && index < array.length-1 ? 
      <ls.ResultCardAnswerTermPart>{term}{scoreMark}</ls.ResultCardAnswerTermPart> :
      null;
    return (
      <span key={index}>
        <ls.ResultCardAnswerPart>{part}</ls.ResultCardAnswerPart>
        {termPart}
      </span>
    );
  });

  return (
    <>
      <span>{answerParts}</span>
    </>
  );
};

// const CardClozeSection = ({clozeData}: {clozeData: types.EQA}) => {
//   if (cardHasError(clozeData)) {
//     return <span>error</span>
//   }

//   return (
//     <>
//       <span>{clozeData.question}</span>
//       <span>{clozeData.answer}</span>
//     </>
//   );
// };

// const CardSourceSection = ({source}: {source:string}) => (
//   <span>{source}</span>
// );

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
        const {fileName, groupName, cardIndex, score, key: term} = result;
        const cardData = card(fileName, groupName, cardIndex);
        const key = fileName+groupName+cardIndex+term;
        if (cardData) {
          return <ResultItem key={key} id={key} card={cardData} score={score} term={term} /> 
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
          <Term key={term.keyword} term={term} />
        ))}
      </ls.TermList>

      <ls.ResultList>
        {resultSection}
      </ls.ResultList>
    </ls.SearchContainer>
  );  
};
