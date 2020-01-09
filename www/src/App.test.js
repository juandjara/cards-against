import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders some text', () => {
  const ctx = render(<App />);
  expect(ctx.baseElement.textContent.length).toBeGreaterThan(0)
});
