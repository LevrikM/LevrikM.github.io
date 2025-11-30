document.body.classList.add('loading-state');

window.addEventListener("load", function() {
    setTimeout(function() {
        document.body.classList.add('loaded');
        document.body.classList.remove('loading-state');
        
        setTimeout(function() {
            var preloader = document.getElementById('preloader');
            if(preloader) preloader.remove();
        }, 1000);
    }, 500); 
});

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

    // --- SCROLL REVEAL LOGIC ---
    function reveal() {
        var reveals = document.querySelectorAll(".reveal-on-scroll");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 100; 

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("visible");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    reveal();

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