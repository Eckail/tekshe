import { createProgressStore } from "./progressStore";
import { notifyProgressUpdated } from "./xp";

export const APP_SETTINGS_STORAGE_KEY = "tekshe-app-settings:v1";

export const APP_LANGUAGES = ["kk", "ru", "en", "zh"] as const;
export type AppLanguage = (typeof APP_LANGUAGES)[number];

export type AppSettings = {
  version: 1;
  appLanguage: AppLanguage;
  nativeLanguage: AppLanguage;
  showPinyin: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  streakWarningEnabled: boolean;
  coinNotificationsEnabled: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  version: 1,
  appLanguage: "kk",
  nativeLanguage: "kk",
  showPinyin: true,
  soundEffects: true,
  hapticFeedback: true,
  dailyReminderEnabled: false,
  dailyReminderTime: "19:00",
  streakWarningEnabled: true,
  coinNotificationsEnabled: true,
};

function isLanguage(value: unknown): value is AppLanguage {
  return APP_LANGUAGES.some((item) => item === value);
}

function isTime(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  );
}

export function normalizeAppSettings(value: unknown): AppSettings | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<AppSettings>;

  if (
    candidate.version !== 1 ||
    !isLanguage(candidate.appLanguage) ||
    !isLanguage(candidate.nativeLanguage) ||
    typeof candidate.showPinyin !== "boolean" ||
    typeof candidate.soundEffects !== "boolean" ||
    typeof candidate.hapticFeedback !== "boolean" ||
    typeof candidate.dailyReminderEnabled !== "boolean" ||
    !isTime(candidate.dailyReminderTime) ||
    typeof candidate.streakWarningEnabled !== "boolean" ||
    typeof candidate.coinNotificationsEnabled !== "boolean"
  ) {
    return null;
  }

  return {
    version: 1,
    appLanguage: candidate.appLanguage,
    nativeLanguage: candidate.nativeLanguage,
    showPinyin: candidate.showPinyin,
    soundEffects: candidate.soundEffects,
    hapticFeedback: candidate.hapticFeedback,
    dailyReminderEnabled: candidate.dailyReminderEnabled,
    dailyReminderTime: candidate.dailyReminderTime,
    streakWarningEnabled: candidate.streakWarningEnabled,
    coinNotificationsEnabled: candidate.coinNotificationsEnabled,
  };
}

function getStorage() {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readAppSettings(): AppSettings {
  const storage = getStorage();
  if (!storage) return { ...DEFAULT_APP_SETTINGS };

  try {
    const raw = storage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_APP_SETTINGS };

    return (
      normalizeAppSettings(JSON.parse(raw)) ?? {
        ...DEFAULT_APP_SETTINGS,
      }
    );
  } catch {
    return { ...DEFAULT_APP_SETTINGS };
  }
}

export function saveAppSettings(value: unknown): boolean {
  const settings = normalizeAppSettings(value);
  const storage = getStorage();

  if (!settings || !storage) return false;

  try {
    storage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notifyProgressUpdated();
    return true;
  } catch {
    return false;
  }
}

export function updateAppSettings(
  patch: Partial<Omit<AppSettings, "version">>
): boolean {
  return saveAppSettings({
    ...readAppSettings(),
    ...patch,
    version: 1,
  });
}

export const appSettingsStore = createProgressStore(
  readAppSettings,
  DEFAULT_APP_SETTINGS
);
