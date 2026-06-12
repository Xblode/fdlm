"use client";

import { useRef, useState } from "react";

type ImageUploadProps = {
  value?: string;
  onChange: (url: string) => void;
};

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Erreur upload");
      }

      onChange(payload.data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Erreur lors de l'upload.",
      );
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="font-display text-sm uppercase">Image</label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="rounded-full border-2 border-brand-black bg-white px-4 py-2 font-display text-sm uppercase shadow-[2px_2px_0_0_#0a0a0a] disabled:opacity-50"
        >
          {isUploading ? "Envoi..." : "Choisir une image"}
        </button>
        {value ? (
          <img
            src={value}
            alt=""
            className="h-16 w-16 rounded-xl border-2 border-brand-black object-cover"
          />
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
