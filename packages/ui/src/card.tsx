import type { ComponentProps } from 'react'

export type CardProps = ComponentProps<'section'> & {
  title: string
  description?: string
}

export function Card({
  title,
  description,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <section
      className={['ui-card', className].filter(Boolean).join(' ')}
      {...props}
    >
      <h2>{title}</h2>
      {description && <p className="ui-card-description">{description}</p>}
      {children}
    </section>
  )
}
