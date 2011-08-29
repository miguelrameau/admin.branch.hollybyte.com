/**
 * @author Fabio Ospitia Trujillo
 */

Namespace('HB2.admin');

HB2.admin.site = ( function($) {

    var site = {};
    var sites = [];
    var siteChannels = [];
    var siteAssets = [];
    var playlists = [];
    var players = [];
    var connectors = [];

    var currSocial;
    var currAsset;

    var flowPath = 'swf/flowplayer.commercial-3.2.7.swf';

    var defaultChannel = {
        "name" : "default",
        "title" : "Default Channel",
        "description" : "Default Channel Description",
        "template" : "fullscreen"
    };

    var pub = {
        account : null,
        region : null,
        init : initSiteEdit,
        load : load,
        setData : setSite,
        list : initSiteList
    };

    // Tabs
    var tabs;

    // Tables
    var sitesTable;
    var channelsTable;
    var assetsTable;
    // Dialogs
    var siteDeleteDialog;
    var channelEditDialog;
    var channelDeleteDialog;
    // Validators
    var validator;
    var channelValidator;

    var currConnector;

    /**
     *
     */
    function onClickEditSite(element) {
        var id = sitesTable.fnGetData($(element).parents('tr')[0])[0];
        window.location = '/site/form?id=' + id;
    };

    /**
     *
     */
    function onClickDeleteSite(element) {
        var pos = sitesTable.fnGetPosition($(element).parents('tr')[0]);
        var siteId = sitesTable.fnGetData(pos)[0];

        console.log(siteDeleteDialog);
        siteDeleteDialog.html('<p>Delete Site: ' + siteId + '<p>');
        siteDeleteDialog.dialog('option', 'title', 'Delete Site');
        siteDeleteDialog.dialog('option', 'height', 180);
        siteDeleteDialog.dialog('option', 'width', 320);
        siteDeleteDialog.dialog('option', 'buttons', {
            "Delete Site" : function() {
                deleteSite(siteId);
                sitesTable.fnDeleteRow(pos);
                $(this).dialog("close");
            },
            Cancel : function() {
                $(this).dialog("close");
            }
        });
        siteDeleteDialog.dialog('open');
    };

    /**
     *
     */
    function initSitesTable(objs) {
        sitesTable.fnClearTable();
        var rows = new Array();
        for(var i = 0; i < objs.length; i++) {
            var row = new Array();
            row[0] = objs[i].id;
            row[1] = objs[i].domain;
            row[2] = objs[i].playlist;
            row[3] = objs[i].created;
            if(objs[i].id == 'www') {
                row[4] = '<img class="site-edit" src="/images/common/edit.png" />';
            } else {
                row[4] = '<img class="site-edit" src="/images/common/edit.png" /><img class="site-delete" src="/images/common/delete.png"/>';
            }
            rows[i] = row;
        }
        sitesTable.fnAddData(rows);
        sitesTable.fnSort([[3, 'asc']]);

        $('.site-edit').click(function() {
            onClickEditSite(this);
        });
        $('.site-delete').click(function() {
            onClickDeleteSite(this);
        });
    };

    /**
     *
     */
    function initSiteList() {
        // Init Sites Table
        sitesTable = $('#siteListTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "sClass" : "center",
                "aTargets" : [1, 2, 3, 4]
            }]
        });
        // Init Delete Dialog
        siteDeleteDialog = $('#siteDeleteDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 140,
            modal : true
        });
        // Refresh Sites Button
        $('#siteListRefresh').click(function() {
            loadSites();
        });
        // Add Site Button
        $('#siteListAdd').click(function() {
            window.location = '/site/form';
        });
        // Load Sites
        loadSites();
    };

    /**
     *
     */
    function renderSiteAssetChannels(obj, channels) {
        var html = '<div id="' + obj.id + '_box" class="assetBox">';
        for(i in channels) {
            var name = channels[i].name;
            html += '<div class="' + name + '_chn">';
            if(!HB2.admin.isEmpty(obj.channels) && jQuery.inArray(name, obj.channels) != -1) {
                html += '<input type="checkbox" value="' + name + '" checked />';
            } else {
                html += '<input type="checkbox" value="' + name + '" />';
            }
            html += '<span>' + name + '</span>';
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    /**
     *
     */
    function renderSiteAssetConnectors(obj) {
        var html = '<div id="' + obj.id + '_con">';
        for(i in connectors) {
            var name = connectors[i].id;
            html += '<div class="connector_' + name + '">';
            html += '<img src="' + connectors[i].img + '" />';
            html += '<span>' + name + '</span>'
            html += '</div>';
        }
        html += '<div class="connector_iframe">';
        html += '<img src="/images/connector/iframe.png" />';
        html += '<span>Iframe</span>'
        html += '</div>';
        html += '<div class="connector_embed">';
        html += '<img src="/images/connector/embed.png" />';
        html += '<span>Embed</span>'
        html += '</div>';
        html += '</div>';
        return html;
    }

    /**
     *
     */
    function initAssetsTable(objs) {

        assetsTable.fnClearTable();
        var rows = [];
        for(var i = 0; i < objs.length; i++) {
            var row = [];
            if(objs[i].assetObj.splash != 'undefined') {
                row[0] = '<img src="https://repo1.eu.hollybyte.com/' + objs[i].assetObj.splash + '" alt="splash" width="90px" height="50px">';
            } else {
                // TODO ERROR
            }
            if(objs[i].assetObj.title !== undefined) {
                row[1] = objs[i].assetObj.title;
            } else {
                row[1] = objs[i].assetObj.name;
            }
            row[2] = renderSiteAssetChannels(objs[i], site.channels);
            row[3] = renderSiteAssetConnectors(objs[i]);
            row[4] = objs[i].assetObj.id;

            rows[i] = row;

        }

        assetsTable.fnAddData(rows);

        $('.site-channel-edit').click(function() {
            onClickChannelEdit(this);
        });
        for(i in connectors) {
            var connId = connectors[i].id;

            $('.connector_'+connId).click(function() {
                for(i in connectors) {
                    if(this.getAttribute("class") == "connector_" + connectors[i].id) {
                        var connId = connectors[i].id;
                        currSocial = connectors[i];
                    }
                }

                $("#siteChannelSocialDialog").dialog('open');
                var pos = assetsTable.fnGetPosition($(this).parents('tr')[0]);
                var assetId = assetsTable.fnGetData(pos)[4];
                currAsset = assetId;

                //$("#txtSocial").val("A cool video: http://" + site.domain + "/watch/" + assetId);
                $("#txtSocial").val("A cool video!!");

            });
        }
        $('.connector_iframe').click(function() {
            currSocial = {};
            currSocial.id = "";
            currSocial.type = "IFRAME";

            $("#siteChannelEmbedDialog").dialog('open');
            var pos = assetsTable.fnGetPosition($(this).parents('tr')[0]);
            var assetId = assetsTable.fnGetData(pos)[4];
            currAsset = assetId;

            $("#txtEmbed").val('<iframe frameborder="0" marginwidth="0" marginheight ="0" id="iframeId" width="640" height="480" src="http://' + site.domain + '/embed/' + assetId + '"></iframe>');
        });
        $('.connector_embed').click(function() {
            currSocial = {};
            currSocial.id = "";
            currSocial.type = "IFRAME";
            $("#siteChannelEmbedDialog").dialog('open');
            var pos = assetsTable.fnGetPosition($(this).parents('tr')[0]);
            var assetId = assetsTable.fnGetData(pos)[4];

            var repo = "http://" + getRepoByRegion(site.region);
            var account = pub.account;
            //site.id
            $("#txtEmbed").val('<object class="vjs-flash-fallback"  width="640" height="480" type="application/x-shockwave-flash" data="' + repo + '/acc/' + account + '/st/' + site.id + '/default/public/' + flowPath + '"><param name="movie" value="' + repo + '/acc/' + account + '/st/' + site.id + '/default/public/' + flowPath + '" /><param name="allowfullscreen" value="true" /><param name="width" value="640" /><param name="height" value="480" /><param name="flashvars" value="config=' + repo + '/acc/' + account + '/st/' + site.id + '/default/public/js/emb/' + assetId + '.js" /></object>');
        });
    };

    /**
     *
     */
    function loadPlaylists() {
        $.ajax({
            url : '/site/playlists',
            async : false,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log(data.result);
                playlists = data.result;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                playlists = [];
            }
        });
    };

    /**
     *
     */
    function loadPlayers() {
        $.ajax({
            url : '/site/players',
            async : false,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log(data.result);
                players = data.result;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                players = [];
            }
        });
    };

    /**
     *
     */
    function loadConnectors() {
        $.ajax({
            url : '/site/connectors',
            async : false,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log(data.result);
                connectors = data.result;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                connectors = [];
            }
        });
    };

    /**
     *
     */
    function loadSites() {
        $.ajax({
            url : '/site/find',
            async : false,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log(data.result);
                sites = data.result;
                initSitesTable(data.result);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                sites = [];
            }
        });
    };

    /**
     *
     */
    function loadAssets(id) {
        $.ajax({
            url : '/site/find-assets?id=' + id,
            async : false,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log(data.result);
                siteAssets = data.result;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                siteAssets = [];
            }
        });
    };

    /**
     *
     */
    function load() {
        loadPlaylists();
        loadPlayers();
        loadConnectors();
        for(i in playlists) {
            $('#sitePlaylist').
            append($("<option></option>").
            attr("value",playlists[i].id).
            text(playlists[i].id));
        }
        for(i in players) {
            $('#siteChannelPlayers').
            append($("<option></option>").
            attr("value",players[i].id).
            text(players[i].id + ' (' + players[i].type + ')'));
        }
        $('#siteChannelPlayers').bsmSelect({
            addItemTarget : 'bottom',
            animate : true,
            highlight : true,
            plugins : [$.bsmSelect.plugins.sortable({
                axis : 'y',
                opacity : 0.5
            }, {
                listSortableClass : 'bsmListSortableCustom'
            }), $.bsmSelect.plugins.compatibility()]
        });
        $('#siteChannelDevices').bsmSelect({
            addItemTarget : 'bottom',
            animate : true,
            highlight : true,
            plugins : [$.bsmSelect.plugins.sortable({
                axis : 'y',
                opacity : 0.5
            }, {
                listSortableClass : 'bsmListSortableCustom'
            }), $.bsmSelect.plugins.compatibility()]
        });
    }

    /**
     *
     */
    function createSite(obj) {
        $.ajax({
            url : '/site/create',
            type : 'POST',
            data : 'data=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info(data);
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
    function updateSite(id, obj) {
        $.ajax({
            url : '/site/update',
            type : 'POST',
            data : 'id=' + id + '&data=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info(data);
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
    function udpateSiteAssets(id, objs) {
        $.ajax({
            url : '/site/update-assets',
            type : 'POST',
            data : 'id=' + id + '&data=' + $.toJSON(objs),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info(data);
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
    function deleteSite(id) {
        $.ajax({
            url : '/site/delete?id=' + id,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info(data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                sites = [];
            }
        });
    };

    /**
     *
     */
    function onClickChannelEdit(element) {
        var data = channelsTable.fnGetData($(element).parents('tr')[0]);
        $('#siteChannelForm')[0].reset();
        channelValidator.resetForm();
        for(i in siteChannels) {
            if(siteChannels[i].name == data[0]) {
                setChannel(siteChannels[i]);
                break;
            }
        }
        $('#siteChannelsDiv').hide();
        $('#siteChannelDiv').show();
    };

    /**
     *
     */
    function onClickChannelDelete(element) {
        var pos = channelsTable.fnGetPosition($(element).parents('tr')[0]);
        var name = channelsTable.fnGetData(pos)[0];
        var idx = HB2.admin.indexOf(name, siteChannels, 'name');
        siteChannels.splice(idx, 1);
        channelsTable.fnDeleteRow(pos);
        $('.'+name+'_chn').remove();
    };

    /**
     *
     */
    function initSiteEditChannelsTable(objs) {
        channelsTable.fnClearTable();
        var rows = new Array();
        for(i in objs) {
            var row = new Array();
            row[0] = objs[i].name;
            if(objs[i].title !== undefined) {
                row[1] = objs[i].title;
            } else {
                row[1] = '';
            }
            if(objs[i].description !== undefined) {
                row[2] = objs[i].description;
            } else {
                row[2] = '';
            }
            if(objs[i].template !== undefined) {
                row[3] = objs[i].template;
            } else {
                row[3] = '';
            }
            if(objs[i].name == 'default') {
                row[4] = '<img class="site-channel-edit" src="/images/common/edit.png" />';
            } else {
                row[4] = '<img class="site-channel-edit" src="/images/common/edit.png" /><img class="site-channel-delete" src="/images/common/delete.png"/>';
            }
            rows[i] = row;
        }
        channelsTable.fnAddData(rows);

        $('.site-channel-edit').click(function() {
            onClickChannelEdit(this);
        });
        $('.site-channel-delete').click(function() {
            onClickChannelDelete(this);
        });
    };

    /**
     *
     */
    function getSiteAssets() {
        for(i in siteAssets) {
            channels = [];
            console.log(siteAssets[i].asset);
            $('#'+siteAssets[i].id+'_box :checkbox:checked').each(function() {
                channels.push($(this).val());
            });
            console.log(channels);
            siteAssets[i].channels = channels;
        }
        return siteAssets;
    }

    /**
     *
     */
    function getChannel() {
        var obj = {};
        if($('#siteChannelName').val().trim()) {
            obj.name = $('#siteChannelName').val().trim();
        }
        if($('#siteChannelTitle').val().trim()) {
            obj.title = $('#siteChannelTitle').val().trim();
        }
        if($('#siteChannelDescription').val().trim()) {
            obj.description = $('#siteChannelDescription').val().trim();
        }
        if($('#siteChannelTemplate').val().trim()) {
            obj.template = $('#siteChannelTemplate').val().trim();
        }
        if(!HB2.admin.isEmpty($('#siteChannelPlayers').val())) {
            obj.players = $('#siteChannelPlayers').val();
        }
        if(!HB2.admin.isEmpty($('#siteChannelDevices').val())) {
            obj.devices = $('#siteChannelDevices').val();
        }
        return obj;
    }

    /**
     *
     */
    function getSite() {
        var obj = {};
        if($('#siteId').val().trim()) {
            obj.id = $('#siteId').val().trim();
        }
        if($('#siteRegion').val().trim()) {
            var code = $('#siteRegion').val().trim();
            obj.region = HB2.admin.getRegionByCode(code);
        }
        if($('#siteDomain').val().trim()) {
            obj.domain = $('#siteDomain').val().trim();
        }
        if($('#sitePlaylist').val().trim()) {
            obj.playlist = $('#sitePlaylist').val().trim();
        }
        if($('#siteGaUa').val().trim()) {
            obj.gaUa = $('#siteGaUa').val().trim();
        }
        if($('#siteAlias').val().trim()) {
            obj.alias = $('#siteAlias').val().trim();
        }
        obj.created = encodeURIComponent(site.created);
        return obj;
    };

    /**
     *
     */
    function setChannel(obj) {
        if(jQuery.isEmptyObject(obj)) {
            return;
        }

        if(!HB2.admin.isEmpty(obj.name)) {
            $('#siteChannelName').val(obj.name);
            $('#siteChannelName').hide();
            $('#siteChannelNameTxt').html(obj.name);
        }
        if(!HB2.admin.isEmpty(obj.title)) {
            $('#siteChannelTitle').val(obj.title);
        }
        if(!HB2.admin.isEmpty(obj.description)) {
            $('#siteChannelDescription').val(obj.description);
        }
        if(!HB2.admin.isEmpty(obj.template)) {
            $('#siteChannelTemplate').val(obj.template);
        }
        $("#siteChannelPlayers option:selected").removeAttr("selected").change();
        if(!HB2.admin.isEmpty(obj.players)) {
            for(i in obj.players) {
                $('#siteChannelPlayers option[value='+obj.players[i]+']').attr("selected", "selected").change();
            }
        }
        $("#siteChannelDevices option:selected").removeAttr("selected").change();
        if(!HB2.admin.isEmpty(obj.devices)) {
            for(i in obj.devices) {
                $('#siteChannelDevices option[value='+obj.devices[i]+']').attr("selected", "selected").change();
            }
        }
    }

    /**
     *
     */
    function setSite(obj) {
        if(jQuery.isEmptyObject(obj)) {
            return;
        }
        site = obj;
        siteChannels = [];

        if(!HB2.admin.isEmpty(obj.id)) {
            loadAssets(obj.id);
            $('#siteId').val(obj.id);
            $('#siteId').hide();
            $('#siteIdTxt').html(obj.id);
        }
        if(!HB2.admin.isEmpty(obj.region)) {
            var regionName = HB2.admin.getRegionName(pub.region);
            var regionCode = HB2.admin.getRegionCode(pub.region);
            $('#siteRegion').val(regionCode);
            $('#siteRegionTxt').html(regionName);
        }
        if(!HB2.admin.isEmpty(obj.domain)) {
            $('#siteDomain').val(obj.domain);
            $('#siteDomainTxt').html(obj.domain);
        }
        if(!HB2.admin.isEmpty(obj.alias)) {
            $('#siteAlias').val(obj.alias);
        }
        if(!HB2.admin.isEmpty(obj.playlist)) {
            $('#sitePlaylist').val(obj.playlist);
            $('#sitePlaylist').hide();
            $('#sitePlaylistTxt').html(obj.playlist);
        }
        if(!HB2.admin.isEmpty(obj.gaUa)) {
            $('#siteGaUa').val(obj.gaUa);
        }
        if(!HB2.admin.isEmpty(obj.channels)) {
            siteChannels = obj.channels;
            initSiteEditChannelsTable(siteChannels);
        }
        initAssetsTable(siteAssets);
    };

    /**
     *
     */
    function onClickSocialPost() {

        if(currSocial.type === "FACEBOOK") {
            var repo = "http://" + getRepoByRegion(site.region);
            $("#siteChannelSocialDialog").dialog('close');
            var connectorId = currSocial.id;
            var message = $("#txtSocial").val();
            var link = "http://" + site.domain + "/watch/" + currAsset;
            var picture = repo + "/acc/" + pub.account + "/as/" + currAsset + "/splash.jpg";
            var swf = repo + "/acc/" + pub.account + "/st/" + site.id + "/" + site.channels[0].name + "/public/swf/flowplayer.commercial-3.2.7.swf";
            var config = "config=" + repo + "/acc/" + pub.account + "/st/" + site.id + "/" + site.channels[0].name + "/public/js/emb/" + currAsset + ".js";
            var source = swf + "?" + config;
            var assetId = currAsset;

            $.ajax({
                url : '/connector/facebook',
                type : 'POST',
                data : 'id=' + connectorId + '&message=' + message + '&link=' + link + '&picture=' + picture + '&source=' + source,
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    console.info(data);
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                    console.info(errorThrown);
                }
            });
        } else if(currSocial.type === "TWITTER") {
            $("#siteChannelSocialDialog").dialog('close');
            var id = currSocial.id;
            var link = "http://" + site.domain + "/watch/" + currAsset;
            var message = $("#txtSocial").val();

            $.ajax({
                url : '/connector/twitter',
                type : 'POST',
                data : 'id=' + id + '&link=' + link + '&message=' + message,
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    console.info(data);
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                    console.info(errorThrown);
                }
            });
        }
    }

    /**
     *
     */
    function initSiteEdit() {
        // Site Tabs
        tabs = $('#siteTabs').tabs();
        // Site Channel Delete Dialog
        channelDeleteDialog = $('#siteChannelDeleteDialog').dialog({
            title : 'Delete Channel',
            autoOpen : false,
            resizable : false,
            height : 600,
            width : 600,
            modal : true,
            buttons : {
                "Delete Channel" : function() {
                    $(this).dialog("close");
                },
                Cancel : function() {
                    $(this).dialog("close");
                }
            }
        });
        // Site Channels Tables
        channelsTable = $('#siteChannelsTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "sClass" : "center",
                "aTargets" : [4]
            }]
        });
        // Site Assets Tables
        assetsTable = $('#siteAssetsTable').dataTable({
            "bLengthChange" : false,

            "aoColumnDefs" : [{
                "bVisible" : false,
                "aTargets" : [4]
            }, {
                "sClass" : "center",
                "aTargets" : [0]
            }]
        });

        channelsTable[0].style.width = '100%';
        assetsTable[0].style.width = '100%';

        // Validators
        validator = $('#siteForm').validate({
            rules : {
                onsubmit : false,
                siteId : {
                    "required" : true,
                    "identity" : true
                },
                siteRegion : {
                    "required" : true
                },
                siteDomain : {
                    "required" : true
                },
                sitePlaylist : {
                    "required" : true
                },
                siteAlias : "domain"
            }
        });
        channelValidator = $('#siteChannelForm').validate({
            rules : {
                onsubmit : false,
                siteChanelName : {
                    "required" : true,
                    "id" : true
                },
                siteTemplate : {
                    "required" : true
                },
                sitePlayers : {
                    "required" : true
                }
            }
        })
        // Site Buttons
        $('#siteSaveBtn').click(function() {
            if(!validator.form()) {
                return;
            }
            var obj = $.extend({}, site, getSite());
            obj.channels = siteChannels;
            console.log(obj);
            if(jQuery.isEmptyObject(site)) {
                createSite(obj);
            } else {
                updateSite(obj.id, obj);
                var assets = getSiteAssets();
                console.log(assets);
                udpateSiteAssets(obj.id, assets);
            }
        });
        $('#siteClearBtn').click(function() {
            $('#siteForm')[0].reset();
            validator.resetForm();
            var regionName = HB2.admin.getRegionName(pub.region);
            var regionCode = HB2.admin.getRegionCode(pub.region);
            var domain = pub.account + '.' + regionCode + '.hollybyte.tv';
            $('#siteRegionTxt').html(regionName);
            $('#siteRegion').val(regionCode);
            $('#siteDomainTxt').html(domain);
            $('#siteDomain').val(domain);
        });
        $('#siteBackBtn').click(function() {
            history.back();
        });
        // Site Defaults
        var regionName = HB2.admin.getRegionName(pub.region);
        var regionCode = HB2.admin.getRegionCode(pub.region);
        var domain = pub.account + '.' + regionCode + '.hollybyte.tv';
        $('#siteRegionTxt').html(regionName);
        $('#siteRegion').val(regionCode);
        $('#siteDomainTxt').html(domain);
        $('#siteDomain').val(domain);

        $('#siteId').keyup(function() {
            var regionCode = HB2.admin.getRegionCode(pub.region);
            var domain = $(this).val() + '.' + pub.account + '.' + regionCode + '.hollybyte.tv';
            $('#siteDomainTxt').html(domain);
            $('#siteDomain').val(domain);
        });
        // Site Channels Buttons
        $('#siteChannelAddBtn').click(function() {
            $('#siteChannelsDiv').hide();
            $('#siteChannelDiv').show();
            channelValidator.resetForm();
            $('#siteChannelForm')[0].reset();

            $("#siteChannelPlayers option:selected").removeAttr("selected").change();
            $("#siteChannelDevices option:selected").removeAttr("selected").change();

            $('#siteChannelName').show();
            $('#siteChannelNameTxt').empty();
        });
        $('#siteChannelSaveBtn').click(function() {
            if(!channelValidator.form()) {
                return;
            }
            var obj = getChannel();
            console.log(obj);
            var idx = HB2.admin.indexOf(obj.name, siteChannels, "name");
            if(idx != -1) {
                siteChannels[idx] = obj;
            } else {
                siteChannels.push(obj);
                var html = '<div class="' + obj.name + '_chn">';
                html += '<input type="checkbox" value="' + obj.name + '" />';
                html += '<span>' + obj.name + '</span>';
                html += '</div>';
                console.log($('.assetBox'));
                $('.assetBox').append(html);
            }
            initSiteEditChannelsTable(siteChannels);

            $('#siteChannelDiv').hide();
            $('#siteChannelsDiv').show();
        });
        $('#siteChannelClearBtn').click(function() {
            $('#siteChannelDiv').hide();
            $('#siteChannelsDiv').show();
        });
        siteChannels.push(defaultChannel);
        initSiteEditChannelsTable(siteChannels);
        $('#siteChannelDiv').hide();

        // Init Delete Value Dialog
        $('#siteChannelSocialDialog').dialog({
            autoOpen : false,
            resizable : false,
            width : 850,
            height : 300,
            closeText : 'close',
            modal : true,
            title : false,
            buttons : {
                'Save' : function() {
                    // Set Validator
                    //HB2.admin.metavalue.onClickEditValueSave(assetValuesTable);
                    onClickSocialPost();
                },
                Cancel : function() {
                    $('#siteChannelSocialDialog').dialog('close');
                }
            }

        });

        $( "#siteChannelSocialDialog" ).dialog("option", "dialogClass", 'siteChannelSocialDialog');

        $('#siteChannelEmbedDialog').dialog({
            autoOpen : false,
            resizable : false,
            width : 850,
            height : 280,
            closeText : 'close',
            modal : true,
            title : false,
            buttons : {
                'Copy' : function() {
                    alert("por hacer");
                    //$.copy($("#txtEmbed").val());
                },
                Cancel : function() {
                    $('#siteChannelEmbedDialog').dialog('close');
                }
            }

        });
        $( "#siteChannelEmbedDialog" ).dialog("option", "dialogClass", 'siteChannelEmbedDialog');

    };

    return pub;
}(jQuery));
