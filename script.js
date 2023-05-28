var translations = {
    en: {
        name: 'Krasnoboky Mykhailo',
        loadMore: 'Load More',
        publicRepOnGitHub: 'Public repositories on GitHub',
        portfolioTitle: "LevrikM | Portfolio",
        openRepositories: "Open all repositories",
        goToProfile: "Go to profile",
        description: "Bio:",
    },
    ua: {
        name: 'Краснобокий Михайло',
        loadMore: 'Завантажити ще',
        publicRepOnGitHub: 'Публічні репозиторії на GitHub',
        portfolioTitle: "LevrikM | Портфоліо",
        openRepositories: "Відкрити всі репозиторії",
        goToProfile: "Перейти до профілю",
        description: "Біо:",
    },
    ru: {
        name: 'Краснобокий Михаил',
        loadMore: 'Загрузить еще',
        publicRepOnGitHub: 'Публичные репозитории на GitHub',
        portfolioTitle: "LevrikM | Портфолио",
        openRepositories: "Открыть все репозитории",
        goToProfile: "Перейти в профиль",
        description: "Био:",
    }
};

$(document).ready(function () {
    var darkModeEnabled = localStorage.getItem("darkModeEnabled") === "true";
    var selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
    var repoCount = 6;
    var repoOffset = 0;
    var loadingSpinner = $("#loadingSpinner");
    var repos = $("#repos");
    var loadMoreButton = $("#loadMoreButton");
    var toggleDarkModeButton = $("#toggleDarkModeButton");
    var toggleDarkModeIcon = $("#toggleDarkModeIcon");

    function showLoadingAnimation() {
        loadingSpinner.show();
        repos.hide();
    }

    function hideLoadingAnimation() {
        loadingSpinner.hide();
        repos.show();
    }

    function fetchRepositories() {
        showLoadingAnimation();

        $.ajax({
            url: "https://api.github.com/users/LevrikM/repos",
            data: {
                type: "owner",
                sort: "updated",
                direction: "desc",
                per_page: repoCount,
                page: Math.floor(repoOffset / repoCount) + 1
            },
            dataType: "json"
        }).then(function (data) {
            $.each(data, function (index, repo) {
                var repoCard = $('<div class="col-md-4 repo-card">');
                var card = $('<div class="card">');
                var cardBody = $('<div class="card-body">');
                var repoLink = $('<a>').attr('href', repo.html_url).attr('target', '_blank').text(repo.name);
                var repoDescription = $('<p>').text(repo.description);

                cardBody.append(repoLink);
                cardBody.append(repoDescription);
                card.append(cardBody);
                repoCard.append(card);
                repos.append(repoCard);
            });

            if (data.length === repoCount) {
                repoOffset += repoCount;
                loadMoreButton.show();
            } else {
                loadMoreButton.hide();
            }

            hideLoadingAnimation();
        });
    }

    function fetchUserData() {
        $.ajax({
            url: "https://api.github.com/users/LevrikM",
            dataType: "json"
        }).then(function (data) {
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
        showLoadingAnimation();
        fetchRepositories();
    });

    toggleDarkModeButton.click(function () {
        toggleDarkMode();
    });

    $("#languageSelect").change(function () {
        selectedLanguage = $(this).val();
        localStorage.setItem("selectedLanguage", selectedLanguage);
        updateTexts();
    });
});
