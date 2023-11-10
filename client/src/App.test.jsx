import { render, screen } from '@testing-library/react';
import App from './App';


// TODO: This test will always fail. Let's replace it with something that actually passes.
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
