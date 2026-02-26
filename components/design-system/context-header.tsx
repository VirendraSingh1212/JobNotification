interface ContextHeaderProps {
  headline: string;
  subtext: string;
}

export function ContextHeader({ headline, subtext }: ContextHeaderProps) {
  return (
    <div className="py-10 px-6 lg:px-10 border-b border-border">
      <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
        {headline}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-[720px]">
        {subtext}
      </p>
    </div>
  );
}
