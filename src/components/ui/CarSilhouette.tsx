export function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M15,96
             Q18,68 55,58
             Q95,50 105,50
             Q118,18 155,14
             Q200,8 245,14
             Q282,18 295,50
             Q305,50 345,58
             Q382,68 385,96
             L345,96
             C325,72 300,72 280,96
             L120,96
             C100,72 75,72 55,96
             Z"
        />
        <path d="M138,51 Q145,40 160,38" strokeWidth="3.5" />
      </g>
    </svg>
  );
}
