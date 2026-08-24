// ============================================
// 🕐 RELÓGIO EM TEMPO REAL
// ============================================

function atualizarRelogio() {
    const agora = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const relogio = document.getElementById('relogio');
    if (relogio) {
        relogio.textContent = agora.toLocaleDateString('pt-BR', options);
    }
}

// Atualizar relógio a cada segundo
atualizarRelogio();
setInterval(atualizarRelogio, 1000);

// ============================================
// 📱 MENU MOBILE
// ============================================

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('aberto');
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('aberto');
    });
});

// ============================================
// 📰 CARREGAR NOTÍCIAS DO SUPABASE
// ============================================

async function carregarNoticias() {
    try {
        const noticias = await buscarNoticias(10);
        
        if (!noticias || noticias.length === 0) {
            document.getElementById('listaNoticias').innerHTML = `
                <div style="text-align:center; padding:30px; color:#999;">
                    <i class="fas fa-newspaper" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
                    Nenhuma notícia cadastrada ainda.
                </div>
            `;
            return;
        }
        
        // ===== DESTAQUE =====
        const destaque = noticias.find(n => n.destaque) || noticias[0];
        const destaqueContainer = document.getElementById('destaqueNoticia');
        
        if (destaqueContainer) {
            destaqueContainer.innerHTML = `
                <div class="destaque-img" style="${destaque.imagem_url ? `background-image:url('${destaque.imagem_url}'); background-size:cover; background-position:center;` : ''}">
                    ${!destaque.imagem_url ? `<div class="destaque-placeholder"><i class="fas fa-newspaper" style="font-size:5rem; color:rgba(255,255,255,0.2);"></i></div>` : ''}
                    ${destaque.urgente ? '<span class="badge-urgente"><i class="fas fa-circle" style="font-size:10px; margin-right:4px;"></i> URGENTE</span>' : ''}
                </div>
                <div class="destaque-body">
                    <span class="cat-label cat-${(destaque.categoria || 'geral').toLowerCase()}">${destaque.categoria || 'Geral'}</span>
                    <h1 class="destaque-title">${destaque.titulo}</h1>
                    <p class="destaque-resumo">${destaque.resumo}</p>
                    <div class="meta-row">
                        <span class="meta-autor"><i class="fas fa-pen-fancy"></i> ${destaque.autor || 'Serginho Lapada'}</span>
                        <span class="meta-tempo"><i class="far fa-clock"></i> ${calcularTempoRelativo(destaque.created_at)}</span>
                        <a href="${destaque.link_externo || 'noticia.html?id=' + destaque.id}" ${destaque.link_externo ? 'target="_blank"' : ''} class="btn-leia">Leia mais →</a>
                    </div>
                </div>
            `;
        }
        
        // ===== LISTA DE NOTÍCIAS =====
        const noticiasRestantes = noticias.filter(n => n.id !== destaque.id);
        const listaContainer = document.getElementById('listaNoticias');
        
        if (listaContainer) {
            if (noticiasRestantes.length === 0) {
                listaContainer.innerHTML = `
                    <div style="text-align:center; padding:20px; color:#999;">
                        <i class="fas fa-newspaper" style="font-size:1.5rem; display:block; margin-bottom:8px;"></i>
                        Mais notícias em breve
                    </div>
                `;
            } else {
                listaContainer.innerHTML = noticiasRestantes.slice(0, 5).map(not => `
                    <article class="card fade-in">
                        <div class="card-img-wrap" style="${not.imagem_url ? `background-image:url('${not.imagem_url}'); background-size:cover; background-position:center;` : ''}">
                            ${!not.imagem_url ? `<div class="card-img-ph"><i class="fas fa-newspaper"></i></div>` : ''}
                            <span class="badge badge-${(not.categoria || 'geral').toLowerCase()}">${not.categoria || 'Geral'}</span>
                        </div>
                        <div class="card-body">
                            <h3 class="card-titulo"><a href="${not.link_externo || 'noticia.html?id=' + not.id}" ${not.link_externo ? 'target="_blank"' : ''}>${not.titulo}</a></h3>
                            <p class="card-resumo">${not.resumo}</p>
                            <div class="card-meta">
                                <span><i class="fas fa-pen-fancy"></i> ${not.autor || 'Serginho Lapada'}</span>
                                <span><i class="far fa-clock"></i> ${calcularTempoRelativo(not.created_at)}</span>
                                <a href="${not.link_externo || 'noticia.html?id=' + not.id}" ${not.link_externo ? 'target="_blank"' : ''} class="btn-leia">Leia mais →</a>
                            </div>
                        </div>
                    </article>
                `).join('');
            }
        }
        
        // ===== GRID DE NOTÍCIAS =====
        const gridContainer = document.getElementById('gridNoticias');
        if (gridContainer) {
            const gridNoticias = noticias.slice(2, 5);
            if (gridNoticias.length === 0) {
                gridContainer.innerHTML = `
                    <div style="text-align:center; padding:20px; color:#999; grid-column: 1/-1;">
                        <i class="fas fa-newspaper" style="font-size:1.5rem; display:block; margin-bottom:8px;"></i>
                        Mais notícias em breve
                    </div>
                `;
            } else {
                gridContainer.innerHTML = gridNoticias.map(not => `
                    <article class="card fade-in">
                        <div class="card-img-wrap" style="${not.imagem_url ? `background-image:url('${not.imagem_url}'); background-size:cover; background-position:center;` : ''}">
                            ${!not.imagem_url ? `<div class="card-img-ph"><i class="fas fa-newspaper"></i></div>` : ''}
                            <span class="badge badge-${(not.categoria || 'geral').toLowerCase()}">${not.categoria || 'Geral'}</span>
                        </div>
                        <div class="card-body">
                            <h3 class="card-titulo"><a href="${not.link_externo || 'noticia.html?id=' + not.id}" ${not.link_externo ? 'target="_blank"' : ''}>${not.titulo}</a></h3>
                            <p class="card-resumo">${not.resumo}</p>
                            <div class="card-meta">
                                <span><i class="fas fa-pen-fancy"></i> ${not.autor || 'Serginho Lapada'}</span>
                                <span><i class="far fa-clock"></i> ${calcularTempoRelativo(not.created_at)}</span>
                                <a href="${not.link_externo || 'noticia.html?id=' + not.id}" ${not.link_externo ? 'target="_blank"' : ''} class="btn-leia">Leia mais →</a>
                            </div>
                        </div>
                    </article>
                `).join('');
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        document.getElementById('listaNoticias').innerHTML = `
            <div style="text-align:center; padding:20px; color:#e74c3c;">
                <i class="fas fa-exclamation-triangle"></i> Erro ao carregar notícias: ${error.message}
            </div>
        `;
    }
}

// ============================================
// 🔍 CARREGAR DESAPARECIDOS
// ============================================

async function carregarDesaparecidos() {
    try {
        const desaparecidos = await buscarDesaparecidos();
        const container = document.getElementById('listaDesaparecidos');
        
        if (!container) return;
        
        if (!desaparecidos || desaparecidos.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:20px; color:#999; grid-column: 1/-1;">
                    <i class="fas fa-user-slash" style="font-size:2rem; display:block; margin-bottom:10px;"></i>
                    Nenhum desaparecido cadastrado.
                </div>
            `;
            return;
        }
        
        container.innerHTML = desaparecidos.slice(0, 4).map(des => `
            <div class="desaparecido-card fade-in">
                <div class="desaparecido-foto">
                    <img src="${des.imagem_url || 'https://via.placeholder.com/200'}" 
                         alt="${des.nome}" 
                         onerror="this.src='https://via.placeholder.com/200'">
                </div>
                <div class="desaparecido-info">
                    <h4>${des.nome}</h4>
                    ${des.idade ? `<span style="font-size:13px; color:#666;"><i class="fas fa-calendar-alt"></i> ${des.idade} anos</span>` : ''}
                    ${des.cidade ? `<span style="font-size:13px; color:#666;"><i class="fas fa-map-pin"></i> ${des.cidade}</span>` : ''}
                    <span class="status ${des.status === 'Localizado' ? 'status-localizado' : 'status-desaparecido'}">
                        <i class="${des.status === 'Localizado' ? 'fas fa-check-circle' : 'fas fa-circle'}"></i>
                        ${des.status || 'Desaparecido'}
                    </span>
                    <p>${des.descricao}</p>
                    ${des.link_externo ? `<a href="${des.link_externo}" target="_blank" class="btn-leia">Leia mais →</a>` : ''}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar desaparecidos:', error);
    }
}

// ============================================
// 🔥 MAIS LIDAS
// ============================================

async function carregarMaisLidas() {
    try {
        const noticias = await buscarNoticias(10);
        const container = document.getElementById('maisLidas');
        
        if (!container) return;
        
        if (!noticias || noticias.length === 0) {
            container.innerHTML = '<li style="color:#999; text-align:center; padding:10px;"><i class="fas fa-chart-simple"></i> Sem dados ainda</li>';
            return;
        }
        
        const ordenadas = [...noticias].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0));
        const top5 = ordenadas.slice(0, 5);
        
        container.innerHTML = top5.map(not => `
            <li><a href="${not.link_externo || 'noticia.html?id=' + not.id}" ${not.link_externo ? 'target="_blank"' : ''}>${not.titulo}</a></li>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar mais lidas:', error);
    }
}

// ============================================
// 🕐 ÚLTIMAS ATUALIZAÇÕES
// ============================================

async function carregarUltimasAtualizacoes() {
    try {
        const noticias = await buscarNoticias(5);
        const container = document.getElementById('ultimasAtualizacoes');
        
        if (!container) return;
        
        if (!noticias || noticias.length === 0) {
            container.innerHTML = '<li style="color:#999; text-align:center; padding:10px;"><i class="fas fa-clock"></i> Sem atualizações</li>';
            return;
        }
        
        container.innerHTML = noticias.map(not => {
            const data = new Date(not.created_at);
            const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return `
                <li>
                    <span class="upd-time"><i class="far fa-clock"></i> ${hora}</span>
                    <a href="${not.link_externo || 'noticia.html?id=' + not.id}" ${not.link_externo ? 'target="_blank"' : ''}>${not.titulo}</a>
                </li>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Erro ao carregar atualizações:', error);
    }
}

// ============================================
// ⏱️ CALCULAR TEMPO RELATIVO
// ============================================

function calcularTempoRelativo(dataISO) {
    const agora = new Date();
    const data = new Date(dataISO);
    const diff = Math.floor((agora - data) / 1000);
    
    if (diff < 60) return 'há ' + diff + ' segundos';
    if (diff < 3600) return 'há ' + Math.floor(diff / 60) + ' min';
    if (diff < 86400) return 'há ' + Math.floor(diff / 3600) + ' h';
    if (diff < 604800) return 'há ' + Math.floor(diff / 86400) + ' dias';
    return data.toLocaleDateString('pt-BR');
}

// ============================================
// 🎬 VÍDEOS (dados estáticos de exemplo)
// ============================================

function carregarVideos() {
    const container = document.getElementById('videosGrid');
    if (!container) return;
    
    const videos = [
        { titulo: 'Resumo da semana: principais acontecimentos da cidade', duracao: '5:32', categoria: 'Resumo da semana' },
        { titulo: 'Entrevista exclusiva com o prefeito sobre as obras', duracao: '12:08', categoria: 'Entrevista' },
        { titulo: 'Bastidores do festival que parou a cidade', duracao: '8:21', categoria: 'Entretenimento' }
    ];
    
    container.innerHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumb">
                <span class="video-icon"><i class="fas fa-play-circle"></i></span>
                <span class="video-dur">${video.duracao}</span>
                <div class="play-btn"><i class="fas fa-play"></i></div>
            </div>
            <div class="video-info">
                <span class="video-cat">${video.categoria}</span>
                <h4>${video.titulo}</h4>
            </div>
        </div>
    `).join('');
}

// ============================================
// 📸 GALERIA DE FOTOS
// ============================================

function carregarGaleria() {
    const container = document.getElementById('galeriaFotos');
    if (!container) return;
    
    const fotos = [
        { icon: 'fa-shield-halved', titulo: 'Operação policial no Centro' },
        { icon: 'fa-landmark', titulo: 'Sessão na Câmara Municipal' },
        { icon: 'fa-futbol', titulo: 'Clássico regional no estádio' },
        { icon: 'fa-music', titulo: 'Show no Festival de Música' },
        { icon: 'fa-city', titulo: 'Obras nos bairros da cidade' },
        { icon: 'fa-cloud-rain', titulo: 'Frente fria atinge a região' }
    ];
    
    container.innerHTML = fotos.map(foto => `
        <div class="galeria-item">
            <div class="gal-ph"><i class="fas ${foto.icon}"></i></div>
            <p>${foto.titulo}</p>
        </div>
    `).join('');
}

// ============================================
// 🌐 PLANTAO
// ============================================

function carregarPlantao() {
    const container = document.getElementById('plantaoTrack');
    if (!container) return;
    
    const noticias = [
        '🚨 Acompanhe a sessão da Câmara',
        '🌡️ TEMPO: Frente fria chega à região nas próximas horas',
        '🚧 TRÂNSITO: Avenida Brasil tem bloqueio total no sentido bairro',
        '⚽ ESPORTES: Time local goleia adversário e assume liderança',
        '🚨 Operação policial desarticula quadrilha no Centro'
    ];
    
    const todas = [...noticias, ...noticias];
    container.innerHTML = todas.map(texto => `<span>${texto}</span>`).join('');
}

// ============================================
// 🚀 INICIALIZAR (execução direta, sem DOMContentLoaded)
// ============================================

// Chamar todas as funções imediatamente
carregarNoticias();
carregarDesaparecidos();
carregarMaisLidas();
carregarUltimasAtualizacoes();
carregarVideos();
carregarGaleria();
carregarPlantao();

// Recarregar a cada 5 minutos (opcional)
setInterval(() => {
    carregarNoticias();
    carregarDesaparecidos();
    carregarMaisLidas();
    carregarUltimasAtualizacoes();
}, 300000);