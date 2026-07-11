// menu-effects.js - Korku Atmosferi Efektleri ve Web Audio API Synth Sentezleyici
class HorrorSoundscape {
    constructor() {
        this.ctx = null;
        this.isInitialized = false;
        this.isPlaying = false;
        
        // Düğümler (Nodes)
        this.masterGain = null;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.droneFilter = null;
        this.droneGain = null;
        
        this.windNoise = null;
        this.windFilter = null;
        this.windLfo = null;
        this.windLfoGain = null;
        this.windGain = null;
        
        this.heartbeatTimer = null;
        this.ambientMelodyTimer = null;
    }

    init() {
        if (this.isInitialized) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Başlangıçta sessiz
            this.masterGain.connect(this.ctx.destination);
            
            // 1. Derin Atmosferik Uğultu (Low Drone & Binaural Beats)
            // Korkuyu fiziksel olarak hissettirmek için birbirine çok yakın iki frekans (45Hz ve 45.6Hz) kullanıyoruz.
            this.droneFilter = this.ctx.createBiquadFilter();
            this.droneFilter.type = 'lowpass';
            this.droneFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
            
            this.droneOsc1 = this.ctx.createOscillator();
            this.droneOsc1.type = 'sawtooth';
            this.droneOsc1.frequency.setValueAtTime(45, this.ctx.currentTime); // 45 Hz sub-bass
            
            this.droneOsc2 = this.ctx.createOscillator();
            this.droneOsc2.type = 'sine';
            this.droneOsc2.frequency.setValueAtTime(45.6, this.ctx.currentTime); // 45.6 Hz (binaural dalgalanma yaratır)
            
            this.droneGain = this.ctx.createGain();
            this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
            
            this.droneOsc1.connect(this.droneGain);
            this.droneOsc2.connect(this.droneGain);
            this.droneGain.connect(this.droneFilter);
            this.droneFilter.connect(this.masterGain);
            
            this.droneOsc1.start();
            this.droneOsc2.start();
            
            // 2. Rüzgar Uğultusu (White Noise + LFO Modulated Bandpass Filter)
            this.setupWind();
            
            this.isInitialized = true;
            console.log("Korku ses sentezleyici başarıyla başlatıldı.");
        } catch (e) {
            console.error("Ses sentezleyici başlatılamadı:", e);
        }
    }
    
    setupWind() {
        // Beyaz gürültü tamponu oluşturma
        const bufferSize = this.ctx.sampleRate * 2; // 2 saniyelik gürültü döngüsü
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        this.windNoise = this.ctx.createBufferSource();
        this.windNoise.buffer = noiseBuffer;
        this.windNoise.loop = true;
        
        this.windFilter = this.ctx.createBiquadFilter();
        this.windFilter.type = 'bandpass';
        this.windFilter.Q.setValueAtTime(3.0, this.ctx.currentTime); // Filtre keskinliği
        this.windFilter.frequency.setValueAtTime(350, this.ctx.currentTime);
        
        this.windGain = this.ctx.createGain();
        this.windGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        
        // Rüzgarın şiddetini simüle etmek için filtre frekansını çok yavaş kontrol eden LFO
        this.windLfo = this.ctx.createOscillator();
        this.windLfo.type = 'sine';
        this.windLfo.frequency.setValueAtTime(0.07, this.ctx.currentTime); // Çok yavaş periyot (~14 saniye)
        
        this.windLfoGain = this.ctx.createGain();
        this.windLfoGain.gain.setValueAtTime(220, this.ctx.currentTime); // Frekans salınım aralığı +/- 220Hz
        
        this.windLfo.connect(this.windLfoGain);
        this.windLfoGain.connect(this.windFilter.frequency);
        
        this.windNoise.connect(this.windFilter);
        this.windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        
        this.windNoise.start();
        this.windLfo.start();
    }
    
    start() {
        if (!this.isInitialized) this.init();
        if (this.isPlaying) return;
        
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        // Ana sesi 4 saniyede yavaşça yükselt (fade-in)
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.75, this.ctx.currentTime + 4.0);
        
        // Kalp atışı ve ürkütücü melodi döngülerini başlat
        this.isPlaying = true;
        this.startHeartbeatLoop();
        this.startCreepyMelodyLoop();
        
        console.log("Korku atmosferi müzikleri çalıyor...");
    }
    
    stop() {
        if (!this.isPlaying) return;
        
        // Ses kapatılırken yavaşça azalt (fade-out)
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 1.2);
        
        // Döngü zamanlayıcılarını temizle
        clearInterval(this.heartbeatTimer);
        clearTimeout(this.ambientMelodyTimer);
        
        setTimeout(() => {
            if (this.ctx && !this.isPlaying) {
                this.ctx.suspend();
            }
        }, 1200);
        
        this.isPlaying = false;
        console.log("Korku atmosferi sesi durduruldu.");
    }
    
    playHeartbeat() {
        const now = this.ctx.currentTime;
        
        const triggerBeat = (delay) => {
            const beatOsc = this.ctx.createOscillator();
            const beatGain = this.ctx.createGain();
            
            beatOsc.type = 'sine';
            // 75Hz'den başlayıp 20Hz'e hızlıca kayan sub-bass vuruşu
            beatOsc.frequency.setValueAtTime(75, now + delay);
            beatOsc.frequency.exponentialRampToValueAtTime(15, now + delay + 0.16);
            
            beatGain.gain.setValueAtTime(0.001, now + delay);
            beatGain.gain.linearRampToValueAtTime(0.75, now + delay + 0.02);
            beatGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.18);
            
            beatOsc.connect(beatGain);
            beatGain.connect(this.masterGain);
            
            beatOsc.start(now + delay);
            beatOsc.stop(now + delay + 0.22);
        };
        
        // Klasik çift kalp atışı vuruşu (Güm güm... Güm güm...)
        triggerBeat(0.0);
        triggerBeat(0.28);
        
        // Kalp atışına göre ekrandaki kırmızı kararma efektini tetikle
        if (typeof triggerVisualPulse === 'function') {
            triggerVisualPulse();
        }
    }
    
    startHeartbeatLoop() {
        // Her 2 saniyede bir çift kalp atışı vuruşu yap
        this.heartbeatTimer = setInterval(() => {
            if (this.isPlaying) this.playHeartbeat();
        }, 2000);
    }
    
    playCreepyNote() {
        if (!this.isPlaying) return;
        
        const now = this.ctx.currentTime;
        
        // Ürkütücü müzik kutusu notaları (Aykırı tritonlar ve yarım sesler - dissonant intervals)
        // E5, F5, Bb5, B5, C6 vb. korku temalarında sıkça kullanılır
        const scaryNotes = [523.25, 739.99, 659.25, 698.46, 830.61, 880.00, 932.33, 440.00, 311.13];
        const randomFreq = scaryNotes[Math.floor(Math.random() * scaryNotes.length)];
        
        // Metalik, uzak bir piyano veya müzik kutusu sesi tınısı (Triangle + Echo Delay)
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        // Yankı (Delay) efekti
        const delay = this.ctx.createDelay();
        delay.delayTime.setValueAtTime(0.45, now);
        
        const delayGain = this.ctx.createGain();
        delayGain.gain.setValueAtTime(0.35, now); // Geri besleme (feedback)
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(randomFreq, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        
        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(0.12, now + 0.04); // Hızlı saldırı (attack)
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // Uzun sönümleme (decay)
        
        osc.connect(filter);
        filter.connect(oscGain);
        
        // Hem doğrudan çıkışa hem de yankı hattına bağlan
        oscGain.connect(this.masterGain);
        
        oscGain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(delay); // Yankıyı kendi üzerine bağlayarak sonsuz fısıltı yarat
        delayGain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 2.8);
        
        // Rastgele 3 ile 6 saniye arasında bir sonraki tekil sesi planla
        const nextTime = 3000 + Math.random() * 3500;
        this.ambientMelodyTimer = setTimeout(() => this.playCreepyNote(), nextTime);
    }
    
    startCreepyMelodyLoop() {
        this.ambientMelodyTimer = setTimeout(() => this.playCreepyNote(), 1200);
    }
    
    playGhostScream() {
        if (!this.isPlaying) return;
        const now = this.ctx.currentTime;
        
        // Hayaletin ani fısıltısı veya metal kazıma sesi
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(120, now + 1.4); // Frekansı hızlıca aşağı kaydırıyoruz
        
        // Titreme efekti (vibrato) için LFO modülasyonu
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(28, now); // 28Hz titreme
        vibratoGain.gain.setValueAtTime(70, now); // Salınım genişliği
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 1.4);
        
        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(0.07, now + 0.15); // Yumuşak beliriş
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3); // Hızlı yok oluş
        
        vibrato.start(now);
        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.masterGain);
        
        osc.start(now);
        vibrato.stop(now + 1.5);
        osc.stop(now + 1.5);
    }
}

