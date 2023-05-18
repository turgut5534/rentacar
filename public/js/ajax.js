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

$('#email-form').on('submit', function(e) {

    e.preventDefault()

    const button = $('.email-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Sending...')
        },
        success: function(response) {
            iziToast.success({
                title: 'OK',
                message: 'Your message is sent successfully!',
            });
            button.html('Send')
            $('#email-form')[0].reset();
        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'An error occurred sending the message',
            });
            button.html('Send')
        }
    })
    
})

$('#register-form').on('submit', function(e) {

    e.preventDefault()

    const button = $('.register-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Saving...')
        },
        success: function(data) {
            
            iziToast.success({
                title: 'OK',
                message: data.message,
            });
            button.html('Send')
            
            setTimeout(() => {
                location.href = '/customer/login'
            }, 1500);

        },
        error: function(e) {

            var response = JSON.parse(e.responseText);
            
            iziToast.error({
                title: 'Error',
                message: response.message,
            });
            button.html('Save')
        }
    })
    
})

$('#customer-login-form').on('submit', function(e) {

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
            window.location.href = '/'
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

$('#customer-image-input').on('change', function(e){

    e.preventDefault()

    var formData = new FormData()
    var file = e.target.files[0]
    formData.append('image', file)

    $.ajax({
        url: '/customer/profile/image/update', // Replace with your server-side upload endpoint
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            location.reload()
        },
        error: function(xhr, status, error) {
          // Handle the error
          console.error(error);
        }
      });

})