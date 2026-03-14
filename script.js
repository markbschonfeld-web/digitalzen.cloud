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
  var screenOrder = ['intro', 'q1', 'q2', 'q3', 'q4', 'result'];
  var currentScreen = 0;
  var currentArchKey = null;
  var transitioning = false;

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
    }, 260); // matches CSS fade-out duration
  }

  function nextScreen() {
    if (currentScreen < screenOrder.length - 1) {
      transitionTo(currentScreen + 1);
    }
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

    resultArchetype.textContent = arch.name;
    resultFreqTag.textContent = arch.freqTag;
    resultFreq.style.setProperty('--freq', arch.freq + '%');
    resultRarity.textContent = arch.rarity;
    resultInsight.textContent = '\u201C' + arch.insight + '\u201D';

    // Build body paragraphs with staggered delays
    resultBody.innerHTML = '';
    var baseDelay = 1.2; // seconds
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

    // Set timing for elements after the body paragraphs
    var afterBody = baseDelay + arch.body.length * 0.2;
    var insightEl = document.querySelector('.result__insight');
    var korfyrEl = document.querySelector('.korfyr');
    var shareEl = document.querySelector('.result__share');
    var captureEl = document.querySelector('.capture');

    insightEl.style.setProperty('--delay-insight', afterBody + 's');
    korfyrEl.style.setProperty('--delay-korfyr', (afterBody + 0.2) + 's');
    shareEl.style.setProperty('--delay-share', (afterBody + 0.8) + 's');
    captureEl.style.setProperty('--delay-capture', (afterBody + 1) + 's');

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '?r=' + arch.key);
    }
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
    traits[trait]++;

    // Wait 420ms (let user see selection + ripple settle), then transition
    setTimeout(function () {
      var screenName = screenOrder[currentScreen];
      if (screenName === 'q4') {
        renderResult(getResult());
      }

      nextScreen();

      // Re-enable options + clear states after transition
      setTimeout(function () {
        options.querySelectorAll('.option').forEach(function (o) {
          o.style.pointerEvents = '';
          o.classList.remove('selected', 'dimmed');
        });
      }, 300);
    }, 420);
  }

  // ---- Share ----
  function handleShare() {
    var arch = archetypes[currentArchKey];
    if (!arch) return;
    var shareUrl = 'https://digitalzen.cloud/?r=' + arch.key;
    var text = 'I\u2019m ' + arch.name + '. What\u2019s your night mode?';

    if (navigator.share) {
      navigator.share({ title: 'My Night Mode', text: text, url: shareUrl }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + ' \u2192 ' + shareUrl).then(function () {
        copiedMsg.classList.add('show');
        setTimeout(function () { copiedMsg.classList.remove('show'); }, 2500);
      });
    }
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
      captureError.textContent = 'This experience is sponsored by KORFYR. To sign up, you must agree to receive emails from KORFYR (Helixirin LLC).';
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

  // ---- Friend referral splash ----
  function checkReferral() {
    var params = new URLSearchParams(window.location.search);
    var r = params.get('r');
    if (!r) return false;

    var archLookup = urlKeyMap[r];
    if (!archLookup || !archetypes[archLookup]) return false;

    var arch = archetypes[archLookup];
    document.getElementById('splashArchetype').textContent = arch.name;

    var screens = quiz.querySelectorAll('.screen');
    screens.forEach(function (s) { s.classList.remove('active'); });
    quiz.querySelector('[data-screen="splash"]').classList.add('active');

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
      screenOrder[0] = 'intro';
      transitionTo(0);
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    quiz.addEventListener('click', function (e) {
      if (e.target.closest('.option')) handleOptionClick(e);
    });

    shareBtn.addEventListener('click', handleShare);
    captureForm.addEventListener('submit', handleCapture);
  });
})();
