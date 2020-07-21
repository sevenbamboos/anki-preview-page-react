import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('check test env', () => {
    expect(1+1).toBe(2);
  });

  test('render basic check', () => {
    render(<App />);
    expect(screen.getByRole('heading')).toHaveTextContent('Anki Previewer');
    expect(screen.getByTitle('Clear')).toBeInTheDocument();
    expect(screen.getByTitle('Output')).toBeInTheDocument();
  });
});
