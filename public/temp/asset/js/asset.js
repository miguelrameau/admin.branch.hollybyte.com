/**
 * @author Fabio Ospitia Trujillo
 */

Namespace('HB2.admin');

HB2.admin.asset = ( function($) {

    var repo;

    var currVal;

    var validator = '';
    var subtitleValidator = '';
    var player;
    // Asset Tabs
    var assetGeneralTab;
    var assetTagsTab;
    var assetValuesTab;
    var assetContentsTab;
    var assetGroupsTab;
    var assetSubtitlesTab;
    var assetYoutubeTab;

    // Asset Contents
    var assetGeneralContent;
    var assetTagsContent;
    var assetValuesContent;
    var assetContentsContent;
    var assetGroupsContent;
    var assetSubtitlesContent;
    var assetYoutubeContent;

    // Asset Tables
    var assetValuesTable;
    var assetContentsTable;
    var assetGroupsTable;
    var assetSubtitlesTable;

    var categories = ["Film", "Autos", "Music", "Animals", "Sports", "Travel", "Games", "Comedy", "People", "News", "Entertainment", "Education", "Howto", "Nonprofit", "Tech"];
    var deleteSubtitles = [];

    function onClickAssetTab(tab) {

        if(assetGeneralTab[0] ? true : false)
            $(assetGeneralTab).attr("class", "hb-assetform-tabTable-left-tabs-general");
        if(assetTagsTab[0] ? true : false)
            $(assetTagsTab).attr("class", "hb-assetform-tabTable-left-tabs-tags");
        if(assetValuesTab[0] ? true : false)
            $(assetValuesTab).attr("class", "hb-assetform-tabTable-left-tabs-metadata");
        if(assetContentsTab[0] ? true : false)
            $(assetContentsTab).attr("class", "hb-assetform-tabTable-left-tabs-profiles");
        if(assetGroupsTab[0] ? true : false)
            $(assetGroupsTab).attr("class", "hb-assetform-tabTable-left-tabs-publish");
        if(assetSubtitlesTab[0] ? true : false)
            $(assetSubtitlesTab).attr("class", "hb-assetform-tabTable-left-tabs-subtitles");
        if(assetYoutubeTab[0] ? true : false)
            $(assetYoutubeTab).attr("class", "hb-assetform-tabTable-left-tabs-youtube");

        if(assetGeneralContent[0] ? true : false)
            assetGeneralContent[0].style.display = "none";
        if(assetTagsContent[0] ? true : false)
            assetTagsContent[0].style.display = "none";
        if(assetValuesContent[0] ? true : false)
            assetValuesContent[0].style.display = "none";
        if(assetContentsContent[0] ? true : false)
            assetContentsContent[0].style.display = "none";
        if(assetGroupsContent[0] ? true : false)
            assetGroupsContent[0].style.display = "none";
        if(assetSubtitlesContent[0] ? true : false)
            assetSubtitlesContent[0].style.display = "none";
        if(assetYoutubeContent[0] ? true : false)
            assetYoutubeContent[0].style.display = "none";

        switch(tab.id) {
            case 'tabGeneral':
                $(assetGeneralTab).attr("class", "hb-assetform-tabTable-left-tabs-generalOn");
                assetGeneralContent[0].style.display = "block";
                break;

            case 'tabTags':
                $(assetTagsTab).attr("class", "hb-assetform-tabTable-left-tabs-tagsOn");
                assetTagsContent[0].style.display = "block";
                break;

            case 'tabMetadata':
                $(assetValuesTab).attr("class", "hb-assetform-tabTable-left-tabs-metadataOn");
                assetValuesContent[0].style.display = "block";
                break;

            case 'tabProfiles':
                $(assetContentsTab).attr("class", "hb-assetform-tabTable-left-tabs-profilesOn");
                assetContentsContent[0].style.display = "block";
                break;

            case 'tabPublish':
                $(assetGroupsTab).attr("class", "hb-assetform-tabTable-left-tabs-publishOn");
                assetGroupsContent[0].style.display = "block";
                break;

            case 'tabSubtitles':
                $(assetSubtitlesTab).attr("class", "hb-assetform-tabTable-left-tabs-subtitlesOn");
                assetSubtitlesContent[0].style.display = "block";
                break;
            case 'tabYoutube':
                $(assetYoutubeTab).attr("class", "hb-assetform-tabTable-left-tabs-youtubeOn");
                assetYoutubeContent[0].style.display = "block";
        }
    }

    /**
     *
     */
    function onClickAssetSave() {
        currVal.created = encodeURIComponent(currVal.created);
        currVal.updated = encodeURIComponent(currVal.updated);

        var obj = $.extend(obj, currVal, getAssetJSON());

        $.ajax({
            url : '/asset/update',
            type : 'POST',
            async : false,
            data : 'data=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                currVal = data;
                console.info('asset: ' + data);
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
    function onClickAssetClear() {
        $('assetEditForm')[0].reset();
        setAssetJSON(currVal);
    }

    /**
     *
     */
    function onClickAssetBack() {
        history.back();
    }

    /**
     *
     */
    function onClickUploadYoutube() {
        console.info('Title: ' + currVal.title);
        if(currVal.title === undefined) {
            alert('You cannot upload a video without a Title');
        } else {
            var id = currVal.id;
            var connector = $('#ytConnCombo').val();
            ;
            console.info('connector: ' + connector);
            var category = $("#ytCatCombo").val();
            console.info('category: ' + category);
            $.ajax({
                url : '/asset/youtube',
                type : 'GET',
                data : 'id=' + id + '&connector=' + connector + '&category=' + category,
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    console.info(data);
                    currVal.youtube = [];
                    currVal.youtube.id = data.result;
                    currVal.youtube.connector = connector;
                    currVal.youtube.category = category;
                    youtubeLoad();

                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    }

    /**
     *
     */
    function onClickAssetSnapshot(entity) {
        var sec = player.getTime();
        if( typeof (sec) !== 'number') {
            console.log('not time')
            return;
        }
        console.log('onClickAssetSnapshot: id: ' + entity.id + " sec: " + sec);
        $.ajax({
            url : '/asset/snapshot?id=' + entity.id + '&second=' + sec,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log('[onClickAssetSnapshot][success]');
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log('[onClickAssetSnapshot][error]');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    /**
     *
     */
    function onClickAssetContentActionReencode(element, table) {
        var pos = table.fnGetPosition($(element).parents('tr')[0]);
        var data = table.fnGetData(pos);
    }

    /**
     *
     */
    function onClickAssetContentActionDownload(element, table) {
        var data = table.fnGetData($(element).parents('tr')[0]);
        var d = new Date();
        var path = 'https://' + repo + '/' + data[3] + '?download=' + d.getTime();
        console.log(path);
        window.location = path;
    }

    /**
     *
     */
    function onClickAssetGroupSmilDownload(element, table) {
        var data = table.fnGetData($(element).parents('tr')[0]);
        var d = new Date();
        var path = 'https://' + repo + '/' + data[2] + '?download=' + d.getTime();
        console.log(path);
        window.location = path;
    }

    /**
     *
     */
    function onClickAssetSubtitleActionDownload(element, table) {
        var data = table.fnGetData($(element).parents('tr')[0]);
        var d = new Date();
        var path = 'https://' + repo + '/' + data[2] + '?download=' + d.getTime();
        console.log(path);
        window.location = path;
    }

    /**
     *
     */
    function onClickAssetSubtitleActionEdit(element, table) {
        var pos = table.fnGetPosition($(element).parents('tr')[0]);
        var data = table.fnGetData(pos);
    }

    /**
     *
     */
    function onClickAssetSubtitleActionDelete(element, table) {
        var pos = table.fnGetPosition($(element).parents('tr')[0]);
        var data = table.fnGetData(pos);
    }

    /**
     *
     */
    function renderAssetContentAction() {
        return '<img class="asset-content-action-reencode" src="/images/common/reencode.png"/><img class="asset-content-action-download" src="/images/common/download.png" />';
    }

    /**
     *
     */
    function renderAssetGroupSmil() {
        return '<img class="asset-group-smil-download" src="/images/common/download.png"/>';
    }

    /**
     *
     */
    function renderAssetSubtitleAction() {
        return '<img class="asset-subtitle-action-download" src="/images/common/download.png"/><img class="asset-subtitle-action-edit" src="/images/common/edit.png"/><img class="asset-subtitle-action-delete" src="/images/common/delete.png" />';
    }

    /**
     *
     */
    function getAssetValuesJSON(datas) {
        var datas = assetValuesTable.fnGetData();
        var objs = [];
        for(i in datas) {
            var obj = {};
            obj.name = datas[i][0];
            obj.type = datas[i][1];
            obj.value = datas[i][2];
            objs.push(obj);
        }
        return objs;
    }

    /**
     *
     */
    function getAssetContentsJSON(datas) {
    }

    /**
     *
     */
    function getAssetGroupsJSON(datas) {
    }

    /**
     *
     */
    function getAssetSubtitlesJSON() {
        if(!HB2.admin.isEmpty(deleteSubtitles)) {
            updateDeleteSubtitles();
        }

        var datas = assetSubtitlesTable.fnGetData();
        var objs = [];
        for(i in datas) {
            var obj = {};
            obj.type = datas[i][0];
            obj.lang = datas[i][1];
            obj.path = datas[i][2];
            objs.push(obj);
        }
        return objs;
    }

    /**
     *
     */
    function updateDeleteSubtitles() {
        for(var i = 0; i < deleteSubtitles.length; i++) {
            $.ajax({
                url : '/asset/delete-subtitle',
                asyn : false,
                type : 'POST',
                data : 'id=' + currVal.id + '&filename=' + deleteSubtitles[i].path,
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    console.info('[deleteSubtitle] delete: ' + data);
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                    console.info(errorThrown);
                }
            });
        }
        deleteSubtitles = [];
    }

    /**
     *
     */
    function inValuesTable(name) {
        var datas = assetValuesTable.fnGetData();
        for(i in datas) {
            if(name == datas[i][0]) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     */
    function inAssetSubtitlesTable(type, lang) {
        var datas = assetSubtitlesTable.fnGetData();
        for(i in datas) {
            if(type == datas[i][0] && lang == datas[i][1]) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     */
    function getAssetValuesData(objs) {
        var datas = new Array();
        for(i in objs) {
            var data = new Array();
            data[0] = objs[i].name;
            data[1] = objs[i].type;
            data[2] = objs[i].value;
            data[3] = '';
            data[4] = '';
            datas[i] = data;
        }
        return datas;
    }

    /**
     *
     */
    function getAssetContentsData(objs) {
        var datas = new Array();
        for(i in objs) {
            var data = new Array();
            data[0] = objs[i].name;
            data[1] = objs[i].type;
            data[2] = objs[i].format;
            data[3] = objs[i].path;
            data[4] = renderAssetContentAction();
            datas[i] = data;
        }
        return datas;
    }

    /**
     *
     */
    function getAssetGroupsData(objs) {
        var datas = new Array();
        for(i in objs) {
            var data = new Array();
            data[0] = objs[i].name;
            data[1] = objs[i].type;
            data[2] = objs[i].smil;
            data[3] = objs[i].contents.join(", ");
            data[4] = renderAssetGroupSmil();
            datas[i] = data;
        }
        return datas;
    }

    /**
     *
     */
    function getAssetSubtitlesData(objs) {
        var datas = new Array();

        if(!HB2.admin.isEmpty(objs)) {
            for(i in objs) {
                var data = new Array();
                data[0] = objs[i].type;
                data[1] = objs[i].lang;
                data[2] = objs[i].path;
                data[3] = renderAssetSubtitleAction();
                datas[i] = data;
            }
        }
        return datas;
    }

    /**
     *
     */
    function getAssetTagsData() {
        var tagList = $('#assetTagList').children();
        var arTags = new Array();

        $.each(tagList, function(key, element) {
            var children = $(element).children();
            $.each(children, function(key2, elementChild) {
                if($(elementChild).is('.assetEdit-tabTable-tags-element-txt')) {
                    arTags.push(elementChild.innerHTML);
                }
            });
        });
        return arTags;
    }

    /**
     *
     */
    function getAssetCategoriesData() {
        var tagList = $('#assetCategoryList').children();
        var arTags = new Array();

        $.each(tagList, function(key, element) {
            var children = $(element).children();
            $.each(children, function(key2, elementChild) {
                if($(elementChild).is('.assetEdit-tabTable-tags-element-txt')) {
                    arTags.push(elementChild.innerHTML);
                }
            });
        });
        return arTags;
    }

    /**
     *
     */
    function initAssetValuesTable(objs) {
        HB2.admin.metavalue.init(assetValuesTable, objs, repo);
    }

    /**
     *
     */
    function initAssetContentsTable(objs) {
        var datas = getAssetContentsData(objs);
        assetContentsTable.fnClearTable();
        assetContentsTable.fnAddData(datas);
        $('.asset-content-action-reencode').click(function() {
            onClickAssetContentActionReencode(this, assetContentsTable);
        });
        $('.asset-content-action-download').click(function() {
            onClickAssetContentActionDownload(this, assetContentsTable);
        });
    }

    /**
     *
     */
    function initAssetGroupsTable(objs) {
        var datas = getAssetGroupsData(objs);
        assetGroupsTable.fnClearTable();
        assetGroupsTable.fnAddData(datas);
        $('.asset-group-smil-download').click(function() {
            onClickAssetGroupSmilDownload(this, assetGroupsTable);
        });
    }

    /**
     *
     */
    function initAssetSubtitlesTable(objs) {
        var datas = getAssetSubtitlesData(objs);

        //assetSubtitlesTable.fnClearTable();
        //assetSubtitlesTable.fnAddData(datas);

        initSubtitlesTable(assetSubtitlesTable, objs);
    }

    function initAssetGeneralData() {
    }

    /**
     *
     */
    function initAssetPlayer(obj) {
        repo = getRepoByRegion(obj.region);
        $('#assetPlayer')[0].href = 'https://' + repo + '/' + obj.source.path;
        if($('#playerSplash')[0] ? true : false)
            $('#playerSplash')[0].src = 'https://' + repo + '/' + obj.splash;
        player = flowplayer("assetPlayer", "/swf/flowplayer.commercial-3.2.6.1.swf", {
            "key" : '#@0b3272bb43eff43967a',
            "play" : {
                "url" : 'http://elplanb.s3.amazonaws.com/accounts/elplanb/site/images/player/play.png',
                "width" : 78,
                "height" : 78
            },
            "clip" : {
                "autoPlay" : true,
                "autoBuffering" : true
            },
            "plugins" : {
                "controls" : {
                    "url" : "http://aws.cdn.elplanb.tv/accounts/elplanb/swf/flowplayer.controls-3.2.5.swf",
                    "autoHide" : {
                        "enabled" : true,
                        "fullscreenOnly" : false,
                        "hideDelay" : 1019,
                        "hideDuration" : 887,
                        "hideStyle" : "move",
                        "mouseOutDelay" : 500
                    },
                    "backgroundColor" : "rgba(46, 46, 46, 0)",
                    "backgroundGradient" : "none",
                    "border" : "0px",
                    "borderColor" : "rgba(0, 0, 0, 1)",
                    "borderRadius" : 30,
                    "borderWidth" : 0,
                    "bottom" : 0,
                    "bufferColor" : "rgba(33, 33, 33, 1)",
                    "bufferGradient" : "none",
                    "builtIn" : false,
                    "buttonColor" : "#ffffff",
                    "buttonOverColor" : "rgba(41, 41, 41, 1)",
                    "display" : "block",
                    "durationColor" : "rgba(0, 153, 255, 1)",
                    "fastBackward" : false,
                    "fastForward" : true,
                    "fullscreen" : true,
                    "height" : 36,
                    "left" : "50pct",
                    "margins" : [2, 6, 2, 12],
                    "mute" : true,
                    "name" : "controls",
                    "opacity" : 1,
                    "play" : true,
                    "playlist" : false,
                    "progressColor" : "rgba(0, 153, 255, 1)",
                    "progressGradient" : "none",
                    "scrubber" : true,
                    "scrubberBarHeightRatio" : 1,
                    "scrubberHeightRatio" : 0.5,
                    "sliderBorder" : "1px solid rgba(128, 128, 128, 0.7)",
                    "sliderColor" : "rgba(23, 23, 23, 1)",
                    "sliderGradient" : "none",
                    "slowBackward" : false,
                    "slowForward" : true,
                    "spacing" : {
                        "all" : 2,
                        "time" : 6,
                        "volume" : 8
                    },
                    "stop" : false,
                    "time" : true,
                    "timeBgColor" : "rgba(0, 0, 0, 0)",
                    "timeBgHeightRatio" : 1.2,
                    "timeBorder" : "0px solid rgba(0, 0, 0, 0.3)",
                    "timeBorderRadius" : 20,
                    "timeColor" : "#ffffff",
                    "timeFontSize" : 12,
                    "timeSeparator" : " ",
                    "tooltipColor" : "rgba(255, 255, 255, 1)",
                    "tooltipTextColor" : "rgba(51, 51, 51, 1)",
                    "tooltips" : {
                        "buttons" : true,
                        "fullscreen" : "Fullscreen",
                        "fullscreenExit" : "Exit fullscreen",
                        "marginBottom" : 5,
                        "mute" : "Mute",
                        "next" : "Next",
                        "pause" : "Pause",
                        "play" : "Play",
                        "previous" : "Previous",
                        "scrubber" : true,
                        "slowMotionBwd" : "Slow backward",
                        "slowMotionFBwd" : "Fast backward",
                        "slowMotionFFwd" : "Fast forward",
                        "slowMotionFwd" : "Slow forward",
                        "stop" : "Stop",
                        "unmute" : "Unmute",
                        "volume" : true
                    },
                    "volume" : true,
                    "volumeBarHeightRatio" : 0.80000000000000004,
                    "volumeBorder" : "1px solid rgba(128, 128, 128, 0.7)",
                    "volumeColor" : "rgba(0, 153, 255, 1)",
                    "volumeSliderColor" : "rgba(51, 51, 51, 1)",
                    "volumeSliderGradient" : "none",
                    "volumeSliderHeightRatio" : 0.40000000000000002,
                    "width" : "100pct",
                    "zIndex" : 1
                }
            }
        });
    }

    /**
     *
     */
    function getAssetJSON() {
        var obj = {};

        if($.trim($('#assetName').val())) {
            obj.name = $.trim($('#assetName').val());
        }
        if($.trim($('#assetTitle').val())) {
            obj.title = $.trim($('#assetTitle').val());
        }
        if($.trim($('#assetDescription').val())) {
            obj.description = $.trim($('#assetDescription').val());
        }
        if($.trim($('#assetSplash').val())) {
            obj.splash = $.trim($('#assetSplash').val());
        }
        if($.trim($('#assetTags').val())) {
            obj.tags = $.trim($('#assetTags').val()).split(',');
        }
        if($.trim($('#assetCategories').val())) {
            obj.categories = $.trim($('#assetCategories').val()).split(',');
        }

        var values = getAssetValuesJSON();
        obj.values = values;
        /*if(!HB2.admin.isEmpty(values)) {
         obj.values = values;
         }*/
        var subtitles = getAssetSubtitlesJSON();
        obj.subtitles = subtitles;
        /*if(!HB2.admin.isEmpty(subtitles)) {
         obj.subtitles = subtitles;
         }*/

        return obj;
    }

    /**
     *
     */
    function setAssetJSON(obj) {
        if(jQuery.isEmptyObject(obj)) {
            return;
        }
        repo = getRepoByRegion(obj.region);

        if(obj.id !== undefined) {
            $('#assetId').html(obj.id);
        }
        if(obj.name !== undefined) {
            $('#assetName').val(obj.name);
        }
        if(obj.splash !== undefined) {
            $('#assetSplash').val(obj.splash);
        }
        if(obj.title !== undefined) {
            $('#assetTitle').val(obj.title);
        }
        if(obj.description !== undefined) {
            $('#assetDescription').val(obj.description);
        }
        if(obj.created !== undefined) {
            $('#assetCreated').val($.format.date(obj.created, "MM/dd/yyyy"));
        }
        if(obj.updated !== undefined) {
            $('#assetUpdated').val($.format.date(obj.updated, "MM/dd/yyyy"));
        }

        if(obj.version !== undefined) {
            $('#assetVersion').val(obj.version);
        }
        if(obj.tags !== undefined) {
            addAssetElementList('assetTagList', obj.tags.join(','), $('#assetTags'));
        }
        if(obj.categories !== undefined) {
            addAssetElementList('assetCategoryList', obj.categories.join(','), $('#assetCategories'));
        }

        initAssetValuesTable(obj.values);

        if(obj.contents !== undefined) {
            initAssetContentsTable(obj.contents);
        }
        if(obj.groups !== undefined) {
            initAssetGroupsTable(obj.groups);
        }
        //if(obj.subtitles !== undefined) {
        initAssetSubtitlesTable(obj.subtitles);
        //}
        if(obj.youtube !== undefined) {
            youtubeLoad();
        } else {
            getYoutubeConnectors();
        }

        initAssetPlayer(obj);
        initAssetGeneralData();
    }

    /**
     *
     */
    function addAssetElementList(parentId, value, element) {
        var parent = $("#"+parentId).get(0);

        var array = value.split(',');
        var vals = new Array();
        if($.trim(element.val()) != '') {
            vals = $.trim(element.val()).split(',');
        }

        for(var i = 0; i < array.length; i++) {
            var tag = jQuery.trim(array[i]);
            if(!tag || jQuery.inArray(tag, vals) != -1) {
                continue;
            }
            //PARENT
            var listElement = document.createElement('div');
            $(listElement).addClass("hb-assetform-tabTable-tags-element");

            parent.appendChild(listElement);

            //PARENT-ICO
            var listElementIco = document.createElement('div');
            $(listElementIco).addClass("hb-assetform-tabTable-tags-element-ico");
            listElement.appendChild(listElementIco);
            listElementIco.onclick = function(e) {
                var vals = $.trim(element.val()).split(',');
                tag = this.nextSibling.innerHTML;
                index = jQuery.inArray(tag, vals);
                vals.splice(index, 1);
                element.val(vals.join(','));
                parent.removeChild(this.parentNode)
            };
            //PARENT-LABEL
            var listElementTxt = document.createElement('div');
            $(listElementTxt).addClass("hb-assetform-tabTable-tags-element-txt");

            listElementTxt.innerHTML = tag;
            listElement.appendChild(listElementTxt);
            vals.push(tag);
        }
        element.val(vals.join(','));
    };

    function saveSplash(path) {
        console.info('saveSplash path: ' + path);
        var id = currVal.id;
        $.ajax({
            url : '/asset/splash',
            type : 'GET',
            data : 'id=' + id + '&filename=' + path,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info('Splash save: ' + data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    function getYoutubeConnectors() {
        var criteria = {};
        criteria.type = "YOUTUBE";
        var conn;
        var conn = $.ajax({
            url : '/connector/find',
            type : 'GET',
            data : 'criteria=' + $.toJSON(criteria),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                youtubeInit(data.result);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
        return conn;
    }

    function youtubeInit(conns) {
        $('#youtubeConnector').empty();
        var combo = '<select id="ytConnCombo"></select>';
        $('#youtubeConnector').html(combo);
        $('#ytConnCombo').append(new Option(conns[0].id, conns[0].id, true, true));
        for(var i = 1; i < conns.length; i++) {
            $('#ytConnCombo').append(new Option(conns[i].id, conns[i].id));
        }

        $('#youtubeCategory').empty();
        var box = '<select id="ytCatCombo"></select>';
        $('#youtubeCategory').html(box);
        $('#ytCatCombo').append(new Option(categories[0], categories[0]));
        for( i = 1; i < categories.length; i++) {
            $('#ytCatCombo').append(new Option(categories[i], categories[i]));
        }
    }

    function youtubeLoad() {
        var yt = currVal.youtube;
        $('#videoID').html(yt.id);
        $('#videoConnector').html(yt.connector);
        $('#videoCategory').html(yt.category);
        //hacer function para la traduccion al español.
    }

    /**
     *
     */
    function onClickEditSubtitleSave(table) { // MIRAR SI SE PUEDE BORRAR

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
            var url = 'https://' + repo + '/' + data[2];
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
        data = table.fnGetData(currValuePos);
        sub = {};
        sub.type = data[0];
        sub.lang = data[1];
        sub.path = data[2];
        deleteSubtitles.push(sub);
        console.info('[Delete] deleteSubtitles: ' + deleteSubtitles);
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
    function saveSubtitle(path) {
        var type = $.trim($("#subtitleType").val());
        var lang = $.trim($('#subtitleLang').val());
        console.info('saveSubtitle path: ' + path);
        console.info('saveSubtitle type: ' + type);
        console.info('saveSubtitle lang: ' + lang);
        var id = currVal.id;
        $.ajax({
            url : '/asset/subtitle',
            type : 'POST',
            data : 'id=' + id + '&filename=' + path + '&type=' + type + '&lang=' + lang,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.info('Subtitle save: ' + data);
                getSubtitleObject(path, type, lang)
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
    function getSubtitleObject(path, type, lang) {
        console.info('getSubtitleObject: ' + path + " " + type + " " + lang);
        var sub = {};
        sub.type = type;
        sub.lang = lang;
        var acc = $("#accounts").val();
        var ext = path.split('.').pop();
        var name = sub.type.toLowerCase() + "_" + sub.lang.toLowerCase() + "." + ext;
        sub.path = "acc/" + acc + "/as/" + currVal.id + "/st/" + name;
        updateSubtitlesTable(assetSubtitlesTable, sub);
    }

    /**
     *
     */
    function updateSubtitlesTable(table, value) {
        console.info('[UpdateSubtitleTable] value: ' + value);
        //var datas = new Array();
        if(!HB2.admin.isEmpty(value)) {
            var data = new Array();
            if(!HB2.admin.isEmpty(value.type)) {
                console.info('Entro aki ');
                data[0] = value.type;
            } else {
                console.info('updateSubtitlesTable[0] is empty');
            }
            if(!HB2.admin.isEmpty(value.lang)) {
                data[1] = value.lang;
            } else {
                console.info('updateSubtitlesTable[1] is empty');
            }

            if(!HB2.admin.isEmpty(value.path)) {
                data[2] = value.path;
            } else {
                console.info('updateSubtitlesTable[2] is empty');
            }
            var url = 'https://' + repo + '/' + data[2];
            data[3] = '<a href="' + url + '"><img class="asset-subtitle-action-download" src="/images/common/download.png" /></a><img class="asset-subtitle-action-delete" src="/images/common/delete.png"/>';

            //datas[i] = data;
        }

        table.fnAddData(data);

        $('.asset-subtitle-action-delete').click(function() {
            onClickDeleteSubtitle(this, table);
        });
        $('#subtitleAddSubtitle').click(function() {
            onClickAddSubtitle();
        });
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
                if(!HB2.admin.isEmpty(obj.type)) {
                    data[0] = obj.type;
                } else {
                    console.info('initSubtitlesTable[0] is empty');
                }
                if(!HB2.admin.isEmpty(obj.lang)) {
                    data[1] = obj.lang;
                } else {
                    console.info('initSubtitlesTable[1] is empty');
                }

                if(!HB2.admin.isEmpty(obj.path)) {
                    data[2] = obj.path;
                } else {
                    console.info('initSubtitlesTable[2] is empty');
                }
                var url = 'https://' + repo + '/' + data[2];
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
                var type = $("#subtitleType").val();
                console.info('[Upload] type: ' + type);
                var ext = obj.path.toLowerCase().split('.').pop();
                console.info('complete Upload ext: ' + ext);
                if((type == "TIMED_TEXT" && ext == "xml") || (type == "SUBRIP" && ext == "srt")) {
                    alert("Archivo subido correctamente");
                    $('#subtitleFileValue').val(obj.path);
                    $('#subtitleFileUploading').val('false');
                    saveSubtitle(obj.path);
                } else {
                    alert('Tipo de archivo y extension incorrecta.')
                    $('#subtitleFileValue').val("");
                    $('#subtitleFileUploading').val('true');
                }
                $('#subtitleEditDialog').dialog('close');
            }
        });

        jQuery.validator.addMethod("subtitleExists", function(value, element) {
            //Esta funcion debe devolver false para validar  y true para ignorar.
            var type = $('#subtitleType').val();
            var lang = $('#subtitleLang').val();

            if($('#subtitleFileUploading').val() == 'true')
                return true;
            return !inAssetSubtitlesTable(type, lang);
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

        console.log('subtitleValidator: ' + subtitleValidator);

        return table;
    }

    function init(entity) {
        currVal = entity;

        // Init Value Dialog
        $('#valueEditDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 460,
            width : 500,
            modal : true,
            buttons : {
                'Save' : function() {
                    // Set Validator
                    HB2.admin.metavalue.onClickEditValueSave(assetValuesTable);
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
                    HB2.admin.metavalue.onClickDeleteValueDelete(assetValuesTable);
                },
                Cancel : function() {
                    $('#valueDeleteDialog').dialog('close');
                }
            }
        });

        // Init Value Dialog
        $('#subtitleEditDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 300,
            width : 500,
            modal : true,
            buttons : {
                'Save' : function() {
                    alert('Click Upload to begin the process');
                    //$('#subtitleEditDialog').dialog('close');
                    // Set Validator
                    //onClickEditSubtitleSave(assetSubtitlesTable);
                },
                Cancel : function() {
                    onClickEditSubtitleCancel();
                }
            }
        });
        // Init Delete Value Dialog
        $('#subtitleDeleteDialog').dialog({
            autoOpen : false,
            resizable : false,
            height : 280,
            width : 450,
            modal : true,
            buttons : {
                "Delete" : function() {
                    onClickDeleteSubtitleDelete(assetSubtitlesTable);
                },
                Cancel : function() {
                    $('#subtitleDeleteDialog').dialog('close');
                }
            }
        });

        // Asset Tabs
        assetGeneralTab = $("#tabGeneral");
        assetTagsTab = $("#tabTags");
        assetValuesTab = $("#tabMetadata");
        assetContentsTab = $("#tabProfiles");
        assetGroupsTab = $("#tabPublish");
        assetSubtitlesTab = $("#tabSubtitles");
        assetYoutubeTab = $("#tabYoutube");

        // Init Value Form
        validator = $('#assetForm').validate({
            rules : {
                onsubmit : false,
                assetName : {
                    "required" : true
                }
            }
        });

        // Asset Contents
        assetGeneralContent = $("#tabGeneralContent");
        assetTagsContent = $("#tabTagsContent");
        assetValuesContent = $("#tabMetadataContent");
        assetContentsContent = $("#tabProfilesContent");
        assetGroupsContent = $("#tabPublishContent");
        assetSubtitlesContent = $("#tabSubtitlesContent");
        assetYoutubeContent = $("#tabYoutubeContent");

        // Asset Tabs Events
        assetGeneralTab.click(function() {
            onClickAssetTab(this);
        });
        assetTagsTab.click(function() {
            onClickAssetTab(this);
        });
        assetValuesTab.click(function() {
            onClickAssetTab(this);
        });
        assetContentsTab.click(function() {
            onClickAssetTab(this);
        });
        assetGroupsTab.click(function() {
            onClickAssetTab(this);
        });
        assetSubtitlesTab.click(function() {
            onClickAssetTab(this);
        });
        assetYoutubeTab.click(function() {
            onClickAssetTab(this);
        })
        $('#assetSnapshot').click(function() {
            onClickAssetSnapshot(entity);
            console.log('assetSnapshot');
        });
        $('#assetForm').iframePostForm({
            iframeID : 'assetSplashFileIframe',
            post : function() {
                var msg = !$('input[type=file]').val().length ? 'Submitting form...' : 'Uploading file...';
                console.log('onClickValueUploadFile: post ' + msg);
            },
            complete : function(response) {
                console.log('onClickValueUploadFile: complete ' + response);
                var obj = jQuery.parseJSON(response);
                var path = $('#assetSplashValue');
                path.val(obj.path);
                if(path.val().length > 0) {
                    saveSplash(obj.path);
                    alert("File Uploaded successfully.");
                } else {
                    alert('ERROR. File not uploaded.');
                }
            }
        });
        // Asset Tags Buttons
        $("#assetTagAdd").click(function() {
            addAssetElementList("assetTagList", $.trim($('#assetTag').val()), $('#assetTags'));
            $('#assetTag').val(null);
        });
        $("#assetCategoryAdd").click(function() {
            addAssetElementList("assetCategoryList", $.trim($('#assetCategory').val()), $('#assetCategories'));
            $('#assetCategory').val(null);
        });
        // Asset Buttoms
        $('#assetSave').click(function() {
            if(validator.form()) {
                onClickAssetSave();
            } else {
            }
        });
        $('#assetClear').click(function() {
            onClickAssetClear();
        });
        $('#assetBack').click(function() {
            onClickAssetBack();
        });
        $('#youtubeAddVideo').click(function() {
            onClickUploadYoutube();
        });
        assetValuesTable = $('#metadataTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "fnRender" : function(oObj) {
                    return HB2.admin.metavalue.renderizeMetavalue(oObj.aData[1], oObj.aData[2])
                    //return 'valor: '+ oObj.aData[2];
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

        // Asset Tables
        assetContentsTable = $('#contentsTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "bVisible" : false,
                "aTargets" : [3]
            }, {
                "sClass" : "center",
                "aTargets" : [1, 2, 4]
            }]
        });
        assetGroupsTable = $('#groupsTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "bVisible" : false,
                "aTargets" : [2]
            }, {
                "sClass" : "center",
                "aTargets" : [1, 4]
            }]
        });
        assetSubtitlesTable = $('#subtitlesTable').dataTable({
            "bLengthChange" : false,
            "aoColumnDefs" : [{
                "bVisible" : true,
                "aTargets" : [2]
            }, {
                "sClass" : "center",
                "aTargets" : [0, 1, 2, 3]
            }]
        });

        setAssetJSON(entity);

        if(assetValuesTable[0] ? true : false)
            assetValuesTable[0].style.width = '100%';
        if(assetContentsTable[0] ? true : false)
            assetContentsTable[0].style.width = '100%';
        if(assetGroupsTable[0] ? true : false)
            assetGroupsTable[0].style.width = '100%';
        if(assetSubtitlesTable[0] ? true : false)
            assetSubtitlesTable[0].style.width = '100%';
    };

    return {
        init : init,
        inAssetSubtitlesTable : inAssetSubtitlesTable
    };
}(jQuery));
