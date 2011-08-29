Namespace('HB2.admin');

HB2.admin.metavalue = ( function ($) {

    currValuePos = -1;
    validator = '';
    

    /**
     *
     */
    repo = 'repo.eu.hollybyte.com';

    function onChangeValueType() {
        type = $('#valueType').val();
        if (type == 'STRING') {//CASO DE STRING
            $('#valueStringBlock')[0].style.display = 'block';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'none';

            var value = $('#valueValue').val();
            $('#valueStringValue').val(value);
        } else if (type == 'INTEGER') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'block';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'none';

            var value = $('#valueValue').val();
            $('#valueIntegerValue').val(value);
        } else if (type == 'DOUBLE') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'block';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'none';

            var value = $('#valueValue').val();
            $('#valueDoubleValue').val(value);
        } else if (type == 'BOOLEAN') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'block';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'none';

            var value = $('#valueValue').val();
            $('#valueBooleanValue').val(value);
        } else if (type == 'COLOR') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'block';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'none';

            var value = $('#valueValue').val();
            picker.changeValue(value);

            $('#valueColorValue').val(value);
        } else if (type == 'URL') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'block';
            $('#valueFileBlock')[0].style.display = 'none';

            var value = $('#valueValue').val();
            $('#valueUrlValue').val(value);
        } else if (type == 'IMAGE') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'block';

            var value = $('#valueValue').val();
            $('#valueImageValue').val(value);
        } else if (type == 'FILE') {
            $('#valueStringBlock')[0].style.display = 'none';
            $('#valueIntegerBlock')[0].style.display = 'none';
            $('#valueDoubleBlock')[0].style.display = 'none';
            $('#valueBooleanBlock')[0].style.display = 'none';
            $('#valueColorBlock')[0].style.display = 'none';
            $('#valueUrlBlock')[0].style.display = 'none';
            $('#valueFileBlock')[0].style.display = 'block';

            var value = $('#valueValue').val();
            $('#valueFileValue').val(value);
        }
    }

    /**
     *
     */
    function onClickEditValueSave(table) {

        var  type = $('#valueType').val();
        var oValue = $('#valueValue');

        //COGER EL VALOR DEL TIPO QUE ES
        if( type == 'STRING') {
            oValue.val( $("#valueStringValue").val() );
        } else if(type == 'INTEGER') {
            oValue.val( $("#valueIntegerValue").val() );
        } else if(type == 'DOUBLE') {
            oValue.val( $("#valueDoubleValue").val() );
        } else if(type == 'BOOLEAN') {
            oValue.val("false") ;
            if( $("#valueBooleanValue").is(':checked'))
                oValue.val("true") ;
        } else if(type == 'COLOR') {
            oValue.val( $("#valueColorValue").val() );
        } else if(type == 'URL') {
            oValue.val( $("#valueUrlValue").val() );
        } else if(type == 'IMAGE') {
            oValue.val( $("#valueFileValue").val() );
        } else if(type == 'FILE') {
            oValue.val( $("#valueFileValue").val() );
        }

        if(!validator.form())
            return false;

        data = new Array();
        if ($.trim($('#valueName').val())) {
            data[0] = $.trim($('#valueName').val());
        }
        if ($.trim($('#valueType').val())) {
            data[1] = $.trim($('#valueType').val());
        }
        if ($.trim($('#valueValue').val())) {
            data[2] = $.trim($('#valueValue').val());
            data[3] = 'valor: ' + $.trim($('#valueValue').val());
        }

        if ($.trim($('#valueValue').val())) {
            data[4] = '<img class="value-edit-img" src="/images/common/edit.png"  /><img class="value-delete-img" src="/images/common/delete.png" />';
        }
   

        if (currValuePos >= 0) {

            /*data[0] = table.fnGetData(currValuePos,0);
            data[1] = table.fnGetData(currValuePos,1);*/

            // Edit
            table.fnUpdate(data, currValuePos, 0);
        } else {

            console.log(data);
            // Add
            table.fnAddData(data);
        }
        
        $('.value-edit-img').click( function() {
            onClickEditValue(this, table);
        });
        $('.value-delete-img').click( function() {
            onClickDeleteValue(this, table);
        });
        $('#valueForm')[0].reset();

        $("#valueEditDialog").dialog('close');
    }

    /**
     *
     */
    function onClickDeleteValueDelete(table) {
        table.fnDeleteRow(currValuePos);
        $("#valueDeleteDialog").dialog('close');
    }

    /**
     *
     */
    function onClickEditValueCancel() {
        $('#valueForm')[0].reset();
        $("#valueEditDialog").dialog('close');
    }

    /**
     *
     */
    function onClickAddValue() {
        $("#valueType").removeAttr("disabled");
        $("#valueName").removeAttr("disabled");
        currValuePos = -1;

        onChangeValueType();
        $("#valueEditDialog").dialog('open');
        $('#valueForm')[0].reset();

        $('#valueStringValue').val('');
        $('#valueIntegerValue').val('');
        $('#valueDoubleValue').val('');
        $('#valueBooleanValue').removeAttr("checked");
        $('#valueUrlValue').val('');
        $('#valueFileValue').val('');
        $('#valueValue').val('');
        onChangeValueType();
    }

    /**
     *
     */
    function onClickEditValue(element, table) {
        $("#valueType").attr("disabled", "disabled");
        $("#valueName").attr("disabled", "disabled");

        currValuePos = table.fnGetPosition($(element).parents('tr')[0]);

        data = table.fnGetData($(element).parents('tr')[0]);

        $('#valueName').val(data[0]);
        $('#valueType').val(data[1]);
        $('#valueValue').val(data[2]);

        $("#valueEditDialog").dialog('open');
        onChangeValueType();
    }

    /**
     *
     */
    function onClickDeleteValue(element, table) {
        currValuePos = table.fnGetPosition($(element).parents('tr')[0]);
        $("#valueDeleteDialog").dialog('open');
    }

    /**
     *
     */
    function renderizeMetavalue(type, value) {
        var strval = "";

        //COGER EL VALOR DEL TIPO QUE ES
        if( type == 'STRING') {
            strval = value;
        } else if(type == 'INTEGER') {
            strval = value;
        } else if(type == 'DOUBLE') {
            strval = value;
        } else if(type == 'BOOLEAN') {
            strval = value;
        } else if(type == 'COLOR') {
            strval = '<div style="background:#'+value+'; width:30px; height:30px; position:relative; margin-left:auto; margin-right:auto;"></div>';
        } else if(type == 'URL') {
            url = value;
            strval = '<a href="'+url+'" target="_blank"><img src="/images/common/btn_metadata_url.png" /></a>';
        } else if(type == 'IMAGE') {
            url = 'http://' + repo + '/' + value;
            strval = '<a href="'+url+'" target="_blank"><img src="/images/common/btn_metadata_image.png" /></a>';
        } else if(type == 'FILE') {
            url = 'http://' + repo + '/' + value;
            strval = '<a href="'+url+'" target="_blank"><img src="/images/common/btn_metadata_file.png" /></a>';
        }

        return strval;
    }

    /**
     *
     */
    function initValuesTable(table, values, repository) {
        repo = repository;

        picker = new Widget_ColorPickerLoader('valueColorBlock', '000000');
        picker.inputId = 'valueColorValue';
        picker.loadWidget();

        table.fnClearTable();

        var datas = new Array();
        if(!HB2.admin.isEmpty(values)){
            for (var i = 0; i < values.length; i++) {
                var data = new Array();
                var obj = values[i];
                if (obj.name != 'undefined') {
                    data[0] = obj.name;
    
                } else {
                    // TODO ERROR
                }
                if (obj.type != 'undefined') {
                    data[1] = obj.type;
                } else {
                    // TODO ERROR
                }
                data[2] = obj.value;
    
                if (obj.value != 'undefined') {
                    data[3] = obj.value;
                } else {
                    // TODO ERROR
                }
                data[4] = '<img class="value-edit-img" src="/images/common/edit.png" /><img class="value-delete-img" src="/images/common/delete.png"/>';
    
                datas[i] = data;
            }
        }
        
        table.fnAddData(datas);
        $('.value-edit-img').click( function() {
            onClickEditValue(this, table);
        });
        $('.value-delete-img').click( function() {
            onClickDeleteValue(this, table);
        });
        
        $('#valueAddValue').click( function() {
            onClickAddValue();
        });
        $('#valueUploadFile').click( function() {
            $('#valueFileUploading').val('true');
        });
        // Init Value Form
        $('#valueForm').iframePostForm ({
            iframeID: 'valueFileIframe',
            post : function () {
                var msg = !$('input[type=file]').val().length ? 'Submitting form...' : 'Uploading file...';
                console.log('onClickValueUploadFile: post ' + msg);
            },
            complete : function (response) {
                //console.log('onClickValueUploadFile: complete ' + response);
                obj = jQuery.parseJSON(response);
                alert("Archivo subido correctamente");
                //alert(obj.path);
                $('#valueFileValue').val(obj.path);
                $('#valueFileUploading').val('false');
            }
        });

        // Init Value Type
        $('#valueType').change( function() {
            onChangeValueType();
        });
        validator = $('#valueForm').validate({
            //onsubmit: false,
            rules: {
                valueName: {
                    required: function() {
                        //alert("comprobacion: " + $('#valueFileUploading').val());
                        if( $('#valueFileUploading').val() == 'true' )
                            return false;
                        if($('#valueName').val().length > 0)
                            return false;
                        return true;
                    }
                },
                valueValue: {
                    required: function() {
                        if( $('#valueFileUploading').val() == 'true' )
                            return false;
                        if($('#valueValue').val().length > 0)
                            return false;
                        return true;
                    }
                }
            },
            messages: {
                valueName: "Name is required",
                valueValue: "Value is required"
            }
        });

        return table;
    };

    return {
        init: initValuesTable,
        renderizeMetavalue: renderizeMetavalue,
        onClickEditValueCancel: onClickEditValueCancel,
        onClickEditValueSave: onClickEditValueSave,
        onClickDeleteValueDelete: onClickDeleteValueDelete
    }
} (jQuery));