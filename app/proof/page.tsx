export default function ProofPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
      <div className="max-w-6xl">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          Proof
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Artifact collection and verification workspace.
        </p>

        {/* Placeholder Content */}
        <div className="mt-10 p-10 border border-dashed border-border rounded-lg bg-card text-center">
          <p className="text-muted-foreground">
            This workspace will contain collected artifacts and verification materials.
          </p>
        </div>
      </div>
    </div>
  );
}
