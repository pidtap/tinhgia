// Các biến toàn cục
let currentSlideIndex = 0;
let slideInterval;
let featuredMovies = [];

// --- CÁC HÀM TIỆN ÍCH ---

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    return str;
}

function createMovieCard(movie) {
    let labelText = '';
    if (movie.links && movie.links.length > 0) {
        const audioTypes = [...new Set(movie.links.map(link => link.audio).filter(Boolean))];
        labelText = audioTypes.join(' / ');
    }

    const div = document.createElement('div');
    div.className = 'movie-item';
    div.onclick = () => openInfoPopup(movie.id);

    div.innerHTML = `
        ${labelText ? `<span class="movie-label">${labelText}</span>` : ''}
        <img src="${movie.poster}" alt="${movie.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/160x240/333/ccc?text=No+Image';">
        <h3>${movie.title}</h3>
        <p>Năm: ${movie.year}</p>
    `;
    return div;
}


window.openInfoPopup = function(movieId) {
    const movie = MOVIES_DATA.find(m => m.id === movieId);
    if (!movie) return;

    const availableAudios = movie.links && movie.links.length > 0
        ? [...new Set(movie.links.map(link => link.audio).filter(Boolean))].join(' / ')
        : '';

    const infoPopup = document.getElementById('movie-info-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    popupOverlay.style.display = 'block';
    infoPopup.style.display = 'block';
    infoPopup.innerHTML = `
        <button class="popup-close-btn" onclick="closeInfoPopup()">×</button>
        <div class="info-title">${movie.title}</div>
        <div class="info-item"><strong>Năm:</strong> ${movie.year}</div>
        ${availableAudios ? `<div class="info-item"><strong>Âm thanh:</strong> ${availableAudios}</div>` : ''}
        <div class="info-item info-description">${movie.description}</div>
        <div class="popup-actions">
            <button class="popup-watch-btn" onclick="startWatching('${movie.id}')"><i class="fas fa-play"></i> Xem ngay</button>
        </div>
    `;
}

window.closeInfoPopup = function() {
    document.getElementById('popup-overlay').style.display = 'none';
    document.getElementById('movie-info-popup').style.display = 'none';
}

window.startWatching = function(movieId) {
    window.location.href = `watch.html?id=${movieId}`;
}

// --- LOGIC TRANG CHỦ ---

function initializeHomepage() {
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (!sliderContainer) return;
    const moviesToShuffle = [...MOVIES_DATA];
    for (let i = moviesToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [moviesToShuffle[i], moviesToShuffle[j]] = [moviesToShuffle[j], moviesToShuffle[i]];
    }
    featuredMovies = moviesToShuffle;
    if (featuredMovies.length === 0) return;

    sliderContainer.innerHTML = ''; // Xóa nội dung cũ

    // Tạo và chèn các slide vào container
    featuredMovies.forEach((movie) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        const imageName = movie.poster.split('/').pop();
        const newImagePath = `carousel-images/${imageName}`;
        slide.style.backgroundImage = `url(${newImagePath})`;
        slide.innerHTML = `
            <div class="slide-content">
                <div class="slide-text-wrapper">
                    <h2>${movie.title}</h2>
                    <div class="meta"><span>${movie.year}</span> • <span>${movie.category === 'phim-le' ? 'Phim Lẻ' : 'Phim Bộ'}</span></div>
                    <p class="description">${movie.description}</p>
                    <div class="slide-actions">
                        <button class="watch-btn" onclick="startWatching('${movie.id}')"><i class="fas fa-play"></i> Xem phim</button>
                    </div>
                </div>
            </div>`;
        sliderContainer.appendChild(slide);
    });

    // Tạo và chèn nút bấm ngẫu nhiên vào container
    const randomBtn = document.createElement('button');
    randomBtn.id = 'random-slide-btn';
    randomBtn.title = 'Slide ngẫu nhiên';
    randomBtn.innerHTML = '<i class="fas fa-dice"></i>';
    
    // Gắn sự kiện click cho nút
    randomBtn.onclick = () => {
        // Lấy một chỉ số ngẫu nhiên trong danh sách slide
        const randomIndex = Math.floor(Math.random() * featuredMovies.length);
        
        // Hiển thị slide ngẫu nhiên
        showSlide(randomIndex);
        
        // Khởi động lại bộ đếm thời gian tự chuyển slide
        startSlideInterval();
    };
    sliderContainer.appendChild(randomBtn);

    showSlide(0);
    startSlideInterval();
}


