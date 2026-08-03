// ============================================================================
// ResQNow Sound & Icon Morph Manager (Web Audio API Engine)
// Provides instant, royalty-free audio effects and icon state morphing
// ============================================================================

export const CATEGORY_CONFIG = {
  hospital: {
    label: "Hospitals",
    defaultIcon: "🏥",
    activeIcon: "👨‍⚕️",
    soundType: "ambulance"
  },
  police: {
    label: "Police",
    defaultIcon: "🚓",
    activeIcon: "⛓️",
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
    activeIcon: "🧰",
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
    masterGain.gain.setValueAtTime(0.55, now);
    masterGain.connect(this.audioCtx.destination);

    const config = CATEGORY_CONFIG[category];
    const type = config ? config.soundType : "hospital";

    try {
      switch (type) {
        case "ambulance": { // Short Ambulance Siren Wail (0.75s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(700, now);
          osc.frequency.linearRampToValueAtTime(950, now + 0.35);
          osc.frequency.linearRampToValueAtTime(700, now + 0.7);
          
          masterGain.gain.setValueAtTime(0.55, now);
          masterGain.gain.setValueAtTime(0.55, now + 0.65);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.75);
          
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.75);
          this.activeOscillators.push(osc);
          break;
        }
        case "police": { // Short Police Siren Whoop Sweep (0.55s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(1350, now + 0.45);

          masterGain.gain.setValueAtTime(0.45, now);
          masterGain.gain.setValueAtTime(0.45, now + 0.45);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.55);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.55);
          this.activeOscillators.push(osc);
          break;
        }
        case "fire": { // Short Fire Truck Siren (0.75s)
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          osc1.type = "sawtooth";
          osc2.type = "triangle";
          
          osc1.frequency.setValueAtTime(400, now);
          osc2.frequency.setValueAtTime(800, now);
          osc1.frequency.linearRampToValueAtTime(540, now + 0.65);
          osc2.frequency.linearRampToValueAtTime(1080, now + 0.65);

          masterGain.gain.setValueAtTime(0.45, now);
          masterGain.gain.setValueAtTime(0.45, now + 0.65);
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
        case "pharmacy": { // Soft Chemist Counter Bell Chime (0.4s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1760, now); // A6 bell note

          masterGain.gain.setValueAtTime(0.35, now);
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.4);
          this.activeOscillators.push(osc);
          break;
        }
        case "vet": { // Single Cat Meow Synth (0.5s)
          const osc = this.audioCtx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(650, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.22);
          osc.frequency.linearRampToValueAtTime(550, now + 0.48);

          masterGain.gain.setValueAtTime(0.45, now);
          masterGain.gain.linearRampToValueAtTime(0.01, now + 0.5);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.5);
          this.activeOscillators.push(osc);
          break;
        }
        case "blood": { // Soft Single Heartbeat Monitor Beep (0.35s - Non-irritating)
          const osc = this.audioCtx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, now); // Soft A5 ECG beep
          
          masterGain.gain.setValueAtTime(0.22, now); // Low, non-irritating gain
          masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.35);
          this.activeOscillators.push(osc);
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
