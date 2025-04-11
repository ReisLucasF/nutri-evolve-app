
import React from 'react';
import { Button as ShadcnButton } from './ui/button';
import { cn } from '../lib/utils';

// Create a new type that includes our custom variants
type CustomVariant = 'primary' | 'success';
type CombinedVariant = Parameters<typeof ShadcnButton>[0]['variant'] | CustomVariant;

interface ButtonProps extends Omit<React.ComponentProps<typeof ShadcnButton>, 'variant'> {
  variant?: CombinedVariant;
}

const Button = ({ variant = 'default', className, ...props }: ButtonProps) => {
  // Mapeamento de variantes personalizadas para classes
  const variantClasses: Record<CustomVariant, string> = {
    primary: 'bg-nutri-600 hover:bg-nutri-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  // Aplicar classes personalizadas apenas para variantes personalizadas
  const customClass = (variant === 'primary' || variant === 'success') 
    ? cn(variantClasses[variant as CustomVariant], className)
    : className;

  // Para variantes padrão, usar a variante normal do ShadcnButton
  const buttonVariant = (variant === 'primary' || variant === 'success') 
    ? 'default' 
    : variant;

  return (
    <ShadcnButton 
      variant={buttonVariant as any} 
      className={customClass} 
      {...props} 
    />
  );
};

export default Button;
