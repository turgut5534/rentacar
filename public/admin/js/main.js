$(document).ready(function() {
    $('#image-input').on('change', function() {
      var file = $(this)[0].files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        $('.preview-image-box').removeClass('d-none')
        $('.preview-image').attr('src', e.target.result);
      }
      reader.readAsDataURL(file);
    });
  });