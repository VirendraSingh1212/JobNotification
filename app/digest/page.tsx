import { Mail } from "lucide-react";

export default function DigestPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
      <div className="max-w-6xl">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          Digest
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your daily 9AM summary of matched opportunities.
        </p>

        {/* Empty State */}
        <div className="mt-16 flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-border rounded-lg bg-card">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Daily digest coming soon
          </h3>
          <p className="text-muted-foreground max-w-md">
            Once you configure your preferences, you will receive a personalized daily summary of matching job opportunities delivered to your inbox at 9AM.
          </p>
        </div>
      </div>
    </div>
  );
}
