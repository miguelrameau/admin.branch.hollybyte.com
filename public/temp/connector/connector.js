/**
 * @author Fabio Ospitia Trujillo
 */

Namespace('HB2.admin');

HB2.admin.connector = ( function($) {

    var currVal = null;

    /**
     *
     */
    function getConnectorJSON() {
        obj = {};
        if($('#id').val().trim()) {
            obj.id = $('#id').val().trim();
        }
        if($('#description').val().trim()) {
            obj.description = $('#description').val().trim();
        }

        obj.type = $('#type').val().trim();
        if(obj.type == 'FTP') {
            obj.conf = {};
            if($('#username').val().trim()) {
                obj.conf.username = $('#username').val().trim();
            }
            if($('#password').val().trim()) {
                obj.conf.password = $('#password').val().trim();
            }
            if($('#server').val().trim()) {
                obj.conf.server = $('#server').val().trim();
            }
            if($('#port').val()) {
                obj.conf.port = parseInt($('#port').val().trim());
            }
            if($('#dir').val().trim()) {
                obj.conf.dir = $('#dir').val().trim();
            }
        } else if(obj.type == 'YOUTUBE') {
            obj.conf = {};
            if($('#username').val().trim()) {
                obj.conf.username = $('#username').val().trim();
            }
            if($('#password').val().trim()) {
                obj.conf.password = $('#password').val().trim();
            }
        } else if(obj.type == 'TWITER') {
            obj.conf = {};
            if($('#username').val().trim()) {
                obj.conf.username = $('#username').val().trim();
            }
        } else if(obj.type == 'FACEBOOK') {
            obj.conf = {};
            if($('#username').val().trim()) {
                obj.conf.username = $('#username').val().trim();
            }
        }

        if($('#created').val().trim()) {
            obj.created = $('#created').val().trim();
        }
        if($('#version').val().trim()) {
            obj.version = parseInt($('#version').val().trim());
        }

        return obj;
    }

    /**
     *
     */
    function setConnectorJSON(obj) {
        if(jQuery.isEmptyObject(obj)) {
            return;
        }
        currVal = obj;
        console.log(obj);
        console.info('conf: ' + obj.conf);
        $('.test-buttom')[0].style.display = "none";

        if(obj.id !== undefined) {
            $('#id').val(obj.id);
        }
        if(obj.description !== undefined) {
            $('#description').val(obj.description);
        }
        if(obj.type !== undefined) {
            $('#type').val(obj.type);
            //if (obj.type === "FACEBOOK" && obj.conf.token === undefined) {
            if(obj.type === "FACEBOOK") {
                getTestUrl();
            }
            if(obj.type === "TWITTER") {
                getTwitterUrl();
            }
        }
        if(obj.conf !== undefined) {
            if(obj.conf.username !== undefined) {
                $('#username').val(obj.conf.username);
            }
            if(obj.conf.password !== undefined) {
                $('#password').val(obj.conf.password);
            }
            if(obj.conf.server !== undefined) {
                $('#server').val(obj.conf.server);
            }
            if(obj.conf.port !== undefined) {
                $('#port').val(obj.conf.port);
            }
            if(obj.conf.dir !== undefined) {
                $('#dir').val(obj.conf.dir);
            }
        }
        if(obj.created !== undefined) {
            $('#created').val(obj.created);
        }
        if(obj.version !== undefined) {
            $('#version').val(obj.version);
        }

        onChangeConnectorType($('#type'));
    }

    /**
     *
     */
    function onChangeConnectorType(type) {
        if(type.val() == 'FTP') {
            $('#usernameLayer')[0].style.display = 'block';
            $('#passwordLayer')[0].style.display = 'block';
            $('#serverLayer')[0].style.display = 'block';
            $('#portLayer')[0].style.display = 'block';
            $('#directoryLayer')[0].style.display = 'block';
        } else if(type.val() == 'YOUTUBE') {
            $('#usernameLayer')[0].style.display = 'block';
            $('#passwordLayer')[0].style.display = 'block';
            $('#serverLayer')[0].style.display = 'none';
            $('#portLayer')[0].style.display = 'none';
            $('#directoryLayer')[0].style.display = 'none';
        } else if(type.val() == 'TWITTER') {
            $('#usernameLayer')[0].style.display = 'block';
            $('#passwordLayer')[0].style.display = 'none';
            $('#serverLayer')[0].style.display = 'none';
            $('#portLayer')[0].style.display = 'none';
            $('#directoryLayer')[0].style.display = 'none';
        } else if(type.val() == 'FACEBOOK') {
            $('#usernameLayer')[0].style.display = 'block';
            $('#passwordLayer')[0].style.display = 'none';
            $('#serverLayer')[0].style.display = 'none';
            $('#portLayer')[0].style.display = 'none';
            $('#directoryLayer')[0].style.display = 'none';
        }
    }

    /**
     *
     */
    function existsConnector(id) {
        var ret = false;
        console.log(id)
        $.ajax({
            async : false,
            url : '/connector/exists?id=' + id,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                ret = data.result;
            },
            error : function(jqXHR, textStatus, errorThrown) {
            }
        });
        return ret;
    }

    /**
     *
     */
    function getTestUrl() {
        //Si existe token->open dialog de alerta
        $('.test-buttom')[0].style.display = "block";
        var id = $('#id').val();
        $.ajax({
            url : '/connector/register-facebook/',
            type : "GET",
            data : 'id=' + id,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info('getTest data: ' + data);
                setUrl(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(jqXHR);
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     *
     */
    function getTwitterUrl() {
        $('.test-buttom')[0].style.display = "block";
        var id = $('#id').val();
        console.info('Twitter Url: ' + id);
        $.ajax({
            url : '/connector/register-twitter/',
            type : "GET",
            data : 'id=' + id,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info('getTest data: ' + data);
                setUrl(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(jqXHR);
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     *
     */
    function setUrl(url) {

        $('#testBt').attr("href", url);
    }

    /**
     *
     */
    function validConnectorId(id) {

    }

    /**
     *
     */
    function initConnectorEdit(org) {

        // Init JSON
        setConnectorJSON(org);

        existsConnector(org.id);

        // Init Validator
        var validator = $('#connectorForm').validate({
            rules : {
                id : "required",
                username : "required",
                password : {
                    required : function() {
                        type = $('#type').val();
                        return (type == 'FTP' || type == 'YOUTUBE');
                    }
                },
                server : {
                    required : function() {
                        type = $('#type').val();
                        return (type == 'FTP');
                    }
                },
                port : {
                    required : function() {
                        type = $('#type').val();
                        return (type == 'FTP');
                    },
                    digits : true
                }
            },
            messages : {
                id : "Id is required",
                username : "Username is required",
                password : "Password is required",
                server : "Server is required",
                port : {
                    required : "Port is required",
                    digits : "Port must be a number"
                }
            }
        });

        $('#type').change(function() {
            onChangeConnectorType($(this));
        });
        $('#connectorSave').click(function() {
            validator.form();
            obj = getConnectorJSON();
            console.log(obj);

            var url = '/connector/create';
            if(!jQuery.isEmptyObject(org)) {
                url = '/connector/update';
            }

            $.ajax({
                url : url,
                type : 'POST',
                dataType : 'json',
                data : 'data=' + $.toJSON(obj),
                success : function(data, textStatus, jqXHR) {
                    alert('ok ' + data);
                }
            });
        });
        $('#connectorClear').click(function() {
            validator.resetForm();
            $('#connectorForm')[0].reset();
            if(!jQuery.isEmptyObject(org)) {
                getConnectorJSON(org);
            }
            onChangeConnectorType($('#type'));
        });
        $('#connectorBack').click(function() {
            history.back();
        });
    }
    
    function onClickEditConnector(element, table) {
        var id = table.fnGetData($(element).parents('tr')[0])[0];
        window.location = '/connector/form?id='+id;
    }

    function onClickDeleteConnector(element, table) {
        var pos = table.fnGetPosition($(element).parents('tr')[0]);
        var data = table.fnGetData(pos);
        $(table).data('position', pos);
        $(table).data('data', data);
        $("#deleteDialog").dialog('open');
    }

    function initConnectorsTable(table, objs) {
        table.fnClearTable();
        var rows = new Array();
        for (var i = 0; i < objs.length; i++) {
            var row = new Array();
            row[0] = objs[i].id;
            if (objs[i].type == 'FTP') {
                row[1] = '<img src="/images/connector/ftp.png" />';
            } else if (objs[i].type == 'YOUTUBE') {
                row[1] = '<img src="/images/connector/youtube.png" />';
            } else if (objs[i].type == 'TWITTER') {
                row[1] = '<img src="/images/connector/twitter.png" />';
            } else if (objs[i].type == 'FACEBOOK') {
                row[1] = '<img src="/images/connector/facebook.png" />';
            }
            row[2] = objs[i].description;
            row[3] = objs[i].created;
            row[4] = '<img class="connector-edit" src="/images/common/edit.png" /><img class="connector-delete" src="/images/common/delete.png"/>';
            rows[i] = row;
        }
        table.fnAddData(rows);

        $('.connector-edit').click( function() {
            onClickEditConnector(this, table);
        });
        $('.connector-delete').click( function() {
            onClickDeleteConnector(this, table);
        });
    }

    function loadConnectors(table) {
        $.ajax({
            url: '/connector/find',
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                initConnectorsTable(table, data.result);
            }
        } );
    }

    function deleteConnector(id) {
        console.log('deleteConnector: '+id);
        $.ajax({
            url: '/connector/delete?id='+id,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
            }
        } );
    }
    
    function initIndex() {
        // Init Connectors Table
        var table = $('#connectorTable').dataTable({
            "bLengthChange": false,
            "aoColumnDefs": [{
                "sClass": "center",
                "aTargets": [ 1, 3, 4 ]
            }]
        });

        // Init Delete Dialog
        $('#deleteDialog').dialog({
            autoOpen: false,
            resizable: false,
            height:140,
            modal: true,
            buttons: {
                "Delete item": function() {
                    var pos = table.data('position');
                    var data = table.data('data');
                    deleteConnector(data[0]);
                    table.fnDeleteRow(pos);
                    $(this).dialog("close");
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });

        // Refresh Connectors Button
        $('#refresh').click( function() {
            loadConnectors(table);
        });
        // Add Connector Button
        $('#add').click( function() {
            window.location = '/connector/form';
        });
        // Load Connectors
        loadConnectors(table);
    }
    
    return {
        init: initIndex,
        initConnectorEdit: initConnectorEdit
    };
}(jQuery));
