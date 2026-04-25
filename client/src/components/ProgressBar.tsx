
interface ProgressBarProps { 
  progress: any; // number
  label?: any; // string - optional
  sublabel?: any; // string - optional
  isWarn?: boolean;
  isDanger?: boolean;
}

export const ProgressBar = (props: ProgressBarProps) => {
  // console.log("progress is " + props.progress);
  
  let clamped = props.progress;
  if (clamped > 100) {
    clamped = 100;
  }

  // check danger/warn states
  let isDanger = false;
  if (props.progress >= 100) {
    isDanger = true;
  }
  
  let isWarn = false;
  if (props.progress >= 75 && props.progress < 100) {
    isWarn = true;
  }

  let color = "";
  if (isDanger == true) {
    color = "from-[var(--accent-danger)] to-red-600";
  } else if (isWarn == true) {
    color = "from-[var(--brand-accent)] to-orange-500";
  } else {
    color = "from-[var(--brand-primary)] to-[var(--brand-accent)]";
  }

  return (
    <div className="w-full space-y-1.5">
      {/* text labels */}
      {(props.label || props.sublabel) ? (
        <div className="flex justify-between items-center text-[10px]">
          {props.label ? <span className="font-bold text-[var(--text-secondary)] uppercase tracking-wider">{props.label}</span> : null}
          {props.sublabel ? (
            <span className={`font-bold ${isDanger ? 'text-[var(--accent-danger)]' : isWarn ? 'text-[var(--accent-warning)]' : 'text-[var(--accent-primary)]'}`}>{props.sublabel}</span>
          ) : null}
        </div>
      ) : null}
      
      {/* progress bar wrap */}
      <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
        {/* actual bar */}
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
