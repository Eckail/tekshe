import { notifyProgressUpdated } from "./xp";

const DATABASE_NAME = "tekshe-profile";
const DATABASE_VERSION = 1;
const STORE_NAME = "avatars";
const AVATAR_KEY = "learner-avatar:v1";

export const LEARNER_AVATAR_UPDATED_EVENT = "tekshe-avatar-updated";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

let databasePromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("Бұл браузер IndexedDB қолдамайды."));
  }

  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      databasePromise = null;
      reject(request.error ?? new Error("Дерекқорды ашу мүмкін болмады."));
    };

    request.onblocked = () => {
      databasePromise = null;
      reject(new Error("Дерекқор басқа терезеде қолданылып жатыр."));
    };
  });

  return databasePromise;
}

function transactionComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();

    transaction.onerror = () => {
      reject(transaction.error ?? new Error("Сақтау қатесі."));
    };

    transaction.onabort = () => {
      reject(transaction.error ?? new Error("Сақтау тоқтатылды."));
    };
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(request.error ?? new Error("Деректі оқу мүмкін болмады."));
    };
  });
}

function notifyAvatarUpdated(): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(LEARNER_AVATAR_UPDATED_EVENT));
  notifyProgressUpdated();

  try {
    const channel = new BroadcastChannel("tekshe-avatar");
    channel.postMessage("updated");
    channel.close();
  } catch {
    // The local event remains available if BroadcastChannel is unsupported.
  }
}

export async function getLearnerAvatar(): Promise<Blob | null> {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readonly");
  const completed = transactionComplete(transaction);

  const result = await requestResult(
    transaction.objectStore(STORE_NAME).get(AVATAR_KEY)
  );

  await completed;

  return result instanceof Blob ? result : null;
}

export async function saveLearnerAvatar(blob: Blob): Promise<void> {
  if (!(blob instanceof Blob)) {
    throw new Error("Сурет файлы дұрыс емес.");
  }

  if (!ALLOWED_TYPES.includes(blob.type)) {
    throw new Error("JPG, PNG немесе WebP форматындағы суретті таңдаңыз.");
  }

  if (blob.size === 0 || blob.size > MAX_AVATAR_SIZE) {
    throw new Error("Суреттің көлемі 2 MB-тан аспауы керек.");
  }

  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  const completed = transactionComplete(transaction);

  transaction.objectStore(STORE_NAME).put(blob, AVATAR_KEY);

  await completed;
  notifyAvatarUpdated();
}

export async function deleteLearnerAvatar(): Promise<void> {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  const completed = transactionComplete(transaction);

  transaction.objectStore(STORE_NAME).delete(AVATAR_KEY);

  await completed;
  notifyAvatarUpdated();
}
