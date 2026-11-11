import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/60 py-4 px-6 text-xs text-muted-foreground">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">FarmGrid</span>
          <span>•</span>
          <span>Agricultural Resource Coordination Under Scarcity</span>
        </div>
        <div className="text-[11px] text-muted-foreground/80">
          Prototype / Hackathon Demo • Built with deterministic, conflict-free scheduling rules
        </div>
      </div>
    </footer>
  );
};
