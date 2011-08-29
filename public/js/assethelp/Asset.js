var Scripts_AssetList = function(parentName, account) {
    this.appendAll = function() {
    };
    this.numPerPage = 5;
    this.currentPage = 1;
    this.parent = $("#"+parentName).get(0);

    this.refreshBtn = $("#assetRefresh").get(0);
    this.loadingBox = $("#assetLoader").get(0);
    
    if( HB2.admin.allowed('admin-asset-list-deploy') ) {
        console.log('Deploy 1');
        this.deployBtn = $("#assetDeploy").get(0);
    }
    
    this.allData = [];
    this.onClickDeleteAsset = function() {
    };
    this.assetDeleteDialog = {};
    this.account = account;
    var myThis = this;
    
    if( HB2.admin.allowed('admin-asset-list-deploy') ) {
        console.log('Deploy 2');
        this.deployBtn.onclick = function() {
            myThis.deploy();
        };
    };

    this.refreshBtn.onclick = function() {
        myThis.appendAll();
    };
    this.appendAll = function() {

        var myThis = this;
        var allData = this.allData;

        //$('#loading').dialog('open');
        myThis.parent.style.display = "none";
        sort = {};
        sort.created = 1;
        $.ajax({
            url: '/asset/find',
            data: 'sort='+$.toJSON(sort),
            dataType: "json",

            success: function(data) {
                allData = data;
                //$('#loading-wrapper').dialog('close');
                myThis.parent.style.display = "block";
                data = data.result;
                myThis.parent.innerHTML = "";

                
                if(data){
                    for(var j=0; j<data.length; j++) {
                        if(Math.floor(data.length/this.numPerPage)) {
                            //Hacer paginación y tal
                        }
                    }
                    
                    var arAssets = new Array();
                    var element;
                    for(var i=0; i< data.length; i++) {
                        
                        element = new AssetHtml(data[i]);
                        arAssets[i] = element;
    
                        myThis.parent.appendChild(element.getElement());
                    }
                }
                $('input#inputSearch').quicksearch('ul#assetlist li');

                //return arAssets;

                //$('.result').html(data);
                //alert('Load was performed.');
            },
            error: function(data, textStatus) {
                alert(textStatus);

            }
        });
    };
    
    this.deploy = function() {
        $.ajax({
            url : '/asset/deploy',
            type : 'POST',
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                console.log('Asset Deploy ', data);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
            }
        });
    }
}
var AssetHtml = function (obj) {  
    repo = HB2.admin.getRepoSsl(obj.region);
    this.obj = obj;
    //CREATE AN ASSET OBJ EXAMPLE
    //this.obj = new Object();
    //this.obj.id= "4db7ca85492d4cb762000000"+"_"+id;
    this.obj.splash = 'https://'+repo+'/'+this.obj.splash;

    //this.obj.name = "Asset Name Asset Name Asset Name Asset Name Asset Name";
    //this.obj.type = "VIDEO";
    //this.obj.type = "AUDIO";
    //this.obj.type = "IMAGE";
    this.obj.type = this.obj.source.type;
    myThis = this;
    this.id = this.obj.id;

    //DEFINE FUNCTIONS
    this.deleteAction = function( _obj ) {
        myThis.onClickDeleteAsset(myThis, _obj.id);
    };
    this.updateAction = function() {
    };
    this.playAction = function (_obj) {
        $( "#assetlistPlayer" ).dialog( "option", "title", _obj.title );
        $( "#assetlistPlayer" ).dialog('open');
        loadVideoPlayer(_obj);
    };
    //PARENT
    this.assetElement = document.createElement('li');
    this.assetElement.setAttribute('id', 'asset_' + this.obj.id);
    this.assetElement.setAttribute("class", "hb-asset-list-element");
    $(this.assetElement).addClass("hb-asset-list-element");

    //ELEMENT-TOP
    this.assetElementTop = document.createElement('div');
    this.assetElementTop.setAttribute("class", "hb-asset-list-top");
    $(this.assetElementTop).addClass("hb-asset-list-top");
    //$(this.assetElementTop).css("background", "url('"+this.obj.splash+"');");
    //$(this.assetElementTop).css("background-image", "url("+this.obj.splash+");");  
    this.assetElement.appendChild(this.assetElementTop);
    
    this.assetElementTopBkg = document.createElement('img');
    this.assetElementTopBkg.setAttribute("src", this.obj.splash); 
    $(this.assetElementTopBkg).addClass("hb-asset-list-top-image");
    this.assetElementTop.appendChild(this.assetElementTopBkg);
    
    //this.assetElementTop.setAttribute("style", "background-image: url("+this.obj.splash+");");

    if(HB2.admin.allowed('admin-asset-list-embedicons')){
        //ELEMENT-TOP-SOCIAL
        this.assetElementTopSocial = document.createElement('div');
        $(this.assetElementTopSocial).addClass("hb-asset-list-top-social");
    
        this.assetElementTop.appendChild(this.assetElementTopSocial);
    
        //ELEMENT-TOP-SOCIAL-EMBED
        this.assetElementTopSocialEmbed = document.createElement('div');
        $(this.assetElementTopSocialEmbed).addClass("hb-asset-list-top-social-embed");
    
        
        this.assetElementTopSocialEmbed.onclick = function(e) {
            
             var flowPath = 'swf/flowplayer.commercial-3.2.7.swf';
             $("#assetlistEmbedDialog").dialog('open');
             $("#txtEmbed").val('<object class="vjs-flash-fallback"  width="640" height="480" type="application/x-shockwave-flash" data="https://'+repo+'/acc/'+asset.account+'/st/www/default/public/'+flowPath+'"><param name="movie" value="https://'+repo+'/acc/'+asset.account+'/st/www/default/public/'+flowPath+'" /><param name="allowfullscreen" value="true" /><param name="width" value="640" /><param name="height" value="480" /><param name="flashvars" value="config=https://'+repo+'/acc/'+asset.account+'/st/www/default/public/js/emb/'+obj.id+'.js" /></object>');        
        };
        this.assetElementTopSocial.appendChild(this.assetElementTopSocialEmbed);
    
        //ELEMENT-TOP-SOCIAL-EMBED-IMG
        this.assetElementTopSocialEmbedImg = document.createElement('img');
        this.assetElementTopSocialEmbedImg.setAttribute("src", HB2.admin.staticRepo+"/img/connector/embed.png");
        this.assetElementTopSocialEmbedImg.setAttribute("title", "Embed code");
        this.assetElementTopSocialEmbed.appendChild(this.assetElementTopSocialEmbedImg);
    
        //ELEMENT-TOP-SOCIAL-IFRAME
        this.assetElementTopSocialIframe = document.createElement('div');
        $(this.assetElementTopSocialIframe).addClass("hb-asset-list-top-social-iframe");
    
        this.assetElementTopSocialIframe.onclick = function(e) {
             $("#assetlistEmbedDialog").dialog('open');
             var domain = "www." + asset.account + '.hollybyte.tv';
             
             $("#txtEmbed").val('<iframe frameborder="0" marginwidth="0" marginheight ="0" id="iframeId" width="640" height="480" src="https://'+domain+'/embed/'+obj.id+'"></iframe>');
     
        };
        this.assetElementTopSocial.appendChild(this.assetElementTopSocialIframe);
    
        //ELEMENT-TOP-ACTION-SOCIAL-IFRAME-IMG
        this.assetElementTopSocialIframeImg = document.createElement('img');
        this.assetElementTopSocialIframeImg.setAttribute("src", HB2.admin.staticRepo+"/img/connector/iframe.png");
        this.assetElementTopSocialIframeImg.setAttribute("title", "Iframe code");
        this.assetElementTopSocialIframe.appendChild(this.assetElementTopSocialIframeImg);
        
    }
    
    
    
    //ELEMENT-TOP-ACTIONS
    this.assetElementTopActions = document.createElement('div');
    this.assetElementTopActions.setAttribute("class", "hb-asset-list-top-actions");
    $(this.assetElementTopActions).addClass("hb-asset-list-top-actions");
    
    this.assetElementTop.appendChild(this.assetElementTopActions);


    if( HB2.admin.allowed('admin-asset-list-edit') ){
        //ELEMENT-TOP-ACTIONS-EDIT
        this.assetElementTopActionsEdit = document.createElement('div');
        $(this.assetElementTopActionsEdit).addClass("hb-asset-list-top-actions-edit");
    
        this.assetElementTopActionsEdit.onclick = function(e) {
            myThis.updateAction(obj);
        };
        this.assetElementTopActions.appendChild(this.assetElementTopActionsEdit);
    
        //ELEMENT-TOP-ACTION-EDIT-IMG
        this.assetElementTopActionsEditImg = document.createElement('img');
        this.assetElementTopActionsEditImg.setAttribute("src", HB2.admin.staticRepo+"/img/assetlist/asset_edit.png");
        this.assetElementTopActionsEdit.appendChild(this.assetElementTopActionsEditImg);
    }
    
    if(HB2.admin.allowed('admin-asset-list-delete')){
        //ELEMENT-TOP-ACTIONS-DELETE
        this.assetElementTopActionsDelete = document.createElement('div');
        $(this.assetElementTopActionsDelete).addClass("hb-asset-list-top-actions-delete");
        this.assetElementTopActionsDelete.onclick = function(e) {
            myThis.deleteAction(obj);
        };
        this.assetElementTopActions.appendChild(this.assetElementTopActionsDelete);
    
        //ELEMENT-TOP-ACTION-EDIT-DELETE
        this.assetElementTopActionsDeleteImg = document.createElement('img');
        this.assetElementTopActionsDeleteImg.setAttribute("src", HB2.admin.staticRepo+"/img/assetlist/asset_delete.png");
        this.assetElementTopActionsDelete.appendChild(this.assetElementTopActionsDeleteImg);
    }


    //ELEMENT-TOP-TYPE
    this.assetElementTopType = document.createElement('div');
    //this.assetElementTopType.setAttribute("class", "hb-asset-list-top-type");
    $(this.assetElementTopType).addClass("hb-asset-list-top-type");
    this.assetElementTop.appendChild(this.assetElementTopType);

    //ELEMENT-TOP-TYPE-IMG
    this.assetElementTopTypeImg = document.createElement('img');
    this.assetElementTopTypeImg.onclick = function(e) {
        myThis.playAction(obj);
    };
    if(this.obj.type == "IMAGE")
        this.assetElementTopTypeImg.setAttribute("src", HB2.admin.staticRepo+"/img/assetlist/type_image.png");
    else if(this.obj.type == "AUDIO")
        this.assetElementTopTypeImg.setAttribute("src", HB2.admin.staticRepo+"/img/assetlist/type_audio.png");
    else
        this.assetElementTopTypeImg.setAttribute("src", HB2.admin.staticRepo+"/img/assetlist/type_video.png");

    this.assetElementTopType.appendChild(this.assetElementTopTypeImg);

    //ELEMENT-INFO
    this.assetElementInfo = document.createElement('div');
    $(this.assetElementInfo).addClass("hb-asset-list-info");
        
    this.assetElement.appendChild(this.assetElementInfo);

    /*//ELEMENT-INFO-ACTIVE
    this.assetElementInfoSwitch = document.createElement('div');
    this.assetElementInfoSwitch.setAttribute("class", "hb-asset-list-info-active");
    this.assetElementInfo.appendChild(this.assetElementInfoSwitch);

    //CREATE SWITCH ELEMENT
    var wSwitch = new Widget_Switch(this.obj.id, true, "floatLeft");
    wSwitch.switchOnEvent = function(){alert(wSwitch.getElement().id);}
    wSwitch.switchOffEvent = function(){alert(wSwitch.getElement().id);}
    //ELEMENT-INFO-ACTIVE-BUTTON
    this.assetElementInfoSwitchWidget = wSwitch.getElement();
    this.assetElementInfoSwitch.appendChild(this.assetElementInfoSwitchWidget);*/

    //ELEMENT-INFO-TEXT
    this.assetElementInfoText = document.createElement('div');
    $(this.assetElementInfoText).addClass("hb-asset-list-info-text");
    
    this.assetElementInfoText.innerHTML = this.obj.name;
    this.assetElementInfo.appendChild(this.assetElementInfoText);

    //ELEMENT-INFO-HIDDENDATA
    this.assetElementInfoText = document.createElement('div');
    $(this.assetElementInfoText).addClass("hb-asset-list-info-hiddendata");
    
    this.assetElementInfoText.innerHTML = this.obj.description + ' ' + this.obj.id;

    this.assetElementInfo.appendChild(this.assetElementInfoText);

    this.getElement = function() {
        return this.assetElement;
    }
    this.updateAction = function( myThis ) {
        window.location = "/asset/form/id/"+myThis.id;
    }
    this.deleteAsset = function(id) {
        var myThis = this;
        $.ajax({
            url: '/asset/delete?id='+id,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                console.info(data);
                asset.appendAll();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
                console.info(errorThrown);
                sites = [];
            }
        } );
    };
    this.onClickDeleteAsset = function (myThis, id) {
        var myThis = myThis;

        this.assetDeleteDialog = $('#assetlistDeleteDialog');
        this.assetDeleteDialog.dialog();
        this.assetDeleteDialog.html('<p>Do you want to delete the asset: '+id+' ?<p>');
        this.assetDeleteDialog.dialog('option', 'title', 'Delete Asset');
        this.assetDeleteDialog.dialog('option', 'height', 200);
        this.assetDeleteDialog.dialog('option', 'width', 350);
        this.assetDeleteDialog.dialog( "option", "dialogClass", 'assetlistDeleteDialog' );
        this.assetDeleteDialog.dialog('option', 'buttons', {
            "Delete Asset": function() {
                myThis.deleteAsset(id);

                $('#assetlistDeleteDialog').dialog("close");

            },
            Cancel: function() {
                $('#assetlistDeleteDialog').dialog("close");
            }
        });

        this.assetDeleteDialog.dialog('open');
    };
    /*this.search = function(valSearch){
     var arAssets = [];
     for(var i=0; i< this.allData.length; i++){
     element = new AssetHtml(this.allData[i]);
     arAssets[i] = element;
     this.parent.innerHTML = '';
     this.parent.appendChild(element.getElement());
     }
     }*/

}
