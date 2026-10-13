import { isValidElement, useState, type ComponentPropsWithRef, type ComponentType, type ReactElement } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'secondary-destructive' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg';

type ButtonBaseProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactElement | ComponentType<{ className?: string }>;
  loading?: boolean;
  fullWidth?: boolean;
};

export type ButtonProps = ButtonBaseProps & (
  | { shape?: 'base' }
  | ({ shape: 'square' | 'circle' } & (
    | { 'aria-label': string }
    | { 'aria-labelledby': string }
  ))
);

export function Button({
  children,
  className,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  shape = 'base',
  size = 'base',
  variant = 'secondary',
  type = 'button',
  onKeyDown,
  onKeyUp,
  onBlur,
  ...props
}: ButtonProps) {
  const [keyboardPressed, setKeyboardPressed] = useState(false);
  const isDisabled = disabled || loading;
  const icon = Icon && (isValidElement(Icon) ? Icon : <Icon className="local-button__icon" />);

  return (
    <button
      {...props}
      type={type}
      className={['local-button', className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-full-width={fullWidth || undefined}
      data-pressed={(keyboardPressed && !isDisabled) || undefined}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && !isDisabled && (event.key === ' ' || event.key === 'Enter')) {
          setKeyboardPressed(true);
        }
      }}
      onKeyUp={(event) => {
        if (event.key === ' ' || event.key === 'Enter') setKeyboardPressed(false);
        onKeyUp?.(event);
      }}
      onBlur={(event) => {
        setKeyboardPressed(false);
        onBlur?.(event);
      }}
    >
      {loading ? <span className="local-button__spinner" aria-hidden="true" /> : (
        icon && <span className="local-button__icon" aria-hidden="true">{icon}</span>
      )}
      {children}
    </button>
  );
}
