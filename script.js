/* ============================================
   Digital Zen — What's Your Night Frequency?
   Quiz engine, scoring, email capture
   ============================================ */

(function () {
  'use strict';

  // ---- Archetype definitions ----
  var archetypes = {
    curator: {
      name: 'The Curator',
      desc: 'You\'re deliberate about every detail. The album, the lighting, the vessel — nothing is accidental. Your ritual isn\'t a habit. It\'s a selection.',
      insight: 'The difference between hearing and listening is the setup. You\'ve always known this.',
      freq: 92
    },
    architect: {
      name: 'The Architect of Silence',
      desc: 'You build stillness on purpose. While everyone else is reacting, you\'re constructing a space where nothing gets in. Your ritual is subtraction.',
      insight: 'Some thresholds are physical. Yours is the moment you decide the world can wait.',
      freq: 88
    },
    nighthawk: {
      name: 'The Nighthawk',
      desc: 'You don\'t wind down — you redirect. Movement is how you process. The night is your runway, and your ritual has a velocity most people can\'t match.',
      insight: 'Every ritual has a vehicle. Not all of them have wheels. Yours might.',
      freq: 85
    },
    alchemist: {
      name: 'The Alchemist',
      desc: 'You turn nothing into something at 2 AM. Cooking, sketching, building — the medium doesn\'t matter. What matters is that you made it when nobody asked you to.',
      insight: 'The vessel matters as much as what\'s in it. You know this because you chose both.',
      freq: 90
    }
  };

  // ---- State ----
  var scores = { curator: 0, architect: 0, nighthawk: 0, alchemist: 0 };
  var screenOrder = ['intro', 'q1', 'q2', 'q3', 'q4', 'result'];
  var currentScreen = 0;

  // ---- DOM refs ----
  var quiz = document.getElementById('quiz');
  var startBtn = document.getElementById('startBtn');
  var resultArchetype = document.getElementById('resultArchetype');
  var resultDesc = document.getElementById('resultDesc');
  var resultInsight = document.getElementById('resultInsight');
  var resultFreq = document.getElementById('resultFreq');
  var shareBtn = document.getElementById('shareBtn');
  var copiedMsg = document.getElementById('copiedMsg');
  var captureForm = document.getElementById('captureForm');
  var captureEmail = document.getElementById('captureEmail');
  var captureSuccess = document.getElementById('captureSuccess');

  // ---- Navigation ----
  function showScreen(index) {
    var screens = quiz.querySelectorAll('.screen');
    screens.forEach(function (s) { s.classList.remove('active'); });

    var target = quiz.querySelector('[data-screen="' + screenOrder[index] + '"]');
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    currentScreen = index;
  }

  function nextScreen() {
    if (currentScreen < screenOrder.length - 1) {
      showScreen(currentScreen + 1);
    }
  }

  // ---- Scoring ----
  function parseScores(str) {
    // Format: "curator:2,architect:1"
    var result = {};
    str.split(',').forEach(function (pair) {
      var parts = pair.split(':');
      result[parts[0].trim()] = parseInt(parts[1], 10);
    });
    return result;
  }

  function addScores(scoreMap) {
    Object.keys(scoreMap).forEach(function (key) {
      if (scores[key] !== undefined) {
        scores[key] += scoreMap[key];
      }
    });
  }

  function getWinner() {
    var max = -1;
    var winner = 'curator';
    Object.keys(scores).forEach(function (key) {
      if (scores[key] > max) {
        max = scores[key];
        winner = key;
      }
    });
    return winner;
  }

  // ---- Show Result ----
  function showResult() {
    var winner = getWinner();
    var arch = archetypes[winner];

    resultArchetype.textContent = arch.name;
    resultDesc.textContent = arch.desc;
    resultInsight.querySelector('p').textContent = arch.insight;
    resultFreq.style.setProperty('--freq', arch.freq + '%');

    nextScreen();
  }

  // ---- Option clicks ----
  function handleOptionClick(e) {
    var btn = e.target.closest('.option');
    if (!btn) return;

    var scoreData = btn.getAttribute('data-scores');
    if (!scoreData) return;

    // Visual feedback
    var options = btn.parentElement;
    options.querySelectorAll('.option').forEach(function (o) {
      o.classList.remove('selected');
      o.style.pointerEvents = 'none';
    });
    btn.classList.add('selected');

    // Score
    addScores(parseScores(scoreData));

    // Advance after brief delay
    setTimeout(function () {
      var screenName = screenOrder[currentScreen];
      if (screenName === 'q4') {
        showResult();
      } else {
        nextScreen();
      }

      // Re-enable options for back navigation (not implemented but safe)
      options.querySelectorAll('.option').forEach(function (o) {
        o.style.pointerEvents = '';
        o.classList.remove('selected');
      });
    }, 500);
  }

  // ---- Share ----
  function handleShare() {
    var winner = getWinner();
    var arch = archetypes[winner];
    var text = 'My night frequency: ' + arch.name + ' — digitalzen.cloud';

    if (navigator.share) {
      navigator.share({ title: 'My Night Frequency', text: text, url: 'https://digitalzen.cloud' }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () {
        copiedMsg.classList.add('show');
        setTimeout(function () { copiedMsg.classList.remove('show'); }, 2500);
      });
    }
  }

  // ---- Email capture ----
  function handleCapture(e) {
    e.preventDefault();

    var email = captureEmail.value.trim();
    if (!email) return;

    // TODO: Replace with real endpoint (Mailchimp, ConvertKit, etc.)
    // POST to your configured endpoint:
    // fetch('YOUR_ENDPOINT', { method: 'POST', body: JSON.stringify({ email: email }) });

    // Store locally as demo fallback
    try {
      var stored = JSON.parse(localStorage.getItem('dz_emails') || '[]');
      stored.push({ email: email, ts: Date.now(), archetype: getWinner() });
      localStorage.setItem('dz_emails', JSON.stringify(stored));
    } catch (_) {}

    // Show success
    captureForm.classList.add('hidden');
    captureSuccess.classList.add('show');
  }

  // ---- Nav background on scroll ----
  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.style.background = window.scrollY > 50
            ? 'rgba(10, 10, 12, 0.92)'
            : 'rgba(10, 10, 12, 0.6)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---- Boot ----
  document.addEventListener('DOMContentLoaded', function () {
    initNav();

    // Start button
    startBtn.addEventListener('click', function () { nextScreen(); });

    // Option clicks (delegated)
    quiz.addEventListener('click', function (e) {
      if (e.target.closest('.option')) {
        handleOptionClick(e);
      }
    });

    // Share
    shareBtn.addEventListener('click', handleShare);

    // Email capture
    captureForm.addEventListener('submit', handleCapture);
  });
})();
