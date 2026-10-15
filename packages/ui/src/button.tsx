import type { ComponentProps } from 'react'

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary'
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={['ui-button', 'ui-button--' + variant, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}
