/**
 * Web Speech API wrapper for Text-to-Speech
 * Supports sentence-by-sentence chunking with callback hooks for highlighting.
 */

// Split text into an array of sentences
export const splitIntoSentences = (text) => {
  if (!text) return [];
  return text
    .replace(/([.!?])\s+/g, '$1|||')
    .split('|||')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

// Create a speech utterance with all parameters applied
export const createUtterance = ({ text, rate = 1.0, pitch = 1.0, voice = null, lang = 'en-IN' }) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.lang = lang;
  if (voice) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.name === voice);
    if (selectedVoice) utterance.voice = selectedVoice;
  }
  return utterance;
};

// Get all available voices, filtering to English variants
export const getAvailableVoices = () => {
  return window.speechSynthesis.getVoices().filter(
    (v) => v.lang.startsWith('en') || v.lang.startsWith('hi')
  );
};

// The main TTS controller class
export class TTSController {
  constructor({ onSentenceStart, onSentenceEnd, onComplete, onError }) {
    this.sentences = [];
    this.currentIndex = 0;
    this.isPaused = false;
    this.isSpeaking = false;
    this.onSentenceStart = onSentenceStart || (() => {});
    this.onSentenceEnd = onSentenceEnd || (() => {});
    this.onComplete = onComplete || (() => {});
    this.onError = onError || (() => {});
    this.settings = { rate: 1.0, pitch: 1.0, voice: null };
  }

  load(text, settings = {}) {
    this.stop();
    this.sentences = splitIntoSentences(text);
    this.currentIndex = 0;
    this.settings = { ...this.settings, ...settings };
  }

  speak() {
    if (!window.speechSynthesis) {
      this.onError('Speech synthesis is not supported in this browser.');
      return;
    }
    if (this.isSpeaking) return;
    this.isSpeaking = true;
    this.isPaused = false;
    this._speakNext();
  }

  _speakNext() {
    if (this.currentIndex >= this.sentences.length) {
      this.isSpeaking = false;
      this.onComplete();
      return;
    }

    const sentence = this.sentences[this.currentIndex];
    const utterance = createUtterance({
      text: sentence,
      rate: this.settings.rate,
      pitch: this.settings.pitch,
      voice: this.settings.voice
    });

    utterance.onstart = () => {
      this.onSentenceStart(this.currentIndex, sentence);
    };

    utterance.onend = () => {
      this.onSentenceEnd(this.currentIndex, sentence);
      this.currentIndex++;
      if (!this.isPaused) {
        this._speakNext();
      }
    };

    utterance.onerror = (e) => {
      this.onError(e.error || 'Speech synthesis error');
      this.isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }

  pause() {
    if (window.speechSynthesis.speaking) {
      this.isPaused = true;
      this.isSpeaking = false;
      window.speechSynthesis.pause();
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.isSpeaking = true;
      window.speechSynthesis.resume();
      // Resume works differently cross-browser; restart from current sentence
      this._speakNext();
    }
  }

  stop() {
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentIndex = 0;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  jumpTo(index) {
    this.stop();
    this.currentIndex = index;
    this.speak();
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
  }
}
