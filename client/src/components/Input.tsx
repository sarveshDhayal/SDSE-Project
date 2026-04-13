
// input props
interface InputProps {
  label?: any;
  error?: any;
  icon?: any;
  className?: any;
  value?: any;
  onChange?: any;
  type?: any;
  placeholder?: any;
  required?: any;
  step?: any;
  // add more later
}

export function Input(props: InputProps) {
  // class string
  let inputClass = "w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-md)] pr-4 py-2.5 text-[var(--text-primary)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent)]/10 placeholder:text-[var(--text-muted)]";
  
  if (props.icon != null) {
      inputClass = inputClass + " pl-10";
  } else {
      inputClass = inputClass + " pl-3";
  }

  if (props.error != null) {
      inputClass = inputClass + " border-[var(--accent-danger)]";
  }

  if (props.className != null) {
      inputClass = inputClass + " " + props.className;
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* input label */}
      {props.label ? (
        <label className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">{props.label}</label>
      ) : null}
      
      <div className="relative">
        {/* render icon if there is one */}
        {props.icon ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]">{props.icon}</div>
        ) : null}
        
        {/* the actual input */}
        <input
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          required={props.required}
          step={props.step}
          className={inputClass}
        />
      </div>

      {/* show error */}
      {props.error ? (
        <span className="text-xs text-red-400">{props.error}</span>
      ) : null}
    </div>
  );
}
