var Scripts_AssetForm = function(serializeData) {
    this.data = serializeData;
    this.tabControl = function() {
    };
    this.addTag = function() {
    };
    this.addCategory = function() {
    };
    var myThis = this;

    this.service = new Service_Asset(this.data);

    this.changes;

    this.updateData = function() {
        var nameBox;
    }
    this.btnAddTag = $("#btnAddTag");
    this.btnAddCat = $("#btnAddCat");
    this.btnAddTag.get(0).onclick = function(e) {myThis.addElementList("tagList", "txtAddTag");
    }
    this.btnAddCat.get(0).onclick = function(e) {myThis.addElementList("catList", "txtAddCat");
    }
    this.tabGeneral = $("#tabGeneral").get(0);
    this.tabGeneral.onclick = function(e) {myThis.tabControl(e)
    };
    this.tabTags = $("#tabTags").get(0);
    this.tabTags.onclick = function(e) {myThis.tabControl(e)
    };
    this.tabProfiles = $("#tabProfiles").get(0);
    this.tabProfiles.onclick = function(e) {myThis.tabControl(e)
    };
    this.tabMetadata = $("#tabMetadata").get(0);
    this.tabMetadata.onclick = function(e) {myThis.tabControl(e)
    };
    this.tabPublish = $("#tabPublish").get(0);
    this.tabPublish.onclick = function(e) {myThis.tabControl(e)
    };
    this.tabSubtitles = $("#tabSubtitles").get(0);
    this.tabSubtitles.onclick = function(e) {myThis.tabControl(e)
    };
    this.tabGeneralContent = $("#tabGeneralContent").get(0);
    this.tabTagsContent = $("#tabTagsContent").get(0);
    this.tabMetadataContent = $("#tabMetadataContent").get(0);
    this.tabProfilesContent = $("#tabProfilesContent").get(0);
    this.tabPublishContent = $("#tabPublishContent").get(0);
    this.tabSubtitlesContent = $("#tabSubtitlesContent").get(0);

    this.addChange = function(type, id, prop, value) {

        var arType = $("#"+inputId).get(0).value.split(',');
        var current;
        for(var i = 0; i < array.length; i++) {

            var type = array[i].replace(/^\s*|\s*$/g, "");
            //Para hace run trim.
            var current = arType[type];

        }
    }
    this.addElementList = function(parentId, inputId) {
        var parent = $("#"+parentId).get(0);

        if($("#"+inputId).get(0).value == "")
            return;

        var array = $("#"+inputId).get(0).value.split(',');

        for(var i = 0; i < array.length; i++) {
            var tag = array[i].replace(/^\s*|\s*$/g, "");
            //Para hace run trim.

            //PARENT
            var listElement = document.createElement('div');
            listElement.setAttribute("class", "hb-assetform-tabTable-tags-element");
            parent.appendChild(listElement);

            //PARENT-ICO
            var listElementIco = document.createElement('div');
            listElementIco.setAttribute("class", "hb-assetform-tabTable-tags-element-ico");
            listElement.appendChild(listElementIco);
            listElementIco.onclick = function(e) {parent.removeChild(listElementIco.parentNode)
            };
            //PARENT-LABEL
            var listElementTxt = document.createElement('div');
            listElementTxt.setAttribute("class", "hb-assetform-tabTable-tags-element-txt");

            listElementTxt.innerHTML = tag;
            $("#"+inputId).get(0).value = '';
            listElement.appendChild(listElementTxt);

        }

    }
    this.tabControl = function(e) {

        $(this.tabGeneral).attr('class', 'hb-assetform-tabTable-left-tabs-general');
        $(this.tabTags).attr('class', 'hb-assetform-tabTable-left-tabs-tags');
        $(this.tabProfiles).attr('class', 'hb-assetform-tabTable-left-tabs-profiles');
        $(this.tabMetadata).attr('class', 'hb-assetform-tabTable-left-tabs-metadata');
        $(this.tabPublish).attr('class', 'hb-assetform-tabTable-left-tabs-publish');
        $(this.tabSubtitles).attr('class', 'hb-assetform-tabTable-left-tabs-subtitles');

        this.tabGeneralContent.style.display = "none";
        this.tabTagsContent.style.display = "none";
        this.tabProfilesContent.style.display = "none";
        this.tabMetadataContent.style.display = "none";
        this.tabPublishContent.style.display = "none";
        this.tabSubtitlesContent.style.display = "none";

        switch(e.target.id) {
            case 'tabGeneral':
                $(this.tabGeneral).attr('class', 'hb-assetform-tabTable-left-tabs-generalOn');
                this.tabGeneralContent.style.display = "block";
                break;

            case 'tabTags':
                $(this.tabTags).attr('class', 'hb-assetform-tabTable-left-tabs-tagsOn');

                this.tabTagsContent.style.display = "block";
                break;

            case 'tabProfiles':
                $(this.tabProfiles).attr('class', 'hb-assetform-tabTable-left-tabs-profilesOn');

                this.tabProfilesContent.style.display = "block";
                break;

            case 'tabMetadata':
                $(this.tabMetadata).attr('class', 'hb-assetform-tabTable-left-tabs-metadataOn');
                this.tabMetadataContent.style.display = "block";
                break;

            case 'tabPublish':
                $(this.tabPublish).attr('class', 'hb-assetform-tabTable-left-tabs-publishOn');
                this.tabPublishContent.style.display = "block";
                break;

            case 'tabSubtitles':
                $(this.tabSubtitles).attr('class', 'hb-assetform-tabTable-left-tabs-subtitlesOn');
                this.tabSubtitlesContent.style.display = "block";
                break;
        }
    }
}