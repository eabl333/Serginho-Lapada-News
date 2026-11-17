// ============================================
// 🔑 CONFIGURAÇÃO DO SUPABASE
// ============================================

const SUPABASE_URL = 'https://uutdsmxvhvnibjaeljqm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ET5BcSdKGYFztFrqiiYTww_ztz6YZIk';

// Criar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
//  FUNÇÕES DE ACESSO
// ============================================

// Buscar notícias
async function buscarNoticias(limite = 10, categoria = null) {
    let query = supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limite);
    
    if (categoria && categoria !== 'Todas') {
        query = query.eq('categoria', categoria);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

// Buscar notícia por ID
async function buscarNoticiaPorId(id) {
    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

// Buscar notícia em destaque
async function buscarDestaque() {
    const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('destaque', true)
        .order('created_at', { ascending: false })
        .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
}

// Buscar desaparecidos
async function buscarDesaparecidos(status = null) {
    let query = supabase
        .from('desaparecidos')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (status && status !== 'Todos') {
        query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

// Buscar desaparecido por ID
async function buscarDesaparecidoPorId(id) {
    const { data, error } = await supabase
        .from('desaparecidos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) throw error;
    return data;
}

// Incrementar visualizações
async function incrementarVisualizacao(id) {
    const { error } = await supabase.rpc('incrementar_visualizacao', {
        tabela: 'noticias',
        id_linha: id
    });
    
    if (error) throw error;
}

// ============================================
// 🖼️ UPLOAD DE IMAGENS
// ============================================

async function uploadImagem(file, pasta = 'noticias') {
    const nomeArquivo = `${Date.now()}_${file.name}`;
    const caminho = `${pasta}/${nomeArquivo}`;
    
    const { data, error } = await supabase.storage
        .from('imagens')
        .upload(caminho, file);
    
    if (error) throw error;
    
    // Pegar URL pública
    const { data: urlData } = supabase.storage
        .from('imagens')
        .getPublicUrl(caminho);
    
    return urlData.publicUrl;
}

// ============================================
//  ADMIN
// ============================================

// Verificar se usuário está autenticado
async function verificarAutenticacao() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session !== null;
}

// Fazer login
async function fazerLogin(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });
    
    if (error) throw error;
    return data;
}

// Fazer logout
async function fazerLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// ============================================
// 📝 ADMIN - CRUD NOTÍCIAS
// ============================================

async function criarNoticia(dados) {
    const { data, error } = await supabase
        .from('noticias')
        .insert([dados])
        .select();
    
    if (error) throw error;
    return data[0];
}

async function atualizarNoticia(id, dados) {
    const { data, error } = await supabase
        .from('noticias')
        .update(dados)
        .eq('id', id)
        .select();
    
    if (error) throw error;
    return data[0];
}

async function excluirNoticia(id) {
    const { error } = await supabase
        .from('noticias')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
}

// ============================================
// 📝 ADMIN - CRUD DESAPARECIDOS
// ============================================

async function criarDesaparecido(dados) {
    const { data, error } = await supabase
        .from('desaparecidos')
        .insert([dados])
        .select();
    
    if (error) throw error;
    return data[0];
}

async function atualizarDesaparecido(id, dados) {
    const { data, error } = await supabase
        .from('desaparecidos')
        .update(dados)
        .eq('id', id)
        .select();
    
    if (error) throw error;
    return data[0];
}

async function excluirDesaparecido(id) {
    const { error } = await supabase
        .from('desaparecidos')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
}
