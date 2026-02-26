interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center max-w-[720px]">
        <h1 className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This section will be built in the next step.
        </p>
      </div>
    </div>
  );
}
