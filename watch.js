// --- CÁC HÀM TIỆN ÍCH ---
// Chuyển người dùng đến trang xem phim
function startWatching(movieId) {
    window.location.href = `watch.html?id=${movieId}`;
}

// CẬP NHẬT: Thêm logic tạo nhãn phim
function createMovieCard(movie) {
    // --- Logic tạo nhãn ---
    let labelText = '';
    if (movie.links && movie.links.length > 0) {
        // Lấy tất cả các loại âm thanh duy nhất và hợp lệ
        const audioTypes = [...new Set(movie.links.map(link => link.audio).filter(Boolean))];
        labelText = audioTypes.join(' / ');
    }
    // --- Kết thúc logic tạo nhãn ---

    const div = document.createElement('div');
    div.className = 'movie-item';
    div.onclick = () => startWatching(movie.id);

    // Thêm nhãn vào HTML nếu có
    div.innerHTML = `
        ${labelText ? `<span class="movie-label">${labelText}</span>` : ''}
        <img src="${movie.poster}" alt="${movie.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/160x240/333/ccc?text=No+Image';">
        <h3>${movie.title}</h3>
        <p>Năm: ${movie.year}</p>
    `;
    return div;
}


// --- LOGIC LỊCH SỬ XEM PHIM ---
function addMovieToHistory(movieId) {
    if (!movieId) return;
    const MAX_HISTORY_LENGTH = 20;

    let history = JSON.parse(localStorage.getItem('movieHistory') || '[]');
    history = history.filter(id => id !== movieId);
    history.unshift(movieId);

    if (history.length > MAX_HISTORY_LENGTH) {
        history = history.slice(0, MAX_HISTORY_LENGTH);
    }

    localStorage.setItem('movieHistory', JSON.stringify(history));
}

// --- LOGIC GỢI Ý PHIM ---
function initializeSuggestions(currentMovieId) {
    const suggestionsGrid = document.getElementById('suggestions-grid');
    if (!suggestionsGrid) return;

    const SUGGESTIONS_COUNT = 6;

    const potentialSuggestions = MOVIES_DATA.filter(m => m.id !== currentMovieId);

    for (let i = potentialSuggestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [potentialSuggestions[i], potentialSuggestions[j]] = [potentialSuggestions[j], potentialSuggestions[i]];
    }

    const suggestions = potentialSuggestions.slice(0, SUGGESTIONS_COUNT);

    suggestionsGrid.innerHTML = '';
    suggestions.forEach(movie => {
        suggestionsGrid.appendChild(createMovieCard(movie));
    });
}

// --- LOGIC NÚT NGUỒN PHÁT ---
function updateServerButtonsState() {
    const serverButtons = document.querySelectorAll('.server-btn');
    serverButtons.forEach(btn => {
        btn.disabled = btn.classList.contains('active');
    });
}


// Hàm tìm kiếm trên trang watch
function searchMovies() {
    const query = document.getElementById("search-input").value.trim();
    if (!query) return;
    sessionStorage.setItem('redirectSearch', query);
    window.location.href = 'index.html';
}

// Code chính của trang watch
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    addMovieToHistory(movieId);
    initializeSuggestions(movieId);

    const refreshBtn = document.getElementById('refresh-suggestions-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const suggestionsGrid = document.getElementById('suggestions-grid');
            if (!suggestionsGrid) return;

            suggestionsGrid.style.opacity = 0;

            setTimeout(() => {
                initializeSuggestions(movieId);
                suggestionsGrid.style.opacity = 1;
            }, 300); 
        });
    }

    const movie = MOVIES_DATA.find(m => m.id === movieId);

    if (!movie) {
        document.getElementById('movie-title').textContent = 'Không tìm thấy phim!';
        return;
    }

    document.title = movie.title;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-description-content').innerHTML = movie.description;
    document.getElementById('sidebar-poster-img').src = movie.poster;

    const serverList = document.getElementById('server-list');
    const playerContainer = document.getElementById('iframe-player-container');
    serverList.innerHTML = '';

    function playInIframe(url) {
        playerContainer.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.id = 'iframe-player';
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.border = '0';
        iframe.style.aspectRatio = '16 / 9';
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('frameborder', '0');
        playerContainer.appendChild(iframe);
    }

    movie.links.forEach((link) => {
        const button = document.createElement('button');
        button.className = 'server-btn';
        button.textContent = link.name;
        button.onclick = () => {
            document.querySelectorAll('.server-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            playInIframe(link.url);
            updateServerButtonsState();
        };
        serverList.appendChild(button);
    });

    if (serverList.firstChild) {
        serverList.firstChild.click();
    }

    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    const searchInput = document.getElementById('search-input');
    const searchGroup = document.querySelector('.search-group');
    const searchBtn = document.getElementById('search-btn');
    const headerContainer = document.querySelector('.header-container');

    if (searchGroup && searchInput && searchBtn && headerContainer) {
        searchBtn.addEventListener('click', (e) => {
            if (!searchGroup.classList.contains('active')) {
                e.preventDefault();
                searchGroup.classList.add('active');
                headerContainer.classList.add('search-active');
                searchInput.focus();
            } else {
                searchMovies();
            }
        });

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchMovies();
            }
        });

        searchInput.addEventListener('search', () => {
            if (searchInput.value === '') {
                searchGroup.classList.remove('active');
                headerContainer.classList.remove('search-active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchGroup.contains(e.target) && searchInput.value === '') {
                searchGroup.classList.remove('active');
                headerContainer.classList.remove('search-active');
            }
        });
    }
});