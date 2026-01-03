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
    var repoCount = 9;
    var repoOffset = 0;
    
    var loadingSpinner = $("#loadingSpinner");
    var reposContainer = $("#repos");
    var loadMoreButton = $("#loadMoreButton");
    var toggleDarkModeButton = $("#toggleDarkModeButton");
    var toggleDarkModeIcon = $("#toggleDarkModeIcon");
    var repositoryDetails = $("#repositoryDetails");
    
    if (darkModeEnabled) {
        $("body").addClass("dark-mode");
        toggleDarkModeIcon.removeClass("fa-moon").addClass("fa-sun");
    } else {
        $("body").removeClass("dark-mode");
        toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-moon");
    }

    function showLoadingAnimation() {
        loadingSpinner.show();
    }

    function hideLoadingAnimation() {
        loadingSpinner.hide();
    }

    const mobileMenuToggle = $('#mobileMenuToggle');
    const navLinks = $('#navLinks');

    mobileMenuToggle.click(function() {
        navLinks.toggleClass('active');
        
        const icon = $(this).find('i');
        if (navLinks.hasClass('active')) {
            icon.removeClass('fa-bars').addClass('fa-times');
        } else {
            icon.removeClass('fa-times').addClass('fa-bars');
        }
    });

    $('.nav-link-item').click(function() {
        navLinks.removeClass('active');
        mobileMenuToggle.find('i').removeClass('fa-times').addClass('fa-bars');
    });

    function revealOnScroll() {
        var reveals = document.querySelectorAll(".section-label, .project-card, .dashboard-card");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].style.opacity = "1";
                reveals[i].style.transform = "translateY(0)";
            }
        }
    }

    $(".section-label, .project-card, .dashboard-card").css({
        "opacity": "0",
        "transform": "translateY(30px)",
        "transition": "all 0.6s ease"
    });

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    function renderRepos(reposList) {
        $.each(reposList, function (index, repo) {
            var repoCard = $('<div class="repo-card-new">');
            repoCard.data('repo', repo);

            var repoHeader = $('<div class="repo-header-new">');
            var repoName = $('<h3 class="repo-name-new">').html('<i class="fab fa-github"></i> ' + repo.name);
            repoHeader.append(repoName);

            if (repo.language) {
                var langBadge = $('<div class="repo-lang-badge">').html('<i class="fas fa-circle"></i> ' + repo.language);
                repoCard.append(langBadge);
            }

            var repoDesc = $('<p class="repo-desc-new">').text(repo.description || "No description provided");
            repoCard.append(repoDesc);

            var repoStats = $('<div class="repo-stats-new">');

            if (repo.stargazers_count > 0) {
                repoStats.append($('<div class="repo-stat-new">').html(
                    '<i class="fas fa-star"></i> <span class="repo-stat-value-new">' + repo.stargazers_count + '</span>'
                ));
            }

            if (repo.forks_count > 0) {
                repoStats.append($('<div class="repo-stat-new">').html(
                    '<i class="fas fa-code-branch"></i> <span class="repo-stat-value-new">' + repo.forks_count + '</span>'
                ));
            }

            var lastUpdate = new Date(repo.updated_at).toLocaleDateString();
            repoStats.append($('<div class="repo-stat-new">').html(
                '<i class="fas fa-history"></i> <span class="repo-stat-value-new">' + lastUpdate + '</span>'
            ));

            repoCard.append(repoHeader);
            repoCard.append(repoStats);
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
            if (repoOffset >= allRepos.length) {
                loadMoreButton.hide();
            } else {
                loadMoreButton.show();
            }
            
            hideLoadingAnimation();
            reposContainer.show();
            updateStats(allRepos);
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
            updateStats(data);
        }).catch(function(err) {
            console.error("API Error", err);
            hideLoadingAnimation();
            reposContainer.html("<p style='color: var(--text-secondary); text-align: center; padding: 40px;'>Error loading repositories. API limit exceeded or network error.</p>").show();
        });
    }

    function updateStats(repos) {
        var totalStars = 0;
        var totalForks = 0;
        
        repos.forEach(function(repo) {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
        });

        $("#repoCount").text(repos.length);
        $("#starCount").text(totalStars);
        $("#forkCount").text(totalForks);
    }

    function fetchUserData() {
        var cachedUser = sessionStorage.getItem('githubUser_LevrikM');
        if(cachedUser) {
            var userData = JSON.parse(cachedUser);
            $("#login span").text(userData.login);
            return;
        }

        $.ajax({
            url: "https://api.github.com/users/LevrikM",
            dataType: "json"
        }).then(function (data) {
            sessionStorage.setItem('githubUser_LevrikM', JSON.stringify(data));
            $("#login span").text(data.login);
        });
    }

    function updateTexts() {
        var translation = translations[selectedLanguage] || translations.en;

        $("#namePlaceholder").text(translation.name);
        var loadMoreBtn = $("#loadMoreButton");
        if (loadMoreBtn.find("span").length) {
            loadMoreBtn.find("span").text(translation.loadMore);
        } else {
            loadMoreBtn.text(translation.loadMore);
        }
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
            toggleDarkModeIcon.removeClass("fa-moon").addClass("fa-sun");
            localStorage.setItem("darkModeEnabled", "true");
        } else {
            $("body").removeClass("dark-mode");
            toggleDarkModeIcon.removeClass("fa-sun").addClass("fa-moon");
            localStorage.setItem("darkModeEnabled", "false");
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

        function setupTechMarquee() {
            const cloud = document.querySelector('.tech-cloud');
            if (cloud) {
                cloud.innerHTML += cloud.innerHTML;
            }
        }
    }

    initializeApp();

    loadMoreButton.click(function () {
        var sessionData = sessionStorage.getItem('githubRepos_LevrikM');
        if (sessionData) {
            var allRepos = JSON.parse(sessionData);
            var nextRepos = allRepos.slice(repoOffset, repoOffset + repoCount);
            renderRepos(nextRepos);
            repoOffset += repoCount;
            if (repoOffset >= allRepos.length) {
                loadMoreButton.hide();
            }
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

    $(document).on("click", ".repo-card-new", function () {
        var translation = translations[selectedLanguage] || translations.en;
        var repoData = $(this).data('repo');
        
        reposContainer.fadeOut(300);
        loadMoreButton.fadeOut(300);
        $(".section-label").fadeOut(300);
        repositoryDetails.fadeIn(300).css("display", "block").html(""); 
    
        var backButton = $('<button class="load-more-btn mb-4">')
            .html('<i class="fas fa-arrow-left" style="margin-right: 10px;"></i>' + translation.backButton);
        
        backButton.click(function () {
            repositoryDetails.fadeOut(300);
            reposContainer.fadeIn(300);
            $(".section-label").fadeIn(300);

            var sessionData = sessionStorage.getItem('githubRepos_LevrikM');
            if(sessionData && repoOffset < JSON.parse(sessionData).length) {
                loadMoreButton.fadeIn(300);
            } else if (!sessionData) {
                loadMoreButton.fadeIn(300);
            }
        });

        var repoDetails = $('<div>');
        
        var repoTitle = $('<h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 20px;">');
        var repoTitleLink = $('<a>')
            .attr('href', repoData.html_url)
            .attr('target', '_blank')
            .css({
                "color": "var(--accent-orange)",
                "text-decoration": "none",
                "display": "inline-flex",
                "align-items": "center",
                "gap": "10px"
            })
            .html('<i class="fab fa-github"></i>' + repoData.name + ' <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i>');
        repoTitle.append(repoTitleLink);
        repoDetails.append(repoTitle);
        
        if(repoData.description) {
            repoDetails.append($('<p style="color: var(--text-secondary); font-size: 1.1rem; line-height: 1.8; margin-bottom: 25px;">').text(repoData.description));
        }
        
        var repoMeta = $('<div style="display: flex; flex-wrap: wrap; gap: 25px; padding: 20px; background: var(--bg-tertiary); border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 30px;">');
        
        if(repoData.language) {
            var langBadge = $('<div style="display: flex; align-items: center; gap: 8px; color: var(--text-primary);">')
                .html('<i class="fas fa-code" style="color: var(--accent-orange);"></i><strong style="margin-right: 8px;">' + translation.detailLanguage + ':</strong><span style="padding: 4px 12px; background: var(--accent-orange); color: white; border-radius: 8px; font-weight: 600;">' + repoData.language + '</span>');
            repoMeta.append(langBadge);
        }
        
        var starsMeta = $('<div style="display: flex; align-items: center; gap: 8px; color: var(--text-primary);">')
            .html('<i class="fas fa-star" style="color: var(--accent-orange);"></i><strong style="margin-right: 8px;">' + translation.detailStars + ':</strong><span>' + repoData.stargazers_count + '</span>');
        repoMeta.append(starsMeta);
        
        var forksMeta = $('<div style="display: flex; align-items: center; gap: 8px; color: var(--text-primary);">')
            .html('<i class="fas fa-code-branch" style="color: var(--accent-orange);"></i><strong style="margin-right: 8px;">' + translation.detailForks + ':</strong><span>' + repoData.forks_count + '</span>');
        repoMeta.append(forksMeta);
        
        repoDetails.append(repoMeta);

        repositoryDetails.append(backButton);
        repositoryDetails.append(repoDetails);
        
        var readmeContainer = $('<div class="readme-container">');
        readmeContainer.html('<div style="text-align: center; padding: 40px;"><div class="loader-orb" style="margin: 0 auto 20px;"></div><p style="color: var(--text-secondary);">' + translation.loadingReadme + '</p></div>');
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
            readmeContainer.html('<p style="color: var(--text-muted); text-align: center; padding: 40px;">' + translation.noReadme + '</p>');
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

    $(".tech-bubble").hover(
        function() {
            $(this).css("transform", "translateY(-10px) scale(1.1)");
        },
        function() {
            $(this).css("transform", "translateY(0) scale(1)");
        }
    );
});
