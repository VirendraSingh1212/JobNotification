import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center max-w-[720px]">
        <h1 className="text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
