$('body').on('submit','#skill-save-form', function(e) {

    e.preventDefault()

    const button = $('.save-skill-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Saving...')
        },
        success: function(response) {

            $('.skills').append(`<div class="col-12 col-md-6 col-lg-4 skill-${response.skill.id}">
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title skill-title-h5-${response.skill.id}">
                        ${response.skill.title}
                    </h5>
                    <h5 class="skill-rate-h5-${response.skill.id}">${response.skill.rate}</h5>
                    <div class="d-flex justify-content-end">
                        <a href="javascript:;"
                            class="btn btn-sm btn-outline-secondary me-2 edit-skill edit-skill-${response.skill.id}" data-id="${response.skill.id}" data-title="${response.skill.title}" data-rate="${response.skill.rate}" data- data-bs-toggle="modal" data-bs-target="#editSkillModal">Edit</a>
                        <a href="javascript:;" data-data="skill" data-href="/admin/skills/delete/${response.skill.id}" data-title="${response.skill.title}" data-id="${response.skill.id}" class="btn btn-sm btn-outline-danger delete-data">Delete</a>
                    </div>
                </div>
            </div>
        </div>`)

        button.html('Save')
        $('#addSkillModal').modal('hide')
        $('.modal-backdrop').remove();
        $('#skill-save-form')[0].reset();

        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'An error occured saving the data',
            });
            button.html('Save')
        }
    })
    
})

$('body').on('click', '.edit-skill', function(e) {

    e.preventDefault()

    const id = $(this).data('id')
    const title = $(this).data('title')
    const rate = $(this).data('rate')
        
    $('#edit-skill-id').val(id)
    $('#skill-title').val(title)
    $('#skill-rate').val(rate)
    
})

$('body').on('click', '.edit-feature', function(e) {

    e.preventDefault()

    const id = $(this).data('id')
    const title = $(this).data('title')
        
    $('#edit-feature-id').val(id)
    $('#feature-title').val(title)
    
})

$('body').on('click', '.edit-location', function(e) {

    e.preventDefault()

    const id = $(this).data('id')
    const title = $(this).data('title')
    const address = $(this).data('address')
    const city = $(this).data('city')
        
    $('#edit-location-id').val(id)
    $('#location-title').val(title)
    $('#location-address').val(address)
    $('#location-city').val(city)
    
})


$('body').on('submit','#skill-edit-form', function(e) {

    e.preventDefault()

    const button = $('.save-skill-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Updating...')
        },
        success: function(response) {

            $('.skill-title-h5-'+ response.skill.id).html(response.skill.title)
            $('.skill-rate-h5-'+ response.skill.id).html(response.skill.rate)

            // $('.edit-skill-'+ response.skill.id).attr('data-title',response.skill.title)
      

        $('#editSkillModal').modal('hide')
        $('.modal-backdrop').remove();
        button.html('Update')

        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'An error occured updating the data',
            });
            button.html('Update')
        }
    })
    
})


$('body').on('submit','#feature-edit-form', function(e) {

    e.preventDefault()

    const button = $('.save-feature-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Updating...')
        },
        success: function(response) {

            $('.feature-name-h5-'+ response.feature.id).html(response.feature.name)
      
        $('#editFeatureModal').modal('hide')
        $('.modal-backdrop').remove();
        button.html('Update')

        iziToast.success({
            title: 'OK',
            message: 'Feature updated successfuly!',
        });

        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'An error occured updating the data',
            });
            button.html('Update')
        }
    })
    
})

$('body').on('submit','#location-edit-form', function(e) {

    e.preventDefault()

    const button = $('.update-location-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Updating...')
        },
        success: function(response) {

            $('.location-name-h5-'+ response.location.id).html(response.location.name)
      
        $('#editLocationModal').modal('hide')
        $('.modal-backdrop').remove();
        button.html('Update')

        iziToast.success({
            title: 'OK',
            message: 'Location updated successfuly!',
        });

        },
        error: function(e) {
            iziToast.error({
                title: 'Error',
                message: 'An error occured updating the data',
            });
            button.html('Update')
        }
    })
    
})


