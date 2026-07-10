document.addEventListener("DOMContentLoaded", function () {
    console.log("Hikaye sistemi yüklendi.");

    // Story narrative content
    const storyPages = [
        {
            date: "14 Ekim 1974",
            reference: "SAĞLIK BAKANLIĞI - GİZLİ GENELGE",
            stamp: "GİZLİDİR",
            bodyClass: "",
            body: `
                <p><strong>Kime:</strong> Dr. Aris (Başhekim, Umut Vadisi Psikiyatri Hastanesi)</p>
                <p><strong>Konu:</strong> Sektör 4'teki Yetkisiz Deneylerin Sonlandırılması</p>
                <br>
                <p>Sayın Dr. Aris,</p>
                <p>Bakanlığımıza ulaşan son teftiş raporları doğrultusunda, hastanenizin bodrum katında bulunan Sektör 4'te yürütülen nörolojik araştırmaların yasal sınırları aştığı tespit edilmiştir. Son üç ayda kayıtlara geçen 12 şüpheli hasta kaybı ve bölgedeki elektromanyetik dalgalanmalar kabul edilemez düzeydedir.</p>
                <p>Bakanlığın kesin emridir: Tüm elektroşok ve kimyasal uyarım deneyleri derhal durdurulacak, Sektör 4 mühürlenecektir. Aksi takdirde hakkınızda vatana ihanet ve insanlık dışı suçlardan soruşturma başlatılacaktır.</p>
                <br>
                <p><em>- Müsteşar K. Demirci</em></p>
            `
        },
        {
            date: "3 Kasım 1974",
            reference: "HEMŞİRE ELENOR'UN GÜNLÜĞÜ (Yırtık Sayfa)",
            stamp: "KAYIP",
            bodyClass: "handwritten-personal",
            body: `
                <p>Tanrım, bize yardım et... Kapıları üzerimize kilitlediler. Dünden beri çığlıklar bir an bile kesilmedi.</p>
                <p>Başhekim Aris artık kendinde değil. Duvarlarla konuşuyor, karanlığın içinden bir ses duyduğunu söylüyor. Bodrum katından o şeyi getirdiklerinden beri tüm hastalar çıldırdı.</p>
                <p>Eğer bir gün bu notu bulursanız... Sakın bizi aramaya kalkmayın. Burası artık bir hastane değil. Burası onların yuvası oldu. Işıklar sönüyor. Geliyorlar...</p>
            `
        },
        {
            date: "Tarih: YOK",
            reference: "DUVARDAKİ KANLI KARALAMALAR",
            stamp: "KORK",
            bodyClass: "handwritten-insane",
            body: `
                <p>O İZLİYOR! O İZLİYOR! O İZLİYOR!</p>
                <p>IŞIKLARI KAPA. IŞIKLAR SÖNDÜĞÜNDE NEFES ALMA.</p>
                <p>KAÇIŞ YOK. KAPILAR KİLİTLİ. RUHLARIMIZ BURAYA AİT.</p>
                <p>YENİ AV GELDİ... SEN GELDİN...</p>
                <p>KURTULAMAYACAKSIN!</p>
            `
        }
    ];

    let currentPage = 0;

    // Create the overlay elements dynamically and inject into body
    const overlayHtml = `
        <div id="story-overlay" class="story-overlay">
            <div id="letter-container" class="letter-container">
                <div class="ink-splatter ink-splatter-1"></div>
                <div class="ink-splatter ink-splatter-2"></div>
                
                <div class="letter-header">
                    <span id="letter-ref">SAĞLIK BAKANLIĞI - GİZLİ GENELGE</span>
                    <span id="letter-date">14 Ekim 1974</span>
                </div>
                
                <div id="letter-body" class="letter-body">
                    <!-- Dynamic content will be injected here -->
                </div>
                
                <div class="letter-footer">
                    <div id="letter-stamp" class="letter-stamp">GİZLİDİR</div>
                    <div class="letter-nav">
                        <button id="btn-prev-letter" class="btn-letter" disabled>Geri</button>
                        <button id="btn-next-letter" class="btn-letter">İleri</button>
                        <button id="btn-skip-letter" class="btn-close-story">Atla</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHtml);

    // Get DOM elements
    const overlay = document.getElementById("story-overlay");
    const container = document.getElementById("letter-container");
    const letterRef = document.getElementById("letter-ref");
    const letterDate = document.getElementById("letter-date");
    const letterBody = document.getElementById("letter-body");
    const letterStamp = document.getElementById("letter-stamp");
    const btnPrev = document.getElementById("btn-prev-letter");
    const btnNext = document.getElementById("btn-next-letter");
    const btnSkip = document.getElementById("btn-skip-letter");

    // Function to render page content with a transition animation
    function renderPage(index) {
        // Add animation class
        container.classList.add("letter-animating");

        // Wait mid-animation to change text (around 300ms)
        setTimeout(() => {
            const page = storyPages[index];
            letterRef.textContent = page.reference;
            letterDate.textContent = page.date;
            letterStamp.textContent = page.stamp;

            // Clean up and set classes
            letterBody.className = "letter-body " + page.bodyClass;
            letterBody.innerHTML = page.body;

            // Update button states
            btnPrev.disabled = index === 0;

            if (index === storyPages.length - 1) {
                btnNext.textContent = "Oyuna Başla";
                btnNext.style.background = "#8b0000";
                btnNext.style.color = "#ffffff";
            } else {
                btnNext.textContent = "İleri";
                btnNext.style.background = "#2a221a";
                btnNext.style.color = "#dfd7c2";
            }
        }, 300);

        // Remove class after animation ends (600ms)
        setTimeout(() => {
            container.classList.remove("letter-animating");
        }, 600);
    }

    // Function to start the story sequence
    function startStory() {
        console.log("Hikaye başlatılıyor...");
        currentPage = 0;
        renderPage(currentPage);
        overlay.classList.add("active");
        playPaperSound();
    }

    // Function to close the story sequence
    function closeStory() {
        // Önce karartma animasyonu ekle
        overlay.style.transition = "opacity 0.4s";
        overlay.style.opacity = "0";

        // 0.4 saniye sonra yönlendir
        setTimeout(() => {
            if (window.gameStartUrl) {
                window.location.href = window.gameStartUrl;
            } else {
                window.location.href = "/Home/Oyun";
            }
        }, 400);
    }

    // Mock paper crinkle sound effect using Web Audio API!
    function playPaperSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            const bufferSize = ctx.sampleRate * 0.15;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            filter.Q.value = 2;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start();
        } catch (e) {
            console.warn("Ses çalınamadı (tarayıcı engellemesi olabilir):", e);
        }
    }

    // Bind click event to "Yeni Oyun" button
    const btnNewGame = document.getElementById("btn-new-game");
    if (btnNewGame) {
        console.log("Yeni Oyun butonu bulundu ve olay dinleyicisi bağlandı.");
        btnNewGame.removeAttribute("onclick"); // Inline onclick varsa kaldırıyoruz
        btnNewGame.addEventListener("click", function (e) {
            e.preventDefault();
            startStory();
        });
    } else {
        // Fallback: arama yöntemi
        console.log("Yeni Oyun ID'li buton bulunamadı, metin araması yapılıyor...");
        const buttons = document.querySelectorAll(".menu-buttons button");
        buttons.forEach(btn => {
            if (btn.textContent.trim().toLowerCase().includes("yeni")) {
                btn.removeAttribute("onclick");
                btn.addEventListener("click", function (e) {
                    e.preventDefault();
                    startStory();
                });
            }
        });
    }

    btnNext.addEventListener("click", function () {
        playPaperSound();

        if (currentPage < storyPages.length - 1) {
            currentPage++;
            renderPage(currentPage);
        } else {
            closeStory();
        }
    });

    btnPrev.addEventListener("click", function () {
        playPaperSound();
        if (currentPage > 0) {
            currentPage--;
            renderPage(currentPage);
        }
    });
    btnSkip.addEventListener("click", function () {
        closeStory();
    });
});
