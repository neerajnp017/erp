import { Button } from "@/components/ui/button";

export function PageHeader({ title, description, action }: { title: string; description: string; action?: string }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-normal sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-base text-muted-foreground">{description}</p>
      </div>
      {action ? <Button className="w-full sm:w-auto">{action}</Button> : null}
    </div>
  );
}
