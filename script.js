(() => {
  'use strict';

  const systems = {
    archive: { icon: '#i-file', sourceLabel: 'SOURCE DOCUMENTS', source: 'Salesforce + DMS', format: 'SHA-256', coreLabel: 'THE BACKEND', core: 'Verify. Back up. Purge.', description: 'Delete only after the backup checks pass.', outputs: ['Verified S3 copy', 'Safe deletion'], result: '830K+ documents · 316 GB archived' },
    lending: { icon: '#i-code', sourceLabel: 'THE LOAN JOURNEY', source: 'Applicants + operations', format: 'REST APIs', coreLabel: 'PYTHON SERVICES', core: 'Validate. Process. Track.', description: 'Configuration-driven steps with audit trails.', outputs: ['Onboarding APIs', 'Fund-use monitoring'], result: 'Appway onboarding · End-Use Monitoring' },
    ai: { icon: '#i-spark', sourceLabel: 'STRUCTURED INPUT', source: 'Education-loan details', format: 'JSON', coreLabel: 'AMAZON BEDROCK', core: 'Analyze. Score. Validate.', description: 'Schema checks keep responses in the workflow.', outputs: ['Validated JSON', 'Human review'], result: 'Production advisory service · Human decisions' }
  };
  const tabs = [...document.querySelectorAll('[data-system]')];
  const panel = document.getElementById('system-panel');
  function selectSystem(tab) {
    const system = systems[tab.dataset.system];
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    const values = { 'flow-source-label': system.sourceLabel, 'flow-source': system.source, 'flow-format': system.format, 'flow-core-label': system.coreLabel, 'flow-core': system.core, 'flow-description': system.description, 'flow-output-one': system.outputs[0], 'flow-output-two': system.outputs[1], 'flow-result': system.result };
    Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = value; });
    document.getElementById('flow-icon').setAttribute('href', system.icon);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSystem(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectSystem(tabs[next]);
    });
  });

  const projects = {
    recorzo: {
      title: 'Recorzo',
      intro: 'A multi-user finance platform that turns bank statements into reconciled, searchable transactions and cash-flow insights.',
      details: [
        ['Reliable imports', 'Imports bank statements, detects duplicate and missing transactions, and reconciles running balances. Transaction enrichment and interactive charts make the data easier to explore.'],
        ['Categorization with feedback', 'Rules and confirmed mappings handle known transactions. AI suggests categories for the rest, with uncertain results sent for review. User corrections become reusable mappings for future transactions.'],
        ['Clear boundaries', 'A multi-user application with transaction data scoped to each user, built around a FastAPI backend and a React interface.']
      ],
      stack: 'Python · FastAPI · PostgreSQL · SQLAlchemy · React · Docker · LLM API'
    },
    backup: {
      title: 'Distributed Backup & Restore Engine',
      intro: 'A backup system that spreads indexed archive parts across storage accounts and restores only the files a user needs.',
      details: [
        ['Selective restoration', 'Selected files are divided into independently restorable archive parts. A file index maps original files to their archive parts and storage destinations, so a restore does not require the entire backup.'],
        ['Storage across accounts', 'Connectors for Amazon S3, Google Drive, and OneDrive combine storage across multiple accounts. The index tracks where each part is stored.'],
        ['Parallel, resumable transfers', 'Parallel uploads and downloads can use multiple network connections. Resumable transfers allow interrupted work to continue.']
      ],
      stack: 'Python · FastAPI · Docker · AWS · Google Drive · OneDrive'
    },
    downloader: {
      title: 'Universal Media Downloader',
      intro: 'A media download manager with format discovery, queued processing, and recovery when a download or application run is interrupted.',
      details: [
        ['A queue that survives restarts', 'A persistent background queue manages downloads with configurable worker concurrency, retry support, progress, speed, ETA, and restart recovery.'],
        ['Playable output', 'yt-dlp discovers media formats and handles supported URLs, including HLS. FFmpeg merges separate audio and video, remuxes media into MP4, and supports output validation.'],
        ['Scope', 'Designed for supported media URLs and streams. General-purpose downloads for arbitrary files are outside the current project scope.']
      ],
      stack: 'Python · FastAPI · asyncio · yt-dlp · FFmpeg · JavaScript'
    }
  };
  const dialog = document.getElementById('project-dialog');
  let trigger;
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('[data-project]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        const project = projects[button.dataset.project];
        document.getElementById('dialog-title').textContent = project.title;
        document.getElementById('dialog-intro').textContent = project.intro;
        const details = document.getElementById('dialog-details');
        details.replaceChildren();
        project.details.forEach(([heading, body]) => {
          const section = document.createElement('section');
          const title = document.createElement('h3');
          const paragraph = document.createElement('p');
          title.textContent = heading;
          paragraph.textContent = body;
          section.append(title, paragraph);
          details.append(section);
        });
        document.getElementById('dialog-stack').textContent = project.stack;
        trigger = button;
        dialog.showModal();
        document.body.classList.add('dialog-open');
      });
    });
    const restorePage = () => {
      document.body.classList.remove('dialog-open');
      trigger?.focus();
    };
    const closeProject = () => {
      dialog.close();
      restorePage();
    };
    document.getElementById('close-dialog').addEventListener('click', closeProject);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeProject();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProject();
    });
    dialog.addEventListener('close', () => {
      if (!dialog.open) restorePage();
    });
  }

  const copyButton = document.getElementById('copy-email');
  const toast = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
  }
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('ravikishandaiya@gmail.com');
        notify('Email address copied.');
      } catch {
        notify('Copy unavailable. Use the email link above.');
      }
    });
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());

  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const trackedSections = navLinks.map(link => document.querySelector(link.hash));
  let navigationFrame = 0;
  function updateNavigation() {
    navigationFrame = 0;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
    const active = atBottom ? trackedSections.at(-1) : trackedSections.filter(section => section.getBoundingClientRect().top <= window.innerHeight * .4).at(-1);
    navLinks.forEach(link => {
      if (active && link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleNavigation() {
    if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation);
  updateNavigation();
})();
