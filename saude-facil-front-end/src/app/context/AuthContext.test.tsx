import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import api from '../services/api';
import React from 'react';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-name">{user?.name || 'Guest'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve iniciar sem usuário', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-name').textContent).toBe('Guest');
  });

  it('deve carregar usuário do localStorage se existir', () => {
    const mockUser = { id: '1', name: 'User Test', role: 'UC' };
    localStorage.setItem('@SaudeFacil:user', JSON.stringify(mockUser));
    localStorage.setItem('@SaudeFacil:token', 'fake-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-name').textContent).toBe('User Test');
  });

  it('deve realizar login com sucesso', async () => {
    const mockUser = { id: '1', name: 'LoggedIn User', role: 'UC' };
    (api.post as any).mockResolvedValue({ data: { user: mockUser, token: 'token123' } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginBtn = screen.getByText('Login');
    await act(async () => {
      loginBtn.click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('LoggedIn User');
    expect(localStorage.getItem('@SaudeFacil:token')).toBe('token123');
  });
});
