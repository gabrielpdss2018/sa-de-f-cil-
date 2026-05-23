import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Cadastro } from './Cadastro';
import { MemoryRouter } from 'react-router';
import { useAuth } from '../context/AuthContext';
import React from 'react';

// Mock useAuth
vi.mock('../context/AuthContext', async () => {
  const actual: any = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Cadastro Page', () => {
  const mockRegister = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      register: mockRegister,
      login: mockLogin,
    });
  });

  it('deve renderizar campos obrigatórios', () => {
    render(
      <MemoryRouter>
        <Cadastro />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Seu nome')).toBeDefined();
    expect(screen.getByPlaceholderText('exemplo@email.com')).toBeDefined();
    expect(screen.getAllByPlaceholderText('••••••')).toHaveLength(2); // Senha e Confirmar Senha
  });

  it('deve mudar campos ao selecionar perfil Clínica (UP)', async () => {
    render(
      <MemoryRouter>
        <Cadastro />
      </MemoryRouter>
    );

    const upButton = screen.getByText('Clínica');
    fireEvent.click(upButton);

    expect(screen.getByPlaceholderText('Ex: Clínica Saúde Total')).toBeDefined();
    expect(screen.getByPlaceholderText('00.000.000/0000-00')).toBeDefined();
  });

  it('deve validar se as senhas coincidem', async () => {
    render(
      <MemoryRouter>
        <Cadastro />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Seu nome'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('exemplo@email.com'), { target: { value: 'test@test.com' } });
    const passwordInputs = screen.getAllByPlaceholderText('••••••');
    fireEvent.change(passwordInputs[0], { target: { value: '123456' } });
    fireEvent.change(passwordInputs[1], { target: { value: '654321' } });

    const submitBtn = screen.getByRole('button', { name: /criar minha conta/i });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(await screen.findByText('As senhas não coincidem')).toBeDefined();
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
