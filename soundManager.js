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
    masterGain.gain.setValueAtTime(0.35, now); // Moderate 35% volume
    masterGain.connect(this.audioCtx.destination);

    const config = CATEGORY_CONFIG[category];
    const type = config ? config.soundType : "hospital";

    try {
      switch (type) {
        case "ambulance": { // Two-tone siren wail (0.7s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.linearRampToValueAtTime(900, now + 0.35);
          osc.frequency.linearRampToValueAtTime(650, now + 0.7);
          
          masterGain.gain.setValueAtTime(0.35, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
          
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.75);
          this.activeOscillators.push(osc);
          break;
        }
        case "police": { // Rapid police siren whoop (0.5s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(1300, now + 0.45);

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 1800;

          masterGain.gain.setValueAtTime(0.3, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc.connect(filter);
          filter.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.5);
          this.activeOscillators.push(osc);
          break;
        }
        case "fire": { // Fire truck air horn siren (0.75s)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          osc1.type = "sawtooth";
          osc2.type = "square";
          
          osc1.frequency.setValueAtTime(380, now);
          osc2.frequency.setValueAtTime(760, now);
          osc1.frequency.linearRampToValueAtTime(520, now + 0.7);
          osc2.frequency.linearRampToValueAtTime(1040, now + 0.7);

          masterGain.gain.setValueAtTime(0.28, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

          osc1.connect(masterGain);
          osc2.connect(masterGain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.75);
          osc2.stop(now + 0.75);
          this.activeOscillators.push(osc1, osc2);
          break;
        }
        case "pharmacy": { // Counter bell crystal chime (0.45s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1760, now); // A6 bell note
          
          masterGain.gain.setValueAtTime(0.38, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.45);
          this.activeOscillators.push(osc);
          break;
        }
        case "vet": { // Cute cat meow pitch synth (0.5s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(680, now);
          osc.frequency.linearRampToValueAtTime(1150, now + 0.25);
          osc.frequency.linearRampToValueAtTime(550, now + 0.5);

          masterGain.gain.setValueAtTime(0.32, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.52);
          this.activeOscillators.push(osc);
          break;
        }
        case "blood": { // Heartbeat ECG monitor double beep (0.4s)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";
          
          osc1.frequency.setValueAtTime(950, now);
          osc2.frequency.setValueAtTime(950, now + 0.18);

          masterGain.gain.setValueAtTime(0.35, now);
          masterGain.gain.setValueAtTime(0.001, now + 0.12);
          masterGain.gain.setValueAtTime(0.35, now + 0.18);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

          osc1.connect(masterGain);
          osc2.connect(masterGain);
          osc1.start(now);
          osc1.stop(now + 0.14);
          osc2.start(now + 0.18);
          osc2.stop(now + 0.4);
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

    // Apply morph animation class
    iconSpan.classList.add("icon-morphing");
    
    // Swap icon content halfway through crossfade (200ms)
    setTimeout(() => {
      iconSpan.textContent = config.activeIcon;
    }, 200);

    setTimeout(() => {
      iconSpan.classList.remove("icon-morphing");
    }, 450);

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

    iconSpan.classList.add("icon-morphing");
    setTimeout(() => {
      iconSpan.textContent = config.defaultIcon;
    }, 200);
    setTimeout(() => {
      iconSpan.classList.remove("icon-morphing");
    }, 450);
  }

  revertAllIcons() {
    Object.keys(CATEGORY_CONFIG).forEach(cat => {
      const btn = document.querySelector(`.pill[data-category="${cat}"]`);
      if (btn) this.revertIcon(btn, cat);
    });
  }
}

export const soundManager = new SoundManager();
