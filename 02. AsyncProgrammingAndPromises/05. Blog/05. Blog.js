function attachEvents() {
    const appId = "kid_SJJgrw1fl";
    const username = "peter";
    const password = "p";
    const url = "https://baas.kinvey.com/appdata/" + appId;
    const base64auth = btoa(username + ":" + password);
    const authHeader = {'Authorization': 'Basic ' + base64auth};

    $('#btnLoadPosts').click(loadPosts);
    $('#btnViewPost').click(loadComments);

    function loadPosts() {
        let loadRequest = {
            method: "GET",
            url: url + "/posts",
            headers: authHeader
        };

        $.ajax(loadRequest)
            .then(displayPostsInSelect)
            .catch(displayError);
    }

    function displayPostsInSelect(posts) {
        $('#posts').empty();

        for (let post of posts) {
            let option = $('<option>')
                .text(post.title)
                .val(post._id);

            $('#posts').append(option);
        }
    }

    function displayError(error) {
        let errorDiv = $('<div>').text(`Error: ${error.status} (${error.statusText})`);
        $(document.body).prepend(errorDiv);

        setTimeout(function() {
            $(errorDiv).fadeOut(function() {
                $(errorDiv).remove();
            });
        }, 3000);
    }

    function loadComments() {
        let selectedPost = $('#posts').val();

        let postRequest = $.ajax({
            method: "GET",
            url: url + `/posts/${selectedPost}`,
            headers: authHeader
        });

        let commentsRequest = $.ajax({
            method: "GET",
            url: url + `/comments/?query={"post_id":"${selectedPost}"}`,
            headers: authHeader
        });

        Promise.all([postRequest, commentsRequest])
            .then(displayPostAndComments)
            .catch(displayError);
    }

    function displayPostAndComments([post, comments]) {
        $('#post-comments').empty();

        $('#post-title').text(post.title);
        $('#post-body').text(post.body);

        for (let comment of comments) {
            let li = $('<li>');
            li.text(comment.text);
            $('#post-comments').append(li);
        }
    }
}