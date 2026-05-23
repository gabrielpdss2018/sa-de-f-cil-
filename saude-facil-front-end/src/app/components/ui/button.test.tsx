import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';
import React from 'react';

describe('Button component', () => {
  it('deve renderizar o texto corretamente', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeDefined();
  });

  it('deve aceitar a variante destructive', () => {
    render(<Button variant="destructive">Deletar</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-destructive');
  });

  it('deve chamar o onClick quando clicado', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByText('Click me');
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
