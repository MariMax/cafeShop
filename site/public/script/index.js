  $(function () {
    
    
    
        function getUserCafe(userId) {
            $.post('/api/users/getcafe/' + userId)
        .done(function (data) {
            if (data && data.CellPhoneApprove)
                document.location.href = '/cafe/'+data._id+'/admin/';
            else document.location.href = '/cafes/newcafe';
        })
        }
    
        function route() {
            var userId = $('#userId').val();
    
            if (userId != 'undefined') {
                getUserCafe(userId);
            }
        }
        route();
    })