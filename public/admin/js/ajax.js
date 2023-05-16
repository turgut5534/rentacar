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

$('body').on('click', '.edit-category', function(e) {

    e.preventDefault()

    const id = $(this).data('id')
    const title = $(this).data('title')
        
    $('#edit-category-id').val(id)
    $('#category-title').val(title)
    
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


$('body').on('submit','#category-edit-form', function(e) {

    e.preventDefault()

    const button = $('.save-category-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Updating...')
        },
        success: function(response) {

            $('.category-name-h5-'+ response.category.id).html(response.category.name)
      
        $('#editCategoryModal').modal('hide')
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


$('body').on('submit','#category-save-form', function(e) {

    e.preventDefault()

    const button = $('.save-category-button')

    $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: $(this).serialize(),
        beforeSend: function() {
            button.html('Saving...')
        },
        success: function(data) {

            console.log(data.category.id)

            $('.categories').append(`<div class="col-12 col-md-6 col-lg-4 category-${data.category.id}">
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="capitalize card-title category-name-h5-${data.category.id}">
                        ${data.category.name}
                    </h5>
                    <div class="d-flex justify-content-end">
                        <a href="javascript:;"
                            class="btn btn-sm btn-outline-secondary me-2 edit-category edit-category-${data.category.id}" data-id="${data.category.id}" data-title="${data.category.name}" data-bs-toggle="modal" data-bs-target="#editCategoryModal">Edit</a>
                        <a href="javascript:;" data-data="category" data-href="/admin/category/delete/${data.category.id}" data-title="${data.category.name}" data-id="${data.category.id}" class="btn btn-sm btn-outline-danger delete-data">Delete</a>
                    </div>
                </div>
            </div>
        </div>`)

        button.html('Save')
        $('#addCategoryModal').modal('hide')
        $('.modal-backdrop').remove();
        $('#category-save-form')[0].reset();

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