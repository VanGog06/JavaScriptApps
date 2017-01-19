function attachEvents() {
    const baseURL = "https://baas.kinvey.com/appdata/kid_Byz5YDQMe/books";
    const username = 'guest';
    const password = 'guest';
    const authorization = "Basic " + btoa(username + ':' + password);

    class Book {
        constructor(title, author, isbn) {
            this.title = title;
            this.author = author;
            this.isbn = isbn;
        }

        createBook() {
            let data = {
                title: this.title,
                author: this.author,
                isbn: this.isbn
            };

            return $.ajax({
                method: "POST",
                url: baseURL,
                data: JSON.stringify(data),
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    $('.add').click(addBook);
    $('.load').click(loadBook);

    function addBook() {
        let title = $('#addForm .title').val();
        let author = $('#addForm .author').val();
        let isbn = $('#addForm .isbn').val();

        let book = new Book(title, author, isbn);
        book.createBook()
            .then(console.log('success'))
            .catch(function(error) {
                console.log(error);
            });
    }

    function loadBook() {
        $('#books').empty();

        let getFishRequest = {
            method: "GET",
            url: baseURL,
            headers: {
                'Authorization': authorization,
            },
            success: function(books) {
                for (let book of books) {
                    let div = $('<div>').addClass('book').attr('data-id', book._id);
                    $('<label>Title</label>').appendTo(div);
                    $('<input type="text" class="title"/>').val(book.title).appendTo(div);
                    $('<label>Author</label>').appendTo(div);
                    $('<input type="text" class="author"/>').val(book.author).appendTo(div);
                    $('<label>ISBN</label>').appendTo(div);
                    $('<input type="text" class="isbn"/>').val(book.isbn).appendTo(div);
                    $('<button class="update">Update</button>').click(updateBook).appendTo(div);
                    $('<button class="delete">Delete</button>').click(deleteBook).appendTo(div);

                    div.appendTo($('#books'));
                }
            },
            error: function(error) {
                console.log(error);
            }
        };

        $.ajax(getFishRequest);
    }
    
    function updateBook() {
        let parent = $(this).parent();
        let id = parent.attr('data-id');

        let title = $(parent.find('.title')).val();
        let author = $(parent.find('.author')).val();
        let isbn = $(parent.find('.isbn')).val();

        let newData = {
            title: title,
            author: author,
            isbn: isbn
        };

        let deleteRequest = {
            method: "PUT",
            url: baseURL + '/' + id,
            data: JSON.stringify(newData),
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            }
        };

        $.ajax(deleteRequest)
            .then(function() {
                loadBook();
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    
    function deleteBook() {
        let parent = $(this).parent();
        let id = parent.attr('data-id');

        let deleteRequest = {
            method: "DELETE",
            url: baseURL + '/' + id,
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            }
        };

        $.ajax(deleteRequest)
            .then(function() {
                parent.remove();
                loadBook();
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

