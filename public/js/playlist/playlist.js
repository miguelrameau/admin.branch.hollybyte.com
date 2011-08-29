/**
 *@author Miguel Angel Casanova
 */

Namespace('HB2.admin');

HB2.admin.playlist = ( function($) {

    // Playlist Tabs
    var playlistGeneralTab;
    var playlistAssetTab;
    var playlistMetaTab;

    // Playlist Content
    var playlistGeneralContent;
    var playlistAssetContent;
    var playlistMetaContent;

    // Playlist Tables
    var playlistValuesTable;
    var playlistAssetTable;
    var playlistAddAssetTable;

    var repo = null;
    var preCell = null;
    var position = null;
    var validator = '';
    var valProg = '';
    var valSplash = '';
    var selectPos = null;
    var lastPos = null;
    var currVal = null;
    var playlists = [];
    var addAsDlg = null;
    var playDelDlg = null;
    var playUpdDlg = null;
    var remAssDlg = null;
    var newPlayDlg = null;
    var valEditDlg = null;
    var ID = null;
    var selectTab = null;
    var flagAssets = false;

    /**
     * Display the appropiate content depending on the tab pressed.
     */
    function onClickMenuTab() {
        if(playlistGeneralTab[0] ? true : false)
            playlistGeneralTab[0].setAttribute("class", "hb-playlist-right-tabs-nSel");
        if(playlistAssetTab[0] ? true : false)
            playlistAssetTab[0].setAttribute("class", "hb-playlist-right-tabs-nSel");
        if(playlistMetaTab[0] ? true : false)
            playlistMetaTab[0].setAttribute("class", "hb-playlist-right-tabs-nSel");

        if(playlistGeneralContent[0] ? true : false)
            playlistGeneralContent[0].style.display = "none";
        if(playlistAssetContent[0] ? true : false)
            playlistAssetContent[0].style.display = "none";
        if(playlistMetaContent[0] ? true : false)
            playlistMetaContent[0].style.display = "none";

        switch(selectTab.id) {
            case 'tabGeneral':
                playlistGeneralTab[0].setAttribute("class", "hb-playlist-right-tabs-Sel");
                playlistGeneralContent[0].style.display = "block";
                break;

            case 'tabAssets':
                if(!flagAssets) {
                    loadAsset(ID);
                }
                playlistAssetTab[0].setAttribute("class", "hb-playlist-right-tabs-Sel");
                playlistAssetContent[0].style.display = "block";
                break;

            case 'tabMetadatas':
                playlistMetaTab[0].setAttribute("class", "program-right-tabs-elSelected");
                playlistMetaContent[0].style.display = "block";
                break;
        }
    }

    /**
     * Change the background color cell in a branch.
     * Also update preCell. Auto-call loadPlaylists(obj).
     */
    function onClickBranch(obj) {
        $(preCell).css('background-color', '#F2F2F2');
        $(obj).css('background-color', '#D3D3D3');
        preCell = obj;
        ID = obj.id.substring(5);
        loadPlaylist(ID);
        if(selectTab.id === "tabAssets") {
            loadAsset(ID);
        }
    }

    /**
     * Change Menu Path
     */
    function changeMenuPath() {
        var path = $('#path');
        if(!HB2.admin.isEmpty(currVal.parent)) {
            var parent = findPlaylist(currVal.parent);
        }
    }

    /**
     * Ajax call to retrieve playlists info.
     */
    function loadPlaylist(id) {
        flagAssets = false;
        for(var i = 0; i < playlists.length; i++) {
            if(id == playlists[i].id) {
                $('#splashPlaylist').each(function() {
                    this.reset();
                });
                setJSONPlaylist(playlists[i]);
                break;
            }
        }
    }

    /**
     * Ajax call to retreiver playlistAsset info.
     */
    function loadAsset(id) {
        flagAssets = true;
        var criteria = {};
        var fields = {};
        criteria.playlist = id;
        fields.splash = 1;
        fields.name = 1;
        var sort = 1;
        $.ajax({
            url : '/playlist/assets',
            type : 'GET',
            async : false,
            data : 'id=' + id + '&criteria=' + $.toJSON(criteria) + '&fields=' + $.toJSON(fields) + '&sort=' + sort,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info('data: ', data);
                setJSONAssets(data.result);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     * Init Metavalues Table
     */
    function initPlaylistValuesTable(objs) {
        HB2.admin.metavalue.init(playlistValuesTable, objs, repo);
    }

    /**
     * Fill Asset Table.
     */
    function initAssetTable(table, values) {

        table.fnClearTable();

        var datas = [];
        for(var i = 0; i < values.length; i++) {
            var data = [];
            var obj = values[i];
            data[0] = '<input class="checkbox" type="checkbox" id="' + obj.playlist + '" />';
            if(!HB2.admin.isEmpty(obj.splash)) {
                data[1] = '<img src="http://' + repo + '/' + obj.splash + '" alt="splash" width="90px" height="50px">';
            } else {
                console.info('ERROR en AssetTable [1]');
                data[1] = '<span>Please Reload</span>';
                // LANZAR POP UP DE ERROR. AUTOCARGAR LA PAGINA.
            }
            if(!HB2.admin.isEmpty(obj.name)) {
                data[2] = '<span id="' + obj.id + '">' + obj.name + '</span>';
            } else {
                console.info('ERROR en AssetTable [2]');
                data[2] = '<span>Please Reload</span>';
            }
            data[3] = '<img class="value-delete-img" src="/images/common/delete.png" alt="delete-asset" />';

            data[4] = i + 1;

            datas[i] = data;
        }

        table.fnAddData(datas);
        $('.value-delete-img').click(function() {
            onClickRemoveAsset(this, table);
        });
        $('.checkbox').click(function() {
            checkStatus(this);
        });
        return table;
    }

    /**
     * Update Asset Table
     */
    function updateAssetTable(table, values) {
        var datas = [];
        for(var i = 0; i < values.length; i++) {
            var data = [];
            var obj = values[i];
            data[0] = '<input class="checkbox" type="checkbox" />';
            if(!HB2.admin.isEmpty(obj.splash)) {
                data[1] = '<img src="' + obj.splash.src + '" alt="splash" width="90px" height="50px">';
            } else {
                console.info('ERROR en AssetTable [1]');
                data[1] = '<span>Please Reload</span>';
                // LANZAR POP UP DE ERROR. AUTOCARGAR LA PAGINA.
            }
            if(!HB2.admin.isEmpty(obj.name)) {
                data[2] = '<span id="' + obj.id + '">' + obj.name.innerHTML + '</span>';
            } else {
                console.info('ERROR en AssetTable [2]');
                data[2] = '<span>Please Reload</span>';
            }
            data[3] = '<img class="value-delete-img" src="/images/common/delete.png" alt="delete-asset" />';

            if(lastPos === null) {
                var asset = playlistAssetTable.fnGetNodes(0);
                if(asset !== null) {
                    checkStatus(asset.cells[0], true);
                    data[4] = lastPos + 2;
                    lastPos += 1;
                } else {
                    data[4] = 1;
                    lastPos = 1;
                }
            } else {
                data[4] = lastPos + 2;
                lastPos += 1;
            }

            datas[i] = data;
        }

        table.fnAddData(datas);
        $('.value-delete-img').click(function() {
            onClickRemoveAsset(this, table);
        });
        $('.checkbox').click(function() {
            checkStatus(this);
        });
        table[0].style.width = '100%';
        return table;
    }

    /**
     * Fill Add Asset Table.
     */
    function initAddAssetTable(table, values) {
        table.fnClearTable();
        var datas = [];
        for(var i = 0; i < values.length; i++) {
            var data = [];
            var obj = values[i];
            data[0] = '<input type="checkbox" />';
            if(!HB2.admin.isEmpty(obj.splash)) {
                data[1] = '<img src="http://' + repo + '/' + obj.splash + '" alt="splash" width="50px" height="40px" />';
            } else {
                console.info('ERROR en AddAssetTable [1]');
                data[1] = '<span>Please Reload</span>';
                // LANZAR POP UP DE ERROR. AUTOCARGAR LA PAGINA.
            }
            if(!HB2.admin.isEmpty(obj.name)) {
                data[2] = '<span id="' + obj.id + '">' + obj.name + '</span>';
            } else {
                console.info('ERROR en AddAssetTable [2]');
                data[2] = '<span>Please Reload</span>';
            }
            datas[i] = data;
        }
        table.fnAddData(datas);
        return table;
    }

    /**
     * Update the add asset value Table.
     */
    function updateAddAssetTable(table, value) {
        var data = [];
        data[0] = '<input type="checkbox" />';
        if(!HB2.admin.isEmpty(value.splash)) {
            data[1] = '<img src="' + value.splash + '" alt="splash" width="50px" height="40px" />';
        } else {
            console.info('ERROR en AddAssetTable [1]');
            data[1] = '<span>Please Reload</span>';
            // LANZAR POP UP DE ERROR. AUTOCARGAR LA PAGINA.
        }
        if(!HB2.admin.isEmpty(value.asset)) {
            data[2] = '<span id="' + value.id + '">' + value.name + '</span>';
        } else {
            console.info('ERROR en AddAssetTable [2]');
            data[2] = '<span>Please Reload</span>';
        }

        table.fnAddData(data);
        table[0].style.width = '100%';
        return table;
    }

    /**
     * Ajax call to get the asset that are not in Playlists
     */
    function diffAssets(id) {

        var criteria = {};
        var fields = {};
        criteria.playlist = id;
        fields.name = 1;
        fields.splash = 1;

        $.ajax({
            url : '/playlist/diff',
            type : 'GET',
            data : 'id=' + id + '&fields=' + $.toJSON(fields),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                initAddAssetTable(playlistAddAssetTable, data.result);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     * Get a list of all playlists
     */
    function getPlaylists() {
        sort = {};
        sort.created = 1;

        $.ajax({
            url : '/playlist/find',
            type : 'GET',
            data : "sort=" + $.toJSON(sort),
            async : false,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                playlists = data.result;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     * Get updated tree.
     */
    function getTree() {
        $.ajax({
            url : '/playlist/tree',
            async : false,
            data : 'data=' + $.toJSON(playlists),
            type : 'POST',
            dataType : 'text',
            success : function(data, textStatus, jqXHR) {
                updateTree(data);
                loadCombobox(playlists);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     * Remove an asset from a Playlists
     */
    function removeAssetPlaylist() {
        var id = playlistAssetTable.fnGetNodes(position).cells[0].childNodes[0].id;
        if(id !== "") {
            $.ajax({
                url : '/playlist/remove-asset',
                type : 'GET',
                data : 'id=' + id,
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    getRemovedAsset();
                    remAssDlg.dialog('close');
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                    console.info(errorThrown);
                }
            });
        } else {
            getRemovedAsset();
            remAssDlg.dialog('close');
        }
    }

    /**
     *
     */
    function uploadSplash(path) {
        var ret = $.ajax({
            url : '/playlist/splash',
            async : false,
            type : 'POST',
            data : 'id=' + ID + '&filename=' + path,
            dataType : 'text',
            success : function(data, textStatus, jqXHR) {
                var splash = $('#program-image').attr("src");
                d = new Date();
                splash = splash + "?" + d.getTime();
                $('#program-image').attr("src", splash);
                currVal.splash = splash.replace("http://" + repo + "/", "");
                updatePlaylists(currVal);

                //return data;
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });

        return ret;
    }

    /**
     * Update Asset Table with new Assets.
     */
    function onClickAddAsset(table) {
        var newAssets = [];
        var toRemove = [];
        $.each(table.fnGetNodes(), function(index, value) {
            if(value.cells[0].childNodes[0].checked) {
                var data = {};
                data.splash = value.cells[1].childNodes[0];
                data.name = value.cells[2].childNodes[0];
                data.id = value.cells[2].childNodes[0].id;
                newAssets.push(data);
                toRemove.push(index);
            }
        });
        for(var i = toRemove.length; i > 0; i--) {
            table.fnDeleteRow(toRemove[i - 1]);
        }
        updateAssetTable(playlistAssetTable, newAssets);
        addAsDlg.dialog('close');
    }

    /**
     * Open verification dialog before remove asset.
     */
    function onClickRemoveAsset(element, table) {
        position = table.fnGetPosition($(element).parents('tr')[0]);
        remAssDlg.dialog('open');
    }

    /**
     * Get the removed Asset Object & update.
     */
    function getRemovedAsset() {
        var value = {};
        value.splash = playlistAssetTable.fnGetNodes(position).cells[1].childNodes[0].src;
        value.asset = playlistAssetTable.fnGetNodes(position).cells[2].childNodes[0].id;
        value.name = playlistAssetTable.fnGetNodes(position).cells[2].childNodes[0].innerHTML;

        updateAddAssetTable(playlistAddAssetTable, value);
        playlistAssetTable.fnDeleteRow(position);

        playlistAssetTable.fnSetColumnVis(4, true);
        var asset = playlistAssetTable.fnGetNodes(0);
        if(asset !== null) {
            checkStatus(asset.cells[0], true);
            for(var i = 0; i < lastPos; i++) {
                asset = playlistAssetTable.fnGetNodes(i);
                var aData = [];
                asset.cells[4].innerHTML = i + 1;
                for(var j = 0; j < 5; j++) {
                    aData.push(asset.cells[j].innerHTML);
                }
                playlistAssetTable.fnUpdate(aData, i, null, false, false);
            }
            asset = playlistAssetTable.fnGetNodes(lastPos);
            var aData = [];
            asset.cells[4].innerHTML = i + 1;
            for(var k = 0; k < 5; k++) {
                aData.push(asset.cells[k].innerHTML);
            }
            playlistAssetTable.fnUpdate(aData, lastPos, null, true, true);
        }
        playlistAssetTable.fnSetColumnVis(4, false);
    }

    /**
     * Get Metavalues in a object.
     */
    function getPlaylistMetavalues() {
        var datas = playlistValuesTable.fnGetData();
        var objs = [];
        for(var i in datas) {
            var obj = {};
            obj.name = datas[i][0];
            obj.type = datas[i][1];
            obj.value = datas[i][2];
            objs.push(obj);
        }
        return objs;
    }

    /**
     * Init Save Process
     */
    function onClickSave() {
        if(valProg.form()) {
            var playlist = getPlaylistObject();
            if(flagAssets) {
                var asData = getPlaylistAssetObject();
                savePlaylistAsset(asData);
            }
            savePlaylist(playlist);
        }
    }

    /**
     * Get a Playlist Object.
     */
    function getPlaylistObject() {
        var data = {};
        data.title = $('#programTitle').val();
        data.description = $('#programDesc').val();
        data.values = getPlaylistMetavalues();
        if(HB2.admin.isEmpty(data.values)) {
            data.values = [];
        }

        data.created = encodeURIComponent(currVal.created);
        data.updated = encodeURIComponent(currVal.updated);

        var obj = $.extend({}, currVal, data);

        return obj;
    }

    /**
     * Get a PlaylistAsset Object.
     */
    function getPlaylistAssetObject() {
        var assets = [];
        var sort = 1;
        $.each(playlistAssetTable.fnGetNodes(), function(index, value) {
            var data = {};
            if(value.cells[0].childNodes[0].id !== "") {
                data.id = value.cells[0].childNodes[0].id;
            }
            data.playlist = ID;
            data.asset = value.cells[2].childNodes[0].id;
            data.order = sort;
            sort++;
            assets.push(data);
        });
        return assets;
    }

    /**
     * Ajax call to update database. AutoCall savePlaylistAsset.
     */
    function savePlaylist(obj) {

        $.ajax({
            url : '/playlist/update',
            type : 'GET',
            data : 'data=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                updatePlaylists(obj);
                getTree();
                preCell = $('#node-' + ID);
                preCell.css('background-color', '#D3D3D3');
                loadPlaylist(ID);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     * Save in DB a PlaylistAsset object. AutoCall to loadAsset.
     */
    function savePlaylistAsset(asObj) {
        $.ajax({
            url : '/playlist/up-assets',
            type : 'GET',
            data : 'id=' + ID + '&playlistAsset=' + $.toJSON(asObj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                loadAsset(ID);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    /**
     * Ajax call to delete a Playlist.
     */
    function deletePlaylist() {
        $.ajax({
            url : '/playlist/delete',
            type : 'GET',
            async : false,
            data : 'id=' + ID,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                removePlaylists(ID);
                getTree();
                preCell = $('#tree tr:first');
                preCell.css('background-color', '#D3D3D3');
                $('#formProgram').each(function() {
                    this.reset();
                });
                ID = preCell[0].id.substr(5);
                loadPlaylist(ID);
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
    function setJSONAssets(assets) {
        if(!jQuery.isEmptyObject(assets)) {
            initAssetTable(playlistAssetTable, assets);
        }

        diffAssets(ID);
    }

    /**
     * Fill the form with data from a playlists
     */
    function setJSONPlaylist(obj) {
        if(jQuery.isEmptyObject(obj)) {
            alert('empty objs');
            return;
        }
        repo = getRepoByRegion(obj.region);
        playlistValuesTable.fnClearTable();
        playlistAssetTable.fnClearTable();
        playlistAddAssetTable.fnClearTable();

        playlistValuesTable[0].style.width = '100%';
        playlistAssetTable[0].style.width = '100%';
        playlistAddAssetTable[0].style.width = '100%';

        if(!HB2.admin.isEmpty(obj.id)) {
            $('#programName').html(obj.id);
        }
        if(!HB2.admin.isEmpty(obj.title)) {
            $('#programTitle').val(obj.title);
        }
        $('#programDesc').val("");
        if(!HB2.admin.isEmpty(obj.description)) {
            $('#programDesc').val(obj.description);
        }
        if(!HB2.admin.isEmpty(obj.created)) {
            var date = decodeURIComponent(obj.created);
            $('#programDate').html(date.substr(0, 10));
            $('#programTime').html(date.substr(11, 5));
        }
        if(!HB2.admin.isEmpty(obj.updated)) {
            var update = decodeURIComponent(obj.updated);
            $('#programUpdate').html(update.substr(0, 10));
            $('#programUptime').html(update.substr(11, 5));
        }
        if(!HB2.admin.isEmpty(obj.values)) {
            initPlaylistValuesTable(obj.values);
        } else {
            initPlaylistValuesTable({});
        }
        if(!HB2.admin.isEmpty(obj.splash)) {
            var splash = decodeURIComponent(obj.splash);
            $('#program-image').attr("src", "http://" + repo + "/" + splash);
        }
        currVal = obj;
    }

    /**
     * Get a playlist Object ready to be save.
     */
    function getNewPlaylist() {
        var data = {};
        data.id = $('#playlistName').val().toLowerCase();
        data.title = $('#playlistTitle').val();
        data.description = $('#playlistDesc').val();
        data.children = [];
        if($("select[name='playlistCombo'] :selected").attr("value") !== "none") {
            data.parent = $("select[name='playlistCombo'] :selected").attr("value");
        }

        newPlaylist(data);
    }

    /**
     * Save a new Playlist to db.
     */
    function newPlaylist(obj) {
        $.ajax({
            url : '/playlist/new',
            type : 'GET',
            data : 'data=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                //updatePlaylists(obj);
                getPlaylists();
                getTree();
                preCell = $('#node-' + obj.id);
                preCell.css('background-color', '#D3D3D3');
                ID = obj.id;
                $('#newPlaylistForm').each(function() {
                    this.reset();
                });
                loadPlaylist(ID);
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
    function updatePlaylists(obj) {
        for(var i = 0; i < playlists.length; i++) {
            if(obj.id === playlists[i].id) {
                playlists[i] = obj;
                return;
            }
        }
        playlists.push(obj);
    }

    /**
     *
     */
    function removePlaylists(id) {
        for(var i = 0; i < playlists.length; i++) {
            if(id === playlists[i].id) {
                var obj = playlists[i];
                playlists.splice(i, 1);
                if(!HB2.admin.isEmpty(obj.children) && obj.children.length > 0) {
                    for(var j = 0; j < obj.children.length; j++) {
                        for(var k = 0; k < playlists.length; k++) {
                            if(obj.children[j] === playlists[k].id) {
                                playlists.splice(k, 1);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     *
     */
    function findPlaylist(id) {
        for(var i = 0; i < playlists.length; i++) {
            if(id === playlists[i].id) {
                return playlists[i];
            }
        }
    }

    /**
     * Check that only an asset is checked, one at a time.
     */
    function checkStatus(element, flag) {
        selectPos = playlistAssetTable.fnGetPosition($(element).parents('tr')[0]);
        var i = 0;
        $.each(playlistAssetTable.fnGetNodes(), function(index, value) {
            value.cells[0].childNodes[0].checked = false;
            i++;
        });
        lastPos = i - 1;
        if(HB2.admin.isEmpty(flag)) {
            playlistAssetTable.fnGetNodes(selectPos).cells[0].childNodes[0].checked = true;
        }
    }

    /**
     * Validate if a playlist is corrected filled.
     */
    function validateNewPlaylist() {
        if(validator.form()) {
            newPlayDlg.dialog('close');
            getNewPlaylist();
        }
    }

    /**
     * Populate the combobox with data
     */
    function loadCombobox(data) {
        $('#playlistCombo').empty();
        $('#playlistCombo').append(new Option('None', 'none'));
        for(var i = 0; i < data.length; i++) {
            $('#playlistCombo').append(new Option(data[i].title, data[i].id));
        }
    }

    /**
     * Update Tree.
     */
    function updateTree(data) {
        $('#program-left-table').empty();
        $('#program-left-table').html(data);
        $("#tree").treeTable({
            initialState : "expanded",
            ident : 10
        });
    }

    /**
     * Move an asset one space up.
     */
    function changeOrderUp() {
        if(selectPos !== 0) {
            playlistAssetTable.fnSetColumnVis(4, true);
            var preAsset = playlistAssetTable.fnGetNodes(selectPos - 1);
            var asset = playlistAssetTable.fnGetNodes(selectPos);

            preAsset.cells[4].innerHTML = selectPos + 1;
            var dat = [];
            for(var i = 0; i < 5; i++) {
                dat.push(preAsset.cells[i].innerHTML);
            }
            asset.cells[4].innerHTML = selectPos;
            var dt = [];
            for( i = 0; i < 5; i++) {
                dt.push(asset.cells[i].innerHTML);
            }

            playlistAssetTable.fnUpdate(dat, selectPos, null, false, false);
            playlistAssetTable.fnUpdate(dt, selectPos - 1, null, true, true);
            playlistAssetTable.fnSetColumnVis(4, false);

            $('.value-delete-img').click(function() {
                onClickRemoveAsset(this, playlistAssetTable);
            });
            $('.checkbox').click(function() {
                checkStatus(this);
            });
        }
    }

    /**
     * Move an asset, one space down.
     */
    function changeOrderDown() {
        if(selectPos !== lastPos) {
            playlistAssetTable.fnSetColumnVis(4, true);
            var order = selectPos + 1;
            var postAsset = playlistAssetTable.fnGetNodes(selectPos + 1);
            var asset = playlistAssetTable.fnGetNodes(selectPos);

            postAsset.cells[4].innerHTML = order;
            var dat = [];
            for(var i = 0; i < 5; i++) {
                dat.push(postAsset.cells[i].innerHTML);
            }

            asset.cells[4].innerHTML = order + 1;
            var dt = [];
            for( i = 0; i < 5; i++) {
                dt.push(asset.cells[i].innerHTML);
            }

            playlistAssetTable.fnUpdate(dat, selectPos, null, false, false);
            playlistAssetTable.fnUpdate(dt, selectPos + 1, null, true, true);
            playlistAssetTable.fnSetColumnVis(4, false);

            $('.value-delete-img').click(function() {
                onClickRemoveAsset(this, playlistAssetTable);
            });
            $('.checkbox').click(function() {
                checkStatus(this);
            });
        }
    }

    /**
     * Move an asset at te top of the list
     */
    function changeOrderTop() {
        if(selectPos !== 0) {
            playlistAssetTable.fnSetColumnVis(4, true);
            var topAsset = playlistAssetTable.fnGetNodes(selectPos);
            topAsset.cells[4].innerHTML = 1;
            var topData = [];
            for(var i = 0; i < 5; i++) {
                topData.push(topAsset.cells[i].innerHTML);
            }

            for(var k = selectPos; k > 0; k--) {
                var asset = playlistAssetTable.fnGetNodes(k - 1);
                var aData = [];
                asset.cells[4].innerHTML = k + 1;
                for(var j = 0; j < 5; j++) {
                    aData.push(asset.cells[j].innerHTML);
                }

                playlistAssetTable.fnUpdate(aData, k, null, false, false);
            }

            playlistAssetTable.fnUpdate(topData, 0, null, true, true);
            playlistAssetTable.fnSetColumnVis(4, false);

            $('.value-delete-img').click(function() {
                onClickRemoveAsset(this, playlistAssetTable);
            });
            $('.checkbox').click(function() {
                checkStatus(this);
            });
        }
    }

    /**
     * Move an asset at the bottom of the list.
     */
    function changeOrderBottom() {
        if(selectPos !== lastPos) {
            playlistAssetTable.fnSetColumnVis(4, true);
            var bottomAsset = playlistAssetTable.fnGetNodes(selectPos);
            bottomAsset.cells[4].innerHTML = lastPos + 1;
            var bottomData = [];
            for(var k = 0; k < 5; k++) {
                bottomData.push(bottomAsset.cells[k].innerHTML);
            }

            for(var i = selectPos; i < lastPos; i++) {
                var asset = playlistAssetTable.fnGetNodes(i + 1);
                var aData = [];
                asset.cells[4].innerHTML = i + 1;
                for(var j = 0; j < 5; j++) {
                    aData.push(asset.cells[j].innerHTML);
                }
                playlistAssetTable.fnUpdate(aData, i, null, false, false);
            }

            playlistAssetTable.fnUpdate(bottomData, lastPos, null, true, true);
            playlistAssetTable.fnSetColumnVis(4, false);

            $('.value-delete-img').click(function() {
                onClickRemoveAsset(this, playlistAssetTable);
            });
            $('.checkbox').click(function() {
                checkStatus(this);
            });
        }
    }

    /**
     *
     */
    function refresh() {
        if(HB2.admin.allowed('admin-playlist-tab-general')) {
            selectTab = playlistGeneralTab[0];
        } else {
            selectTab = playlistAssetTab[0];
        }
        onClickMenuTab();
        flagAssets = false;
        getPlaylists();
        getTree();
        preCell = $('#tree tr:first');
        preCell.css('background-color', '#D3D3D3');
        ID = preCell[0].id.substr(5);
        loadPlaylist(ID);
    }

    /**
     *
     */
    function load() {
        getPlaylists();
        getTree();
        preCell = $('#tree tr:first');
        preCell.css('background-color', '#D3D3D3');
        loadCombobox(playlists);
        ID = preCell[0].id.substr(5);
        loadPlaylist(ID);
        onClickMenuTab();
    }

    /**
     * On ready functions.
     */
    function init() {

        // Tabs
        //tabs = $('#program-right-tabs').tabs; // NO funciona
        playlistGeneralTab = $('#tabGeneral');
        playlistAssetTab = $('#tabAssets');
        playlistMetaTab = $('#tabMetadatas');

        if(HB2.admin.allowed('admin-playlist-tab-general')) {
            selectTab = playlistGeneralTab[0];
        } else {
            selectTab = playlistAssetTab[0];

        }

        // Contents
        playlistGeneralContent = $('#tabGeneralContent');
        playlistAssetContent = $('#tabAssetContent');
        playlistMetaContent = $('#tabMetaContent');

        // Events
        playlistGeneralTab.click(function() {
            selectTab = this;
            onClickMenuTab();
        });
        playlistAssetTab.click(function() {
            selectTab = this;
            onClickMenuTab();
        });
        playlistMetaTab.click(function() {
            selectTab = this;
            onClickMenuTab();
        });
        $('#saveBtn').click(function() {
            onClickSave();
        });
        $('#newBtn').click(function() {
            addAsDlg.dialog('open');
        });
        $('.deleteBtn').click(function() {
            if(ID == "default") {
                alert('El Playlists Default no se puede borrar.');
            } else {
                playDelDlg.dialog('open');
            }
        });
        $('.program-right-menu-subcat').click(function() {
            newPlayDlg.dialog('open');
        });
        $('#btn-top').click(function() {
            changeOrderTop();
        });
        $('#btn-up').click(function() {
            changeOrderUp();
        });
        $('#btn-down').click(function() {
            changeOrderDown();
        });
        $('#btn-bottom').click(function() {
            changeOrderBottom();
        });
        $('#btnReload').click(function() {
            refresh();
        });
        $('#splashPlaylist').iframePostForm({
            iframeID : 'playlistFileIframe',
            post : function() {
                var msg = !$('input[type=file]').val().length ? 'Submitting form...' : 'Uploading file...';
                console.log('onClickValueUploadFile: post ' + msg);
            },
            complete : function(response) {
                console.log('onClickValueUploadFile: complete ' + response);
                var obj = jQuery.parseJSON(response);
                var path = obj.path;
                if(!HB2.admin.isEmpty(path)) {
                    if(path.length > 0) {
                        uploadSplash(path);
                        alert("File Uploaded successfully.");
                    } else {
                        alert('ERROR. File not uploaded.');
                    }
                } else {
                    alert("You must select an image");
                }
            }
        });

        // Define Metadata Table
        playlistValuesTable = $('#metadataTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "fnRender" : function(oObj) {
                    return HB2.admin.metavalue.renderizeMetavalue(oObj.aData[1], oObj.aData[2]);
                },
                "aTargets" : [3]
            }, {
                "bVisible" : false,
                "aTargets" : [2]
            }, {
                "sClass" : "center",
                "aTargets" : [3]
            }, {
                "sClass" : "center",
                "aTargets" : [4]
            }]
        });
        playlistValuesTable[0].style.width = '100%';

        // Init Value Dialog
        valEditDlg = $('#valueEditDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 460,
            width : 500,
            modal : true,
            buttons : {
                'Save' : function() {
                    HB2.admin.metavalue.onClickEditValueSave(playlistValuesTable);
                },
                Cancel : function() {
                    HB2.admin.metavalue.onClickEditValueCancel();
                }
            }
        });

        // Init Delete Value Dialog
        $('#valueDeleteDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 280,
            width : 450,
            modal : true,
            buttons : {
                "Delete" : function() {
                    HB2.admin.metavalue.onClickDeleteValueDelete(playlistValuesTable);
                },
                Cancel : function() {
                    $('#valueDeleteDialog').dialog('close');
                }
            }
        });
        playlistAssetTable = $('#assetTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "bVisible" : false,
                "aTargets" : [4]
            }]
        });
        playlistAddAssetTable = $('#addAssetTable').dataTable({
            "bLengthChange" : false
        });

        playlistAssetTable[0].style.width = '100%';
        playlistAddAssetTable[0].style.width = '100%';

        // Init Add Asset Dialog
        addAsDlg = $("#addAssetDialog").dialog({
            autoOpen : false,
            resizable : false,
            height : 520,
            width : 700,
            modal : true,
            buttons : {
                'Add Asset' : function() {
                    onClickAddAsset(playlistAddAssetTable);
                },
                Cancel : function() {
                    addAsDlg.dialog('close');
                }
            }
        });
        playDelDlg = $('#playlistDeleteDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 280,
            width : 450,
            modal : true,
            buttons : {
                "Delete" : function() {
                    deletePlaylist();
                    playDelDlg.dialog('close');
                },
                Cancel : function() {
                    playDelDlg.dialog('close');
                }
            }
        });

        // Init OK Playlist Dialog
        playUpdDlg = $('#playlistUpdateDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 280,
            width : 450,
            modal : true,
            buttons : {
                "Accept" : function() {
                    $('#playlistUpdateDialog').dialog('close');
                }
            }
        });

        // Init Remove Asset from Playlist Dialog
        remAssDlg = $('#removeAssetDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 280,
            width : 450,
            modal : true,
            buttons : {
                "Delete" : function() {
                    removeAssetPlaylist();
                    remAssDlg.dialog('close');
                },
                Cancel : function() {
                    remAssDlg.dialog('close');
                }
            }
        });

        // Init add new Playlist Dialog
        newPlayDlg = $('#newPlaylistDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 500,
            width : 450,
            modal : true,
            buttons : {
                "Create" : function() {
                    validateNewPlaylist();
                },
                Cancel : function() {
                    $('#newPlaylistForm').each(function() {
                        this.reset();
                    });
                    newPlayDlg.dialog('close');
                }
            }
        });

        /*jQuery.validator.addMethod("checkSpell", function(value) {
         if (value == "") {
         return false;
         }
         var iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_ ´ñáéíóúäëïöü";
         for (var i = 0; i < value.length; i++) {
         if (iChars.indexOf(value.charAt(i)) != -1) {
         return false;
         }
         }
         return true;
         }, "Name cannot have special chars.");*/
        validator = $('#newPlaylistForm').validate({
            onsubmit : false,
            rules : {
                playlistName : {
                    "required" : true,
                    "identity" : true
                },
                playlistTitle : {
                    "required" : true
                }
            },
            messages : {
                playlistName : "Name is required. Whitout special chars.",
                playlistTitle : "Title is a required field."
            }
        });
        valProg = $('#formProgram').validate({
            onsubmit : false,
            rules : {
                programTitle : {
                    "required" : true
                }
            },
            messages : {
                programTitle : "Title is a required field."
            }
        });
        valSplash = $('#splashPlaylist').validate({
            onsubmit : false,
            rules : {
                playlistFileFile : {
                    required : {
                        "required" : true
                    }
                }
            },
            messages : {
                playlistFileFile : "You must select a file to upload"
            }
        });

    }

    return {
        init : init,
        onClickBranch : onClickBranch,
        load : load
    };
}(jQuery));
