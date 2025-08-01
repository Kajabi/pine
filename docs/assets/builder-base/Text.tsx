import React from 'react';
import { PdsText } from '@pine-ds/react';

interface TextProps {
  children: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'code' | 'pre' | 'strong' | 'em';
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  weight?: 'extra-light' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'start' | 'center' | 'end' | 'justify';
  color?: string;
  decoration?: 'strikethrough' | 'underline-dotted';
  gutter?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs';
  italic?: boolean;
  truncate?: boolean;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  tag = 'p',
  size,
  weight,
  align,
  color,
  decoration,
  gutter,
  italic = false,
  truncate = false,
  className = ''
}) => {
  return (
    <PdsText
      tag={tag}
      size={size}
      weight={weight}
      align={align}
      color={color}
      decoration={decoration}
      gutter={gutter}
      italic={italic}
      truncate={truncate}
      className={className}
    >
      {children}
    </PdsText>
  );
};
