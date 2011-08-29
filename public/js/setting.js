/**
 * @author Fabio Ospitia Trujillo
 */

Namespace('HB2.admin');

HB2.admin.setting = ( function($) {

    var currData = {};
    var medias = [];
    var tabs = null;
    var groupsTable = null;
    var groupEditDialog = null;
    var groupDeleteDialog = null;
    var groupValidator = null;
    var groupTablePos = -1;
    var groupActionHtml = '<img class="setting-group-action-edit" src="/images/common/edit.png"/><img class="setting-group-action-delete" src="/images/common/delete.png" />';

    function loadMedias() {
        $.ajax({
            url : '/setting/medias',
            async : true,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info(data);
                medias = data.result;
                onChangeGroupType();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                medias = [];
            }
        });
    };

    function loadData() {
        $.ajax({
            url : '/setting/data',
            async : true,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info(data);
                currData = data;
                setData(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                currData = {};
            }
        });
    };

    function load() {
        loadMedias();
        loadData();
    };

    function onChangeGroupType() {
        var type = $('#settingGroupType').val();
        $('#settingGroupDefaultMedia').empty();
        $('#settingGroupMedias').empty();
        for(i in medias) {
            if(type == medias[i].type) {
                $('#settingGroupDefaultMedia').
                append($("<option></option>").
                attr("value",medias[i].id).
                text(medias[i].id));
                $('#settingGroupMedias').
                append($("<option></option>").
                attr("value",medias[i].id).
                text(medias[i].id));
            }
        }
    }

    function editGroup(element) {
        if(!HB2.admin.allowed('admin-settings-btn-groups'))
            groupTablePos = groupsTable.fnGetPosition($(element).parents('tr')[0]);

        var data = groupsTable.fnGetData(groupTablePos);
        $('#settingGroupForm')[0].reset();
        $('#settingGroupType').val(data[0]);
        onChangeGroupType();
        $('#settingGroupName').val(data[1]);
        $('#settingGroupDefaultMedia option[value='+data[2]+']').attr("selected", "selected");
        var values = data[3].split(',');
        for(i in values) {
            $('#settingGroupMedias option[value='+values[i]+']').attr("selected", "selected");
        }
        groupEditDialog.dialog('open');
    };

    function deleteGroup(element) {
        groupTablePos = groupsTable.fnGetPosition($(element).parents('tr')[0]);
        console.log(groupTablePos);
        groupDeleteDialog.dialog('open');
    };

    function setGroupTableActions() {
        $('.setting-group-action-edit').click(function() {
            editGroup(this);
        });
        $('.setting-group-action-delete').click(function() {
            deleteGroup(this);
        });
    }

    function setGroupData(obj) {
        var data = [];
        data[0] = obj.type;
        data[1] = obj.name;
        data[2] = obj.defaultMedia;
        data[3] = obj.medias.join(',');
        data[4] = groupActionHtml;
        return data;
    };

    function setGroupsDatas(objs) {
        var datas = [];
        for(i in objs) {
            var data = setGroupData(objs[i]);
            datas.push(data);
        }
        groupsTable.fnClearTable();
        groupsTable.fnAddData(datas);
        setGroupTableActions();
    };

    function setData(obj) {
        if(jQuery.isEmptyObject(obj)) {
            return;
        }
        if(obj.id !== undefined) {
            $('#settingId').html(obj.id);
        }
        if(obj.region !== undefined) {
            $('#settingRegion').html(obj.region);
        }
        if(obj.groups !== undefined) {
            if(HB2.admin.allowed('admin-settings-btn-groups')) {
                setGroupsDatas(obj.groups);
            }
        }
    };

    function getGroupsData() {
        var datas = groupsTable.fnGetData();
        return datas;
    };

    function getData() {
        var obj = {};
        if(HB2.admin.allowed('admin-settings-btn-groups')) {
            obj.groups = getGroupsData();
        }
        return obj;
    };

    function save() {
        var obj = $.extend({}, currData, getData());
        console.log(obj);
        return;
        $.ajax({
            url : '/setting/update',
            async : false,
            dataType : 'json',
            data : 'id=' + obj.id + '&data=' + $.toJSON(obj),
            success : function(data, textStatus, jqXHR) {
                console.info(data);
                currData = data;
                setData(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                currData = {};
            }
        });
    };

    function clear() {
        $('#settingForm')[0].reset()
        setData(currData);
    };

    function back() {
        history.back();
    };

    function init() {
        tabs = $('#settingTabs').tabs();
        groupEditDialog = $('#groupEditDialog').dialog({
            title : "Media Group",
            autoOpen : false,
            resizable : false,
            height : 450,
            width : 600,
            modal : true,
            buttons : {
                "Save" : function() {
                    if(!groupValidator.form()) {
                        return;
                    }
                    var obj = {};
                    obj.type = $('#settingGroupType').val();
                    obj.name = $('#settingGroupName').val();
                    obj.defaultMedia = $('#settingGroupDefaultMedia').val();
                    obj.medias = $('#settingGroupMedias').val();
                    var data = setGroupData(obj);
                    if(groupTablePos >= 0) {
                        groupsTable.fnUpdate(data, groupTablePos);
                    } else {
                        groupsTable.fnAddData(data);
                    }
                    setGroupTableActions();
                    $('#settingGroupForm')[0].reset();
                    $(this).dialog("close");
                },
                Cancel : function() {
                    $('#settingGroupForm')[0].reset();
                    $(this).dialog("close");
                }
            }
        });
        groupDeleteDialog = $('#groupDeleteDialog').dialog({
            title : "Delete Group",
            autoOpen : false,
            resizable : false,
            height : 200,
            width : 400,
            modal : true,
            buttons : {
                "Delete Item" : function() {
                    groupsTable.fnDeleteRow(groupTablePos);
                    $(this).dialog("close");
                },
                Cancel : function() {
                    $(this).dialog("close");
                }
            }
        });
        if(HB2.admin.allowed('admin-settings-btn-groups')) {
            groupsTable = $('#settingGroupsTable').dataTable({
                "bLengthChange" : false,
                "aoColumnDefs" : [{
                    "sClass" : "center",
                    "aTargets" : [4]
                }]
            });
        }

        $('#settingSave').click(function() {
            save();
        });
        $('#settingClear').click(function() {
            clear();
        });
        $('#settingBack').click(function() {
            back();
        });
        $('#addGroup').click(function() {
            onChangeGroupType();
            groupTablePos = -1;
            groupEditDialog.dialog("open");
        });
        $('#settingGroupType').change(function() {
            onChangeGroupType();
        });
        jQuery.validator.addMethod("inMedias", function(value, element) {
            var media = $('#settingGroupDefaultMedia').val();
            var medias = $('#settingGroupMedias').val();
            return !jQuery.inArray(media, medias);
        }, "Default Media must be selected in Medias");
        groupValidator = $('#settingGroupForm').validate({
            rules : {
                onsubmit : false,
                settingGroupType : {
                    "required" : true
                },
                settingGroupName : {
                    "required" : true
                },
                settingGroupDefaultMedia : {
                    "required" : true,
                    "inMedias" : true
                },
                settingGroupMedias : {
                    "required" : true
                }
            }
        });
    };

    // Public
    return {
        init : init,
        load : load
    };
}(jQuery));
