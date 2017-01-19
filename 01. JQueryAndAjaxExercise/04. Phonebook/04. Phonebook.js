function attachEvents() {
    const url = 'https://phonebook-nakov.firebaseio.com/phonebook.json';

    $('#btnCreate').click(createRecord);
    $('#btnLoad').click(loadRecords);

    function createRecord() {
        let person = $('#person').val();
        let phone = $('#phone').val();

        let contact = {person: person, phone: phone};

        let request = {
            method: "POST",
            url: url,
            data: JSON.stringify(contact),
            success: loadRecords
        };

        $.ajax(request);

        $('#person').val('');
        $('#phone').val('');
    }

    function loadRecords() {
        let request = {
            method: "GET",
            url: url,
            success: function(recordData) {
                $('#phonebook').empty();

                for (let key of Object.keys(recordData)) {
                    let btnDelete = $('<button>');
                    btnDelete.text('[Delete]');
                    btnDelete.click(function () {
                        let deleteUrl = `https://phonebook-nakov.firebaseio.com/phonebook/${key}.json`;

                        let request = {
                            method: "DELETE",
                            url: deleteUrl,
                            success: loadRecords
                        };

                        $.ajax(request);
                    });

                    let li = $('<li>');
                    li.text(`${recordData[key].person}: ${recordData[key].phone} `);
                    li.append(btnDelete);

                    $('#phonebook').append(li);
                }
            }
        };

        $.ajax(request);
    }
}