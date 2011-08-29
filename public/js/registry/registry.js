/**
 * @author Fabio Ospitia Trujillo
 */
Namespace('HB2.admin');

HB2.admin.registry = ( function($) {
    var value = {};
    var validator;

    /**
     *
     */
    function setData(data) {
        if(jQuery.isEmptyObject(data)) {
            data.identity = null;
        }
        if(!HB2.admin.isEmpty(data.adduser)) {
            $('#account').attr('readonly', true);
            $('#regionDiv').hide();
        }
        if(!HB2.admin.isEmpty(data.identity)) {
            validator = $('#registryForm').validate({
                "rules" : {
                    "onsubmit" : false,
                    "name" : {
                        "required" : true
                    },
                    "email" : {
                        "required" : true,
                        "email" : true,
                        "remote" : {
                            "url" : "/auth/exists-email",
                            "data" : {
                            }
                        }
                    },
                    "account" : {
                        "required" : true,
                        "identity" : true,
                        "remote" : {
                            "url" : "/auth/exists-account",
                            "data" : {
                                "id" : function() {
                                    return $("#account").val();
                                }
                            }
                        }
                    },
                    "region" : {
                        "required" : true
                    }
                },
                "messages" : {
                    "account" : {
                        "remote" : "Account exist"
                    },
                    "email" : {
                        "remote" : "Email exist"
                    }
                }
            });

            $('#usernameDiv').hide();
            $('#dataDiv').hide();
        } else {
            validator = $('#registryForm').validate({
                "rules" : {
                    "onsubmit" : false,
                    "username" : {
                        "remote" : {
                            "url" : "/auth/exists-username",
                            "data" : {
                                "username" : function() {
                                    return $("#username").val();
                                }
                            }
                        },
                        "username" : true
                    },
                    "password" : {
                        "required" : true
                    },
                    "password2" : {
                        "required" : true,
                        "equalTo" : "#password"
                    },
                    "name" : {
                        "required" : true
                    },
                    "email" : {
                        "required" : true,
                        "email" : true,
                        "remote" : {
                            "url" : "/auth/exists-email",
                            "data" : {
                            }
                        }
                    },
                    "gender" : {
                        "required" : true
                    },
                    "language" : {
                        "required" : true
                    },
                    "country" : {
                        "required" : true
                    },
                    "account" : {
                        "required" : true,
                        "identity" : true,
                        "remote" : {
                            "url" : "/auth/exists-account",
                            "data" : {
                                "id" : function() {
                                    return $("#account").val();
                                }
                            }
                        }
                    },
                    "region" : {
                        "required" : true
                    }
                },
                "messages" : {
                    "username" : {
                        "remote" : "Username exist"
                    },
                    "account" : {
                        "remote" : "Account exist"
                    },
                    "email" : {
                        "remote" : "Email exist"
                    }
                }
            });

            $('#providerTxt').html('Hollybyte');
            $('#providerImg')[0].src = '/images/anonymous/ico_hollybyte.png';

            var language = $('#language');
            for(i in HB2.admin.languages) {
                language.append($("<option></option>").
                attr("value",HB2.admin.languages[i][1]).
                text(HB2.admin.languages[i][0]));
            }
            var country = $('#country');
            for(i in HB2.admin.countries) {
                country.append($("<option></option>").
                attr("value",HB2.admin.countries[i][1]).
                text(HB2.admin.countries[i][0]));
            }
            $('#usernameDiv').show();
            $('#dataDiv').show();
        }

        if(!HB2.admin.isEmpty(data.provider)) {
            $('#provider').val(data.provider);
            if(data.provider == 'GOOGLE') {
                $('#providerTxt').html('Google Account');
                $('#providerImg')[0].src = '/images/anonymous/ico_google.png';
                $('#name').attr('readonly', true);
                $('#email').attr('readonly', true);
            } else if(data.provider == 'GOOGLE_APPS') {
                $('#providerTxt').html('Google Apps Account');
                $('#providerImg')[0].src = '/images/anonymous/ico_google.png';
                $('#name').attr('readonly', true);
                $('#email').attr('readonly', true);
            } else if(data.provider == 'FACEBOOK') {
                $('#providerTxt').html('Facebook');
                $('#providerImg')[0].src = '/images/anonymous/ico_facebook.png';
                $('#name').attr('readonly', true);
                $('#email').attr('readonly', true);
            } else if(data.provider == 'TWITTER') {
                $('#providerTxt').html('Twitter');
                $('#providerImg')[0].src = '/images/anonymous/ico_twitter.png';
                $('#name').attr('readonly', true);
                $('#email').attr('readonly', true);
            } else if(data.provider == 'HOLLYBYTE') {
                $('#providerTxt').html('Hollybyte');
                $('#providerImg')[0].src = '/images/anonymous/ico_hollybyte.png';
            }
        }
        if(!HB2.admin.isEmpty(data.name)) {
            $('#name').val(data.name);
        }
        if(!HB2.admin.isEmpty(data.email)) {
            $('#email').val(data.email);
        }
        if(!HB2.admin.isEmpty(data.account)) {
            $('#account').val(data.account);
        }
        if(!HB2.admin.isEmpty(data.region)) {
            $('#region').val(data.region);
        }
        value = data;
    }

    /**
     *
     */
    function getData() {
        var data = {};

        if(!HB2.admin.isEmpty($('#username').val())) {
            data.username = $('#username').val();
        }
        if(!HB2.admin.isEmpty($('#password').val())) {
            data.password = $('#password').val();
        }
        if(!HB2.admin.isEmpty($('#password2').val())) {
            data.password2 = $('#password2').val();
        }
        if(!HB2.admin.isEmpty($('#gender').val())) {
            data.gender = $('#gender').val();
        }
        if(!HB2.admin.isEmpty($('#country').val())) {
            data.country = $('#country').val();
        }
        if(!HB2.admin.isEmpty($('#language').val())) {
            data.language = $('#language').val();
        }
        if(!HB2.admin.isEmpty($('#account').val())) {
            data.account = $('#account').val();
        }
        if(!HB2.admin.isEmpty($('#region').val())) {
            data.region = $('#region').val();
        }
        if(!HB2.admin.isEmpty($('#provider').val())) {
            data.provider = $('#provider').val();
        }
        if(!HB2.admin.isEmpty($('#name').val())) {
            data.name = $('#name').val();
        }
        if(!HB2.admin.isEmpty($('#email').val())) {
            data.email = $('#email').val();
        }

        return data;
    }

    /**
     *
     */
    function onClickRegister() {
        if(!validator.form()) {
            return;
        }
        obj = jQuery.extend({}, value, getData());
        if(!HB2.admin.isEmpty(value.callback)) {
            obj.callback = encodeURIComponent(value.callback);
        }
        $.ajax({
            url : '/auth/register',
            type : 'POST',
            async : true,
            data : 'registry=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info('[onClickRegister][success] ' + data);
                if(data.result) {
                    if(!HB2.admin.isEmpty(value.adduser)) {
                        alert('Your user has been added successfully to account ' + value.account);
                    }
                    if(HB2.admin.isEmpty(value.identity)) {
                        alert('Your user and account and user has been created successfully');
                        window.location.href = 'https://admin.hollybyte.com/auth/login?openid_identifier=https://openid.hollybyte.com';
                    } else {
                        alert('Your account has been created successfully');
                    }
                    if (!HB2.admin.isEmpty(value.callback)) {
                        window.location.href = value.callback;
                    } else {
                        window.location.href = 'https://admin.hollybyte.com/auth/login';
                    }
                } else {
                }
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     *
     */
    function init() {
        $('#register').click(function(e) {
            onClickRegister()
        });
    }

    return {
        init : init,
        setData : setData
    }
}(jQuery));
