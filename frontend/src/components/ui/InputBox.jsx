import { forwardRef } from "react";

const defaultPlaceholder =
  "Begin where you are — a few lines or a longer passage. There is no wrong length.";

/**
 * Large, calm textarea — rounded-2xl, soft border and shadow.
 */
export const InputBox = forwardRef(function InputBox(
  {
    id,
    label,
    hint,
    value,
    onChange,
    rows = 10,
    placeholder = defaultPlaceholder,
    disabled = false,
    className = "",
    ...rest
  },
  ref
) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="font-display text-[1.125rem] font-normal tracking-tight text-ink"
        >
          {label}
        </label>
      )}
      {hint && (
        <p
          className={`text-sm font-light leading-relaxed text-mist ${label ? "mt-2" : ""}`}
        >
          {hint}
        </p>
      )}
      <textarea
        ref={ref}
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-6 w-full resize-y rounded-2xl border border-lavender-200/80 bg-white/90 px-5 py-[1.125rem] font-sans text-[0.9375rem] font-light leading-[1.65] text-ink shadow-soft ring-1 ring-white/80 placeholder:text-mist/50 placeholder:font-light placeholder:not-italic focus:border-lavender-400/90 focus:outline-none focus:ring-2 focus:ring-lavender-300/30 disabled:opacity-55"
        {...rest}
      />
    </div>
  );
});
