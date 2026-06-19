import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const TestComponent = () => {
  const { user, token } = useAuth();
  return (
    <div>
      <span data-testid="user-role">{user ? user.role : 'none'}</span>
      <span data-testid="token">{token ? 'has-token' : 'no-token'}</span>
    </div>
  );
};

describe('AuthContext', () => {
  it('initializes with no user', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByTestId('user-role')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('no-token');
  });

  // Mocking API and testing login flow could be added here
});
