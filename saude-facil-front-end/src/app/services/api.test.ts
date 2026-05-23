import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import axios from 'axios';

vi.mock('axios', async () => {
  const actual: any = await vi.importActual('axios');
  return {
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn() },
        },
        defaults: { baseURL: 'http://localhost:3001' },
        headers: { common: {} },
        post: vi.fn(),
        get: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
      })),
    },
  };
});

describe('API Service', () => {
  it('deve ter a baseURL correta', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:3001');
  });

  it('deve adicionar token de autorização se existir no localStorage', async () => {
    // Como o api.ts já foi importado, o interceptor já foi registrado.
    // Vamos testar se o interceptor configurado faz o que esperamos.
    
    const mockConfig = { headers: {} as any };
    localStorage.setItem('@SaudeFacil:token', 'fake-token');
    
    // Recuperar o interceptor de request (o primeiro registrado)
    const interceptor = (api.interceptors.request.use as any).mock.calls[0][0];
    const result = interceptor(mockConfig);
    
    expect(result.headers.Authorization).toBe('Bearer fake-token');
  });
});
