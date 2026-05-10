export function LoadingState({ title = "Loading" }: { title?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-lg font-semibold">{title}</p>
      </div>
    </div>
  );
}
