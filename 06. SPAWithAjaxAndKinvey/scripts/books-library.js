function startApp() {
    sessionStorage.clear();

    showHideMenuLinks();

    showView('viewHome');

    // Bind the navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(listBooks);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logoutUser);


    // Bind the form submit buttons
    $("#formLogin").submit(loginUser);
    $("#formRegister").submit(registerUser);
    $("#buttonCreateBook").click(createBook);
    $("#buttonEditBook").click(editBook);

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_HJeLMrdMg";
    const kinveyAppSecret = "4dfc52f09b114f91985a4c28c6b072a3";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    function showHideMenuLinks() {
        $('#menu a').hide();
        if (sessionStorage.getItem('authToken')) {
            $('#linkHome').show();
            $('#linkListBooks').show();
            $('#linkCreateBook').show();
            $('#linkLogout').show();
        } else {
            $('#linkHome').show();
            $('#linkLogin').show();
            $('#linkRegister').show();
        }
    }

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();

    }

    function showHomeView() {
        showView('viewHome');
    }
    
    function showLoginView() {
        showView('viewLogin');
        $('#formLogin').trigger('reset');
    }
    
    function showRegisterView() {
        showView('viewRegister');
        $('#formRegister').trigger('reset');
    }
    
    function listBooks() {
        $('#books').empty();
        showView('viewBooks')

        $.ajax({
            method: "GET",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
            headers: getKinveyUserAuthHeaders(),
            success: loadBooksSuccess,
            error: ajaxError
        });

        function loadBooksSuccess(books) {
            let table = $(
                `<table>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </table>`);

            for (let book of books) {
                let tr = $('<tr>');
                displayTableRow(tr, book);
                tr.appendTo(table);
            }

            $('#books').append(table);
        }

        function displayTableRow(tr, book) {
            let links = [];

            if (book._acl.creator === sessionStorage.getItem('userId')) {
                let deleteLink = $('<a href="#">[Delete]</a>').click(function() {deleteBookById(book._id)});
                let editLink = $('<a href="#">[Edit]</a>').click(function() {loadBookForEdit(book._id)});
                links.push(deleteLink);
                links.push(" ");
                links.push(editLink);
            }

            tr.append(
                $('<td>').text(book.title),
                $('<td>').text(book.author),
                $('<td>').text(book.description),
                $('<td>').append(links)
            );
        }
    }

    function deleteBookById(bookId) {
        $.ajax({
            method: "DELETE",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + bookId,
            headers: getKinveyUserAuthHeaders(),
            success: deleteBooksSuccess,
            error: ajaxError
        });
        
        function deleteBooksSuccess() {
            showInfo('Book deleted.');
            listBooks();
        }
    }

    function getKinveyUserAuthHeaders() {
        return {
            "Authorization": "Kinvey " + sessionStorage.getItem('authToken')
        }
    }
    
    function showCreateBookView() {
        showView('viewCreateBook');
        $('#formCreateBook').trigger('reset');
    }
    
    function logoutUser() {
        //TODO: invoke Kinvey REST _logout

        sessionStorage.clear();
        $('#loggedInUser').text('');
        showView('viewHome');
        showHideMenuLinks();
        showInfo('Logout successful');
    }
    
    function registerUser(event) {
        event.preventDefault();

        let userData = {
            username: $('#formRegister input[name=username]').val(),
            password: $('#formRegister input[name=passwd]').val()
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: registerUserSuccess,
            error: ajaxError
        });

        function registerUserSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('User registration successful.');
        }
    }

    function loginUser(event) {
        event.preventDefault();

        let userData = {
            username: $('#formLogin input[name=username]').val(),
            password: $('#formLogin input[name=passwd]').val()
        };
        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: loginUserSuccess,
            error: ajaxError
        });

        function loginUserSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('Login successful.');
        }
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        $('#loggedInUser').text(`Welcome ${userInfo.username}`);
    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);

    }
    
    function createBook() {
        let bookData = {
            title: $('#formCreateBook input[name=title]').val(),
            author: $('#formCreateBook input[name=author]').val(),
            description: $('#formCreateBook textarea[name=descr]').val()
        };

        $.ajax({
            method: "POST",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: ajaxError
        });
        
        function createBookSuccess() {
            showInfo('Book created.');
            listBooks();
        }
    }
    
    function editBook() {
        let bookData = {
            title: $('#formEditBook input[name=title]').val(),
            author: $('#formEditBook input[name=author]').val(),
            description: $('#formEditBook textarea[name=descr]').val()
        };

        $.ajax({
            method: "PUT",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + $('#formEditBook input[name=id]').val(),
            headers: getKinveyUserAuthHeaders(),
            data: bookData,
            success: createBookSuccess,
            error: ajaxError
        });

        function createBookSuccess() {
            showInfo('Book edited.');
            listBooks();
        }
    }

    function loadBookForEdit(bookId) {
        $.ajax({
            method: "GET",
            url: kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + bookId,
            headers: getKinveyUserAuthHeaders(),
            success: loadBookForEditSuccess,
            error: ajaxError
        });

        function loadBookForEditSuccess(book) {
            $('#formEditBook input[name=id]').val(book._id);
            $('#formEditBook input[name=title]').val(book.title);
            $('#formEditBook input[name=author]').val(book.author);
            $('#formEditBook textarea[name=descr]').val(book.description);
            showView('viewEditBook');
        }
    }

    function ajaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }
}