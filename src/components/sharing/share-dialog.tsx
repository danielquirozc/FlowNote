"use client";
import { useState } from "react";
import { Check, Copy, Globe, Lock } from "lucide-react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types";
export function ShareDialog({
  note,
  pending,
  onChange,
  onClose,
}: {
  note: Note;
  pending: boolean;
  onChange: (enabled: boolean) => Promise<boolean>;
  onClose: () => void;
}) {
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const url =
    note.isPublic && note.shareToken
      ? `${origin}/share/${note.shareToken}`
      : "";
  async function change(enabled: boolean) {
    setError("");
    setCopied(false);
    if (!(await onChange(enabled)))
      setError("No se pudo actualizar el enlace público.");
  }
  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
      title="Compartir nota"
      description="Elige quién puede leer esta nota."
    >
      <fieldset
        disabled={pending}
        className="space-y-2"
        aria-label="Visibilidad de la nota"
      >
        {[
          {
            enabled: false,
            icon: Lock,
            title: "Privada",
            detail: "Solo tú puedes acceder a esta nota.",
          },
          {
            enabled: true,
            icon: Globe,
            title: "Cualquiera con el enlace",
            detail: "Cualquier persona con este enlace podrá ver la nota.",
          },
        ].map(({ enabled, icon: Icon, title, detail }) => (
          <label
            key={title}
            className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-3 has-[:checked]:bg-primary-soft"
          >
            <input
              type="radio"
              name="visibility"
              checked={note.isPublic === enabled}
              onChange={() => void change(enabled)}
              className="mt-1 accent-primary"
            />
            <Icon size={16} className="mt-0.5 shrink-0 text-secondary" />
            <span>
              <span className="block text-xs font-medium">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-secondary">
                {detail}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      {url && (
        <div className="mt-5">
          <label htmlFor="public-url" className="text-xs font-medium">
            Enlace público
          </label>
          <input
            id="public-url"
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
            className="auth-input"
          />
          <Button
            disabled={pending}
            variant="outline"
            className="mt-3 w-full"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setError("");
              } catch {
                setError("No se pudo copiar el enlace.");
              }
            }}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Enlace copiado" : "Copiar enlace"}
          </Button>
          <Button
            disabled={pending}
            variant="ghost"
            className="mt-2 w-full text-red-600"
            onClick={() => void change(false)}
          >
            Desactivar enlace público
          </Button>
        </div>
      )}
      <p role="status" className="mt-3 text-xs text-secondary">
        {pending ? "Actualizando acceso…" : copied ? "Enlace copiado" : ""}
      </p>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </Modal>
  );
}
