/* ============================================
   Digital Zen — What's Your Night Frequency?
   Quiz engine: scoring, 10 archetypes, share URLs
   ============================================ */

(function () {
  'use strict';

  // ---- Archetype definitions (4 core + 6 hybrids) ----
  var archetypes = {
    precision: {
      key: 'architect',
      name: 'The Architect of Silence',
      freqTag: 'Your frequency: Controlled',
      freq: 85,
      rarity: 'Only 14% of people get this result.',
      body: [
        'You build stillness on purpose. While everyone else is reacting, you\u2019re constructing a space where nothing gets in. Your ritual is subtraction \u2014 removing what doesn\u2019t belong until what\u2019s left is exactly right.',
        'You don\u2019t do \u201Cgood enough.\u201D The details aren\u2019t details to you \u2014 they\u2019re the whole point. You chose your hour, your setting, your tools with the same precision other people reserve for things that don\u2019t matter.'
      ],
      insight: 'Some thresholds are physical. Yours is the moment you decide the world can wait.'
    },
    stillness: {
      key: 'keeper',
      name: 'The Keeper of the Threshold',
      freqTag: 'Your frequency: Receptive',
      freq: 60,
      rarity: 'Only 11% of people get this result.',
      body: [
        'You don\u2019t chase the moment. You hold still until it arrives. Your ritual isn\u2019t about doing \u2014 it\u2019s about the quality of your attention when you\u2019ve stopped doing everything else.',
        'Other people fill silence with noise. You\u2019ve learned that silence has a texture, and the right kind of quiet is the most underrated luxury there is. Your threshold isn\u2019t a place. It\u2019s a decision to stop performing and start receiving.'
      ],
      insight: 'The rarest thing you can give a moment is your full, undivided nothing.'
    },
    kinetic: {
      key: 'circuit',
      name: 'The Night Circuit',
      freqTag: 'Your frequency: Restless',
      freq: 92,
      rarity: 'Only 18% of people get this result.',
      body: [
        'You don\u2019t wind down. You redirect. The energy doesn\u2019t leave \u2014 it just changes shape. Your ritual is motion: the drive, the walk, the pace of thought that only unlocks when your body is moving.',
        'People mistake this for restlessness. It\u2019s not. It\u2019s a different kind of attention \u2014 one that requires movement to function. The road with no destination isn\u2019t aimless. It\u2019s the only map that makes sense to you.'
      ],
      insight: 'Stillness is a language you understand. You just don\u2019t speak it.'
    },
    generative: {
      key: 'alchemist',
      name: 'The 2 AM Alchemist',
      freqTag: 'Your frequency: Generative',
      freq: 74,
      rarity: 'Only 9% of people get this result.',
      body: [
        'Your best work happens when nobody\u2019s watching. Not because you need secrecy, but because the absence of an audience removes the performance. What\u2019s left is the thing itself \u2014 the making, the process, the slow accumulation of something that didn\u2019t exist before.',
        'The kitchen counter, the late-night project, the thing nobody asked for \u2014 that\u2019s your ritual. You think with your hands. You feel with your output. The ceremony is the creation itself.'
      ],
      insight: 'Nobody asked for it. That\u2019s why it\u2019s good.'
    },
    // ---- Hybrids (tie-breakers) ----
    'precision+stillness': {
      key: 'minimalist',
      name: 'The Precision Minimalist',
      freqTag: 'Your frequency: Refined',
      freq: 78,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'You\u2019ve eliminated everything except what earns its place. Your ritual is the intersection of control and stillness \u2014 a space so refined it practically hums.'
      ],
      insight: 'You don\u2019t add. You subtract until it\u2019s perfect.'
    },
    'precision+kinetic': {
      key: 'wanderer',
      name: 'The Deliberate Wanderer',
      freqTag: 'Your frequency: Paradoxical',
      freq: 82,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'You move with purpose, even when there\u2019s no destination. Your ritual is the paradox of controlled spontaneity \u2014 every unplanned moment was, in its own way, engineered.'
      ],
      insight: 'You planned not to plan. And it worked.'
    },
    'precision+generative': {
      key: 'engineer',
      name: 'The Midnight Engineer',
      freqTag: 'Your frequency: Exacting',
      freq: 80,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'Precision meets creation. You make things at odd hours, and everything you make carries the mark of someone who cares about tolerances that nobody else will notice.'
      ],
      insight: 'It\u2019s not done until it\u2019s right. And \u201Cright\u201D has nothing to do with morning.'
    },
    'stillness+kinetic': {
      key: 'monk',
      name: 'The Restless Monk',
      freqTag: 'Your frequency: Contradictory',
      freq: 70,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'You crave stillness but your body won\u2019t cooperate. Your ritual is finding the eye of the hurricane \u2014 motion around you, quiet within.'
      ],
      insight: 'You don\u2019t sit with silence. You chase it until it stops running.'
    },
    'stillness+generative': {
      key: 'builder',
      name: 'The Quiet Builder',
      freqTag: 'Your frequency: Meditative',
      freq: 66,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'You make things in silence. No music, no conversation, just the thing and your attention. Your ritual is the meditative repetition of hands doing what they know.'
      ],
      insight: 'The quiet isn\u2019t the absence of noise. It\u2019s the presence of focus.'
    },
    'kinetic+generative': {
      key: 'nocturnal',
      name: 'The Nocturnal',
      freqTag: 'Your frequency: Untamed',
      freq: 88,
      rarity: 'Fewer than 8% of people get this result.',
      body: [
        'Energy and creation in perpetual orbit. You\u2019re the person who starts a project at midnight and surfaces four hours later having made something real. Your ritual is productive chaos with a purpose.'
      ],
      insight: 'You don\u2019t have a bedtime. You have a creative window.'
    }
  };

  // Map URL param keys to archetype lookup keys
  var urlKeyMap = {
    architect: 'precision',
    keeper: 'stillness',
    circuit: 'kinetic',
    alchemist: 'generative',
    minimalist: 'precision+stillness',
    wanderer: 'precision+kinetic',
    engineer: 'precision+generative',
    monk: 'stillness+kinetic',
    builder: 'stillness+generative',
    nocturnal: 'kinetic+generative'
  };

  // ---- State ----
  var traits = { precision: 0, stillness: 0, kinetic: 0, generative: 0 };
  var screenOrder = ['intro', 'q1', 'q2', 'q3', 'q4', 'result'];
  var currentScreen = 0;
  var currentArchKey = null; // the lookup key for the winning archetype

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
  var captureSuccess = document.getElementById('captureSuccess');

  // ---- Helpers ----
  function showScreen(index) {
    var screens = quiz.querySelectorAll('.screen');
    screens.forEach(function (s) { s.classList.remove('active'); });

    var name = screenOrder[index];
    var target = quiz.querySelector('[data-screen="' + name + '"]');
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
  function getResult() {
    // Find max score
    var max = 0;
    Object.keys(traits).forEach(function (k) {
      if (traits[k] > max) max = traits[k];
    });

    // Collect all traits at max
    var winners = [];
    Object.keys(traits).forEach(function (k) {
      if (traits[k] === max) winners.push(k);
    });

    // Sort for consistent hybrid keys
    winners.sort();

    if (winners.length === 1) {
      return winners[0]; // core archetype
    }

    // Two-way tie: use hybrid
    if (winners.length === 2) {
      return winners[0] + '+' + winners[1];
    }

    // 3+ way tie: pick first two alphabetically
    return winners[0] + '+' + winners[1];
  }

  // ---- Render Result ----
  function renderResult(archKey) {
    var arch = archetypes[archKey];
    if (!arch) arch = archetypes.precision; // fallback
    currentArchKey = archKey;

    resultArchetype.textContent = arch.name;
    resultFreqTag.textContent = arch.freqTag;
    resultFreq.style.setProperty('--freq', arch.freq + '%');
    resultRarity.textContent = arch.rarity;
    resultInsight.textContent = '\u201C' + arch.insight + '\u201D';

    // Build body paragraphs
    resultBody.innerHTML = '';
    arch.body.forEach(function (para) {
      var p = document.createElement('p');
      p.textContent = para;
      resultBody.appendChild(p);
    });

    // Update URL without reload
    var urlKey = arch.key;
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '?r=' + urlKey);
    }
  }

  // ---- Option clicks ----
  function handleOptionClick(e) {
    var btn = e.target.closest('.option');
    if (!btn) return;

    var trait = btn.getAttribute('data-trait');
    if (!trait || traits[trait] === undefined) return;

    // Visual feedback
    var options = btn.parentElement;
    options.querySelectorAll('.option').forEach(function (o) {
      o.classList.remove('selected');
      o.style.pointerEvents = 'none';
    });
    btn.classList.add('selected');

    // Score
    traits[trait]++;

    // Advance after delay for selection feel
    setTimeout(function () {
      var screenName = screenOrder[currentScreen];
      if (screenName === 'q4') {
        var archKey = getResult();
        renderResult(archKey);
        nextScreen();
      } else {
        nextScreen();
      }
      // Re-enable
      options.querySelectorAll('.option').forEach(function (o) {
        o.style.pointerEvents = '';
        o.classList.remove('selected');
      });
    }, 400);
  }

  // ---- Share ----
  function handleShare() {
    var arch = archetypes[currentArchKey];
    if (!arch) return;

    var urlKey = arch.key;
    var shareUrl = 'https://digitalzen.cloud/?r=' + urlKey;
    var text = 'I\u2019m ' + arch.name + '. What\u2019s your night frequency?';

    if (navigator.share) {
      navigator.share({
        title: 'My Night Frequency',
        text: text,
        url: shareUrl
      }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + ' \u2192 ' + shareUrl).then(function () {
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
    // fetch('YOUR_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email, archetype: currentArchKey })
    // });

    // localStorage demo fallback
    try {
      var stored = JSON.parse(localStorage.getItem('dz_emails') || '[]');
      stored.push({ email: email, ts: Date.now(), archetype: currentArchKey });
      localStorage.setItem('dz_emails', JSON.stringify(stored));
    } catch (_) {}

    captureForm.classList.add('hidden');
    captureSuccess.classList.add('show');
  }

  // ---- Friend referral splash (?r= parameter) ----
  function checkReferral() {
    var params = new URLSearchParams(window.location.search);
    var r = params.get('r');
    if (!r) return false;

    // Look up archetype by URL key
    var archLookup = urlKeyMap[r];
    if (!archLookup || !archetypes[archLookup]) return false;

    var arch = archetypes[archLookup];
    var splashArchetype = document.getElementById('splashArchetype');
    splashArchetype.textContent = arch.name;

    // Show splash instead of intro
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
    var hasReferral = checkReferral();

    // Start buttons
    startBtn.addEventListener('click', function () { nextScreen(); });
    splashBtn.addEventListener('click', function () {
      // Switch to intro flow (screen order starts at intro)
      screenOrder[0] = 'intro'; // ensure intro is first
      showScreen(0);
      // Clear the URL param
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    // Option clicks (delegated)
    quiz.addEventListener('click', function (e) {
      if (e.target.closest('.option')) handleOptionClick(e);
    });

    shareBtn.addEventListener('click', handleShare);
    captureForm.addEventListener('submit', handleCapture);
  });
})();
