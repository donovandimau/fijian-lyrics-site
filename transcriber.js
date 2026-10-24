// Local-only ASR controller. Audio is copied before transferring it to the worker.
const MAX_SECONDS = 15 * 60;
const SAMPLE_RATE = 16000;

function abortError() {
  return new DOMException("Transcription cancelled.", "AbortError");
}

export function createTranscriber({ onProgress } = {}) {
  let worker = null;
  let active = null;
  let nextId = 0;
  let disposed = false;

  function stopWorker() {
    worker?.terminate();
    worker = null;
  }

  function report(job, progress) {
    for (const callback of new Set([onProgress, job.onProgress])) {
      if (typeof callback === "function") {
        try { callback(progress); } catch { /* UI callbacks cannot interrupt the job. */ }
      }
    }
  }

  function fail(error) {
    const job = active;
    active = null;
    stopWorker();
    job?.reject(error);
  }

  function ensureWorker() {
    if (worker) return;
    worker = new Worker(new URL("./transcribe-worker.js", import.meta.url), {
      type: "module",
      name: "sere-local-transcription",
    });
    worker.onmessage = ({ data }) => {
      const job = active;
      if (!job || data?.id !== job.id) return;
      if (data.type === "progress") {
        report(job, data.progress);
      } else if (data.type === "result") {
        active = null;
        job.resolve(data.result);
      } else if (data.type === "error") {
        fail(new Error(data.message || "Local transcription failed. Please try again."));
      }
    };
    worker.onerror = (event) => {
      event.preventDefault();
      fail(new Error("Local transcription could not start. Check your connection for the first model download, then try again."));
    };
    worker.onmessageerror = () => fail(new Error("The browser could not read the transcription result. Please try again."));
  }

  return {
    transcribe(audio, { language = "auto", onProgress: jobProgress } = {}) {
      if (disposed) return Promise.reject(new Error("This transcriber has been closed."));
      if (active) return Promise.reject(new Error("A transcription is already running. Cancel it before starting another."));
      if (!(audio instanceof Float32Array) || !audio.length) {
        return Promise.reject(new Error("Choose an audio recording before transcribing."));
      }
      if (audio.length > SAMPLE_RATE * MAX_SECONDS) {
        return Promise.reject(new Error("Local transcription supports recordings up to 15 minutes. Trim this recording first, or add lyrics manually."));
      }
      if (!["auto", "en"].includes(language)) {
        return Promise.reject(new Error("Choose automatic language detection or English."));
      }
      for (let i = 0; i < audio.length; i++) {
        if (!Number.isFinite(audio[i])) return Promise.reject(new Error("This recording could not be decoded. Try another audio file."));
      }
      return new Promise((resolve, reject) => {
        const job = { id: ++nextId, resolve, reject, onProgress: jobProgress };
        active = job;
        try {
          ensureWorker();
          const copy = new Float32Array(audio);
          report(job, { phase: "loading", message: "Preparing local transcription…" });
          worker.postMessage({ type: "transcribe", id: job.id, audio: copy, language }, [copy.buffer]);
        } catch (error) {
          fail(new Error(`Local transcription could not start: ${error.message}`));
        }
      });
    },
    cancel() {
      const job = active;
      active = null;
      stopWorker();
      job?.reject(abortError());
    },
    dispose() {
      disposed = true;
      const job = active;
      active = null;
      stopWorker();
      job?.reject(abortError());
    },
  };
}