function initializeHomepageSuggestions() {
    const suggestionsGrid = document.getElementById('homepage-suggestions-grid');
    if (!suggestionsGrid) return;
    const SUGGESTIONS_COUNT = 6;
    const moviesToShuffle = [...MOVIES_DATA];
    for (let i = moviesToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [moviesToShuffle[i], moviesToShuffle[j]] = [moviesToShuffle[j], moviesToShuffle[i]];
    }
    const suggestions = moviesToShuffle.slice(0, SUGGESTIONS_COUNT);
    suggestionsGrid.innerHTML = '';
    suggestions.forEach(movie => {
        suggestionsGrid.appendChild(createMovieCard(movie));
    });
}

function initializeMovieScroller() {
    const container = document.getElementById('movie-row-full');
    if (!container) return;
    container.innerHTML = '';
    const moviesToShuffle = [...MOVIES_DATA];
    for (let i = moviesToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [moviesToShuffle[i], moviesToShuffle[j]] = [moviesToShuffle[j], moviesToShuffle[i]];
    }
    moviesToShuffle.forEach(movie => {
        container.appendChild(createMovieCard(movie));
    });
}

// --- LOGIC VUỐT VÀ LỊCH SỬ XEM PHIM ---

/**
 * Gắn các sự kiện vuốt (touch) và kéo (mouse) vào một element
 * @param {HTMLElement} element - Element cần gắn sự kiện
 */
/**
 * Gắn các sự kiện vuốt (touch) và kéo (mouse) vào một element
 * @param {HTMLElement} element - Element cần gắn sự kiện
 */
function attachSwipeEvents(element) {
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false; // Cờ để kiểm tra đã kéo hay chưa

    // --- Sự kiện cho chuột (Desktop) ---

    // 1. Khi nhấn chuột xuống
    element.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false; // Reset cờ mỗi lần nhấn chuột
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        element.classList.remove('is-dragging');
    });

    // 2. Khi di chuyển chuột
    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Ngăn chọn văn bản khi kéo

        const x = e.pageX - element.offsetLeft;
        const walk = x - startX;

        // Nếu di chuyển hơn 5px thì mới tính là kéo
        if (Math.abs(walk) > 5) {
            hasDragged = true;
        }

        if (hasDragged) {
            element.classList.add('is-dragging');
            element.scrollLeft = scrollLeft - walk * 2; // Kéo nhanh hơn
        }
    });

    // 3. Khi nhả chuột hoặc chuột rời khỏi vùng
    const endDrag = () => {
        isDown = false;
        element.classList.remove('is-dragging');
    };
    element.addEventListener('mouseup', endDrag);
    element.addEventListener('mouseleave', endDrag);

    // 4. Xử lý sự kiện click
    element.addEventListener('click', (e) => {
        // Nếu đã kéo (hasDragged là true) thì chặn sự kiện click
        if (hasDragged) {
            e.stopPropagation();
        }
    }, true); // "true" để chạy ở pha capturing, xử lý trước khi click vào phim

    // --- Sự kiện cho cảm ứng (Mobile) ---

    element.addEventListener('touchstart', (e) => {
        isDown = true;
        hasDragged = false;
        startX = e.touches[0].pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
        element.classList.remove('is-dragging');
    });

    element.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - element.offsetLeft;
        const walk = x - startX;

        if (Math.abs(walk) > 5) {
            hasDragged = true;
        }
        
        if (hasDragged) {
            element.scrollLeft = scrollLeft - walk * 2;
        }
    });

    element.addEventListener('touchend', endDrag);
}