// Global ses nesnesi
const soundscape = new HorrorSoundscape();

// Ekranın kalp atışıyla ritmik olarak kızarıp kararması (Visual Vignette Pulse)
function triggerVisualPulse() {
    const vignette = document.querySelector('.vignette');
    if (vignette) {
        // Birinci kalp atışı (Güm)
        vignette.classList.add('pulse-active');
        setTimeout(() => {
            vignette.classList.remove('pulse-active');
        }, 280);
        
        // İkinci kalp atışı (güm)
        setTimeout(() => {
            vignette.classList.add('pulse-active-subtle');
            setTimeout(() => {
                vignette.classList.remove('pulse-active-subtle');
            }, 240);
        }, 260);
    }
}

// Belirli aralıklarla korkunç gölge veya kızıl gözlerin belirmesi
function startGhostEffects() {
    setInterval(() => {
        if (!soundscape.isPlaying) return;
        
        // %35 şansla ekranda korkunç bir halüsinasyon tetiklenir
        if (Math.random() < 0.35) {
            triggerGhostHallucination();
        }
    }, 13000); // Her 13 saniyede bir kontrol et
}

function triggerGhostHallucination() {
    soundscape.playGhostScream();
    
    const body = document.body;
    const ghostType = Math.random() < 0.5 ? 'eyes' : 'shadow';
    const ghostElement = document.createElement('div');
    
    if (ghostType === 'eyes') {
        ghostElement.className = 'creepy-eyes-jumpscare';
        // Menü sol tarafta olduğu için ekranın orta-sağ bölgesinde rastgele konumlandırıyoruz
        const x = 50 + Math.random() * 40; // %50 ile %90 arası (X)
        const y = 15 + Math.random() * 65; // %15 ile %80 arası (Y)
        ghostElement.style.left = `${x}%`;
        ghostElement.style.top = `${y}%`;
        ghostElement.innerHTML = `
            <div class="eye eye-left"></div>
            <div class="eye eye-right"></div>
        `;
    } else {
        ghostElement.className = 'creepy-shadow-jumpscare';
        const x = 40 + Math.random() * 45; // %40 ile %85 arası
        const y = 10 + Math.random() * 60;
        ghostElement.style.left = `${x}%`;
        ghostElement.style.top = `${y}%`;
    }
    
    body.appendChild(ghostElement);
    
    // Aktifleştir ve yumuşak geçiş yap
    setTimeout(() => {
        ghostElement.classList.add('active');
    }, 50);
    
    // 2.2 saniye sonra kaldır
    setTimeout(() => {
        ghostElement.classList.remove('active');
        setTimeout(() => {
            ghostElement.remove();
        }, 1000);
    }, 2200);
}

// Tarayıcı kısıtlamalarını aşmak için kullanıcının ilk etkileşiminde sesi başlat (ve her zaman açık tut)
function initAudioOnFirstClick() {
    const startAudio = () => {
        soundscape.start();
        document.removeEventListener('click', startAudio);
        document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
}

// Butonların üzerine gelindiğinde ince bir fısıltı / metal gıcırtısı sesi çıkart
function setupButtonWhispers() {
    const buttons = document.querySelectorAll('.menu-buttons button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (soundscape.isPlaying && soundscape.ctx) {
                playButtonHoverWhisper();
            }
        });
    });
}

function playButtonHoverWhisper() {
    const now = soundscape.ctx.currentTime;
    const osc = soundscape.ctx.createOscillator();
    const gain = soundscape.ctx.createGain();
    const filter = soundscape.ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.35); // Pes fısıltı
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(soundscape.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.4);
}

// Sayfa yüklendiğinde çalışacak ana kısım
document.addEventListener('DOMContentLoaded', () => {
    initAudioOnFirstClick();
    startGhostEffects();
    setupButtonWhispers();
});
