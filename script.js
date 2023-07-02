var translations = {
    en: {
        name: 'Krasnoboky Mykhailo',
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

    },
    ua: {
        name: 'Краснобокий Михайло',
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

    },
    ru: {
        name: 'Краснобокий Михаил',
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

    function fetchRepositories() {
        showLoadingAnimation();
        repos.hide();

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
                var repoCard = $('<div class="col-md-4 repo-card ccc">').attr('data-repo', repo.name);
                var card = $('<div class="card">');
                var cardBody = $('<div class="card-body">');
                // var repoLink = $('<a>').attr('href', repo.html_url).attr('target', '_blank').text(repo.name);
                var repoName = $('<h5>').css("color", "#1E90FF").text(repo.name)
                var repoDescription = $('<p>').text(repo.description);

                cardBody.append(repoName);
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
            repos.show();

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

    $(document).on("click", ".repo-card", function () {

        var repoName = $(this).data("repo");
        var repositoryDetails = $("#repositoryDetails");
        var repos = $("#repos");
        var loadMoreButton = $("#loadMoreButton");
        repos.hide();
        loadMoreButton.hide();
        repositoryDetails.show();
        repositoryDetails.html("");
    
        var translation = translations[selectedLanguage] || translations.en;
        var backButton = $('<button class="btn btn-primary">').text(translation.backButton).attr('data-trans', "backButton");
        backButton.click(function () {
            repositoryDetails.hide();
            repos.show();
            loadMoreButton.show()
            $("#publicRepOnGitHub").show();
        });
        showLoadingAnimation();
        repositoryDetails.hide();
        $.ajax({
            url: "https://api.github.com/repos/LevrikM/" + repoName,
            dataType: "json"
        }).then(function (data) {
            var repoName = data.name;
            var repoDescription = data.description;
            var repoLanguage = data.language;
            var repoStars = data.stargazers_count;
            var repoForks = data.forks_count;
    
            var repoDetails = $('<div>');
            repoDetails.append($('<a>').attr('href', data.html_url).attr('target', '_blank').text(repoName).css("font-size", "20px"));
            repoDetails.append($('<p>').text(repoDescription));
            if(repoLanguage != null)    repoDetails.append($('<p>').text(translation.detailLanguage + ": " + repoLanguage));
            repoDetails.append($('<p>').text(translation.detailStars + ": " + repoStars));
            repoDetails.append($('<p>').text(translation.detailForks + ": " + repoForks));

            
            repositoryDetails.append(repoDetails);
            repositoryDetails.append(backButton);
            $("#publicRepOnGitHub").hide();
            $.ajax({
                url: "https://api.github.com/repos/LevrikM/" + repoName + "/readme",
                headers: {
                    Accept: "application/vnd.github.v3.html"
                }
            }).then(function (readmeData) {
                repositoryDetails.append($('<h2 class="mt-5">').text(translation.detailReadme));

                var readmeContent = readmeData; 

                var readmeContainer = $('<div class="readme-container">');
                readmeContainer.css("padding", "55px");

                readmeContainer.html(readmeContent);
                repositoryDetails.append(readmeContainer);
            }).catch(function (error) {
                console.log('Error in loading ReadMe.md', error);
            });
            hideLoadingAnimation();
            repositoryDetails.show();
        });
        repositoryDetails.append(backButton);
    });
    
});