function setupHistoryScroller() {
    const scroller = document.querySelector('#history-container .movie-scroller-inner');
    const arrowLeft = document.getElementById('history-arrow-left');
    const arrowRight = document.getElementById('history-arrow-right');
    if (!scroller || !arrowLeft || !arrowRight) return;

    function updateArrows() {
        // Hiện/ẩn nút dựa trên vị trí cuộn
        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        arrowLeft.disabled = scroller.scrollLeft < 1;
        arrowRight.disabled = scroller.scrollLeft >= maxScrollLeft - 1;
    }

    arrowLeft.addEventListener('click', () => {
        const scrollAmount = scroller.clientWidth * 0.8; // Cuộn 80% chiều rộng
        scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    arrowRight.addEventListener('click', () => {
        const scrollAmount = scroller.clientWidth * 0.8;
        scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Cập nhật trạng thái mũi tên khi người dùng tự cuộn
    scroller.addEventListener('scroll', updateArrows);

    // Cập nhật khi kích thước cửa sổ thay đổi
    new ResizeObserver(updateArrows).observe(scroller);

    // Cập nhật khi nội dung thay đổi
    new MutationObserver(updateArrows).observe(scroller.querySelector('#history-row-items'), { childList: true });

    updateArrows(); // Cập nhật lần đầu
}

function initializeHistorySection() {
    const historyContainer = document.getElementById('history-container');
    const historyRow = document.getElementById('history-row-items');
    const scrollerInner = document.querySelector('#history-container .movie-scroller-inner');
    if (!historyContainer || !historyRow || !scrollerInner) return;

    const history = JSON.parse(localStorage.getItem('movieHistory') || '[]');

    if (history.length === 0) {
        historyContainer.style.display = 'none';
        return;
    }

    historyContainer.style.display = 'block';
    historyRow.innerHTML = '';

    history.forEach(movieId => {
        const movie = MOVIES_DATA.find(m => m.id === movieId);
        if (movie) {
            historyRow.appendChild(createMovieCard(movie));
        }
    });

    // Kích hoạt chức năng cho cả nút bấm và vuốt
    setupHistoryScroller();
    attachSwipeEvents(scrollerInner);
}

// --- CÁC HÀM KHÁC ---

function showSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    currentSlideIndex = (index + slides.length) % slides.length;
    slides.forEach(s => s.classList.remove('active'));
    slides[currentSlideIndex].classList.add('active');
}

function nextSlide() { showSlide(currentSlideIndex + 1); }
function startSlideInterval() { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 5000); }

// --- LOGIC TÌM KIẾM & CHUYỂN ĐỔI GIAO DIỆN ---

function showHomepageView() {
    document.getElementById('homepage-content').style.display = 'block';
    document.getElementById('all-movies-container').style.display = 'block';
    document.getElementById('history-container').style.display = 'block';
    document.getElementById('search-results-container').style.display = 'none';
    document.getElementById('homepage-suggestions-container').style.display = 'block';
    initializeHistorySection();

    const searchInput = document.getElementById('search-input');
    if(searchInput) searchInput.value = '';
}

function showAllMoviesGrid() {
    document.getElementById('homepage-content').style.display = 'none';
    document.getElementById('all-movies-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('homepage-suggestions-container').style.display = 'none';
    const resultsContainer = document.getElementById('search-results-container');
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '';
    const titleEl = document.createElement('h2');
    titleEl.id = 'section-title';
    titleEl.textContent = 'Tất Cả Phim';
    resultsContainer.appendChild(titleEl);
    const gridContainer = document.createElement('div');
    gridContainer.className = 'movie-grid';
    MOVIES_DATA.forEach(movie => {
        gridContainer.appendChild(createMovieCard(movie));
    });
    resultsContainer.appendChild(gridContainer);
}

function showAllHistoryGrid() {
    document.getElementById('homepage-content').style.display = 'none';
    document.getElementById('all-movies-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('homepage-suggestions-container').style.display = 'none';
    const resultsContainer = document.getElementById('search-results-container');
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = '';
    const titleEl = document.createElement('h2');
    titleEl.id = 'section-title';
    titleEl.textContent = 'Lịch Sử Đã Xem';
    resultsContainer.appendChild(titleEl);

    const history = JSON.parse(localStorage.getItem('movieHistory') || '[]');
    if (history.length === 0) {
        resultsContainer.innerHTML += '<p style="text-align: center;">Chưa có lịch sử xem phim.</p>';
        return;
    }

    const gridContainer = document.createElement('div');
    gridContainer.className = 'movie-grid';
    history.forEach(movieId => {
        const movie = MOVIES_DATA.find(m => m.id === movieId);
        if (movie) {
            gridContainer.appendChild(createMovieCard(movie));
        }
    });
    resultsContainer.appendChild(gridContainer);
}


function performSearch(query, originalQuery) {
    if (!query) {
        showHomepageView();
        return;
    }
    document.getElementById('homepage-content').style.display = 'none';
    document.getElementById('all-movies-container').style.display = 'none';
    document.getElementById('history-container').style.display = 'none';
    document.getElementById('homepage-suggestions-container').style.display = 'none';
    const searchResultsContainer = document.getElementById('search-results-container');
    searchResultsContainer.style.display = 'block';
    searchResultsContainer.innerHTML = '';
    const results = MOVIES_DATA.filter(m => removeVietnameseTones(m.title.toLowerCase()).includes(query));
    const titleEl = document.createElement('h2');
    titleEl.id = 'section-title';
    titleEl.textContent = `Kết quả tìm kiếm cho: "${originalQuery}"`;
    searchResultsContainer.appendChild(titleEl);
    if (results.length === 0) {
        searchResultsContainer.innerHTML += '<p style="text-align: center;">Không tìm thấy phim phù hợp.</p>';
        return;
    }
    const gridContainer = document.createElement('div');
    gridContainer.className = 'movie-grid';
    results.forEach(movie => {
        gridContainer.appendChild(createMovieCard(movie));
    });
    searchResultsContainer.appendChild(gridContainer);
}


window.searchMovies = function() {
    const searchInput = document.getElementById('search-input');
    const originalQuery = searchInput.value.trim();
    const query = removeVietnameseTones(originalQuery.toLowerCase());

    if (document.getElementById('watch-page-container')) {
        if (!originalQuery) return;
        sessionStorage.setItem('redirectSearch', originalQuery);
        window.location.href = 'index.html';
    } else {
        performSearch(query, originalQuery);
    }
}

// --- KHỞI TẠO KHI TẢI TRANG ---

document.addEventListener('DOMContentLoaded', () => {
    // Scroll header
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Khởi tạo các mục trên trang chủ
    if (document.getElementById('homepage-content')) {
        initializeHomepage();
        initializeHomepageSuggestions();
        initializeMovieScroller();
        initializeHistorySection();
    }

    // Logic Popup
    document.getElementById('popup-overlay')?.addEventListener('click', closeInfoPopup);

    // Logic nút Logo/Trang chủ
    document.getElementById('logo-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        const searchResultsContainer = document.getElementById('search-results-container');
        if (searchResultsContainer.style.display === 'block') {
             showHomepageView();
        } else {
            window.location.href = 'index.html';
        }
    });

    // Logic ô tìm kiếm
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
            if (e.key === 'Enter') searchMovies();
        });
        searchInput.addEventListener('search', () => {
            if(searchInput.value === '' && !document.getElementById('watch-page-container')) {
                showHomepageView();
            }
        });
        document.addEventListener('click', (e) => {
            if (!searchGroup.contains(e.target) && searchInput.value === '') {
                searchGroup.classList.remove('active');
                headerContainer.classList.remove('search-active');
            }
        });
    }

    // Logic tìm kiếm chuyển hướng
    const redirectSearch = sessionStorage.getItem('redirectSearch');
    if (redirectSearch && !document.getElementById('watch-page-container')) {
        sessionStorage.removeItem('redirectSearch');
        searchInput.value = redirectSearch;
        performSearch(removeVietnameseTones(redirectSearch.toLowerCase()), redirectSearch);
        searchGroup.classList.add('active');
        headerContainer.classList.add('search-active');
    }

    // Logic nút "Xem tất cả"
    document.querySelector('#all-movies-container .view-all-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showAllMoviesGrid();
    });

    document.getElementById('view-all-history-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showAllHistoryGrid();
    });

    const refreshBtn = document.getElementById('refresh-homepage-suggestions-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const suggestionsGrid = document.getElementById('homepage-suggestions-grid');
            if (!suggestionsGrid) return;
            suggestionsGrid.style.opacity = 0;
            setTimeout(() => {
                initializeHomepageSuggestions();
                suggestionsGrid.style.opacity = 1;
            }, 300);
        });
    }
});