import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '.';

describe('Card', () => {

  test('render basic check', () => {
    const clozeQuestion = 'test-cloze-question';
    const clozeAnswer = 'test-cloze-answer';
    const basicQuestion = 'test-basic-question';
    const basicAnswer = 'test-basic-answer';
    const sourceText = 'test-source';
    const card = {
      forCloze: true, 
      forBasic: true, 
      tags: 'test-tag1 test-tag2', 
      clozeData: {
        question: clozeQuestion,
        answer: clozeAnswer
      }, 
      basicData: {
        question: basicQuestion,
        answer: basicAnswer
      }, 
      source: sourceText,
    };
    render(<Card card={card}/>);
    const basicBtn = screen.getByTitle('Basic');
    expect(basicBtn).toBeInTheDocument();
    expect(screen.getByText(basicQuestion)).toBeInTheDocument();
    expect(screen.getByText(basicAnswer)).toBeInTheDocument();

    const clozeBtn = screen.getByTitle('Cloze');
    expect(clozeBtn).toBeInTheDocument();
    expect(screen.getByText(clozeQuestion)).toBeInTheDocument();
    expect(screen.getByText(clozeAnswer)).toBeInTheDocument();

    expect(screen.getByTitle('Source')).toBeInTheDocument();
    expect(screen.getByText(sourceText)).toBeInTheDocument();

    expect(screen.getByRole('heading')).toHaveTextContent('Tags');
  });

  test('render card in error', () => {
    const clozeQuestion = 'test-cloze-question';
    const clozeAnswer = 'test-cloze-answer';
    const basicQuestion = 'test-basic-question';
    const basicAnswer = 'test-basic-answer';
    const sourceText = 'test-source';
    const card = {
      forCloze: true, 
      forBasic: true, 
      tags: 'test-tag1 test-tag2', 
      clozeData: {
        error: true,
        question: clozeQuestion,
        answer: clozeAnswer
      }, 
      basicData: {
        error: true,
        question: basicQuestion,
        answer: basicAnswer
      }, 
      source: sourceText,
    };
    render(<Card card={card}/>);

    expect(screen.queryByText(basicQuestion)).not.toBeInTheDocument();
    expect(screen.queryByText(basicAnswer)).not.toBeInTheDocument();

    expect(screen.queryByText(clozeQuestion)).not.toBeInTheDocument();
    expect(screen.queryByText(clozeAnswer)).not.toBeInTheDocument();

    expect(screen.getByTitle('Source')).toBeInTheDocument();
    expect(screen.getByText(sourceText)).toBeInTheDocument();

    expect(screen.getByRole('heading')).toHaveTextContent('Tags');
  });
});