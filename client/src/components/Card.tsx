
// card interface
interface CardProps {
  children: any;
  className: any;
  onClick?: any; // optional - not all cards need a click handler
}

// card component
export function Card(props: CardProps) {
  // check if classname exists
  let cname = "";
  if (props.className != undefined) {
    cname = props.className;
  }

  // return the div
  return (
    <div
      onClick={props.onClick}
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-md)] ${cname}`}
    >
      {/* card content goes here */}
      {props.children}
    </div>
  );
}
