"use client";

export function AnonymityToggle({
  anonymous,
  onChange,
}: {
  anonymous: boolean;
  onChange: (anonymous: boolean) => void;
}) {
  return (
    <div className="mt-3 inline-flex rounded-full border border-ink-950/12 bg-white p-1 text-xs font-semibold">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          !anonymous ? "bg-ink-950 text-paper-100" : "text-ink-950/50"
        }`}
      >
        Attribute this to me
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          anonymous ? "bg-ink-950 text-paper-100" : "text-ink-950/50"
        }`}
      >
        Keep me anonymous
      </button>
    </div>
  );
}
