// Translation data
const translations = {
    ru: {
        title: "BeenVONV - Модельное Агентство",
        subtitle: "Модельное Агентство",
        searchTitle: "Поиск модели по ID",
        searchPlaceholder: "Введите ID модели (например: 123456789)",
        searchButton: "Найти",
        infoText: "Введите уникальный ID для поиска профиля модели",
        popularProfiles: "Популярные профили",
        footer: "© 2024 BeenVONV Модельное Агентство. Все права защищены.",
        // Profile page
        profileName: "Стелла Авинуловска Шказенют Смирноваливска",
        personalInfo: "Личная информация",
        age: "Возраст",
        height: "Рост",
        weight: "Вес",
        eyeColor: "Цвет глаз",
        hairColor: "Цвет волос",
        measurements: "Параметры",
        bust: "Грудь",
        waist: "Талия", 
        hips: "Бедра",
        years: "лет",
        cm: "см",
        kg: "кг",
        pounds: "фунтов",
        hazel: "Карие",
        blonde: "Блондинка",
        statistics: "Статистика",
        photoshoots: "Фотосессий",
        campaigns: "Рекламных кампаний",
        awards: "Награды",
        backToSearch: "Вернуться к поиску",
        recentAwards: "Последние награды"
    },
    en: {
        title: "BeenVONV - Modeling Agency",
        subtitle: "Modeling Agency",
        searchTitle: "Search Model by ID",
        searchPlaceholder: "Enter model ID (e.g.: 123456789)",
        searchButton: "Search",
        infoText: "Enter unique ID to search for model profile",
        popularProfiles: "Popular Profiles",
        footer: "© 2024 BeenVONV Modeling Agency. All rights reserved.",
        // Profile page
        profileName: "Stella Avinulovska Shkazenyut Smirnovalievska",
        personalInfo: "Personal Information",
        age: "Age",
        height: "Height",
        weight: "Weight",
        eyeColor: "Eye Color",
        hairColor: "Hair Color",
        measurements: "Measurements",
        bust: "Bust",
        waist: "Waist",
        hips: "Hips",
        years: "years",
        cm: "cm",
        kg: "kg",
        pounds: "lbs",
        hazel: "Hazel",
        blonde: "Blonde",
        statistics: "Statistics",
        photoshoots: "Photoshoots",
        campaigns: "Ad Campaigns",
        awards: "Awards",
        backToSearch: "Back to Search",
        recentAwards: "Recent Awards"
    }
};

let currentLanguage = 'ru';

function searchModel() {
    const modelId = document.getElementById('modelId').value.trim();
    if (modelId) {
        goToProfileWithURL(modelId);
    }
}

function goToProfile(id) {
    if (id === '100003563683') {
        createProfilePage();
    } else {
        alert(currentLanguage === 'ru' ? 'Профиль не найден' : 'Profile not found');
    }
}

