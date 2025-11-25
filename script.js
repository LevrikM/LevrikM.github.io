document.body.classList.add('loading-state');

window.addEventListener("load", function() {
    setTimeout(function() {
        document.body.classList.add('loaded');
        document.body.classList.remove('loading-state');
        
        setTimeout(function() {
            var preloader = document.getElementById('preloader');
            if(preloader) preloader.remove();
        }, 1000);
    }, 1000); 
});

var translations = {
    en: {
        name: 'Krasnoboky Mykhailo',
        whoIAM: 'Software Engineer with a foundation from Zhytomyr Polytechnic State University and practical training from IT-STEP Academy.',
        loadMore: 'Load More',
        publicRepOnGitHub: 'Public repositories on GitHub',
        portfolioTitle: "LevrikM | Portfolio",
        openRepositories: "Open all repositories",
        goToProfile: "Go to profile",
        description: "Bio:",
        myStatistics: "My statistics:",
        backButton: "Back",
        detailLanguage: "Coding language: ",
        detailStars: "Stars",
        detailForks: "Forks",
        detailReadme: "Info of repo from ReadMe.md",
        assistantNotes: "Notes",
        assistantTodos: "To-Do",
        assistantShortcuts: "Shortcuts",
        assistantSnippets: "Snippets",
        assistantClose: "Close",
        assistantNotesPlaceholder: "Write your notes...",
        assistantSnippetsPlaceholder: "Save your code snippets...",
        assistantTodosPlaceholder: "Add a task...",
        assistantTitle: "Assistant (beta)",
        assistantSafe: "Everything is saved locally",
        mainForDevelop: "Main resources for developers",
        development: "Development",
        tools: "Tools",
        learning: "Learning",
        rustLauncherDescription: "Custom client for launching the game Rust. Enhanced performance, quick access to settings, and a user-friendly interface.",
        goToSite: "Explore Project",
        unofficialLauncher: "Unofficial Launcher",
        loadingReadme: "Loading README...",
        noReadme: "No README.md found for this repository."
    },
    ua: {
        name: 'Краснобокий Михайло',
        whoIAM: 'Програміст з основами з Житомирського політехнічного університету та практичною підготовкою в IT-STEP Academy.',
        loadMore: 'Завантажити ще',
        publicRepOnGitHub: 'Публічні репозиторії на GitHub',
        portfolioTitle: "LevrikM | Портфоліо",
        openRepositories: "Відкрити всі репозиторії",
        goToProfile: "Перейти до профілю",
        description: "Біо:",
        myStatistics: "Моя статистика:",
        backButton: "Повернутись",
        detailLanguage: "Мова програмування",
        detailStars: "Зірок",
        detailForks: "Розвітлень",
        detailReadme: "Інформація про репозиторій з ReadMe.md",
        assistantNotes: "Нотатки",
        assistantTodos: "Список",
        assistantShortcuts: "Посилання",
        assistantSnippets: "Код",
        assistantClose: "Закрити",
        assistantNotesPlaceholder: "Пиши свої ідеї тут...",
        assistantSnippetsPlaceholder: "Тут можна зберегти шматки коду...",
        assistantTodosPlaceholder: "Додати завдання...",
        assistantTitle: "Помічник (бета)",
        assistantSafe: "Все зберігається локально",
        mainForDevelop: "Основні ресурси для розробників",
        development: "Розробка",
        tools: "Інструменти",
        learning: "Навчання",
        rustLauncherDescription: "Кастомний клієнт для запуску гри Rust. Покращена продуктивність, швидкий доступ до налаштувань та зручний інтерфейс.",
        goToSite: "Перейти на проект",
        unofficialLauncher: "Неофіційний лаунчер",
        loadingReadme: "Завантаження README...",
        noReadme: "README.md не знайдено."
    },
    ru: {
        name: 'Краснобокий Михаил',
        whoIAM: 'Программист с основами из Житомирского политехнического университета и практической подготовкой в IT-STEP Academy.',
        loadMore: 'Загрузить еще',
        publicRepOnGitHub: 'Публичные репозитории на GitHub',
        portfolioTitle: "LevrikM | Портфолио",
        openRepositories: "Открыть все репозитории",
        goToProfile: "Перейти в профиль",
        description: "Био:",
        myStatistics: "Моя статистика:",
        backButton: "Вернуться",
        detailLanguage: "Язык программирования",
        detailStars: "Звезд",
        detailForks: "Веток",
        detailReadme: "Информация про репозиторий с ReadMe.md",
        assistantNotes: "Заметки",
        assistantTodos: "Список дел",
        assistantShortcuts: "Ссылки",
        assistantSnippets: "Код",
        assistantClose: "Закрыть",
        assistantNotesPlaceholder: "Пиши свои идеи здесь...",
        assistantSnippetsPlaceholder: "Здесь можно хранить куски кода...",
        assistantTodosPlaceholder: "Добавить задачу...",
        assistantTitle: "Помощник (бета)",
        assistantSafe: "Всё сохраняется локально",
        mainForDevelop: "Основные ресурсы для разработчиков",
        development: "Разработка",
        tools: "Инструменты",
        learning: "Обучение",
        rustLauncherDescription: "Кастомный клиент для запуска игры Rust. Улучшенная производительность, быстрый доступ к настройкам и удобный интерфейс.",
        goToSite: "Перейти на проект",
        unofficialLauncher: "Неофициальный лаунчер",
        loadingReadme: "Загрузка README...",
        noReadme: "README.md не найден."
    }
};

