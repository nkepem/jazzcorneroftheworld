document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Active nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Scroll navbar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Fade-in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Animated stat counters — count up from 0 to data-count when scrolled into view
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    };
    requestAnimationFrame(step);
  };

  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => countObserver.observe(c));
  }

  // Contact form
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Message envoyé ✓';
      setTimeout(() => {
        btn.textContent = originalText;
        form.reset();
      }, 3000);
    });
  }

  // Funnel forms — opt-in / order / access forms redirect to the next funnel step.
  // The destination is set with a data-redirect attribute on the <form>.
  document.querySelectorAll('form[data-redirect]').forEach(funnelForm => {
    funnelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = funnelForm.querySelector('button[type="submit"], .btn');
      if (btn) {
        btn.textContent = 'Un instant…';
        btn.style.opacity = '0.7';
      }
      const dest = funnelForm.getAttribute('data-redirect');
      setTimeout(() => { window.location.href = dest; }, 700);
    });
  });

  // Billing toggle (monthly / annual) on the Club page
  const billingToggle = document.querySelector('[data-billing-toggle]');
  if (billingToggle) {
    billingToggle.addEventListener('click', (e) => {
      const opt = e.target.closest('[data-plan]');
      if (!opt) return;
      billingToggle.querySelectorAll('[data-plan]').forEach(b => b.classList.remove('active'));
      opt.classList.add('active');
      const plan = opt.getAttribute('data-plan');
      document.querySelectorAll('[data-price]').forEach(p => {
        p.style.display = p.getAttribute('data-price') === plan ? '' : 'none';
      });
    });
  }
});
