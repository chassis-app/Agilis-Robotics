import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  required?: boolean
  error?: string
  maxChars?: number
  currentLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, error, maxChars, currentLength, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'px-3 py-2 rounded-md border text-sm transition-colors duration-150 resize-y min-h-[80px]',
            'bg-white text-neutral-700 placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
            error ? 'border-danger-500' : 'border-neutral-300',
            className,
          )}
          {...props}
        />
        <div className="flex justify-between">
          {error && <p className="text-xs text-danger-500">{error}</p>}
          {maxChars && (
            <p className={cn('text-xs ml-auto', (currentLength ?? 0) > maxChars ? 'text-danger-500' : 'text-neutral-400')}>
              {currentLength ?? 0}/{maxChars}
            </p>
          )}
        </div>
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
