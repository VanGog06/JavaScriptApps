function attachEvents() {
    const appKey = 'kid_BJXTsSi-e';
    const username = 'guest';
    const password = 'guest';
    const authorization = 'Basic ' + btoa(username + ":" + password);
    const baseURL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students';

    $('#addStudent').click(addStudent);

    let headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
    };

    function requestStudents() {
        let studentsRequest = {
            method: "GET",
            url: baseURL,
            headers: headers
        };

        $.ajax(studentsRequest)
            .then(displayStudents)
            .catch(displayError);
    }

    requestStudents();

    function displayStudents(students) {
        students = students.sort((a, b) => a.ID - b.ID);

        for (let student of students) {
            let tr = $('<tr>');
            $('<td>').text(student.ID).appendTo(tr);
            $('<td>').text(student.FirstName).appendTo(tr);
            $('<td>').text(student.LastName).appendTo(tr);
            $('<td>').text(student.FacultyNumber).appendTo(tr);
            $('<td>').text(student.Grade).appendTo(tr);

            $('#results').append(tr);
        }
    }

    function displayError(error) {
        $('<tr>').append($('<td>').text(error.statusText)).appendTo($('#results'));
    }

    function addStudent() {
        let id = $('#studentId').val();
        let firstName = $('#studentFirstName').val();
        let lastName = $('#studentLastName').val();
        let facultyNumber = $('#studentFacultyNumber').val();
        let grade = $('#studentGrade').val();

        let facultyNumberRegex = /\d+/;

        if (id !== '' &&
            firstName !== '' &&
            lastName !== '' &&
            facultyNumberRegex.test(facultyNumber) &&
            grade !== '') {
            grade = Number(grade);
            id = Number(id);

            let studentData = {
                ID: id,
                FirstName: firstName,
                LastName: lastName,
                FacultyNumber: facultyNumber,
                Grade: grade
            };

            let studentRequest = {
                method: "POST",
                url: baseURL,
                headers: headers,
                data: JSON.stringify(studentData)
            };

            $.ajax(studentRequest)
                .then(function() {
                    $('#results tr:gt(0)').remove();
                    requestStudents();
                })
                .catch(function() {
                    $('<tr>').append($('<td>').text(error.statusText)).appendTo($('#results'));
                });
        }
    }
}