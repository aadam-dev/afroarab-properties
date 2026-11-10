export default function Loading() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-forest-950" role="status" aria-live="polite">
      <span className="sr-only">Loading</span>
      <span aria-hidden className="relative block h-px w-40 overflow-hidden bg-white/15">
        <span className="absolute inset-y-0 left-0 w-1/3 bg-[#e3c88c] motion-safe:animate-[aa-load_1.2s_ease-in-out_infinite]" />
      </span>
    </div>
  );
}
