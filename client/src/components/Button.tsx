
// button component props
interface ButtonProps {
  children: any;
  variant?: any;
  size?: any;
  fullWidth?: any;
  className?: any;
  onClick?: any;
  disabled?: any;
}

export function Button(props: ButtonProps) {
  // default values
  let variant = props.variant;
  if (!variant) variant = 'primary';
  
  let size = props.size;
  if (!size) size = 'md';

  let fullWidth = props.fullWidth;
  if (!fullWidth) fullWidth = false;

  let className = props.className;
  if (!className) className = '';

  // base css
  let base = "inline-flex items-center justify-center font-bold rounded-[var(--radius-md)] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2 px-6 py-2.5 text-sm";
  
  let sizeCss = '';
  if (size == 'sm') sizeCss = 'px-4 py-2 text-xs';
  if (size == 'md') sizeCss = 'px-6 py-2.5 text-sm';
  if (size == 'lg') sizeCss = 'px-8 py-3.5 text-base';

  let variantCss = '';
  if (variant == 'primary') variantCss = "bg-[var(--brand-primary)] text-white hover:opacity-95 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]";
  if (variant == 'secondary') variantCss = "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]";
  if (variant == 'danger') variantCss = "bg-[var(--accent-danger)] text-white hover:opacity-90 shadow-[var(--shadow-sm)]";
  if (variant == 'ghost') variantCss = "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5";
  if (variant == 'accent') variantCss = "bg-[var(--brand-accent)] text-[var(--brand-primary)] hover:opacity-95 shadow-[var(--shadow-md)]";

  let fullWidthCss = '';
  if (fullWidth == true) fullWidthCss = 'w-full';

  // final string
  let finalClass = base + " " + sizeCss + " " + variantCss + " " + fullWidthCss + " " + className;

  return (
    <button className={finalClass} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
}
