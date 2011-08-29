/**
 * @author Fabio Ospitia Trujillo
 */
Namespace('HB2.admin');

HB2.admin.player = ( function($) {

    var flowplayerSWF = "http://repo1.eu.hollybyte.com/public/players/flowplayer/swf/flowplayer.commercial-3.2.7.swf";
    var flowplayerCfg = {
        "key" : "#@0b3272bb43eff43967a",
        "play" : {
            "url" : "http://repo1.eu.hollybyte.com/public/players/img/play.png",
            "width" : 78,
            "height" : 78
        },
        "logo" : {
            "url" : "http://repo1.eu.hollybyte.com/public/players/img/logo.png",
            "fullscreenOnly" : false,
            "displayTime" : 0,
            "linkUrl" : "http://www.hollybyte.com"
        },
        "clip" : {
            "autoPlay" : true,
            "autoBuffering" : true,
            "url" : "http://repo1.eu.hollybyte.com/public/players/hollybyte-en.mp4"
        },
        "plugins" : {
            "controls" : {
                "url" : "http://repo1.eu.hollybyte.com/public/players/flowplayer/swf/flowplayer.controls-3.2.5.swf",
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
                "volumeBarHeightRatio" : 0.8,
                "volumeBorder" : "1px solid rgba(128, 128, 128, 0.7)",
                "volumeColor" : "rgba(0, 153, 255, 1)",
                "volumeSliderColor" : "rgba(51, 51, 51, 1)",
                "volumeSliderGradient" : "none",
                "volumeSliderHeightRatio" : 0.4,
                "width" : "100pct",
                "zIndex" : 1
            }
        }
    };

    var currVal = {};
    var validator;

    var formType;
    var formPlayer;
    var configFlow;
    var configJs;

    var formId;

    var btnSave;
    var playerEditTabs;
    var configTabTitle;
    var account;
    //var repo = "http://repo1.eu.hollybyte.com";

    var flowPath = 'flowplayer.commercial-3.2.7.swf';

    function getPlayers(type) {
        console.info("getPlayers[1]");
        var arPlayers = Array();
        if(type.toLowerCase() == "html5" || $('#playerEditFormType option:first').val().toLowerCase() == "html5") {
            arPlayers.push(new Array("VideoJS", "videojs"));
        } else if(type.toLowerCase() == "flash" || $('#playerEditFormType option:first').val().toLowerCase() == "flash") {
            arPlayers.push(new Array("Flowplayer", "flowplayer"));
        } else {
            
        }

        return arPlayers;
    }

    function setPlayer(type, player) {
        type = type ? type : "";
        player = player ? player : "";
        formPlayer[0].length = 0;
        
        if(player !== "") {
            var op = document.createElement("OPTION");
            formPlayer.append(op);
            op.text = player;
            op.value = player.toLowerCase();
            /*var op = new Option(player, player.toLowerCase());
            formPlayer.append(op);
            formPlayer.attr('disable', true);*/
            
        } else {
            var players = getPlayers(type);
            for(var i = 0; i < players.length; i++) {
                /*var op = new Option(players[i][0], players[i][1]);
                $(op).html(players[i][0]);*/
                
                 var op = document.createElement("OPTION");
                 formPlayer.append(op);
                 op.text = players[i][0];
                 op.value = players[i][1];
                
                /*if(players[i][1].toLowerCase() == player.toLowerCase()) {
                    $(op).attr('selected', true);
                }*/
                //formPlayer.append(op);
                console.log("setPlayer[3]");
            }
        }

        if($('#playerEditFormPlayer option:first').val().toLowerCase() != "flowplayer") {
            configFlow.hide();
            configJs.show();

        } else {
            configJs.hide();
            configFlow.show();
        }
    }

    function getTypes() {
        var arTypes = Array();
        arTypes.push(new Array("FLASH", "flash"));
        arTypes.push(new Array("HTML5", "html5"));
        
        return arTypes;
    }

    function setType(type) {
        type = type ? type : false;
        formType[0].length = 0;
        console.log("entra? ");
        if(type !== false) {
           var op = document.createElement("OPTION");
           formType.append(op);
           op.text = type;
           op.value = type.toLowerCase();
           
           formType.attr('disable', true);
            
           return;
        }

        var types = getTypes();
        console.log("types: ");
        console.log(types);
        for(var i = 0; i < types.length; i++) {
            
           var op = document.createElement("OPTION");
           formType.append(op);
           op.text = types[i][0];
           op.value = types[i][1];
           
           /*if(types[i][1].toLowerCase() == type.toLowerCase()) {
                $(op).attr('selected', true);
            }*/
           
        }

    }

    function formInit(data) {
        if(jQuery.isEmptyObject(data)) {
            //return;
        }
        
        currVal = data;
        if(data && data.config) {
            flowplayerLoadConf(data.config);
        }
        
        if(data && data.id) {
            formId.val(data.id);
            $('#playerEditFormId').attr('disabled', true);
            configTabTitle.show();
        } else {
            configTabTitle.hide();

        }
        if(data) {
            $('#playerEditFormCreated').val(data.created);
            $('#playerEditFormUpdated').val(data.updated);
            $('#playerEditFormCreatedValue').val(data.created);
            $('#playerEditFormUpdatedValue').val(data.updated);
            setType(data.type);
            setPlayer(data.type, data.player);
        } else {
            setType();
            setPlayer();
        }

        formType.change(function() {
            setPlayer($(this).val(), "");
        });
    }

    function getPlayer() {
        //var currConf = $f("player").getConfig();
        //Funcion que coge los datos del form y los encapsula en un object
        var data = {};
        data.id = formId.val();
        data.updated = $('#playerEditFormUpdatedValue').val();
        data.type = $('#playerEditFormType').val().toUpperCase();
        data.player = $('#playerEditFormPlayer').val().toUpperCase();
        //data.config = currConf;
        data.region = $('#playerEditFormRegion').val();

        return data;
    }

    function saveNewPlayer() {

        var json = {};
        json.id = formId.val();
        json.type = $('#playerEditFormType').val().toUpperCase();
        json.player = $('#playerEditFormPlayer').val().toUpperCase();
        json.region = $('#playerEditFormRegion').val();

        return json;
    }

    function onClickSave() {
        if(!validator.form())
            return;

        if($('#playerEditConfigTabTitle').css('display') !== 'none') {
            var json = getPlayer();
            var action = "update";

            json.config = $f("player").getConfig();
            //json.config = currVal;
            if(json.config) {
                if(json.config.playerId)
                    delete json.config.playerId;
                if(json.config.clip.url)
                    delete json.config.clip.url;
                if(json.config.playlist)
                    delete json.config.playlist;
            }
            if(!currVal)
                currVal = {};

            currVal.config = {};

            if(currVal.created)
                currVal.created = encodeURIComponent(currVal.created);
            if(currVal.updated)
                currVal.updated = encodeURIComponent(currVal.updated);
            obj = $.extend({}, currVal, json);
        } else {
            obj = saveNewPlayer();
            action = "create";
            setType(obj.type);
            setPlayer(obj.type, obj.player);
            formId.attr('disabled', true);
            console.info('create obj: ' + obj);
        }

        $.ajax({
            url : '/player/' + action,
            type : 'POST',
            async : true,
            data : 'data=' + $.toJSON(obj),
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                //console.info('player: ' + $.toJSON(data));
                currVal = data;
                if (action === "create") {
                    flowplayerLoadConf(data.config);
                }
                console.info('data: ', data);
                configTabTitle.show();
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }

    function flowplayerUpdateRealTime(strConfig) {
        var oldConf = $f("player").getConfig();
        var config = jQuery.parseJSON(strConfig);

        var controls = config.plugins.controls;
        oldConf.plugins.controls = controls;
        var plugin = $f("player").getControls();

        //BAR SIZE
        if(plugin.width != controls.width) {
            plugin.css("width", controls.width);
        }
        if(plugin.height != controls.height) {
            plugin.css("height", controls.height);
        }

        //BAR POSITION
        if(plugin.left != controls.left) {
            plugin.css("left", controls.left);
        }
        if(plugin.bottom != controls.bottom) {
            plugin.css("bottom", controls.bottom);
        }

        if(plugin.backgroundColor != controls.backgroundColor) {
            plugin.css("backgroundColor", controls.backgroundColor);
        }
        if(plugin.backgroundGradient != controls.backgroundGradient) {
            plugin.css("backgroundGradient", controls.backgroundGradient);
        }
        if(plugin.borderColor != controls.borderColor) {
            plugin.css("borderColor", controls.borderColor);
        }
        if(plugin.borderRadius != controls.borderRadius) {
            plugin.css("borderRadius", controls.borderRadius);
        }

        if(plugin.bufferColor != controls.bufferColor) {
            plugin.css("bufferColor", controls.bufferColor);
        }
        if(plugin.bufferGradient != controls.bufferGradient){
            plugin.css("bufferGradient", controls.bufferGradient);
        }
        if(plugin.builtIn != controls.builtIn) {
            plugin.css("builtIn", controls.builtIn);
        }

        if(plugin.buttonColor != controls.buttonColor) {
            plugin.css("buttonColor", controls.buttonColor);
        }
        if(plugin.buttonOffColor != controls.buttonOffColor) {
            plugin.css("buttonOffColor", controls.buttonOffColor);
        }
        if(plugin.buttonOverColor != controls.buttonOverColor) {
            plugin.css("buttonOverColor", controls.buttonOverColor);
        }

        if(plugin.display != controls.display) {
            plugin.css("display", controls.display);
        }
        if(plugin.durationColor != controls.durationColor) {
            plugin.css("durationColor", controls.durationColor);
        }

        //BUTTONS
        if(plugin.fullscreen != controls.fullscreen) {
            plugin.css("fullscreen", controls.fullscreen);
        }
        if(plugin.stop != controls.stop) {
            plugin.css("stop", controls.stop);
        }
        if(plugin.play != controls.play) {
            plugin.css("play", controls.play);
        }
        if(plugin.mute != controls.mute) {
            plugin.css("mute", controls.mute);
        }
        if(plugin.volume != controls.volume) {
            plugin.css("volume", controls.volume);
        }

        if(plugin.margins != controls.margins) {
            plugin.css("margins", controls.margins);
        }
        if(plugin.opacity != controls.opacity) {
            plugin.css("opacity", controls.opacity);
        }
        if(plugin.progressColor != controls.progressColor) {
            plugin.css("progressColor", controls.progressColor);
        }
        if(plugin.progressGradient != controls.progressGradient) {
            plugin.css("progressGradient", controls.progressGradient);
        }
        if(plugin.scrubber != controls.scrubber) {
            plugin.css("scrubber", controls.scrubber);
        }
        if(plugin.scrubberBarHeightRatio != controls.scrubberBarHeightRatio) {
            plugin.css("scrubberBarHeightRatio", controls.scrubberBarHeightRatio);
        }
        if(plugin.scrubberHeightRatio != controls.scrubberHeightRatio) {
            plugin.css("scrubberHeightRatio", controls.scrubberHeightRatio);
        }
        if(plugin.spacing != controls.spacing) {
            plugin.css("spacing", controls.spacing);
        }

        //SLIDER OPTIONS
        if(plugin.sliderBorder != controls.sliderBorder) {
            plugin.css("sliderBorder", controls.sliderBorder);
        }
        if(plugin.sliderColor != controls.sliderColor) {
            plugin.css("sliderColor", controls.sliderColor);
        }
        if(plugin.sliderGradient != controls.sliderGradient) {
            plugin.css("sliderGradient", controls.sliderGradient);
        }

        //TIME OPTIONS
        if(plugin.time != controls.time) {
            plugin.css("time", controls.time);
        }
        if(plugin.bottimeBgColortom != controls.timeBgColor) {
            plugin.css("timeBgColor", controls.timeBgColor);
        }
        if(plugin.timeBgHeightRatio != controls.timeBgHeightRatio) {
            plugin.css("timeBgHeightRatio", controls.timeBgHeightRatio);
        }
            
        if(plugin.timeBorder != controls.timeBorder) {
            plugin.css("timeBorder", controls.timeBorder);
        }
        if(plugin.timeBorderRadius != controls.timeBorderRadius) {
            plugin.css("timeBorderRadius", controls.timeBorderRadius);
        }
        if(plugin.timeColor != controls.timeColor) {
            plugin.css("timeColor", controls.timeColor);
        }
        if(plugin.timeFontSize != controls.timeFontSize) {
            plugin.css("timeFontSize", controls.timeFontSize);
        }
        if(plugin.timeSeparator != controls.timeSeparator) {
            plugin.css("timeSeparator", controls.timeSeparator);
        }

        //VOLUME OPTIONS
        if(plugin.volumeBarHeightRatio != controls.volumeBarHeightRatio) {
            plugin.css("volumeBarHeightRatio", controls.volumeBarHeightRatio);
        }
        if(plugin.volumeBorder != controls.volumeBorder) {
            plugin.css("volumeBorder", controls.volumeBorder);
        }
        if(plugin.volumeColor != controls.volumeColor) {
            plugin.css("volumeColor", controls.volumeColor);
        }
        if(plugin.volumeSliderColor != controls.volumeSliderColor) {
            plugin.css("volumeSliderColor", controls.volumeSliderColor);
        }
        if(plugin.volumeSliderGradient != controls.volumeSliderGradient) {
            plugin.css("volumeSliderGradient", controls.volumeSliderGradient);
        }
        if(plugin.volumeSliderHeightRatio != controls.volumeSliderHeightRatio) {
            plugin.css("volumeSliderHeightRatio", controls.volumeSliderHeightRatio);
        }

        //TOOLTIPS
        if(plugin.tooltipColor != controls.tooltipColor) {
            plugin.css("tooltipColor", controls.tooltipColor);
        }
        if(plugin.tooltipTextColor != controls.tooltipTextColor) {
            plugin.css("tooltipTextColor", controls.tooltipTextColor);
        }
        plugin.setTooltips(controls.tooltips);

        plugin.setAutoHide(controls.autoHide);

        //currVal = $f("player").getConfig();

    }

    function flowplayerUpdate(strConfig) {
        var oldConf = $f("player").getConfig();
        var config = jQuery.parseJSON(strConfig);
        config.clip.url = "http://repo1.eu.hollybyte.com/public/players/hollybyte-en.mp4";
        config.key = "#@0b3272bb43eff43967a";

        if(config.plugins.carousel) {
            if(!config.plugins.carousel.menuTree) {
                config.plugins.carousel.menuTree = {
                    "id" : "home",
                    "title" : "Peliculas",
                    "description" : "Mis Peliculas",
                    "splash" : "http://acme.hollybyte.com/repo/p/playlist1/thumb.jpg",
                    "menus" : [{
                        "id" : "peliculas",
                        "title" : "Estrenos",
                        "description" : "Estrenos de Peliculas",
                        "splash" : "http://acme.hollybyte.com/repo/p/playlist2/thumb.jpg",
                        "playlist" : [{
                            "id" : "4d3440e29099afafe5a3012b",
                            "url" : "http://repo1.eu.hollybyte.com/public/players/hollybyte-en.mp4",
                            "title" : "Tangled",
                            "description" : "Pelicula Tangled",
                            "splash" : "http://acme.hollybyte.com/repo/a/4d3440e29099afafe5a3012b/thumb.png",
                            "profileHtml" : "",
                            "pageUrl" : "http://compartirvideo.com/video1"
                        }]
                    }, {
                        "id" : "playlist3",
                        "title" : "Actuales",
                        "description" : "Peliculas Actuales",
                        "splash" : "http://acme.hollybyte.com/repo/p/playlist3/thumb.jpg",
                        "playlist" : [{
                            "id" : "4d3440e29099afafe5a3012d",
                            "url" : "http://repo1.eu.hollybyte.com/public/players/hollybyte-en.mp4",
                            "title" : "Ahora los padres son ellos",
                            "description" : "Pelicula Ahora los padres son ellos",
                            "splash" : "http://acme.hollybyte.com/repo/a/4d3440e29099afafe5a3012d/thumb.png",
                            "profileHtml" : "",
                            "pageUrl" : "http://compartirvideo.com/video3"
                        }]
                    }]
                };
            }
        }

        $f("player", currVal.swf, config);

        //$('player').config = config;

    }

    function flowplayerLoadConf(config) {
        config.clip = {};
        config.clip.url = "http://repo1.eu.hollybyte.com/public/players/hollybyte-en.mp4";
        $f("player", currVal.swf, config);
    }

    function flowConfigReady() {
        //flashObj es el objeto swf del configurador.

        var brandingTab = false;
        var pluginTab = false;

        //console.info(HB2.admin.player.account);

        if(currVal.id) {
            flashObj.loadConfig("http://admin.hollybyte.com/player/getconf?id=" + currVal.id);
        } else {
            flashObj.loadConfig("http://admin.hollybyte.com/player/getconf");
        }
        currVal.config.clip.url = "http://repo1.eu.hollybyte.com/public/players/hollybyte-en.mp4";

        if(HB2.admin.allowed('admin-player-flash-branding')) {
            brandingTab = true;
        }
        if(HB2.admin.allowed('admin-player-flash-plugin')) {
            pluginTab = true;
        }

        flashObj.setAccount(HB2.admin.player.account);
        flashObj.setTabConfig(brandingTab, pluginTab);

    }
    
    function uploadLogo(path) {
        console.log('uploadLogo path: ',path);
        var id = currVal.id;
        $.ajax({
            url : '/player/logo',
            type : 'POST',
            data : 'id=' + id + '&filename=' + path,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log('Logo save: ', data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }
    
    function uploadPlay(path) {
        console.log('uploadLogo path: ',path);
        var id = currVal.id;
        $.ajax({
            url : '/player/play',
            type : 'POST',
            data : 'id=' + id + '&filename=' + path,
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log('Play save: ', data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }


    function init() {
        formType = $("#playerEditFormType");
        formPlayer = $("#playerEditFormPlayer");
        configFlow = $("#playerEditConfigFlow");
        configJs = $("#playerEditConfigJs");
        formId = $("#playerEditFormId");
        btnSave = $("#btnSave");
        playerEditTabs = $("#playerEditTabs");
        configTabTitle = $('#playerEditConfigTabTitle');

        playerEditTabs.tabs();
        btnSave.click(function(e) {
            onClickSave();
        });
        // Init Value Form
        validator = $('#playerForm').validate({
            rules : {
                onsubmit : false,
                playerEditFormId : {
                    "required" : true,
                    "identity" : true
                }
            }
        });
        
        $('#logoPlayer').iframePostForm({
            iframeID : 'playerLogoIframe',
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
                        uploadLogo(path);
                        alert("File Uploaded successfully.");
                    } else {
                        alert('ERROR. File not uploaded.');
                    }
                }else{
                    alert("You must select an image");
                }
            }
        });
        
        $('#playPlayer').iframePostForm({
            iframeID : 'playerPlayIframe',
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
                        uploadPlay(path);
                        alert("File Uploaded successfully.");
                    } else {
                        alert('ERROR. File not uploaded.');
                    }
                }else{
                    alert("You must select an image");
                }
            }
        });

    }

    return {
        init : init,
        account : account,
        loadData : formInit,
        flowplayerUpdateRealTime : flowplayerUpdateRealTime,
        flowplayerUpdate : flowplayerUpdate,
        flowConfigReady : flowConfigReady,
        flowplayerLoadConf : flowplayerLoadConf
    }

}(jQuery));
function replacePlayList(pl) {
    $f().play(pl);
}

function playVideo(i) {
    $f().play(i);
}