$(document).ready(function () {
    var darkModeEnabled = localStorage.getItem("darkModeEnabled") === "true";
    var selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
    var repoCount = 6;
    var repoOffset = 0;
    
    var loadingSpinner = $("#loadingSpinner");
    var reposContainer = $("#repos");
    var loadMoreButton = $("#loadMoreButton");
    var toggleDarkModeButton = $("#toggleDarkModeButton");
    var toggleDarkModeIcon = $("#toggleDarkModeIcon");
    var repositoryDetails = $("#repositoryDetails");

    if (darkModeEnabled) {
        $("body").addClass("dark-mode");
        toggleDarkModeIcon.removeClass("fa-adjust").addClass("fa-sun");
    } else {
        $("body").removeClass("dark-mode");
        toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-adjust");
    }

    function showLoadingAnimation() {
        loadingSpinner.show();
    }

    function hideLoadingAnimation() {
        loadingSpinner.hide();
    }

    function renderRepos(reposList) {
        $.each(reposList, function (index, repo) {
            var repoCard = $('<div class="col-md-4 repo-card mb-4">');
            
           
            repoCard.data('repo', repo);

            var card = $('<div class="card">');
            var cardBody = $('<div class="card-body">');
            
            var repoName = $('<h5>').text(repo.name);
            var repoDescription = $('<p>').text(repo.description || "No description provided");

            cardBody.append(repoName);
            cardBody.append(repoDescription);
            card.append(cardBody);
            repoCard.append(card);
            reposContainer.append(repoCard);
        });
    }

    function fetchRepositories() {
        var sessionData = sessionStorage.getItem('githubRepos_LevrikM');
        
        if (sessionData && repoOffset === 0) {
            console.log("Loading from cache");
            var allRepos = JSON.parse(sessionData);
            var slicedRepos = allRepos.slice(repoOffset, repoOffset + repoCount);
            renderRepos(slicedRepos);
            
            repoOffset += repoCount;
            if (repoOffset >= allRepos.length) loadMoreButton.hide();
            else loadMoreButton.show();
            
            hideLoadingAnimation();
            reposContainer.show();
            return;
        }

        showLoadingAnimation();
        
        $.ajax({
            url: "https://api.github.com/users/LevrikM/repos",
            data: {
                type: "owner",
                sort: "updated", 
                direction: "desc",
                per_page: 100 
            },
            dataType: "json"
        }).then(function (data) {
            sessionStorage.setItem('githubRepos_LevrikM', JSON.stringify(data));
            
            if(repoOffset === 0) reposContainer.empty();

            var slicedRepos = data.slice(repoOffset, repoOffset + repoCount);
            renderRepos(slicedRepos);

            repoOffset += repoCount;
            if (repoOffset >= data.length) {
                loadMoreButton.hide();
            } else {
                loadMoreButton.show();
            }

            hideLoadingAnimation();
            reposContainer.show();
        }).catch(function(err) {
            console.error("API Error", err);
            hideLoadingAnimation();
            reposContainer.html("<p class='text-danger'>Error loading repositories. API limit exceeded or network error.</p>").show();
        });
    }

    function fetchUserData() {
        var cachedUser = sessionStorage.getItem('githubUser_LevrikM');
        if(cachedUser) {
            $("#login").append(JSON.parse(cachedUser).login);
            return;
        }

        $.ajax({
            url: "https://api.github.com/users/LevrikM",
            dataType: "json"
        }).then(function (data) {
            sessionStorage.setItem('githubUser_LevrikM', JSON.stringify(data));
            var login = data.login;
            $("#login").append(login);
        });
    }

    function updateTexts() {
        var translation = translations[selectedLanguage] || translations.en;

        $("#namePlaceholder").text(translation.name);
        $("#loadMoreButton").text(translation.loadMore);
        $("#publicRepOnGitHub").text(translation.publicRepOnGitHub);

        $("[data-trans]").each(function () {
            var transKey = $(this).data("trans");
            if (translation.hasOwnProperty(transKey)) {
                $(this).text(translation[transKey]);
            }
        });
    }

    function toggleDarkMode() {
        darkModeEnabled = !darkModeEnabled;
        if (darkModeEnabled) {
            $("body").addClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-adjust").addClass("fa-sun");
            localStorage.setItem("darkModeEnabled", true);
        } else {
            $("body").removeClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-adjust");
            localStorage.setItem("darkModeEnabled", false);
        }
    }

    function initializeApp() {
        if (darkModeEnabled) {
            $("body").addClass("dark-mode");
            toggleDarkModeIcon.addClass("fa-sun");
        }

        $("#languageSelect").val(selectedLanguage);
        updateTexts();
        fetchRepositories();
        fetchUserData();
    }

    initializeApp();

    loadMoreButton.click(function () {
        var sessionData = sessionStorage.getItem('githubRepos_LevrikM');
        if (sessionData) {
            var allRepos = JSON.parse(sessionData);
            var nextRepos = allRepos.slice(repoOffset, repoOffset + repoCount);
            renderRepos(nextRepos);
            repoOffset += repoCount;
            if (repoOffset >= allRepos.length) loadMoreButton.hide();
        } else {
            fetchRepositories(); 
        }
    });

    toggleDarkModeButton.click(function () {
        toggleDarkMode();
    });

    $("#languageSelect").change(function () {
        selectedLanguage = $(this).val();
        localStorage.setItem("selectedLanguage", selectedLanguage);
        updateTexts();
    });


    $(document).on("click", ".repo-card", function () {
        var translation = translations[selectedLanguage] || translations.en;
        var repoData = $(this).data('repo');
        
        reposContainer.hide();
        loadMoreButton.hide();
        $("#publicRepOnGitHub").hide();
        repositoryDetails.show().html(""); 
    
        var backButton = $('<button class="btn btn-orange mb-3">').text(translation.backButton);
        backButton.click(function () {
            repositoryDetails.hide();
            reposContainer.show();

            var sessionData = sessionStorage.getItem('githubRepos_LevrikM');
            if(sessionData && repoOffset < JSON.parse(sessionData).length) {
                loadMoreButton.show();
            } else if (!sessionData) {
                 loadMoreButton.show();
            }
            $("#publicRepOnGitHub").show();
        });

       
        var repoDetails = $('<div>');
        
        repoDetails.append($('<a>').attr('href', repoData.html_url).attr('target', '_blank').text(repoData.name).css("font-size", "28px").css("font-weight", "bold").css("color", "#1E90FF"));
        repoDetails.append($('<p class="mt-2 lead">').text(repoData.description));
        
        if(repoData.language) repoDetails.append($('<p>').html(`<strong>${translation.detailLanguage}:</strong> ${repoData.language}`));
        
        repoDetails.append($('<p>').html(`<i class="fas fa-star text-warning"></i> <strong>${translation.detailStars}:</strong> ${repoData.stargazers_count}`));
        repoDetails.append($('<p>').html(`<i class="fas fa-code-branch"></i> <strong>${translation.detailForks}:</strong> ${repoData.forks_count}`));

        repositoryDetails.append(backButton);
        repositoryDetails.append(repoDetails);
        
        var readmeContainer = $('<div class="readme-container mt-4">');
        readmeContainer.html(`<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p>${translation.loadingReadme}</p></div>`);
        repositoryDetails.append(readmeContainer);

        var username = "LevrikM"; 
        
        $.ajax({
            url: `https://api.github.com/repos/${username}/${repoData.name}/readme`,
            headers: {
                Accept: "application/vnd.github.v3.html"
            }
        }).then(function (readmeData) {
            readmeContainer.html(readmeData);
        }).catch(function (error) {
            console.log('Readme load error', error);
            readmeContainer.html(`<p class="text-muted text-center py-4">${translation.noReadme}</p>`);
        });
    });
    
    // Scroll to Top
    var scrollToTopBtn = $("#scrollToTopBtn");
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            scrollToTopBtn.fadeIn();
        } else {
            scrollToTopBtn.fadeOut();
        }
    });

    scrollToTopBtn.click(function() {
        $('html, body').animate({scrollTop : 0}, 800);
        return false;
    });
});