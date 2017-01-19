function loadCommits() {
    $('#commits').empty();

    let username = $('#username').val();
    let repo = $('#repo').val();
    let url = `https://api.github.com/repos/${username}/${repo}/commits`;

    $.get(url)
        .then(function(commits) {
            for (let commit of commits) {
                let li = $('<li>');
                li.text(`${commit.commit.author.name}: ${commit.commit.message}`);
                $('#commits').append(li);
            }
        })
        .catch(function(error) {
            let li = $('<li>');
            li.text(`Error: ${error.status} (${error.statusText})`);
            $('#commits').append(li);
        });
}