$('body').on('click', '.delete-data', function(e) {

    e.preventDefault()

    const data = $(this).data('data')
    const title = $(this).data('title')

    Swal.fire({
        title: 'Are you sure?',
        text: title+ " will be deleted",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

            const target = $(this).data('href')
            const id = $(this).data('id')

            $.ajax({
                type: 'DELETE',
                url: target,
                success: function(response) {

                    $('.'+data + '-' + id).remove()

                    iziToast.success({
                        title: 'Ok',
                        message: title + ' has been deleted successfully!',
                    });
                },
                error: function(e) {
                    iziToast.error({
                        title: 'Error',
                        message: 'An error occured deleting the data',
                    });
                }
            })

        }
      })
    
})

$('.delete-file').on('click', function() {
    
    const id = $(this).data('id')

    Swal.fire({
        title: 'Are you sure?',
        text: "File will be deleted",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            
            $.ajax({
                type: 'DELETE',
                url: "/admin/project/projectfile/delete/"+ id,
                success: function(response) {

                    $('.project-file-'+ id).remove()

                    iziToast.success({
                        title: 'Ok',
                        message: 'The file has been deleted successfully!',
                    });
                },
                error: function(e) {
                    iziToast.error({
                        title: 'Error',
                        message: 'An error occured deleting the file',
                    });
                }
            })

        }
      })

})


$('body').on('submit','#feature-save-form', function(e) {

    e.preventDefault()

    const button = $('.save-feature-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Saving...')
        },
        success: function(data) {

            console.log(data.feature.id)

            $('.categories').append(`<div class="col-12 col-md-6 col-lg-4 category-${data.feature.id}">
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="capitalize card-title category-name-h5-${data.feature.id}">
                        ${data.feature.name}
                    </h5>
                    <div class="d-flex justify-content-end">
                        <a href="javascript:;"
                            class="btn btn-sm btn-outline-secondary me-2 edit-category edit-category-${data.feature.id}" data-id="${data.feature.id}" data-title="${data.feature.name}" data-bs-toggle="modal" data-bs-target="#editCategoryModal">Edit</a>
                        <a href="javascript:;" data-data="category" data-href="/admin/category/delete/${data.feature.id}" data-title="${data.feature.name}" data-id="${data.feature.id}" class="btn btn-sm btn-outline-danger delete-data">Delete</a>
                    </div>
                </div>
            </div>
        </div>`)

        button.html('Save')
        $('#addFeatureModal').modal('hide')
        $('.modal-backdrop').remove();
        $('#feature-save-form')[0].reset();

        },
        error: function(e) {
            console.log(e)
            iziToast.error({
                title: 'Error',
                message: 'An error occured saving the data',
            });
            button.html('Save')
        }
    })
    
})

$('body').on('submit','#location-save-form', function(e) {

    e.preventDefault()

    const button = $('.save-location-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Saving...')
        },
        success: function(data) {

            console.log(data.location.id)

            $('.categories').append(`<div class="col-12 col-md-6 col-lg-4 location-${data.location.id}">
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="capitalize card-title location-name-h5-${data.location.id}">
                        ${data.location.name}
                    </h5>
                    <div class="d-flex justify-content-end">
                        <a href="javascript:;"
                            class="btn btn-sm btn-outline-secondary me-2 edit-location edit-category-${data.location.id}" data-id="${data.location.id}" data-title="${data.location.name}" data-bs-toggle="modal" data-bs-target="#editLocationModal">Edit</a>
                        <a href="javascript:;" data-data="location" data-href="/admin/locations/delete/${data.location.id}" data-title="${data.location.name}" data-id="${data.location.id}" class="btn btn-sm btn-outline-danger delete-data">Delete</a>
                    </div>
                </div>
            </div>
        </div>`)

        button.html('Save')
        $('#addLocationModal').modal('hide')
        $('.modal-backdrop').remove();
        $('#location-save-form')[0].reset();

        },
        error: function(e) {
            console.log(e)
            iziToast.error({
                title: 'Error',
                message: 'An error occured saving the data',
            });
            button.html('Save')
        }
    })
    
})

$('.receive-car').on('click', function(e) {

    e.preventDefault()

    const id = $(this).data('id')

    Swal.fire({
        title: 'Are you sure?',
        text: "This car will be taken from the customer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes I confirm',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            
            $.ajax({
                type: 'POST',
                url: "/admin/cars/takecar/"+ id,
                success: function(data) {

                    iziToast.success({
                        title: 'Ok',
                        message: 'The car is taken back from the customer!',
                    });

                    setTimeout(() => {
                        location.reload()
                    }, 1500);
       
                },
                error: function(e) {
                    iziToast.error({
                        title: 'Error',
                        message: 'An error occured deleting the file',
                    });
                }
            })

        }
      })

})