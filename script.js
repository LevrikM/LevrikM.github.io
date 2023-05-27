$(document).ready(function () {
    var repoCount = 6;
    var repoOffset = 0;

    function fetchRepositories() {
        $.ajax({
            url: "https://api.github.com/users/LevrikM/repos",
            data: {
                type: "owner",
                sort: "updated",
                direction: "desc",
                per_page: repoCount,
                page: (repoOffset / repoCount) + 1
            },
            dataType: "json",
            success: function (data) {
                var repos = $("#repos");

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
                    $("#loadMoreButton").show();
                } else {
                    $("#loadMoreButton").hide();
                }
            }
        });
    }

    fetchRepositories();

    $("#loadMoreButton").click(function () {
        fetchRepositories();
    });

    $("#toggleDarkModeButton").click(function () {
        $("body").toggleClass("dark-mode");
        $("#toggleDarkModeIcon").toggleClass("fa-sun fa-adjust");
    });


    $.ajax({
        url: "https://api.github.com/users/LevrikM",
        dataType: "json",
        success: function (data) {
            $("#namePlaceholder").text(data.name || "Krasnoboky Mykhailo");
        }
    });
});