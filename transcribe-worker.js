// Transformers.js is Apache-2.0; the Whisper model is MIT licensed.
// Public code/model downloads are the only network activity. Audio stays here.
const LIBRARY_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";
const MODEL = "Xenova/whisper-tiny";
const SAMPLE_RATE = 16000;
let pipelinePromise = null;
let busy = false;
let currentId = null;
let lastDownloadNotice = 0;

function progress(value, force = false) {
  const now = performance.now();
  if (!force && now - lastDownloadNotice < 150) return;
  lastDownloadNotice = now;
  self.postMessage({ type: "progress", id: currentId, progress: value });
}

async function loadTranscriber() {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      const { pipeline, env } = await import(LIBRARY_URL);
      env.allowLocalModels = false;
      env.useBrowserCache = true;
      // A single WASM thread works without cross-origin isolation headers.
      env.backends.onnx.wasm.numThreads = 1;
      return pipeline("automatic-speech-recognition", MODEL, {
        device: "wasm",
        dtype: "q8",
        progress_callback(event) {
          if (event.status === "progress") {
            progress({
              phase: "download",
              message: "Downloading the speech model for this device…",
              file: event.file,
              loaded: event.loaded,
              total: event.total,
              progress: Number.isFinite(event.progress) ? event.progress : undefined,
            });
          } else if (event.status === "ready") {
            progress({ phase: "ready", message: "Speech model ready." }, true);
          }
        },
      });
    })();
  }
  return pipelinePromise;
}

function toCues(chunks, duration) {
  const rows = Array.isArray(chunks) ? chunks : [];
  return rows.flatMap((chunk, index) => {
    const text = String(chunk.text || "").trim();
    const start = chunk.timestamp?.[0];
    const nextStart = rows[index + 1]?.timestamp?.[0];
    const rawEnd = chunk.timestamp?.[1] ?? nextStart ?? duration;
    if (!text || !Number.isFinite(start) || !Number.isFinite(rawEnd)) return [];
    const begin = Math.max(0, Math.min(start, duration));
    const end = Math.max(begin, Math.min(rawEnd, duration));
    return end > begin ? [{ start: begin, end, text }] : [];
  });
}

self.onmessage = async ({ data }) => {
  if (data?.type !== "transcribe") return;
  if (busy) {
    self.postMessage({ type: "error", id: data.id, message: "A transcription is already running." });
    return;
  }
  busy = true;
  currentId = data.id;
  try {
    if (!(data.audio instanceof Float32Array) || !data.audio.length) throw new Error("No audio was supplied.");
    const duration = data.audio.length / SAMPLE_RATE;
    const transcriber = await loadTranscriber();
    progress({ phase: "transcribing", message: "Transcribing on this device. This can take a few minutes…" }, true);
    const options = {
      task: "transcribe",
      return_timestamps: true,
      chunk_length_s: 30,
      stride_length_s: 5,
      max_new_tokens: 224,
      num_beams: 1,
      do_sample: false,
    };
    if (data.language === "en") options.language = "english";
    const output = await transcriber(data.audio, options);
    const text = String(output?.text || "").trim();
    if (!text) throw new Error("No words were detected. Try a clearer vocal recording, or add lyrics from the library.");
    const cues = toCues(output.chunks, duration);
    progress({ phase: "complete", message: "Transcription ready. Review the words and timing." }, true);
    self.postMessage({ type: "result", id: data.id, result: { text, cues, model: MODEL, language: data.language || "auto" } });
  } catch (error) {
    pipelinePromise = null;
    const detail = String(error?.message || error).slice(0,350);
    self.postMessage({ type: "error", id: data.id, message: `Local transcription failed: ${detail}. Check the model download connection or use lyrics from the library.` });
  } finally {
    busy = false;
    currentId = null;
  }
};