function createProfilePage() {
    const body = document.body;
    const t = translations[currentLanguage];

    body.innerHTML = `
        <div class="container">
            <div class="profile-container">
                <div class="profile-header">
                    <h1>${t.profileName}</h1>
                    <p>ID: 100003563683</p>
                </div>

                <div class="profile-content">
                    <div class="profile-photo">
                        <img src="STRLLA880384.png" alt="${currentLanguage === 'ru' ? 'Фото модели' : 'Model Photo'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                    </div>

                    <div class="profile-info">
                        <div class="info-group">
                            <h4>${t.personalInfo}</h4>
                            <p><strong>${t.age}:</strong> 19 ${t.years}</p>
                            <p><strong>${t.height}:</strong> 179 ${t.cm} (5'9")</p>
                            <p><strong>${t.weight}:</strong> 52 ${t.kg} (114 ${t.pounds})</p>
                            <p><strong>${t.eyeColor}:</strong> ${t.hazel}</p>
                            <p><strong>${t.hairColor}:</strong> ${t.blonde}</p>
                        </div>

                        <div class="info-group">
                            <h4>${t.measurements}</h4>
                            <p><strong>${t.bust}:</strong> 88 ${t.cm}</p>
                            <p><strong>${t.waist}:</strong> 60 ${t.cm}</p>
                            <p><strong>${t.hips}:</strong> 88 ${t.cm}</p>
                        </div>
                    </div>

                    <div class="stats">
                        <h4>${t.statistics}</h4>
                        <p><strong>${t.photoshoots}:</strong> 87</p>
                        <p><strong>${t.campaigns}:</strong> 23</p>
                        <p><strong>${t.awards}:</strong> 53</p>
                    </div>

                    <div class="view-counter">
                        <div class="view-icon">👁</div>
                        <span class="view-count">44k+ ${currentLanguage === 'ru' ? 'просмотров' : 'views'}</span>
                    </div>

                    <div class="location-section">
                        <h4>${currentLanguage === 'ru' ? 'Местоположение' : 'Location'}</h4>
                        <p><strong>${currentLanguage === 'ru' ? 'Родной город:' : 'Hometown:'}</strong> ${currentLanguage === 'ru' ? 'Якутск, Россия' : 'Yakutsk, Russia'}</p>
                    </div>

                    <div class="social-section">
                        <h4>${currentLanguage === 'ru' ? 'Социальные сети' : 'Social Media'}</h4>
                        <p><strong>Snapchat:</strong> doingmeth</p>
                        <p><strong>ModelUN:</strong> StellaUB15</p>
                        <p><strong>Instagram:</strong> ${currentLanguage === 'ru' ? 'Не указан' : 'None'}</p>
                        <p><strong>YouTube:</strong> ${currentLanguage === 'ru' ? 'Не указан' : 'None'}</p>
                        <p><strong>TikTok:</strong> ${currentLanguage === 'ru' ? 'Не указан' : 'None'}</p>
                        <p><strong>WhatsApp:</strong> ${currentLanguage === 'ru' ? 'Не указан' : 'None'}</p>
                        <p><strong>Telegram:</strong> ${currentLanguage === 'ru' ? 'Не указан' : 'None'}</p>
                    </div>

                    <div class="awards-section">
                        <h4>${currentLanguage === 'ru' ? 'Все награды и достижения' : 'All Awards & Achievements'}</h4>
                        <div class="awards-list">
                            <p>• ${currentLanguage === 'ru' ? 'Победитель – Премия "Восходящая звезда Балтики" 2024' : 'Winner – 2024 Baltic Rising Star Model Award'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Финалист – Elite Model Look Восточная Европа 2023' : 'Finalist – Elite Model Look Eastern Europe 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Модель обложки – Vogue Online (Апрель 2024)' : 'Featured Model – Vogue Online Spotlight (April 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Дебют на подиуме – Неделя моды в Таллине SS25' : 'Runway Debut – Tallinn Fashion Week SS25'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Победитель "Лучшее новое лицо" – Варшавские подиумные почести 2024' : 'Winner – "Best New Face" – Warsaw Runway Honors 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Звезда кампании – ZAYA Denim Весна 2024' : 'Campaign Star – ZAYA Denim Spring 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Номинант – "Прорывной талант подиума" – EuroModel Awards 2023' : 'Nominated – "Breakthrough Runway Talent" – EuroModel Awards 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Лицо кампании – SKINA Skincare Глобальная реклама 2024' : 'Lead Model – SKINA Skincare Global Ad Campaign 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Редакционная статья – Harper\'s Bazaar Baltics (Лето 2024)' : 'Editorial Feature – Harper\'s Bazaar Baltics (Summer 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Финалист – Global Model Search by ICON Europe 2023' : 'Finalist – Global Model Search by ICON Europe 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Топ-10 – Лица моды международный 2024' : 'Top 10 – Faces of Fashion International 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Модель обложки – MODESTYLE Выпуск №87 (Май 2024)' : 'Cover Model – MODESTYLE Issue No. 87 (May 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Приглашенная модель – Milan Youth Designers Showcase 2023' : 'Invited Model – Milan Youth Designers Showcase 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Отобрана – LVMH Emerging Talent Runway Segment 2024' : 'Selected – LVMH Emerging Talent Runway Segment 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? '"Лучшая точность позирования" – Nordic Catwalk Academy 2023' : '"Best Posing Precision" – Nordic Catwalk Academy 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Лицо кампании – Aurora Beauty \'Crystal Skin\' Line 2024' : 'Face of Campaign – Aurora Beauty \'Crystal Skin\' Line 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Награждена – "Присутствие на подиуме года" – EstModa Gala 2024' : 'Awarded – "Catwalk Presence of the Year" – EstModa Gala 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Модель подиума – Riga Fashion Night 2023 & 2024' : 'Runway Model – Riga Fashion Night 2023 & 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Названа – "За кем следить" – FashionWeek EU Talent List 2024' : 'Named – "One to Watch" – FashionWeek EU Talent List 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Модель проекта – Urban Vogue Streetwear Series Vol. III' : 'Featured Model – Urban Vogue Streetwear Series Vol. III'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Победитель кастинга – Fae & Luna Haute Spring Capsule 2024' : 'Casting Winner – Fae & Luna Haute Spring Capsule 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'В шорт-листе – Dazed x IMG Model Feature 2024' : 'Shortlisted – Dazed x IMG Model Feature 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Партнерская кампания – MIRA Hair Essentials (2025)' : 'Signed – Partnership Campaign with MIRA Hair Essentials (2025)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Лицо обложки – YOUTH Style Quarterly (Q2 2024)' : 'Face of Cover Story – YOUTH Style Quarterly (Q2 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Постоянная модель подиума – NeoNordic Designers Circle' : 'Runway Regular – NeoNordic Designers Circle'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Топ-3 – International Runway Icons Youth Division 2024' : 'Top 3 – International Runway Icons Youth Division 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Победитель – "Открытие свежего лица" – Baltic Teen Model Awards 2021' : 'Winner – "Fresh Face Discovery" – Baltic Teen Model Awards 2021'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Финалист – ModelNext Rising Talent Showcase (15–17 лет) – 2022' : 'Finalist – ModelNext Rising Talent Showcase (Age 15–17 Division) – 2022'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Выбранное лицо – NEXTSkin Teen Clean Beauty Campaign 2021' : 'Chosen Face – NEXTSkin Teen Clean Beauty Campaign 2021'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Отобрана – Studio Rella x Youth Fashion Lab Collaboration 2022' : 'Selected – Studio Rella x Youth Fashion Lab Collaboration 2022'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Лучшая техника ходьбы – Northern Lights Model Camp Intensive 2021' : 'Best Walk Technique – Northern Lights Model Camp Intensive 2021'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Модель в центре внимания – Liora Teens Lookbook (AW21 Collection)' : 'Spotlight Model – Liora Teens Lookbook (AW21 Collection)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Второе место – Baltic Runway Academy Junior Showcase 2022' : 'Runner-Up – Baltic Runway Academy Junior Showcase 2022'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Обложка – TeenView Baltics Fashion Issue (Winter 2021)' : 'Cover Feature – TeenView Baltics Fashion Issue (Winter 2021)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Номинант – Самый перспективный юниор талант – YMR Model Awards 2022' : 'Nominated – Most Promising Junior Talent – YMR Model Awards 2022'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Топ-10 – "Следующее поколение подиума" Финал, ModelYouth Europe 2021' : 'Top 10 – "Next Generation Catwalk" Final, ModelYouth Europe 2021'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Редакционная модель – Innocenza Youth Fashion Magazine (June 2022)' : 'Editorial Model – Innocenza Youth Fashion Magazine (June 2022)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Завершающая модель подиума – ARTIKA Spring 2025 Exclusive Preview' : 'Runway Closer – ARTIKA Spring 2025 Exclusive Preview'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Финалист – International Print Model Showcase – ICONS24' : 'Finalist – International Print Model Showcase – ICONS24'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Признана – "Выдающаяся природная красота" – RAW Models Awards 2023' : 'Recognized – "Natural Beauty Standout" – RAW Models Awards 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Выбрана кастинг-комиссией – Vienna Fashion Casting Week 2024' : 'Chosen by Casting Panel – Vienna Fashion Casting Week 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Награда за фирменный образ – NEONMODE Capsule Reveal 2023' : 'Signature Look Award – NEONMODE Capsule Reveal 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Участие в кампании для волос – Glasha Shine Oils SS24' : 'Hair Campaign Feature – Glasha Shine Oils SS24'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Ведущая редакционной истории – SKINVERSE Beauty Culture Mag 2023' : 'Editorial Story Lead – SKINVERSE Beauty Culture Mag 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Открывающая показ – BelModa Fusion Exhibit 2024' : 'Opening Walk – BelModa Fusion Exhibit 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Молодая модель месяца – SelectModels.EU (Jan 2024)' : 'Youth Model of the Month – SelectModels.EU (Jan 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Выделена – IMG Global Scout Picks (April 2024)' : 'Highlighted – IMG Global Scout Picks (April 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Творческая съемка – REDLINE Studio Editorial Series' : 'Creative Shoot Feature – REDLINE Studio Editorial Series'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'В шорт-листе – CYNTH x RUNA Fashion Film 2024 Casting' : 'Shortlisted – CYNTH x RUNA Fashion Film 2024 Casting'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Победитель – "Model Momentum" Rising Talent Award – LOOKAwards 2023' : 'Winner – "Model Momentum" Rising Talent Award – LOOKAwards 2023'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Забронирована – Featured Talent for NY-Baltic Fashion Collaboration 2025' : 'Booked – Featured Talent for NY-Baltic Fashion Collaboration 2025'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Обложка редакции – VOXEUROPA Minimalist Issue (Mar 2024)' : 'Cover Editorial – VOXEUROPA Minimalist Issue (Mar 2024)'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Посол – Sustainable Fashion Youth Project 2024' : 'Ambassador – Sustainable Fashion Youth Project 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Лицо цифрового дропа – STRAYLOVE Collection 07' : 'Face of Digital Drop – STRAYLOVE Collection 07'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'В центре внимания – EU Catwalk Collective Rising Models 2024' : 'Spotlight Feature – EU Catwalk Collective Rising Models 2024'}</p>
                            <p>• ${currentLanguage === 'ru' ? 'Признана – Топ принт-модель до 20 лет – SelectModelWatch 2023' : 'Recognized – Top Print Model Under 20 – SelectModelWatch 2023'}</p>
                        </div>
                    </div>

                    <a href="#" onclick="goHome()" class="back-button">${t.backToSearch}</a>
                </div>
            </div>
        </div>

        <div id="translateModal" class="modal">
            <div class="modal-content">
                <p>Translate page to English?</p>
                <div class="modal-buttons">
                    <button class="translate-btn" onclick="translatePage()">Yes</button>
                    <button class="close-btn" onclick="closeModal()">No</button>
                </div>
            </div>
        </div>
    `;

    // Show translation modal only if page is in Russian
    if (currentLanguage === 'ru') {
        setTimeout(() => {
            document.getElementById('translateModal').style.display = 'block';
        }, 1000);
    }
}

