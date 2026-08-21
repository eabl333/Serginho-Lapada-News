// RELÓGIO EM TEMPO REAL
(function() {
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function pad(n) { return String(n).padStart(2, '0'); }
  function atualizarRelogio() {
    const agora = new Date();
    const relogio = document.getElementById('relogio');
    if (relogio) {
      relogio.textContent = `${diasSemana[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]} de ${agora.getFullYear()} • ${pad(agora.getHours())}:${pad(agora.getMinutes())}:${pad(agora.getSeconds())}`;
    }
  }
  atualizarRelogio();
  setInterval(atualizarRelogio, 1000);
})();

// MENU MOBILE
(function() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }
})()

// FADE-IN COM INTERSECTION OBSERVER
(function() {
  const items = document.querySelectorAll('.fade-in');
  if (items.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }
})();

// BARRA DE PLANTÃO: PAUSA NO HOVER
(function() {
  const track = document.getElementById('plantaoTrack');
  if (track) {
    const bar = track.closest('.plantao-bar');
    bar?.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    bar?.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }
})();

// VÍDEOS FUNCIONAIS (abre o link em nova aba)
document.querySelectorAll('.video-card').forEach(video => {
  video.addEventListener('click', () => {
    const url = video.getAttribute('data-video') || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    window.open(url, '_blank');
  });
});

// SIMULA ATUALIZAÇÃO DAS "ÚLTIMAS ATUALIZAÇÕES"
(function() {
  const noticiasNovas = [
    'Bombeiros combatem incêndio no Distrito Industrial',
    'Prefeito assina convênio com governo estadual',
    'Candidatos apresentam propostas para eleições',
    'Temporal causa alagamentos em bairros baixos'
  ];
  let idx = 0;
  setInterval(() => {
    const lista = document.querySelectorAll('.ultimas-list li a');
    if (lista.length) {
      const agora = new Date();
      const hora = `${String(agora.getHours()).padStart(2,'0')}:${String(agora.getMinutes()).padStart(2,'0')}`;
      lista[0].textContent = noticiasNovas[idx % noticiasNovas.length];
      const timeSpan = lista[0].closest('li')?.querySelector('.upd-time');
      if (timeSpan) timeSpan.textContent = hora;
      idx++;
    }
  }, 30000);
})();

// PREVENÇÃO DE CLIQUE EM LINKS # (apenas exemplo)
document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

document.addEventListener('DOMContentLoaded', function () {
  fetch('lapada_dados.json')
    .then(res => {
      if (!res.ok) throw new Error('Arquivo JSON não encontrado');
      return res.json();
    })
    .then(dados => {
      // Exibir notícias
      const containerNoticias = document.querySelector('.news-grid');
      if (containerNoticias && dados.noticias) {
        containerNoticias.innerHTML = dados.noticias.map(not => `
          <article class="news-card">
            <div class="card-body">
              <h3>${not.titulo}</h3>
              <p>${not.resumo}</p>
              <div class="card-footer">
                <span>✍️ ${not.autor}</span>
                <span>🕒 ${not.tempo}</span>
              </div>
            </div>
          </article>
        `).join('');
      }

      // Exibir desaparecidos
      const containerDesaparecidos = document.querySelector('.desaparecidos-grid');
      if (containerDesaparecidos && dados.desaparecidos) {
        containerDesaparecidos.innerHTML = dados.desaparecidos.map(des => `
          <div class="desaparecido-card">
            <img src="${des.foto}" alt="${des.nome}" onerror="this.src='https://via.placeholder.com/150'">
            <h4>${des.nome}</h4>
            <p>${des.descricao}</p>
          </div>
        `).join('');
      }
    })
    .catch(err => console.error('Erro ao carregar dados:', err));
});