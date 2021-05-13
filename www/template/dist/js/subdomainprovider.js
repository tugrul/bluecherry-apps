
$.validator.addMethod( 'ipv4', function( value, element ) {
    return this.optional( element ) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test( value );
}, 'Please enter a valid IP v4 address.' );

$.validator.addMethod( 'ipv6', function( value, element ) {
    return this.optional( element ) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test( value );
}, 'Please enter a valid IP v6 address.' );

$.validator.addMethod('subdomain', function(value, element) {
    return this.optional( element ) || /^[a-z0-9][a-z0-9\-]{2,49}$/i.test(value);
}, 'Invalid subdomain name');


$('#subdomain-provider-register').validate({
    rules: {
        subdomain_name: {
            required: true,
            subdomain: true,
            minlength: 3,
            maxlength: 50
        },
        server_ip_address_4: {
            required: true,
            ipv4: true
        },
        server_ip_address_6: {
            ipv6: true
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.closest('.validation-field'));
    },
    submitHandler: function(form) {

        var that = this;

        $.get('/subdomainproviderquery', {
            name: $('#subdomain_name').val()
        }, function (data) {

            if (!data.success) {
                that.showErrors({
                    subdomain_name: 'This subdomain name is not available'
                });
            }

            if (licenseIdExists) {
                form.submit();
            } else {
                alert('you need a license id to use a subdomain');
            }


        }, 'json');

    }
});
