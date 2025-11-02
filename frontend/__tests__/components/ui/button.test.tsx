import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('deve renderizar botão com texto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('deve aplicar variant default', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('bg-primary');
  });

  it('deve aplicar variant destructive', () => {
    render(<Button variant='destructive'>Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('deve aplicar variant outline', () => {
    render(<Button variant='outline'>Outline</Button>);
    const button = screen.getByText('Outline');
    expect(button).toHaveClass('border');
  });

  it('deve aplicar size small', () => {
    render(<Button size='sm'>Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('h-8');
  });

  it('deve aplicar size large', () => {
    render(<Button size='lg'>Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('h-10');
  });

  it('deve estar desabilitado quando disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('deve aceitar className customizado', () => {
    render(<Button className='custom-class'>Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });
});
