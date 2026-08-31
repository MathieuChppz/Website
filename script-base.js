const dot  = document.getElementById('cDot');
    const ring = document.getElementById('cRing');

    function isTouchLike() {
      return window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;
    }

    /* CURSOR (desktop only) */
    (function initCursor(){
      if (isTouchLike()) return;
      let mx=0,my=0,rx=0,ry=0;
      document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
      (function lerp(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lerp);})();
      document.querySelectorAll('[onclick],a,button').forEach(el=>{
        el.addEventListener('mouseenter',()=>{dot.style.transform='translate(-50%,-50%) scale(2.2)';ring.style.transform='translate(-50%,-50%) scale(1.5)';ring.style.borderColor='var(--current)';});
        el.addEventListener('mouseleave',()=>{dot.style.transform='translate(-50%,-50%) scale(1)';ring.style.transform='translate(-50%,-50%) scale(1)';ring.style.borderColor='var(--cursor-col)';});
      });
    })();

    /* ROUTER — navigue vers de vrais fichiers HTML */
    const PAGE_FILES = {
      home: 'index.html',
      ingenieur: 'ingenieur.html',
      cinema: 'cinema.html',
      dev: 'dev.html',
      'proj-hopaway': 'proj-hopaway.html',
      'proj-opinion': 'proj-opinion.html',
      onu: 'onu.html',
      'texte-Art': 'texte-Art.html',
      'texte-Femme': 'texte-Femme.html',
      'texte-Guerre': 'texte-Guerre.html'
    };
    function go(id) {
      var file = PAGE_FILES[id];
      if (file) window.location.href = file;
    }

    function toggleDrawer(){document.getElementById('mDrawer').classList.toggle('open');}

    /* SCROLL REVEAL */
    function runReveal(){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
      },{threshold:0.1});
      document.querySelectorAll('.reveal:not(.visible)').forEach(function(el){io.observe(el);});
    }

    /* ═══ ANNOTATIONS ══════════════════════════════════ */

function closeAllPanels() {
      ['art','femme','guerre'].forEach(function(id){
        var panel = document.getElementById('panel-'+id);
        if (panel) panel.classList.remove('open');
      });
      document.body.classList.remove('panel-open');
      document.querySelectorAll('.annotable').forEach(a=>a.classList.remove('active'));
      closeAwardLightbox();
    }

    function openAwardLightbox(card) {
      if (!card) return;
      var lightbox = document.getElementById('awardLightbox');
      if (!lightbox) return;
      var imgEl = document.getElementById('awardLightboxImg');
      var titleEl = document.getElementById('awardLightboxTitle');
      var metaEl = document.getElementById('awardLightboxMeta');
      var textEl = document.getElementById('awardLightboxText');

      if (imgEl) imgEl.src = card.dataset.awardImg || '';
      if (titleEl) titleEl.textContent = card.dataset.awardTitle || 'Prix et Distinction';
      if (metaEl) metaEl.textContent = card.dataset.awardMeta || '';
      if (textEl) textEl.textContent = card.dataset.awardText || '';

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeAwardLightbox() {
      var lightbox = document.getElementById('awardLightbox');
      if (!lightbox || !lightbox.classList.contains('open')) return;
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeAwardLightbox();
    });

    function annotate(el, textId, key) {
  document.querySelectorAll('.annotable').forEach(a => a.classList.remove('active'));
  el.classList.add('active');

  var panel = document.getElementById('panel-' + textId);
  var ann   = ANNOTATIONS[textId] && ANNOTATIONS[textId][key];
  if (!panel) return;
  if (!ann) ann = { title: 'Annotation', text: 'Annotations indisponibles pour le moment.' };

  /* image optionnelle */
  var imgEl = document.getElementById('panel-' + textId + '-img');
  if (imgEl) {
    if (ann.image) { imgEl.src = ann.image; imgEl.style.display = 'block'; }
    else           { imgEl.style.display = 'none'; }
  }

  /* construction du contenu multi-sections */
  var container = document.getElementById('panel-' + textId + '-content');
  var sections = ann.sections;
  if (!sections && (ann.title || ann.text)) {
    sections = [{ subtitle: ann.title || 'Annotation', text: ann.text || '' }];
  }

  if (container && sections && sections.length) {
    container.innerHTML = sections.map(function(s) {
      return '<h4 class="texte-panel-title">' + s.subtitle + '</h4>'
           + (s.text ? '<p class="texte-panel-text">' + s.text + '</p>' : '');
    }).join('<div style="margin-top:18px; padding-top:18px; border-top:1px solid var(--border);"></div>');
  } else if (container) {
    container.innerHTML = '<h4 class="texte-panel-title">Annotation</h4><p class="texte-panel-text">Annotations indisponibles pour le moment.</p>';
  }

  panel.classList.add('open');
  if (isTouchLike()) document.body.classList.add('panel-open');
  panel.scrollTop = 0;
}

    function closePanel(textId) {
      var panel = document.getElementById('panel-'+textId);
      if (panel) panel.classList.remove('open');
      document.querySelectorAll('.annotable').forEach(a=>a.classList.remove('active'));
      document.body.classList.remove('panel-open');
    }

    /* INIT */
    runReveal();
