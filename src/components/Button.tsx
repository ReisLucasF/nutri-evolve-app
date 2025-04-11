
import React from 'react';
import { Button as ShadcnButton } from './ui/button';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary' | 'success';
}

const Button = ({ variant = 'default', className, ...props }: ButtonProps) => {
  // Mapeamento de variantes personalizadas para classes
  const variantClasses = {
    primary: 'bg-nutri-600 hover:bg-nutri-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  // Aplicar classes personalizadas apenas para variantes personalizadas
  const customClass = (variant === 'primary' || variant === 'success') 
    ? cn(variantClasses[variant], className)
    : className;

  // Para variantes padrão, usar a variante normal do ShadcnButton
  const buttonVariant = (variant === 'primary' || variant === 'success') 
    ? 'default' 
    : variant;

  return (
    <ShadcnButton 
      variant={buttonVariant} 
      className={customClass} 
      {...props} 
    />
  );
};

export default Button;