function translatePage() {
    currentLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    closeModal();

    // Check if we're on profile page or home page
    if (document.querySelector('.profile-container')) {
        createProfilePage();
    } else {
        createHomePage();
    }
}

function closeModal() {
    const modal = document.getElementById('translateModal');
    if (modal) {
        modal.style.display = 'none';
        // Remove modal from DOM after animation
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function goHome() {
    // Clear URL parameters
    window.history.pushState({}, '', window.location.origin + window.location.pathname);
    createHomePage();
}

function createHomePage() {
    const body = document.body;
    const t = translations[currentLanguage];

    body.innerHTML = `
        <div class="container">
            <header>
                <h1>BeenVONV</h1>
                <p class="subtitle">${t.subtitle}</p>
            </header>

            <div class="search-section">
                <h2>${t.searchTitle}</h2>
                <div class="search-box">
                    <input type="text" id="modelId" placeholder="${t.searchPlaceholder}">
                    <button onclick="searchModel()">${t.searchButton}</button>
                </div>
                <p class="info-text">${t.infoText}</p>
            </div>

            <footer>
                <p>${t.footer}</p>
            </footer>
        </div>
    `;

    document.title = t.title;
}

// Check URL parameters on page load
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    if (profileId) {
        goToProfile(profileId);
    }
});

// Handle Enter key in search
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.getElementById('modelId')) {
        searchModel();
    }
});

// Update URL when viewing profile
function updateURL(id) {
    const newURL = window.location.origin + window.location.pathname + '?id=' + id;
    window.history.pushState({}, '', newURL);
}

// Update goToProfile function to update URL
function goToProfileWithURL(id) {
    updateURL(id);
    goToProfile(id);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('translateModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});