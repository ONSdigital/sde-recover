$(function(){
    $('#decrypt-form').on('submit', function(event){
        event.preventDefault();
        var postData = $('#post-data').val();

        $.post('/', $('#post-data').val())
          .done(function(data){
            $(".alert").removeClass('alert-success alert-danger hidden');
            $(".alert").addClass('alert-success').text("Posted encrypted data: " + data.substr(1, 100) + "...");
            $(".alert").show();
          })
          .fail(function(){
            $(".alert").removeClass('alert-success alert-danger hidden');
            $(".alert").addClass('alert-danger').text("Error during submission");
            $(".alert").show();
          });
    });

    var dataTypes = ['pck', 'image', 'index', 'receipt'];

    function pollFTP() {
      $.getJSON('/list', function(data) {
        for (var i in dataTypes) {
          var dataType = dataTypes[i];
          var tableData = data[dataType];

          $("#" + dataType + "-data tbody").empty();

          $.each(tableData, function(filename, metadata){
            var $tableRow = $('<tr id="' + metadata['filename'] + '"><td><a href="#">' + metadata['filename'] + '</a></td><td>' +  metadata['size'] + '</td><td>' + metadata['modify'] + '</td></tr>');

            var onClickType = dataType;
            
            $tableRow.on("click", function(event){
              var filename = $(event.target).closest("tr").attr("id");

              $('#contentModal .modal-title').text(filename);

              $.get('/view/' + onClickType + '/' + filename, function(data){
                $('#contentModal .modal-body').html(data);
                $('#contentModal').modal('show');
              });
            });

            $("#" + dataType + "-data tbody").append($tableRow);
          });
        }
      });
    }

    $("#empty-ftp").on("click", function(event){
      $.getJSON('/clear')
        .done(function(data){

          for (var i in dataTypes) {
            var dataType = dataTypes[i];
            console.log(dataType);
            $("#" + dataType + "-data tbody").empty();
          }

          $(".alert").removeClass('alert-success alert-danger hidden');
          $(".alert").addClass('alert-success').text("Cleared " + data.removed + " files from FTP");
          $(".alert").show();
        })
        .fail(function(){
          $(".alert").removeClass('alert-success alert-danger hidden');
          $(".alert").addClass('alert-danger').text("Error on emptying ftp");
          $(".alert").show();
        });
    });

    setInterval(pollFTP, 2000);
});