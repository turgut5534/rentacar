$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
    }
});

$('#login-form').on('submit', function(e) {

    e.preventDefault()

    const button = $('.login-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Please wait...')
        },
        success: function(response) {
            window.location.href = '/admin/dashboard'
        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'Incorrect username or password',
            });
            button.html('Send')
        }
    })
    
})