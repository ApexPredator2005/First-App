// ============================================================================
// ResQNow Sound & Icon Morph Manager (Web Audio API Engine)
// Provides instant, royalty-free audio effects and icon state morphing
// ============================================================================

export const CATEGORY_CONFIG = {
  hospital: {
    label: "Hospitals",
    defaultIcon: "🏥",
    activeIcon: "🩺",
    soundType: "ambulance"
  },
  police: {
    label: "Police",
    defaultIcon: "🚓",
    activeIcon: "🚨",
    soundType: "police"
  },
  fire_station: {
    label: "Fire Stations",
    defaultIcon: "🚒",
    activeIcon: "🔥",
    soundType: "fire"
  },
  pharmacy: {
    label: "Pharmacies",
    defaultIcon: "💊",
    activeIcon: "🩹",
    soundType: "pharmacy"
  },
  veterinary_care: {
    label: "Vet Clinics",
    defaultIcon: "🐾",
    activeIcon: "🐱",
    soundType: "vet"
  },
  blood_bank: {
    label: "Blood Banks",
    defaultIcon: "🩸",
    activeIcon: "💉",
    soundType: "blood"
  }
};

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem("RESQNOW_MUTED") === "true";
    this.activeOscillators = [];
    this.revertTimers = {};
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("RESQNOW_MUTED", this.isMuted ? "true" : "false");
    return this.isMuted;
  }

  stopAllSounds() {
    this.activeOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch (e) {}
    });
    this.activeOscillators = [];
  }

  playSound(category) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.audioCtx) return;

    this.stopAllSounds();
    const now = this.audioCtx.currentTime;
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.65, now); // Clear, crisp volume level
    masterGain.connect(this.audioCtx.destination);

    const config = CATEGORY_CONFIG[category];
    const type = config ? config.soundType : "hospital";

    try {
      switch (type) {
        case "ambulance": { // Clear Two-Tone Ambulance Siren (0.8s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(750, now);
          osc.frequency.setValueAtTime(950, now + 0.35);
          osc.frequency.setValueAtTime(750, now + 0.6);
          
          masterGain.gain.setValueAtTime(0.65, now);
          masterGain.gain.setValueAtTime(0.65, now + 0.7);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.8);
          
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.8);
          this.activeOscillators.push(osc);
          break;
        }
        case "police": { // High-Pitch Police Siren Whoop (0.6s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.exponentialRampToValueAtTime(1400, now + 0.5);

          masterGain.gain.setValueAtTime(0.55, now);
          masterGain.gain.setValueAtTime(0.55, now + 0.5);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.6);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.6);
          this.activeOscillators.push(osc);
          break;
        }
        case "fire": { // Dual-Tone Fire Engine Horn (0.75s)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          osc1.type = "sawtooth";
          osc2.type = "triangle";
          
          osc1.frequency.setValueAtTime(420, now);
          osc2.frequency.setValueAtTime(840, now);
          osc1.frequency.linearRampToValueAtTime(560, now + 0.65);
          osc2.frequency.linearRampToValueAtTime(1120, now + 0.65);

          masterGain.gain.setValueAtTime(0.5, now);
          masterGain.gain.setValueAtTime(0.5, now + 0.65);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.75);

          osc1.connect(masterGain);
          osc2.connect(masterGain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.75);
          osc2.stop(now + 0.75);
          this.activeOscillators.push(osc1, osc2);
          break;
        }
        case "pharmacy": { // Bright Chemist Counter Bell Ring (0.5s)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";

          osc1.frequency.setValueAtTime(1760, now); // A6
          osc2.frequency.setValueAtTime(2637, now); // E7 harmonic

          masterGain.gain.setValueAtTime(0.65, now);
          masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

          osc1.connect(masterGain);
          osc2.connect(masterGain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.5);
          osc2.stop(now + 0.5);
          this.activeOscillators.push(osc1, osc2);
          break;
        }
        case "vet": { // Playful Cat Meow Synth (0.55s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(1250, now + 0.25);
          osc.frequency.linearRampToValueAtTime(550, now + 0.5);

          masterGain.gain.setValueAtTime(0.55, now);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.55);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.55);
          this.activeOscillators.push(osc);
          break;
        }
        case "blood": { // Crisp Heartbeat ECG Double Beep (0.45s)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";
          
          osc1.frequency.setValueAtTime(1050, now);
          osc2.frequency.setValueAtTime(1050, now + 0.16);

          masterGain.gain.setValueAtTime(0.6, now);
          masterGain.gain.setValueAtTime(0.01, now + 0.12);
          masterGain.gain.setValueAtTime(0.6, now + 0.16);
          masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);

          osc1.connect(masterGain);
          osc2.connect(masterGain);
          osc1.start(now);
          osc1.stop(now + 0.14);
          osc2.start(now + 0.16);
          osc2.stop(now + 0.42);
          this.activeOscillators.push(osc1, osc2);
          break;
        }
      }
    } catch (err) {
      console.warn("Audio playback error:", err);
    }
  }

  triggerIconMorph(buttonEl, category) {
    if (!buttonEl) return;
    const iconSpan = buttonEl.querySelector(".pill-icon");
    if (!iconSpan) return;

    const config = CATEGORY_CONFIG[category];
    if (!config) return;

    // Clear existing revert timer for this category
    if (this.revertTimers[category]) {
      clearTimeout(this.revertTimers[category]);
    }

    // Force animation reflow so rapid clicks always re-trigger 3D morph
    iconSpan.classList.remove("icon-morphing");
    void iconSpan.offsetWidth;
    iconSpan.classList.add("icon-morphing");
    
    // Swap icon content at the peak of the 3D spin morph (250ms)
    setTimeout(() => {
      iconSpan.textContent = config.activeIcon;
    }, 250);

    setTimeout(() => {
      iconSpan.classList.remove("icon-morphing");
    }, 550);

    // Schedule automatic revert back to default icon after 2.5 seconds
    this.revertTimers[category] = setTimeout(() => {
      this.revertIcon(buttonEl, category);
    }, 2500);
  }

  revertIcon(buttonEl, category) {
    if (!buttonEl) return;
    const iconSpan = buttonEl.querySelector(".pill-icon");
    if (!iconSpan) return;

    const config = CATEGORY_CONFIG[category];
    if (!config) return;

    iconSpan.classList.remove("icon-morphing");
    void iconSpan.offsetWidth;
    iconSpan.classList.add("icon-morphing");

    setTimeout(() => {
      iconSpan.textContent = config.defaultIcon;
    }, 250);

    setTimeout(() => {
      iconSpan.classList.remove("icon-morphing");
    }, 550);
  }

  revertAllIcons() {
    Object.keys(CATEGORY_CONFIG).forEach(cat => {
      const btn = document.querySelector(`.pill[data-category="${cat}"]`);
      if (btn) this.revertIcon(btn, cat);
    });
  }
}

export const soundManager = new SoundManager();
