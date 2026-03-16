/* ============================================
   Digital Zen — What's Your Night Mode?
   Quiz engine: transitions, staggered reveals
   ============================================ */

(function () {
  'use strict';

  // ---- Archetype definitions (4 core + 6 hybrids) ----
  var archetypes = {
    precision: {
      key: 'architect',
      name: 'The Architect',
      freqTag: 'Your night mode: Precision',
      freq: 85,
      rarity: 'Only 14% of people get this result.',
      body: [
        'You don\u2019t react. You set the conditions. By the time the night starts, you\u2019ve already decided how it ends.',
        'Every detail is a decision. The playlist. The setup. The exact moment you decide to shut the world out. Other people call it overthinking. You call it the baseline. You don\u2019t do \u201Cgood enough\u201D because good enough is just a different word for settling.'
      ],
      insight: 'You built this. Down to the last detail.'
    },
    stillness: {
      key: 'ghost',
      name: 'The Ghost',
      freqTag: 'Your night mode: Subtracted',
      freq: 60,
      rarity: 'Only 11% of people get this result.',
      body: [
        'You don\u2019t chase the moment. You strip everything away until it shows up on its own.',
        'While everyone else is adding \u2014 more noise, more stimulation, more everything \u2014 you\u2019ve figured out that the best version of your night is the one with the least in it. That\u2019s not emptiness. That\u2019s refinement. You\u2019ve learned that silence has weight, and the right kind of nothing is the hardest thing to build.'
      ],
      insight: 'The less there is, the more it matters.'
    },
    kinetic: {
      key: 'circuit',
      name: 'The Circuit',
      freqTag: 'Your night mode: Restless',
      freq: 92,
      rarity: 'Only 18% of people get this result.',
      body: [
        'You don\u2019t wind down. You change direction.',
        'The energy doesn\u2019t leave when the day ends \u2014 it redirects. Into the drive. Into the walk. Into the thing you can\u2019t name that only happens when you\u2019re moving. People confuse this with restlessness. It\u2019s not. It\u2019s a different kind of focus \u2014 one that only unlocks when your body stops sitting still.'
      ],
      insight: 'You don\u2019t stop. You shift gears.'
    },
    generative: {
      key: 'twam',
      name: 'The 2AM',
      freqTag: 'Your night mode: Generative',
      freq: 74,
      rarity: 'Only 9% of people get this result.',
      body: [
        'Your best work happens when nobody\u2019s watching. Not because it\u2019s secret \u2014 because the audience is the thing that gets in the way.',
        'Between midnight and sunrise, something changes. The pressure to perform disappears. What\u2019s left is just you and the thing you\u2019re making. The sketch. The beat. The idea that won\u2019t let you sleep until it exists. You don\u2019t set an alarm for this. It sets its own schedule.'
      ],
      insight: 'Nobody asked for it. That\u2019s why it\u2019s good.'
    },
    'precision+stillness': {
      key: 'minimalist',
      name: 'The Minimalist',
      freqTag: 'Your night mode: Refined',
      freq: 78,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'You\u2019ve eliminated everything that doesn\u2019t earn its place. Your ritual is the intersection of control and stillness \u2014 a space so refined it practically hums.'
      ],
      insight: 'You don\u2019t add. You subtract until it\u2019s perfect.'
    },
    'precision+kinetic': {
      key: 'operator',
      name: 'The Operator',
      freqTag: 'Your night mode: Calculated',
      freq: 82,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'Controlled chaos. Nothing random about it. You move with purpose, even when there\u2019s no destination. Every unplanned moment was, in its own way, engineered.'
      ],
      insight: 'You planned not to plan. And it worked.'
    },
    'precision+generative': {
      key: 'engineer',
      name: 'The Night Engineer',
      freqTag: 'Your night mode: Exacting',
      freq: 80,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'You build things at hours that don\u2019t exist. Precision meets creation \u2014 everything you make carries the mark of someone who cares about tolerances nobody else will notice.'
      ],
      insight: 'It\u2019s not done until it\u2019s right. And \u201Cright\u201D has nothing to do with morning.'
    },
    'stillness+kinetic': {
      key: 'phantom',
      name: 'The Phantom',
      freqTag: 'Your night mode: Contradictory',
      freq: 70,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'Moving through silence. Both at the same time. You crave stillness but your body won\u2019t cooperate. Your ritual is finding the eye of the hurricane \u2014 motion around you, quiet within.'
      ],
      insight: 'You don\u2019t sit with silence. You chase it until it stops running.'
    },
    'stillness+generative': {
      key: 'builder',
      name: 'The Quiet Builder',
      freqTag: 'Your night mode: Meditative',
      freq: 66,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'No audience. No deadline. No problem. You make things in silence \u2014 just the thing and your attention. Your ritual is the meditative repetition of hands doing what they know.'
      ],
      insight: 'The quiet isn\u2019t the absence of noise. It\u2019s the presence of focus.'
    },
    'kinetic+generative': {
      key: 'nocturnal',
      name: 'The Nocturnal',
      freqTag: 'Your night mode: Untamed',
      freq: 88,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'Sleep is a suggestion. Making things is the priority. You\u2019re the person who starts a project at midnight and surfaces four hours later having made something real. Your ritual is productive chaos with a purpose.'
      ],
      insight: 'You don\u2019t have a bedtime. You have a creative window.'
    }
  };

  // ---- Bridge lines per archetype (curiosity copy for KORFYR block) ----
  var bridgeLines = {
    architect: 'You set the conditions before the night starts. Someone else designed something with that same precision.',
    ghost: 'You stripped everything down to what matters. We did the same thing.',
    circuit: 'You don\u2019t stop moving. We made something for people who shift gears, not wind down.',
    twam: 'You make things at hours that don\u2019t exist. So did we.',
    minimalist: 'You subtract until only the essential remains. We kept only what matters.',
    operator: 'Controlled chaos. Engineered spontaneity. We created something for that exact frequency.',
    engineer: 'Precision at hours nobody\u2019s watching. We made something with the same tolerances.',
    phantom: 'Motion and silence at the same time. We made something for the contradiction.',
    builder: 'No audience. No deadline. Just the thing and your attention. We work the same way.',
    nocturnal: 'You surface at 4 AM having made something real. So did we.'
  };

  var urlKeyMap = {
    architect: 'precision',
    ghost: 'stillness',
    circuit: 'kinetic',
    twam: 'generative',
    minimalist: 'precision+stillness',
    operator: 'precision+kinetic',
    engineer: 'precision+generative',
    phantom: 'stillness+kinetic',
    builder: 'stillness+generative',
    nocturnal: 'kinetic+generative'
  };

  // ---- State ----
  var traits = { precision: 0, stillness: 0, kinetic: 0, generative: 0 };
  var screenOrder = ['intro', 'q1', 'q2', 'q3', 'q4', 'analyzing', 'result'];
  var currentScreen = 0;
  var currentArchKey = null;
  var transitioning = false;
  var quizProgress = 0;
  var particleProfile = null;
  var analyzingActive = false;
  var quizColor = null;        // choice-reactive color during quiz
  var bursts = [];             // click-point particle bursts
  var answerHistory = [];      // tracks {trait, screenIndex} for back navigation
  var referredFrom = null;     // friend's archetype key if arrived via ?r= link
  var particleProfiles = {
    architect: { speed: 0.7, r: 170, g: 185, b: 210, o: 0.15 },
    ghost:     { speed: 0.2, r: 200, g: 200, b: 200, o: 0.04 },
    circuit:   { speed: 1.5, r: 232, g: 93,  b: 58,  o: 0.18 },
    twam:      { speed: 0.5, r: 200, g: 160, b: 40,  o: 0.14 },
    minimalist:{ speed: 0.3, r: 210, g: 210, b: 210, o: 0.06 },
    operator:  { speed: 1.1, r: 100, g: 130, b: 220, o: 0.14 },
    engineer:  { speed: 0.6, r: 80,  g: 130, b: 200, o: 0.12 },
    phantom:   { speed: 0.9, r: 150, g: 100, b: 190, o: 0.13 },
    builder:   { speed: 0.35,r: 165, g: 130, b: 85,  o: 0.10 },
    nocturnal: { speed: 1.4, r: 230, g: 45,  b: 45,  o: 0.22 }
  };
  // Trait → color mapping for choice-reactive particles
  var traitColors = {
    precision:  { r: 170, g: 185, b: 210 },
    stillness:  { r: 160, g: 170, b: 185 },
    kinetic:    { r: 220, g: 75,  b: 40  },
    generative: { r: 200, g: 160, b: 40  }
  };

  function getQuizColor() {
    var total = 0;
    var keys = Object.keys(traits);
    keys.forEach(function (k) { total += traits[k]; });
    if (!total) return null;
    var r = 0, g = 0, b = 0;
    keys.forEach(function (k) {
      var w = traits[k] / total;
      r += traitColors[k].r * w;
      g += traitColors[k].g * w;
      b += traitColors[k].b * w;
    });
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  }

  function spawnBurst(clientX, clientY) {
    for (var i = 0; i < 8; i++) {
      var angle = (Math.PI * 2 / 8) * i + (Math.random() - 0.5) * 0.5;
      bursts.push({
        x: clientX,
        y: clientY,
        dx: Math.cos(angle) * (1.5 + Math.random() * 2),
        dy: Math.sin(angle) * (1.5 + Math.random() * 2),
        r: 1.5 + Math.random(),
        life: 1,
        decay: 0.015 + Math.random() * 0.01
      });
    }
  }

  // ---- DOM ----
  var quiz = document.getElementById('quiz');
  var startBtn = document.getElementById('startBtn');
  var splashBtn = document.getElementById('splashBtn');
  var resultArchetype = document.getElementById('resultArchetype');
  var resultFreqTag = document.getElementById('resultFreqTag');
  var resultBody = document.getElementById('resultBody');
  var resultInsight = document.getElementById('resultInsight');
  var resultFreq = document.getElementById('resultFreq');
  var resultRarity = document.getElementById('resultRarity');
  var shareBtn = document.getElementById('shareBtn');
  var copiedMsg = document.getElementById('copiedMsg');
  var captureForm = document.getElementById('captureForm');
  var captureEmail = document.getElementById('captureEmail');
  var captureConsent = document.getElementById('captureConsent');
  var captureError = document.getElementById('captureError');
  var captureSuccess = document.getElementById('captureSuccess');

  // ---- Screen transitions ----
  function transitionTo(index) {
    if (transitioning) return;
    transitioning = true;

    var currentEl = quiz.querySelector('.screen.active');
    var name = screenOrder[index];
    var nextEl = quiz.querySelector('[data-screen="' + name + '"]');
    if (!nextEl) { transitioning = false; return; }

    // Stop ambient system when leaving result/splash/analyzing (unless going to result)
    var currentName = currentEl ? currentEl.getAttribute('data-screen') : '';
    if ((currentName === 'result' || currentName === 'splash' || currentName === 'analyzing') && name !== 'result' && name !== 'analyzing' && window._ambientSystem) {
      window._ambientSystem.stop();
    }

    // Fade out current
    if (currentEl) {
      currentEl.classList.add('fade-out');
    }

    setTimeout(function () {
      // Hide current
      if (currentEl) {
        currentEl.classList.remove('active', 'fade-out');
      }

      // Prepare next
      nextEl.classList.add('fade-in');
      nextEl.classList.add('active');

      // Force reflow then animate in
      void nextEl.offsetHeight;

      window.scrollTo({ top: 0, behavior: 'instant' });
      currentScreen = index;
      transitioning = false;

      // Cinematic analyzing interstitial — 3 clean phases
      if (name === 'analyzing') {
        analyzingActive = true;
        var archKey = getResult();
        renderResult(archKey);
        var arch = archetypes[archKey];

        // Start ambient at low intensity during analysis
        if (window._ambientSystem) {
          window._ambientSystem.start(archKey, false);
          window._ambientSystem.setIntensity(0.3);
        }

        var analyzingScreen = quiz.querySelector('[data-screen="analyzing"]');
        var phaseScan = document.getElementById('azPhaseScan');
        var phaseTraits = document.getElementById('azPhaseTraits');
        var phaseLock = document.getElementById('azPhaseLock');
        var pctEl = document.getElementById('azPct');
        var barFill = document.getElementById('azBarFill');
        var statusEl = document.getElementById('azStatus');
        var traitGrid = document.getElementById('azTraitGrid');
        var lockName = document.getElementById('azLockName');

        // Reset all phases
        [phaseScan, phaseTraits, phaseLock].forEach(function (p) { p.classList.remove('active'); });
        analyzingScreen.classList.remove('az-flash', 'az-scanning');
        traitGrid.innerHTML = '';
        pctEl.textContent = '0';
        barFill.style.width = '0%';
        statusEl.textContent = 'Reading frequency';

        // ── Phase 1: Percentage counter (0-2s) ──
        phaseScan.classList.add('active');
        analyzingScreen.classList.add('az-scanning');
        var pctTarget = 100;
        var pctStart = performance.now();
        var pctDuration = 1800;
        var statusTexts = ['Reading frequency', 'Mapping traits', 'Matching pattern'];

        function animatePct(now) {
          var elapsed = now - pctStart;
          var progress = Math.min(elapsed / pctDuration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          var val = Math.round(eased * pctTarget);
          pctEl.textContent = val;
          barFill.style.width = val + '%';
          // Update status text at milestones
          if (val >= 66) statusEl.textContent = statusTexts[2];
          else if (val >= 33) statusEl.textContent = statusTexts[1];
          if (progress < 1) requestAnimationFrame(animatePct);
        }
        requestAnimationFrame(animatePct);

        // ── Phase 2: Trait readout (2s-3.5s) ──
        setTimeout(function () {
          phaseScan.classList.remove('active');
          analyzingScreen.classList.remove('az-scanning');
          phaseTraits.classList.add('active');

          var traitLabels = ['Precision', 'Stillness', 'Kinetic', 'Generative'];
          var traitKeys = ['precision', 'stillness', 'kinetic', 'generative'];
          var maxT = 0;
          traitKeys.forEach(function (k) { if (traits[k] > maxT) maxT = traits[k]; });

          traitKeys.forEach(function (k, i) {
            var pct = maxT > 0 ? Math.round((traits[k] / maxT) * 100) : 0;
            var row = document.createElement('div');
            row.className = 'az__trait-row';
            row.innerHTML =
              '<span class="az__trait-label">' + traitLabels[i] + '</span>' +
              '<div class="az__trait-track"><div class="az__trait-value"></div></div>' +
              '<span class="az__trait-num">0</span>';
            traitGrid.appendChild(row);

            // Stagger entrance
            setTimeout(function () {
              row.classList.add('show');
              // Animate bar fill
              var fill = row.querySelector('.az__trait-value');
              var numEl = row.querySelector('.az__trait-num');
              requestAnimationFrame(function () {
                fill.style.width = pct + '%';
              });
              // Animate number count-up
              var numStart = performance.now();
              function countUp(ts) {
                var p = Math.min((ts - numStart) / 600, 1);
                numEl.textContent = Math.round(p * pct);
                if (p < 1) requestAnimationFrame(countUp);
              }
              requestAnimationFrame(countUp);
            }, i * 250);
          });
        }, 2000);

        // ── Phase 3: Archetype lock (3.5s-4.8s) ──
        setTimeout(function () {
          phaseTraits.classList.remove('active');
          phaseLock.classList.add('active');
          analyzingScreen.classList.add('az-flash');
          lockName.textContent = arch.name;
        }, 3500);

        // ── Advance to result ──
        setTimeout(function () {
          analyzingActive = false;
          [phaseScan, phaseTraits, phaseLock].forEach(function (p) { p.classList.remove('active'); });
          analyzingScreen.classList.remove('az-flash', 'az-scanning');
          traitGrid.innerHTML = '';
          nextScreen();
        }, 4800);
      }

      // Ramp ambient to full intensity when entering result
      if (name === 'result' && window._ambientSystem) {
        window._ambientSystem.setIntensity(1);
      }
    }, 260); // matches CSS fade-out duration
  }

  function nextScreen() {
    if (currentScreen < screenOrder.length - 1) {
      transitionTo(currentScreen + 1);
    }
  }

  function prevScreen() {
    if (transitioning || answerHistory.length === 0) return;
    var last = answerHistory.pop();
    traits[last.trait]--;
    quizProgress--;
    quizColor = getQuizColor();
    quiz.style.setProperty('--vignette', (quizProgress * 0.07).toFixed(3));
    transitionTo(last.screenIndex);
  }

  // ---- Scoring ----
  function getResult() {
    var max = 0;
    Object.keys(traits).forEach(function (k) {
      if (traits[k] > max) max = traits[k];
    });
    var winners = [];
    Object.keys(traits).forEach(function (k) {
      if (traits[k] === max) winners.push(k);
    });
    winners.sort();
    if (winners.length === 1) return winners[0];
    return winners[0] + '+' + winners[1];
  }

  // ---- Render Result (with stagger timing) ----
  function renderResult(archKey) {
    var arch = archetypes[archKey];
    if (!arch) arch = archetypes.precision;
    currentArchKey = archKey;

    // Apply archetype visual theme
    quiz.querySelector('[data-screen="result"]').setAttribute('data-archetype', arch.key);
    particleProfile = particleProfiles[arch.key] || null;

    // Start archetype-specific ambient system
    if (window._ambientSystem) window._ambientSystem.start(arch.key, false);

    resultArchetype.textContent = arch.name;
    resultFreqTag.textContent = arch.freqTag;
    resultFreq.style.setProperty('--freq', arch.freq + '%');
    resultRarity.textContent = arch.rarity;
    resultInsight.textContent = '\u201C' + arch.insight + '\u201D';

    // Build body paragraphs with staggered delays
    resultBody.innerHTML = '';
    var baseDelay = 1.4; // seconds (after share button at 0.8s)
    arch.body.forEach(function (para, i) {
      var p = document.createElement('p');
      p.textContent = para;
      p.style.setProperty('--delay', (baseDelay + i * 0.2) + 's');
      resultBody.appendChild(p);
    });

    // Set bridge line for KORFYR block
    var bridgeEl = document.getElementById('korfyrBridge');
    if (bridgeEl && bridgeLines[arch.key]) {
      bridgeEl.textContent = bridgeLines[arch.key];
    }

    // Set UTM-tagged outbound link
    var korfyrLink = document.querySelector('.btn--korfyr');
    if (korfyrLink) {
      korfyrLink.href = 'https://www.korfyr.com?utm_campaign=3ae82b'
        + '&utm_source=digitalzen'
        + '&utm_medium=quiz'
        + '&utm_content=' + arch.key;
    }

    // Set timing — share button now appears before body copy
    var shareEl = document.querySelector('.result__share');
    var insightEl = document.querySelector('.result__insight');
    var korfyrEl = document.querySelector('.korfyr');
    var captureEl = document.querySelector('.capture');

    shareEl.style.setProperty('--delay-share', '0.8s');
    // Body paragraphs start at 1.4s (set via baseDelay above)
    var afterBody = baseDelay + arch.body.length * 0.2;
    insightEl.style.setProperty('--delay-insight', afterBody + 's');
    captureEl.style.setProperty('--delay-capture', (afterBody + 0.2) + 's');
    korfyrEl.style.setProperty('--delay-korfyr', (afterBody + 0.6) + 's');

    // Rarity slot machine — random numbers tick before settling on real %
    var rarityFinal = arch.rarity;
    var rarityMatch = rarityFinal.match(/(\d+)%/);
    resultRarity.textContent = rarityFinal;
    if (rarityMatch && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var rarityNum = rarityMatch[1];
      var rarityPre = rarityFinal.substring(0, rarityFinal.indexOf(rarityNum));
      var raritySuf = rarityFinal.substring(rarityFinal.indexOf(rarityNum) + rarityNum.length);
      var totalDelay = Math.round(0.8 * 1000) + 2800; // ~time share+rarity becomes visible
      setTimeout(function () {
        var ticks = 0;
        var maxTicks = 10;
        var interval = setInterval(function () {
          ticks++;
          if (ticks >= maxTicks) {
            clearInterval(interval);
            resultRarity.textContent = rarityFinal;
          } else {
            resultRarity.textContent = rarityPre + (Math.floor(Math.random() * 28) + 4) + raritySuf;
          }
        }, 75);
      }, totalDelay);
    }

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '?r=' + arch.key);
    }

    // One-time attention ping on the KORFYR button when block first appears
    if (!window._korfyrPinged) {
      var pingDelay = 2760 + Math.round((afterBody + 0.3) * 1000);
      setTimeout(function () {
        var kBtn = document.querySelector('.btn--korfyr');
        if (kBtn) {
          window._korfyrPinged = true;
          var ping = document.createElement('span');
          ping.className = 'korfyr-ping';
          kBtn.style.position = 'relative';
          kBtn.appendChild(ping);
          setTimeout(function () { if (ping.parentNode) ping.parentNode.removeChild(ping); }, 1100);
        }
      }, pingDelay);
    }

    // Show comparison line if visitor came from a friend's share link
    var compEl = document.getElementById('resultComparison');
    if (compEl && referredFrom) {
      var friendArch = null;
      Object.keys(archetypes).forEach(function (k) {
        if (archetypes[k].key === referredFrom) friendArch = archetypes[k];
      });
      if (friendArch) {
        if (referredFrom === arch.key) {
          compEl.textContent = 'Your friend got ' + friendArch.name + ' too. Same frequency.';
        } else {
          compEl.textContent = 'Your friend got ' + friendArch.name + '. You\u2019re different.';
        }
      }
    }

    // Show retake link
    var retakeEl = document.getElementById('retakeLink');
    if (retakeEl) retakeEl.style.display = '';
  }

  // ---- Ripple effect at click point ----
  function createRipple(btn, e) {
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var clientX = e.clientX != null ? e.clientX : rect.left + rect.width / 2;
    var clientY = e.clientY != null ? e.clientY : rect.top + rect.height / 2;
    var x = clientX - rect.left - size / 2;
    var y = clientY - rect.top - size / 2;
    var ripple = document.createElement('span');
    ripple.className = 'option__ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    btn.appendChild(ripple);
    setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 600);
  }

  // ---- Option clicks ----
  function handleOptionClick(e) {
    var btn = e.target.closest('.option');
    if (!btn || transitioning) return;
    var trait = btn.getAttribute('data-trait');
    if (!trait || traits[trait] === undefined) return;

    // Ripple from click point
    createRipple(btn, e);

    // Haptic feedback on mobile (subtle, 8ms)
    if (navigator.vibrate) navigator.vibrate(8);

    // Immediate visual feedback
    var options = btn.parentElement;
    options.querySelectorAll('.option').forEach(function (o) {
      o.classList.remove('selected');
      o.style.pointerEvents = 'none';
      if (o !== btn) o.classList.add('dimmed'); // focus on chosen
    });
    btn.classList.add('selected');
    // Subtle scale-up on selected option
    btn.style.transform = 'scale(1.02)';
    traits[trait]++;
    quizProgress++;

    // Track answer for back navigation
    answerHistory.push({ trait: trait, screenIndex: currentScreen });

    // Choice-reactive: update particle color based on accumulated traits
    quizColor = getQuizColor();

    // Vignette deepening
    quiz.style.setProperty('--vignette', (quizProgress * 0.07).toFixed(3));

    // Particle burst from click point
    spawnBurst(e.clientX, e.clientY);

    // Micro-shake feedback
    quiz.classList.add('shake');
    setTimeout(function () { quiz.classList.remove('shake'); }, 150);

    // Wait 550ms (let user see selection + ripple settle), then transition
    setTimeout(function () {
      nextScreen();

      // Re-enable options + clear states after transition
      setTimeout(function () {
        options.querySelectorAll('.option').forEach(function (o) {
          o.style.pointerEvents = '';
          o.classList.remove('selected', 'dimmed');
          o.style.transform = '';
        });
      }, 300);
    }, 550);
  }

  // ---- Share ----
  function handleShare() {
    var arch = archetypes[currentArchKey];
    if (!arch) return;
    var shareUrl = 'https://digitalzen.cloud/?r=' + arch.key;
    var text;
    if (referredFrom) {
      var friendArch = null;
      Object.keys(archetypes).forEach(function (k) {
        if (archetypes[k].key === referredFrom) friendArch = archetypes[k];
      });
      if (friendArch && referredFrom !== arch.key) {
        text = 'My friend got ' + friendArch.name + '. I got ' + arch.name + '. What\u2019s your night mode?';
      } else {
        text = 'I\u2019m ' + arch.name + '. What\u2019s your night mode?';
      }
    } else {
      text = 'I\u2019m ' + arch.name + '. What\u2019s your night mode?';
    }

    // Update meta tags for direct URL sharing
    updateMetaTags(arch, shareUrl);

    if (navigator.share) {
      navigator.share({ title: 'I\u2019m ' + arch.name, text: text, url: shareUrl }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + ' \u2192 ' + shareUrl).then(function () {
        copiedMsg.classList.add('show');
        var nudge = document.getElementById('shareNudge');
        if (nudge) {
          setTimeout(function () { nudge.classList.add('show'); }, 1000);
          setTimeout(function () { nudge.classList.remove('show'); }, 6000);
        }
        setTimeout(function () { copiedMsg.classList.remove('show'); }, 2500);
      });
    }
  }

  function updateMetaTags(arch, shareUrl) {
    var ogImage = 'https://digitalzen.cloud/og/' + arch.key + '.png';
    var title = 'I\u2019m ' + arch.name + '. What\u2019s your night mode?';
    var desc = arch.body[0];
    var metaUpdates = {
      'og:title': title,
      'og:description': desc,
      'og:image': ogImage,
      'og:url': shareUrl,
      'twitter:title': title,
      'twitter:description': desc,
      'twitter:image': ogImage
    };
    Object.keys(metaUpdates).forEach(function (prop) {
      var selector = prop.indexOf('twitter:') === 0
        ? 'meta[name="' + prop + '"]'
        : 'meta[property="' + prop + '"]';
      var el = document.querySelector(selector);
      if (el) el.setAttribute('content', metaUpdates[prop]);
    });
  }

  // ---- Email capture ----
  var CAPTURE_ENDPOINT = 'https://dz-subscribe.helixirin.workers.dev';

  function handleCapture(e) {
    e.preventDefault();
    var email = captureEmail.value.trim();
    if (!email) return;

    // Clear previous error
    captureError.textContent = '';
    captureError.classList.remove('show');

    // Require consent checkbox
    if (!captureConsent.checked) {
      captureError.textContent = 'Just need a quick check on the box above \u2014 it lets KORFYR (our sponsor) send you the good stuff.';
      captureError.classList.add('show');
      return;
    }

    fetch(CAPTURE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, archetype: currentArchKey })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      captureForm.classList.add('hidden');
      captureSuccess.classList.add('show');
    })
    .catch(function () {
      captureForm.classList.add('hidden');
      captureSuccess.classList.add('show');
    });
  }

  // ---- Archetype theme colors for splash ----
  var archColors = {
    architect: { r: 170, g: 185, b: 210 },
    ghost: { r: 200, g: 200, b: 200 },
    circuit: { r: 232, g: 93, b: 58 },
    twam: { r: 200, g: 160, b: 40 },
    minimalist: { r: 220, g: 220, b: 220 },
    operator: { r: 42, g: 111, b: 255 },
    engineer: { r: 80, g: 130, b: 200 },
    phantom: { r: 150, g: 100, b: 190 },
    builder: { r: 165, g: 130, b: 85 },
    nocturnal: { r: 230, g: 45, b: 45 }
  };

  // ---- Friend referral splash ----
  function checkReferral() {
    var params = new URLSearchParams(window.location.search);
    var r = params.get('r');
    if (!r) return false;

    var archLookup = urlKeyMap[r];
    if (!archLookup || !archetypes[archLookup]) return false;

    var arch = archetypes[archLookup];
    referredFrom = arch.key;
    var splashEl = quiz.querySelector('[data-screen="splash"]');
    document.getElementById('splashArchetype').textContent = arch.name;

    // Set freq tag
    var freqTag = document.getElementById('splashFreqTag');
    if (freqTag) freqTag.textContent = arch.freqTag;

    // Set rarity on splash
    var splashRarity = document.getElementById('splashRarity');
    if (splashRarity) splashRarity.textContent = arch.rarity;

    // Apply archetype data attribute for themed styling
    splashEl.setAttribute('data-archetype', arch.key);

    // Set archetype color as CSS custom property for rings/glow
    var c = archColors[arch.key] || { r: 196, g: 30, b: 30 };
    splashEl.style.setProperty('--splash-color', c.r + ', ' + c.g + ', ' + c.b);

    var screens = quiz.querySelectorAll('.screen');
    screens.forEach(function (s) { s.classList.remove('active'); });
    splashEl.classList.add('active');

    // Start archetype-specific ambient system for splash
    if (window._ambientSystem) window._ambientSystem.start(arch.key, true);

    return true;
  }

  // ---- Nav scroll ----
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.style.background = window.scrollY > 50
            ? 'rgba(12, 12, 14, 0.92)'
            : 'rgba(12, 12, 14, 0.6)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    checkReferral();

    startBtn.addEventListener('click', function () { nextScreen(); });
    splashBtn.addEventListener('click', function () {
      if (referredFrom) {
        // Referral visitor already committed — skip intro, go straight to Q1
        traits = { precision: 0, stillness: 0, kinetic: 0, generative: 0 };
        quizProgress = 0;
        answerHistory = [];
        if (window._ambientSystem) window._ambientSystem.stop();
        // Jump directly to q1 (index 1 in screenOrder)
        transitionTo(1);
      } else {
        screenOrder[0] = 'intro';
        transitionTo(0);
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    // Nav logo — reset quiz to intro
    var navBrand = document.getElementById('navBrand');
    if (navBrand) {
      navBrand.addEventListener('click', function (e) {
        e.preventDefault();
        traits = { precision: 0, stillness: 0, kinetic: 0, generative: 0 };
        quizProgress = 0;
        currentArchKey = null;
        answerHistory = [];
        if (window._ambientSystem) window._ambientSystem.stop();
        screenOrder[0] = 'intro';
        transitionTo(0);
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      });
    }

    // Retake link — reset and restart quiz
    var retakeLink = document.getElementById('retakeLink');
    if (retakeLink) {
      retakeLink.addEventListener('click', function (e) {
        e.preventDefault();
        traits = { precision: 0, stillness: 0, kinetic: 0, generative: 0 };
        quizProgress = 0;
        currentArchKey = null;
        answerHistory = [];
        if (window._ambientSystem) window._ambientSystem.stop();
        screenOrder[0] = 'intro';
        transitionTo(0);
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      });
    }

    quiz.addEventListener('click', function (e) {
      if (e.target.closest('.option')) handleOptionClick(e);
      if (e.target.closest('.back-btn')) prevScreen();
    });

    shareBtn.addEventListener('click', handleShare);
    captureForm.addEventListener('submit', handleCapture);

    // ---- Sticky archetype header (result page) ----
    (function () {
      var sticky = document.getElementById('resultSticky');
      var stickyName = document.getElementById('stickyName');
      var stickyShare = document.getElementById('stickyShare');
      if (!sticky) return;

      // Show/hide via IntersectionObserver on the result title
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          // Show sticky when title scrolls out of view
          if (!entry.isIntersecting && screenOrder[currentScreen] === 'result') {
            sticky.classList.add('visible');
          } else {
            sticky.classList.remove('visible');
          }
        });
      }, { threshold: 0 });

      // Observe once result is shown
      var origRender = renderResult;
      renderResult = function (archKey) {
        origRender(archKey);
        var arch = archetypes[archKey];
        if (arch) stickyName.textContent = arch.name.toUpperCase();
        observer.observe(resultArchetype);
      };

      // Tap name → scroll to top
      stickyName.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // Tap share icon → same as main share button
      stickyShare.addEventListener('click', handleShare);
    })();

    // ---- KORFYR button — cursor spotlight + click burst ----
    (function () {
      var kBtn = document.querySelector('.btn--korfyr');
      if (!kBtn) return;

      // Cursor-aware spotlight (radial gradient follows mouse inside button)
      kBtn.addEventListener('mousemove', function (e) {
        var rect = this.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        this.style.setProperty('--mx', x + '%');
        this.style.setProperty('--my', y + '%');
      });
      kBtn.addEventListener('mouseleave', function () {
        this.style.removeProperty('--mx');
        this.style.removeProperty('--my');
      });

      // Click burst ring — expands from button center, navigates normally
      kBtn.addEventListener('click', function (e) {
        var rect = this.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var burst = document.createElement('div');
        burst.className = 'korfyr-burst';
        burst.style.cssText =
          'width:' + size + 'px;height:' + size + 'px;' +
          'left:' + (rect.left + (rect.width - size) / 2) + 'px;' +
          'top:'  + (rect.top  + (rect.height - size) / 2) + 'px;';
        document.body.appendChild(burst);
        setTimeout(function () { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 750);
      });
    })();

    // ---- Keyboard navigation (1-4 for options, Enter/Space for buttons) ----
    document.addEventListener('keydown', function (e) {
      if (transitioning) return;
      var screenName = screenOrder[currentScreen];

      if (screenName === 'intro' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextScreen();
        return;
      }

      if (screenName === 'splash' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        splashBtn.click();
        return;
      }

      if (screenName.charAt(0) === 'q') {
        var num = parseInt(e.key, 10);
        if (num >= 1 && num <= 4) {
          var activeScreen = quiz.querySelector('[data-screen="' + screenName + '"]');
          var opts = activeScreen ? activeScreen.querySelectorAll('.option') : [];
          if (opts[num - 1]) {
            var rect = opts[num - 1].getBoundingClientRect();
            opts[num - 1].dispatchEvent(new MouseEvent('click', {
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2,
              bubbles: true
            }));
          }
        }
      }
    });

    // ---- Archetype ambient visual system ----
    (function () {
      var canvas = document.getElementById('ambientBg');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W, H;
      var isMobile = window.innerWidth < 768;
      var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var activeArch = null;
      var fadeOpacity = 0;
      var fadeTarget = 0;
      var intensityMult = 1;
      var intensityTarget = 1;
      var running = false;

      function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        isMobile = W < 768;
      }
      resize();
      window.addEventListener('resize', resize);

      // --- Architect: drifting grid ---
      var gridState = { lines: [], flashIdx: -1, flashTime: 0, nextFlash: 3000 };
      function initGrid() {
        gridState.lines = [];
        var spacing = isMobile ? 100 : 90;
        for (var x = spacing / 2; x < W + spacing; x += spacing + (Math.random() - 0.5) * 30) {
          gridState.lines.push({ x: x, y: 0, vertical: true, drift: (Math.random() - 0.5) * 0.15, bright: 0 });
        }
        for (var y = spacing / 2; y < H + spacing; y += spacing + (Math.random() - 0.5) * 30) {
          gridState.lines.push({ x: 0, y: y, vertical: false, drift: (Math.random() - 0.5) * 0.12, bright: 0 });
        }
        gridState.nextFlash = performance.now() + 3000 + Math.random() * 2000;
      }
      function drawGrid(now) {
        var c = archColors.architect;
        if (now > gridState.nextFlash) {
          gridState.flashIdx = Math.floor(Math.random() * gridState.lines.length);
          gridState.flashTime = now;
          gridState.nextFlash = now + 3000 + Math.random() * 2000;
        }
        for (var i = 0; i < gridState.lines.length; i++) {
          var l = gridState.lines[i];
          if (!reducedMotion) {
            if (l.vertical) l.x += l.drift;
            else l.y += l.drift;
          }
          var op = 0.09;
          if (i === gridState.flashIdx) {
            var elapsed = now - gridState.flashTime;
            if (elapsed < 800) op = 0.09 + 0.20 * Math.max(0, 1 - elapsed / 800);
          }
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (op * fadeOpacity * intensityMult) + ')';
          ctx.lineWidth = 1;
          if (l.vertical) { ctx.moveTo(l.x, 0); ctx.lineTo(l.x, H); }
          else { ctx.moveTo(0, l.y); ctx.lineTo(W, l.y); }
          ctx.stroke();
        }
      }

      // --- Ghost: drifting fog ---
      var fogState = { blobs: [] };
      function initFog() {
        fogState.blobs = [];
        var count = isMobile ? 2 : 3;
        for (var i = 0; i < count; i++) {
          fogState.blobs.push({
            x: Math.random() * W, y: Math.random() * H,
            r: 200 + Math.random() * 200,
            dx: (Math.random() - 0.5) * 0.08, dy: (Math.random() - 0.5) * 0.06,
            phase: Math.random() * Math.PI * 2, period: 6 + Math.random() * 4
          });
        }
      }
      function drawFog(now) {
        var c = archColors.ghost;
        var t = now / 1000;
        for (var i = 0; i < fogState.blobs.length; i++) {
          var b = fogState.blobs[i];
          if (!reducedMotion) { b.x += b.dx; b.y += b.dy; }
          if (b.x < -b.r) b.x = W + b.r;
          if (b.x > W + b.r) b.x = -b.r;
          if (b.y < -b.r) b.y = H + b.r;
          if (b.y > H + b.r) b.y = -b.r;
          var cycleOp = 0.03 + 0.03 * Math.sin(t / b.period * Math.PI * 2 + b.phase);
          var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          grad.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (cycleOp * fadeOpacity * intensityMult) + ')');
          grad.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
          ctx.fillStyle = grad;
          ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
        }
      }

      // --- Circuit: flowing vector streaks ---
      var streakState = { streaks: [] };
      function initStreaks() {
        streakState.streaks = [];
        var count = isMobile ? 12 : 22;
        var zones = [
          { angle: -0.3, weight: 0.4 },
          { angle: 0.8, weight: 0.35 },
          { angle: -1.2, weight: 0.25 }
        ];
        for (var i = 0; i < count; i++) {
          var zone = zones[Math.floor(Math.random() * zones.length)];
          streakState.streaks.push({
            x: Math.random() * W, y: Math.random() * H,
            len: 20 + Math.random() * 20,
            angle: zone.angle + (Math.random() - 0.5) * 0.4,
            speed: 1 + Math.random() * 2,
            op: 0.11 + Math.random() * 0.09,
            flare: 0, flareTime: 0
          });
        }
        streakState.nextFlare = performance.now() + 2000 + Math.random() * 1000;
      }
      function drawStreaks(now) {
        var c = archColors.circuit;
        if (now > streakState.nextFlare) {
          var fi = Math.floor(Math.random() * streakState.streaks.length);
          streakState.streaks[fi].flareTime = now;
          streakState.nextFlare = now + 2000 + Math.random() * 1000;
        }
        for (var i = 0; i < streakState.streaks.length; i++) {
          var s = streakState.streaks[i];
          if (!reducedMotion) {
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
          }
          if (s.x < -50 || s.x > W + 50 || s.y < -50 || s.y > H + 50) {
            var edge = Math.floor(Math.random() * 4);
            if (edge === 0) { s.x = -10; s.y = Math.random() * H; }
            else if (edge === 1) { s.x = W + 10; s.y = Math.random() * H; }
            else if (edge === 2) { s.y = -10; s.x = Math.random() * W; }
            else { s.y = H + 10; s.x = Math.random() * W; }
          }
          var op = s.op;
          var elapsed = now - s.flareTime;
          if (elapsed < 500 && elapsed > 0) op = s.op + 0.28 * Math.max(0, 1 - elapsed / 500);
          var ex = s.x + Math.cos(s.angle) * s.len;
          var ey = s.y + Math.sin(s.angle) * s.len;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (op * fadeOpacity * intensityMult) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }
      }

      // --- 2AM: waveform ---
      var waveState = { phase: 0, ampPhase: 0 };
      function drawWaveform(now) {
        var c = archColors.twam;
        var t = now / 1000;
        var baseY = H * 0.75;
        var waveW = W;
        // Noise floor
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (0.05 * fadeOpacity * intensityMult) + ')';
        ctx.lineWidth = 1;
        ctx.moveTo(0, baseY);
        ctx.lineTo(waveW, baseY);
        ctx.stroke();
        // Waveform
        var amp = 15 + 20 * (0.5 + 0.5 * Math.sin(t / 5 * Math.PI * 2));
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (0.14 * fadeOpacity * intensityMult) + ')';
        for (var x = 0; x < waveW; x += 2) {
          var nx = x / waveW;
          var val = Math.sin(nx * 12 + t * 1.5) * 0.5
                  + Math.sin(nx * 7 + t * 0.8) * 0.3
                  + Math.sin(nx * 20 + t * 2.5) * 0.2;
          var y = baseY - val * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // --- Minimalist: single breathing line ---
      var minState = { y: 0, targetY: 0, phase: 0 };
      function initMinimalist() {
        minState.y = H * 0.4;
        minState.targetY = H * 0.4;
      }
      function drawMinimalist(now) {
        var c = archColors.minimalist;
        var t = now / 1000;
        if (!reducedMotion) {
          minState.y += (minState.targetY + Math.sin(t / 18 * Math.PI * 2) * 20 - minState.y) * 0.005;
        }
        var op = 0.06 + 0.08 * (0.5 + 0.5 * Math.sin(t / 6 * Math.PI * 2));
        var lineW = W * 0.6;
        var startX = (W - lineW) / 2;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (op * fadeOpacity * intensityMult) + ')';
        ctx.lineWidth = 1;
        ctx.moveTo(startX, minState.y);
        ctx.lineTo(startX + lineW, minState.y);
        ctx.stroke();
      }

      // --- Operator: radar sweep ---
      var radarState = { angle: 0, blips: [], ringR: 0 };
      function initRadar() {
        radarState.angle = 0;
        radarState.blips = [
          { angle: 0.8, dist: 0.3, life: 0 },
          { angle: 2.5, dist: 0.55, life: 0 },
          { angle: 4.1, dist: 0.4, life: 0 }
        ];
        radarState.ringR = Math.min(W, H) * 0.4;
      }
      function drawRadar(now) {
        var cBlue = archColors.operator;
        var cx = W * 0.5, cy = H * 0.45;
        var maxR = radarState.ringR;
        var t = now / 1000;
        if (!reducedMotion) radarState.angle = (t / 9) * Math.PI * 2;
        var sweepAngle = radarState.angle % (Math.PI * 2);

        // Distance ring
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + cBlue.r + ',' + cBlue.g + ',' + cBlue.b + ',' + (0.06 * fadeOpacity * intensityMult) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Sweep line with gradient
        var sweepLen = maxR * 1.1;
        var sx = cx + Math.cos(sweepAngle) * sweepLen;
        var sy = cy + Math.sin(sweepAngle) * sweepLen;
        var grad = ctx.createLinearGradient(cx, cy, sx, sy);
        grad.addColorStop(0, 'rgba(' + cBlue.r + ',' + cBlue.g + ',' + cBlue.b + ',' + (0.11 * fadeOpacity * intensityMult) + ')');
        grad.addColorStop(1, 'rgba(196,30,30,' + (0.09 * fadeOpacity * intensityMult) + ')');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Blips
        for (var i = 0; i < radarState.blips.length; i++) {
          var blip = radarState.blips[i];
          var angleDiff = sweepAngle - blip.angle;
          if (angleDiff < 0) angleDiff += Math.PI * 2;
          if (angleDiff < 0.15 && blip.life <= 0) blip.life = 1;
          if (blip.life > 0) {
            if (!reducedMotion) blip.life -= 0.008;
            var bx = cx + Math.cos(blip.angle) * maxR * blip.dist;
            var by = cy + Math.sin(blip.angle) * maxR * blip.dist;
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + cBlue.r + ',' + cBlue.g + ',' + cBlue.b + ',' + (0.16 * blip.life * fadeOpacity * intensityMult) + ')';
            ctx.fill();
          }
        }
      }

      // --- Engineer: schematic traces ---
      var traceState = { traces: [], nextSpawn: 0 };
      function initTraces() {
        traceState.traces = [];
        traceState.nextSpawn = performance.now() + 500;
      }
      function spawnTrace() {
        var segments = [];
        var x = Math.random() * W * 0.8 + W * 0.1;
        var y = Math.random() * H * 0.8 + H * 0.1;
        var numSegs = 2 + Math.floor(Math.random() * 2);
        for (var i = 0; i < numSegs; i++) {
          var horiz = i % 2 === 0;
          var len = 40 + Math.random() * 60;
          var dir = Math.random() > 0.5 ? 1 : -1;
          var ex = horiz ? x + len * dir : x;
          var ey = horiz ? y : y + len * dir;
          segments.push({ sx: x, sy: y, ex: ex, ey: ey });
          x = ex; y = ey;
        }
        return { segments: segments, progress: 0, phase: 'draw', holdStart: 0, fadeOut: 1 };
      }
      function drawTraces(now) {
        var c = archColors.engineer;
        var maxTraces = isMobile ? 2 : 3;
        if (now > traceState.nextSpawn && traceState.traces.length < maxTraces) {
          traceState.traces.push(spawnTrace());
          traceState.nextSpawn = now + 2000 + Math.random() * 2000;
        }
        for (var ti = traceState.traces.length - 1; ti >= 0; ti--) {
          var tr = traceState.traces[ti];
          if (tr.phase === 'draw') {
            if (!reducedMotion) tr.progress += 0.012;
            if (tr.progress >= 1) { tr.phase = 'hold'; tr.holdStart = now; tr.progress = 1; }
          } else if (tr.phase === 'hold') {
            if (now - tr.holdStart > 1500) tr.phase = 'fade';
          } else if (tr.phase === 'fade') {
            tr.fadeOut -= 0.015;
            if (tr.fadeOut <= 0) { traceState.traces.splice(ti, 1); continue; }
          }
          var totalLen = 0;
          for (var si = 0; si < tr.segments.length; si++) {
            var seg = tr.segments[si];
            totalLen += Math.hypot(seg.ex - seg.sx, seg.ey - seg.sy);
          }
          var drawLen = tr.progress * totalLen;
          var drawn = 0;
          var baseOp = 0.14 * tr.fadeOut * fadeOpacity * intensityMult;
          ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + baseOp + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          var lastX, lastY;
          for (si = 0; si < tr.segments.length; si++) {
            seg = tr.segments[si];
            var segLen = Math.hypot(seg.ex - seg.sx, seg.ey - seg.sy);
            if (drawn + segLen <= drawLen) {
              if (si === 0) ctx.moveTo(seg.sx, seg.sy);
              ctx.lineTo(seg.ex, seg.ey);
              lastX = seg.ex; lastY = seg.ey;
              drawn += segLen;
            } else {
              var remain = drawLen - drawn;
              var frac = remain / segLen;
              var px = seg.sx + (seg.ex - seg.sx) * frac;
              var py = seg.sy + (seg.ey - seg.sy) * frac;
              if (si === 0) ctx.moveTo(seg.sx, seg.sy);
              ctx.lineTo(px, py);
              lastX = px; lastY = py;
              break;
            }
          }
          ctx.stroke();
          // Cursor dot
          if (lastX !== undefined && tr.phase === 'draw') {
            ctx.beginPath();
            ctx.arc(lastX, lastY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (0.28 * tr.fadeOut * fadeOpacity * intensityMult) + ')';
            ctx.fill();
          }
        }
      }

      // --- Phantom: glitch/interference ---
      var glitchState = { active: false, x: 0, y: 0, w: 0, h: 0, shiftX: 0, start: 0, dur: 100, nextEvent: 0 };
      function initGlitch() {
        glitchState.nextEvent = performance.now() + 3000 + Math.random() * 3000;
        glitchState.active = false;
      }
      function drawGlitch(now) {
        var c = archColors.phantom;
        if (!glitchState.active && now > glitchState.nextEvent) {
          glitchState.active = true;
          glitchState.x = Math.random() * (W - 200);
          glitchState.y = Math.random() * (H - 50);
          glitchState.w = 100 + Math.random() * 100;
          glitchState.h = 20 + Math.random() * 30;
          glitchState.shiftX = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
          glitchState.start = now;
          glitchState.dur = 80 + Math.random() * 40;
        }
        if (glitchState.active) {
          var elapsed = now - glitchState.start;
          if (elapsed > glitchState.dur) {
            glitchState.active = false;
            glitchState.nextEvent = now + 3000 + Math.random() * 3000;
          } else {
            var op = 0.09 * fadeOpacity * intensityMult;
            ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + op + ')';
            ctx.fillRect(glitchState.x + glitchState.shiftX, glitchState.y, glitchState.w, glitchState.h);
          }
        }
      }

      // --- Builder: slow geometric construction ---
      var buildState = { shape: null, nextSpawn: 0 };
      function initBuilder() {
        buildState.shape = null;
        buildState.nextSpawn = performance.now() + 500;
      }
      function spawnShape() {
        var type = Math.floor(Math.random() * 3); // 0=rect, 1=triangle, 2=arc
        var cx = W * (0.2 + Math.random() * 0.6);
        var cy = H * (0.2 + Math.random() * 0.6);
        var size = 60 + Math.random() * 80;
        return { type: type, cx: cx, cy: cy, size: size, progress: 0, phase: 'draw', holdStart: 0, fadeOut: 1 };
      }
      function drawBuilder(now) {
        var c = archColors.builder;
        if (!buildState.shape && now > buildState.nextSpawn) {
          buildState.shape = spawnShape();
        }
        var sh = buildState.shape;
        if (!sh) return;
        if (sh.phase === 'draw') {
          if (!reducedMotion) sh.progress += 0.008;
          if (sh.progress >= 1) { sh.phase = 'hold'; sh.holdStart = now; sh.progress = 1; }
        } else if (sh.phase === 'hold') {
          if (now - sh.holdStart > 3500) sh.phase = 'fade';
        } else if (sh.phase === 'fade') {
          sh.fadeOut -= 0.006;
          if (sh.fadeOut <= 0) {
            buildState.shape = null;
            buildState.nextSpawn = now + 1000 + Math.random() * 1000;
            return;
          }
        }
        var baseOp = 0.11 * sh.fadeOut * fadeOpacity * intensityMult;
        ctx.strokeStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + baseOp + ')';
        ctx.lineWidth = 1;
        var p = sh.progress;
        if (sh.type === 0) {
          // Rectangle
          var half = sh.size / 2;
          var perim = sh.size * 4;
          var drawLen = p * perim;
          ctx.beginPath();
          var corners = [
            [sh.cx - half, sh.cy - half],
            [sh.cx + half, sh.cy - half],
            [sh.cx + half, sh.cy + half],
            [sh.cx - half, sh.cy + half],
            [sh.cx - half, sh.cy - half]
          ];
          ctx.moveTo(corners[0][0], corners[0][1]);
          var accumulated = 0;
          for (var i = 0; i < 4; i++) {
            var segLen = sh.size;
            if (accumulated + segLen <= drawLen) {
              ctx.lineTo(corners[i + 1][0], corners[i + 1][1]);
              accumulated += segLen;
            } else {
              var frac = (drawLen - accumulated) / segLen;
              ctx.lineTo(
                corners[i][0] + (corners[i + 1][0] - corners[i][0]) * frac,
                corners[i][1] + (corners[i + 1][1] - corners[i][1]) * frac
              );
              break;
            }
          }
          ctx.stroke();
        } else if (sh.type === 1) {
          // Triangle
          var r = sh.size / 2;
          var pts = [];
          for (var j = 0; j < 3; j++) {
            var a = -Math.PI / 2 + j * (Math.PI * 2 / 3);
            pts.push([sh.cx + Math.cos(a) * r, sh.cy + Math.sin(a) * r]);
          }
          pts.push(pts[0]);
          var totalPerim = 0;
          for (j = 0; j < 3; j++) totalPerim += Math.hypot(pts[j + 1][0] - pts[j][0], pts[j + 1][1] - pts[j][1]);
          var dl = p * totalPerim;
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          var acc = 0;
          for (j = 0; j < 3; j++) {
            var sLen = Math.hypot(pts[j + 1][0] - pts[j][0], pts[j + 1][1] - pts[j][1]);
            if (acc + sLen <= dl) { ctx.lineTo(pts[j + 1][0], pts[j + 1][1]); acc += sLen; }
            else {
              var fr = (dl - acc) / sLen;
              ctx.lineTo(pts[j][0] + (pts[j + 1][0] - pts[j][0]) * fr, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * fr);
              break;
            }
          }
          ctx.stroke();
        } else {
          // Arc
          ctx.beginPath();
          ctx.arc(sh.cx, sh.cy, sh.size / 2, 0, Math.PI * 2 * p);
          ctx.stroke();
        }
      }

      // --- Nocturnal: heat signature ---
      var heatState = { zones: [] };
      function initHeat() {
        heatState.zones = [];
        var count = isMobile ? 3 : 4;
        for (var i = 0; i < count; i++) {
          heatState.zones.push({
            x: Math.random() * W, y: Math.random() * H,
            r: 100 + Math.random() * 150,
            dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.3,
            phase: Math.random() * Math.PI * 2,
            period: 2 + Math.random() * 3,
            flare: 0, flareTime: 0
          });
        }
        heatState.nextFlare = performance.now() + 4000 + Math.random() * 3000;
      }
      function drawHeat(now) {
        var c = archColors.nocturnal;
        var t = now / 1000;
        if (now > heatState.nextFlare) {
          var fi = Math.floor(Math.random() * heatState.zones.length);
          heatState.zones[fi].flareTime = now;
          heatState.nextFlare = now + 4000 + Math.random() * 3000;
        }
        for (var i = 0; i < heatState.zones.length; i++) {
          var z = heatState.zones[i];
          if (!reducedMotion) { z.x += z.dx; z.y += z.dy; }
          if (z.x < -z.r) z.x = W + z.r;
          if (z.x > W + z.r) z.x = -z.r;
          if (z.y < -z.r) z.y = H + z.r;
          if (z.y > H + z.r) z.y = -z.r;
          var pulseOp = 0.06 + 0.06 * Math.sin(t / z.period * Math.PI * 2 + z.phase);
          var flareElapsed = now - z.flareTime;
          if (flareElapsed < 300 && flareElapsed > 0) pulseOp += 0.10 * Math.max(0, 1 - flareElapsed / 300);
          var grad = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, z.r);
          grad.addColorStop(0, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + (pulseOp * fadeOpacity * intensityMult) + ')');
          grad.addColorStop(1, 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',0)');
          ctx.fillStyle = grad;
          ctx.fillRect(z.x - z.r, z.y - z.r, z.r * 2, z.r * 2);
        }
      }

      // --- Draw dispatch ---
      var drawFns = {
        architect: drawGrid,
        ghost: drawFog,
        circuit: drawStreaks,
        twam: drawWaveform,
        minimalist: drawMinimalist,
        operator: drawRadar,
        engineer: drawTraces,
        phantom: drawGlitch,
        builder: drawBuilder,
        nocturnal: drawHeat
      };
      var initFns = {
        architect: initGrid,
        ghost: initFog,
        circuit: initStreaks,
        minimalist: initMinimalist,
        operator: initRadar,
        engineer: initTraces,
        phantom: initGlitch,
        builder: initBuilder,
        nocturnal: initHeat
      };

      function startAmbient(archKey, splash) {
        if (reducedMotion) return;
        activeArch = archKey;
        fadeTarget = 1;
        fadeOpacity = 0;
        intensityMult = 1;
        intensityTarget = 1;
        if (initFns[archKey]) initFns[archKey]();
        if (splash) {
          // Splash: elevated baseline intensity
          intensityTarget = 1.4;
          // Brief boost when name appears
          setTimeout(function () {
            intensityTarget = 1.6;
            setTimeout(function () { intensityTarget = 1.4; }, 200);
          }, 300);
        }
        if (!running) { running = true; ambientLoop(); }
      }

      function stopAmbient() {
        fadeTarget = 0;
      }

      function ambientLoop() {
        if (!running) return;
        var now = performance.now();
        ctx.clearRect(0, 0, W, H);

        // Fade in/out
        if (fadeOpacity < fadeTarget) fadeOpacity = Math.min(fadeOpacity + 0.015, fadeTarget);
        else if (fadeOpacity > fadeTarget) fadeOpacity = Math.max(fadeOpacity - 0.02, fadeTarget);

        // Intensity lerp
        intensityMult += (intensityTarget - intensityMult) * 0.05;

        if (fadeOpacity <= 0 && fadeTarget <= 0) {
          activeArch = null;
          running = false;
          return;
        }

        if (activeArch && drawFns[activeArch]) {
          drawFns[activeArch](now);
        }

        requestAnimationFrame(ambientLoop);
      }

      // Expose to outer scope
      window._ambientSystem = {
        start: startAmbient,
        stop: stopAmbient,
        setIntensity: function (val) { intensityTarget = val; }
      };
    })();

    // ---- Particle background ----
    (function () {
      var canvas = document.getElementById('particleBg');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var pts = [];
      var count = 18;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function spawn() {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          dx: (Math.random() - 0.5) * 0.25,
          dy: -(Math.random() * 0.3 + 0.08),
          o: Math.random() * 0.12 + 0.04
        };
      }

      resize();
      window.addEventListener('resize', resize);
      for (var i = 0; i < count; i++) pts.push(spawn());

      // Lerp state for smooth transitions
      var lR = 196, lG = 30, lB = 30, lSpeed = 1, lOp = 1;

      (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var progress = 1 + quizProgress * 0.25;

        // Priority: archetype profile > quiz color > default red
        var tR = 196, tG = 30, tB = 30, tSpeed = 1, tOp = 1;
        if (particleProfile) {
          tR = particleProfile.r; tG = particleProfile.g; tB = particleProfile.b;
          tSpeed = particleProfile.speed;
          tOp = particleProfile.o / 0.08;
        } else if (quizColor) {
          tR = quizColor.r; tG = quizColor.g; tB = quizColor.b;
        }
        if (analyzingActive) {
          tSpeed = 3.5;
          progress = Math.max(progress, 3);
        }

        // Smooth lerp (~2s convergence at 60fps)
        lR += (tR - lR) * 0.025;
        lG += (tG - lG) * 0.025;
        lB += (tB - lB) * 0.025;
        lSpeed += (tSpeed - lSpeed) * 0.03;
        lOp += (tOp - lOp) * 0.025;

        var cr = Math.round(lR), cg = Math.round(lG), cb = Math.round(lB);

        // Main particles
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          p.x += p.dx * lSpeed;
          p.y += p.dy * lSpeed;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          if (p.x < -10 || p.x > canvas.width + 10) p.x = Math.random() * canvas.width;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * progress, 0, 6.283);
          ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + Math.min(p.o * progress * lOp, 0.4) + ')';
          ctx.fill();
        }

        // Click-point burst particles
        for (var j = bursts.length - 1; j >= 0; j--) {
          var b = bursts[j];
          b.x += b.dx;
          b.y += b.dy;
          b.dx *= 0.97;
          b.dy *= 0.97;
          b.life -= b.decay;
          if (b.life <= 0) { bursts.splice(j, 1); continue; }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * b.life, 0, 6.283);
          ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.5 * b.life) + ')';
          ctx.fill();
        }

        requestAnimationFrame(loop);
      })();
    })();
  });
})();
