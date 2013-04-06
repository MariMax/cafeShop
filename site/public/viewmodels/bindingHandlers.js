ko.bindingHandlers.uploadImage = {
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()); // Get the current value of the current property we're bound to
            $(element).fileupload({ dataType: 'json',
                done: function (e, data) {
                    //var newId = "#" + e.target.id.replace("newPhotoInput", "newPhoto");
                    //$(newId).attr("style", "background:#fff url(\"" + data.result[0].url + "\") no-repeat center 25%;");

                    var newId = "#" + e.target.id.replace("newPhotoInput", "newPhotoImage");
                    //if (self.id() != null)
                    //    $("#newPhotoImage" + self.id()).attr("src", data.result[0].url);
                    //else
                    $(newId).attr("src", data.result[0].url);
                    $("#newPhotoTmpUrl").val(data.result[0].url);
                }
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            // Leave as before
        }
    };