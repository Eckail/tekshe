
"use client";

import { useEffect, useRef, useState } from "react";
import type { LearnerAvatarId } from "../data/learnerProfile";
import {
  deleteLearnerAvatar,
  getLearnerAvatar,
  saveLearnerAvatar,
} from "../data/learnerAvatar";
import LearnerAvatar from "./LearnerAvatar";

const MAX_SOURCE_SIZE = 8 * 1024 * 1024;
const OUTPUT_SIZE = 512;
const PREVIEW_SIZE = 192;

function drawAvatarCrop(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  zoom: number,
  offsetX: number,
  offsetY: number
) {
  const shortestSide = Math.min(image.naturalWidth, image.naturalHeight);
  const cropSize = shortestSide / zoom;

  const centerX =
    image.naturalWidth / 2 +
    ((image.naturalWidth - cropSize) * offsetX) / 2;

  const centerY =
    image.naturalHeight / 2 +
    ((image.naturalHeight - cropSize) * offsetY) / 2;

  const sx = Math.max(
    0,
    Math.min(image.naturalWidth - cropSize, centerX - cropSize / 2)
  );

  const sy = Math.max(
    0,
    Math.min(image.naturalHeight - cropSize, centerY - cropSize / 2)
  );

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Суретті өңдеу мүмкін болмады.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    sx,
    sy,
    cropSize,
    cropSize,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

export default function AvatarPhotoEditor({
  avatarId,
  nickname,
}: {
  avatarId: LearnerAvatarId;
  nickname: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    void getLearnerAvatar()
      .then((blob) => {
        if (active) setHasPhoto(Boolean(blob));
      })
      .catch(() => {
        if (active) setMessage("Аватарды оқу мүмкін болмады.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        setIsOpen(false);
        setSourceUrl(null);
        setMessage("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, busy]);

  useEffect(() => {
    if (!sourceUrl || !previewRef.current) return;

    let active = true;
    const image = new window.Image();

    image.onload = () => {
      if (!active || !previewRef.current) return;

      try {
        drawAvatarCrop(image, previewRef.current, zoom, offsetX, offsetY);
      } catch {
        setMessage("Алдын ала көріністі дайындау мүмкін болмады.");
      }
    };

    image.onerror = () => {
      if (active) setMessage("Суретті оқу мүмкін болмады.");
    };

    image.src = sourceUrl;

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [sourceUrl, zoom, offsetX, offsetY]);

  function openEditor() {
    setMessage("");
    setSourceUrl(null);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setIsOpen(true);
  }

  function closeEditor() {
    if (busy) return;

    setIsOpen(false);
    setSourceUrl(null);
    setMessage("");
  }

  function selectFile(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("JPG, PNG немесе WebP форматындағы суретті таңдаңыз.");
      return;
    }

    if (file.size > MAX_SOURCE_SIZE) {
      setMessage("Бастапқы суреттің көлемі 8 MB-тан аспауы керек.");
      return;
    }

    const nextUrl = URL.createObjectURL(file);

    setSourceUrl(nextUrl);
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setMessage("");
  }

  async function handleSave() {
    if (!sourceUrl) return;

    setBusy(true);
    setMessage("");

    try {
      const image = new window.Image();
      image.src = sourceUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;

      drawAvatarCrop(image, canvas, zoom, offsetX, offsetY);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error("Суретті дайындау мүмкін болмады."));
          },
          "image/webp",
          0.86
        );
      });

      await saveLearnerAvatar(blob);

      setHasPhoto(true);
      setSourceUrl(null);
      setIsOpen(false);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Суретті сақтау мүмкін болмады."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setMessage("");

    try {
      await deleteLearnerAvatar();

      setHasPhoto(false);
      setSourceUrl(null);
      setIsOpen(false);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Фото өшірілмеді."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openEditor}
        aria-label="Профиль фотосын өзгерту"
        className="group relative shrink-0 rounded-[22px] text-left outline-none transition duration-200 hover:scale-[1.02] active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-blue/30"
      >
        <LearnerAvatar
          avatarId={avatarId}
          nickname={nickname}
          className="h-16 w-16 rounded-[20px] text-xl shadow-sm ring-2 ring-card"
        />

        <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-blue text-sm font-semibold text-white shadow-sm">
          <span aria-hidden="true">✎</span>
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeEditor();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="avatar-editor-title"
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-[26px] border border-border-soft bg-card p-5 shadow-floating sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-blue-dark">
                  ЖЕКЕ ПРОФИЛЬ
                </p>

                <h2
                  id="avatar-editor-title"
                  className="mt-1 text-xl font-bold tracking-tight text-text-primary"
                >
                  Аватарды өзгерту
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  Фото таңдаңыз және оны өзіңізге ыңғайлап қиыңыз.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={busy}
                aria-label="Жабу"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card-soft text-lg text-text-secondary transition hover:bg-sky/30 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-[30px] bg-sky/25 ring-4 ring-card-soft">
                {sourceUrl ? (
                  <canvas
                    ref={previewRef}
                    width={PREVIEW_SIZE}
                    height={PREVIEW_SIZE}
                    aria-label="Аватарды қию алдын ала көрінісі"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <LearnerAvatar
                    avatarId={avatarId}
                    nickname={nickname}
                    className="h-full w-full rounded-[30px] text-4xl"
                  />
                )}
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => {
                selectFile(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue px-5 text-sm font-semibold text-white transition hover:bg-blue-dark active:scale-[0.97] disabled:opacity-50"
              >
                {sourceUrl ? "Басқа фото таңдау" : "Фото жүктеу"}
              </button>

              {hasPhoto && !sourceUrl && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleDelete()}
                  className="min-h-11 rounded-full px-4 text-sm font-medium text-danger transition hover:bg-danger-bg disabled:opacity-50"
                >
                  Фотоны өшіру
                </button>
              )}
            </div>

            {sourceUrl && (
              <div className="mt-6 space-y-5 border-t border-border-soft pt-5">
                <p className="text-sm font-semibold text-text-primary">
                  Фотоны реттеу
                </p>

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <label htmlFor="avatar-zoom" className="text-text-secondary">
                      Масштаб
                    </label>
                    <span className="tabular-nums text-text-primary">
                      {zoom.toFixed(1)}×
                    </span>
                  </div>

                  <input
                    id="avatar-zoom"
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full accent-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatar-x"
                    className="mb-2 block text-xs text-text-secondary"
                  >
                    Көлденең орналасуы
                  </label>
                  <input
                    id="avatar-x"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={offsetX}
                    onChange={(event) => setOffsetX(Number(event.target.value))}
                    className="w-full accent-blue"
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatar-y"
                    className="mb-2 block text-xs text-text-secondary"
                  >
                    Тік орналасуы
                  </label>
                  <input
                    id="avatar-y"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={offsetY}
                    onChange={(event) => setOffsetY(Number(event.target.value))}
                    className="w-full accent-blue"
                  />
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void handleSave()}
                  className="min-h-12 w-full rounded-full bg-blue px-5 text-sm font-semibold text-white shadow-card transition hover:bg-blue-dark active:scale-[0.99] disabled:opacity-50"
                >
                  {busy ? "Сақталуда..." : "Фотоны сақтау"}
                </button>
              </div>
            )}

            <p
              aria-live="polite"
              role="status"
              className="mt-4 min-h-5 text-center text-xs text-text-secondary"
            >
              {message}
            </p>

            <p className="mt-2 text-center text-[11px] leading-5 text-text-secondary">
              JPG, PNG немесе WebP · Бастапқы фото көлемі 8 MB-тан аспауы керек.
              Фото осы құрылғыда сақталады.
            </p>
          </section>
        </div>
      )}
    </>
  );
}
