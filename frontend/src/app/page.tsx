"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="flex flex-col sm:flex-row gap-6">
        <Button
          variant="default"
          size="lg"
          className="text-2xl py-8 px-12 w-full sm:w-auto"
          onClick={() => router.push("/dashboard/kanban")}
        >
          Kanban
        </Button>
        <Button
          variant="default"
          size="lg"
          className="text-2xl py-8 px-12 w-full sm:w-auto"
          onClick={() => router.push("/dashboard/tasks")}
        >
          Tasks
        </Button>
      </div>
    </div>
  );
}
