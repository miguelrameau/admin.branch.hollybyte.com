//repo lo coge del general.
subtitleValidator = '';
var uploadPath = '';

/**
 *
 */
function onClickEditSubtitleSave(table) {

    var type = $('#subtitleType').val();
    var oValue = $('#subtitleValue');

    if(!subtitleValidator.form())
        return false;
    data = new Array();
    if($.trim($('#subtitleType').val())) {
        data[0] = $.trim($('#subtitleType').val());
    }
    if($.trim($('#subtitleLang').val())) {
        data[1] = $.trim($('#subtitleLang').val());
    }
    if($.trim($('#subtitleFileValue').val())) {
        data[2] = $.trim($('#subtitleFileValue').val());
    }

    if($.trim($('#subtitleFileValue').val())) {
        var url = 'http://' + repo + '/' + data[2];
        data[3] = '<a href="' + url + '"><img class="asset-subtitle-action-download" src="/images/common/download.png" /></a><img class="asset-subtitle-action-delete" src="/images/common/delete.png" onClick="onClickDeleteSubtitle(this, assetSubtitleTable);"/>';
    }

    console.log(data);
    // Add
    table.fnAddData(data);

    $('#subtitleForm')[0].reset();

    $("#subtitleEditDialog").dialog('close');
}

/**
 *
 */
function onClickDeleteSubtitleDelete(table) {
    table.fnDeleteRow(currValuePos);
    $("#subtitleDeleteDialog").dialog('close');
}

/**
 *
 */
function onClickEditSubtitleCancel() {
    $('#subtitleForm')[0].reset();
    $("#subtitleEditDialog").dialog('close');
}

/**
 *
 */
function onClickAddSubtitle() {
    currValuePos = -1;
    //onChangeValueType();
    $("#subtitleEditDialog").dialog('open');
    $('#subtitleForm')[0].reset();

    //onChangeValueType();

}

/**
 *
 */
function onClickEditSubtitle(element, table) {
    currValuePos = table.fnGetPosition($(element).parents('tr')[0]);
    data = table.fnGetData($(element).parents('tr')[0]);

    $('#subtitleType').val(data[0]);
    $('#subtitleLang').val(data[1]);
    $('#subtitlePath').val(data[2]);

    $("#subtitleEditDialog").dialog('open');

}

/**
 *
 */
function onClickDeleteSubtitle(element, table) {
    currValuePos = table.fnGetPosition($(element).parents('tr')[0]);
    $("#subtitleDeleteDialog").dialog('open');
}

/**
 *
 */
function renderizeSubtitle(lang, path) {
    var strval = "";

    //COGER EL VALOR DEL TIPO QUE ES
    if(type == 'EN') {
        strval = value;
    } else if(type == 'ES') {
        strval = value;
    } else {
        strval = value;
    }

    return strval;
}

/**
 *
 */
function initSubtitlesTable(table, values) {

    table.fnClearTable();

    var datas = new Array();
    if(!HB2.admin.isEmpty(values)) {
        for(var i = 0; i < values.length; i++) {
            var data = new Array();
            var obj = values[i];
            if(obj.type != 'undefined') {
                data[0] = obj.type;
            } else {
                // TODO ERROR
            }
            if(obj.lang != 'undefined') {
                data[1] = obj.lang;
            } else {
                // TODO ERROR
            }

            if(obj.path != 'undefined') {
                data[2] = obj.path;
            } else {
                // TODO ERROR
            }
            var url = 'http://' + repo + '/' + data[2];
            data[3] = '<a href="' + url + '"><img class="asset-subtitle-action-download" src="/images/common/download.png" /></a><img class="asset-subtitle-action-delete" src="/images/common/delete.png"/>';

            datas[i] = data;
        }
    }

    table.fnAddData(datas);

    $('.asset-subtitle-action-delete').click(function() {
        onClickDeleteSubtitle(this, table);
    });
    $('#subtitleAddSubtitle').click(function() {
        onClickAddSubtitle();
    });
    $('#subtitleUploadFile').click(function() {
        $('#subtitleFileUploading').val('true');
    });
    // Init Value Form
    $('#subtitleForm').iframePostForm({
        iframeID : 'subtitleFileIframe',
        post : function() {
            var msg = !$('input[type=file]').val().length ? 'Submitting form...' : 'Uploading file...';
            console.log('onClickValueUploadFile: post ' + msg);

        },
        complete : function(response) {
            console.log('onClickValueUploadFile: complete ' + response);
            obj = jQuery.parseJSON(response);
            alert("Archivo subido correctamente");
            if(($("#subtitleType").val() == "TIMED_TEXT" && checkExtension($("#subtitleFileValue").val().toLowerCase(), Array('.xml')) ) || ($("#subtitleType").val() == "SUBRIP" && checkExtension($("#subtitleFileValue").val().toLowerCase(), Array('.srt')) )) {
                $('#subtitleFileValue').val(obj.path);
                uploadPath = obj.path;
                $('#subtitleFileUploading').val('false');
            } else {
                $('#subtitleFileValue').val("");
                $('#subtitleFileUploading').val('true');
            }
        }
    });

    jQuery.validator.addMethod("subtitleExists", function(value, element) {
        //Esta funcion debe devolver false para validar  y true para ignorar.
        var type = $('#subtitleType').val();
        var lang = $('#subtitleLang').val();

        if($('#subtitleFileUploading').val() == 'true')
            return true;
        return !HB2.admin.asset.inAssetSubtitlesTable(type, lang);
    }, "El subtitle ya existe");
    subtitleValidator = $('#subtitleForm').validate({
        rules : {
            subtitleType : {
                "required" : true,
                "subtitleExists" : true
            },

            subtitleLang : {
                "required" : true
            }
        },
        messages : {
            subtitleFileValue : "Debe subir un archivo."

        }
    });

    console.log(subtitleValidator);

    return table;
}