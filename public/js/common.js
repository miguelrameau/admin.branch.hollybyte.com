/**
 * @author Fabio Ospitia Trujillo
 */
$.validator.addMethod('identity', function(value, element) {
    return this.optional(element) || /^([a-z0-9]+[a-z0-9_\-]+)*[a-z0-9]$/g.test(value);
}, "Value must be a valid identity name (lower case, alphanumeric, '-' and '_')");
$.validator.addMethod('username', function(value, element) {
    return this.optional(element) || /^([a-z0-9]+[a-z0-9_\-\.]+)*[a-z0-9]$/g.test(value);
}, "Value must be a valid username (lower case, alphanumeric, '-', '.' and '_')");
$.validator.addMethod('subdomain', function(value, element) {
    return this.optional(element) || /^[a-z0-9]+[a-z0-9\-]*[a-z0-9]+$/g.test(value);
}, "Value must be a valid subdomain name");
$.validator.addMethod('domain', function(value, element) {
    return this.optional(element) || /^([a-z0-9]+([\-a-z0-9]*[a-z0-9]+)?\.){0,}([a-z0-9]+([\-a-z0-9]*[a-z0-9]+)?){1,63}(\.[a-z0-9]{2,7})+$/i.test(value);
}, "Value must be a valid domain name");
$.validator.addMethod('email', function(value, element) {
    return this.optional(element) || /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/i.test(value);
}, "Value must be a valid email");
Namespace('HB2.admin');

HB2.admin = ( function($) {

    var languages = [["Abkhaz","ab"],["Afar","aa"],["Afrikaans","af"],["Akan","ak"],["Albanian","sq"],["Amharic","am"],["Arabic","ar"],["Aragonese","an"],["Armenian","hy"],["Assamese","as"],["Avaric","av"],["Avestan","ae"],["Aymara","ay"],["Azerbaijani","az"],["Bambara","bm"],["Bashkir","ba"],["Basque","eu"],["Belarusian","be"],["Bengali","bn"],["Bihari","bh"],["Bislama","bi"],["Bosnian","bs"],["Breton","br"],["Bulgarian","bg"],["Burmese","my"],["Catalan; Valencian","ca"],["Chamorro","ch"],["Chechen","ce"],["Chichewa; Chewa; Nyanja","ny"],["Chinese","zh"],["Chuvash","cv"],["Cornish","kw"],["Corsican","co"],["Cree","cr"],["Croatian","hr"],["Czech","cs"],["Danish","da"],["Divehi; Dhivehi; Maldivian;","dv"],["Dutch","nl"],["Dzongkha","dz"],["English","en"],["Esperanto","eo"],["Estonian","et"],["Ewe","ee"],["Faroese","fo"],["Fijian","fj"],["Finnish","fi"],["French","fr"],["Fula; Fulah; Pulaar; Pular","ff"],["Galician","gl"],["Georgian","ka"],["German","de"],["Greek, Modern","el"],["Guaran\u00ed","gn"],["Gujarati","gu"],["Haitian; Haitian Creole","ht"],["Hausa","ha"],["Hebrew (modern)","he"],["Herero","hz"],["Hindi","hi"],["Hiri Motu","ho"],["Hungarian","hu"],["Interlingua","ia"],["Indonesian","id"],["Interlingue","ie"],["Irish","ga"],["Igbo","ig"],["Inupiaq","ik"],["Ido","io"],["Icelandic","is"],["Italian","it"],["Inuktitut","iu"],["Japanese","ja"],["Javanese","jv"],["Kalaallisut, Greenlandic","kl"],["Kannada","kn"],["Kanuri","kr"],["Kashmiri","ks"],["Kazakh","kk"],["Khmer","km"],["Kikuyu, Gikuyu","ki"],["Kinyarwanda","rw"],["Kirghiz, Kyrgyz","ky"],["Komi","kv"],["Kongo","kg"],["Korean","ko"],["Kurdish","ku"],["Kwanyama, Kuanyama","kj"],["Latin","la"],["Luxembourgish, Letzeburgesch","lb"],["Luganda","lg"],["Limburgish, Limburgan, Limburger","li"],["Lingala","ln"],["Lao","lo"],["Lithuanian","lt"],["Luba-Katanga","lu"],["Latvian","lv"],["Manx","gv"],["Macedonian","mk"],["Malagasy","mg"],["Malay","ms"],["Malayalam","ml"],["Maltese","mt"],["M\u0101ori","mi"],["Marathi (Mar\u0101\u1e6dh\u012b)","mr"],["Marshallese","mh"],["Mongolian","mn"],["Nauru","na"],["Navajo, Navaho","nv"],["Norwegian Bokm\u00e5l","nb"],["North Ndebele","nd"],["Nepali","ne"],["Ndonga","ng"],["Norwegian Nynorsk","nn"],["Norwegian","no"],["Nuosu","ii"],["South Ndebele","nr"],["Occitan","oc"],["Ojibwe, Ojibwa","oj"],["Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic","cu"],["Oromo","om"],["Oriya","or"],["Ossetian, Ossetic","os"],["Panjabi, Punjabi","pa"],["P\u0101li","pi"],["Persian","fa"],["Polish","pl"],["Pashto, Pushto","ps"],["Portuguese","pt"],["Quechua","qu"],["Romansh","rm"],["Kirundi","rn"],["Romanian, Moldavian, Moldovan","ro"],["Russian","ru"],["Sanskrit (Sa\u1e41sk\u1e5bta)","sa"],["Sardinian","sc"],["Sindhi","sd"],["Northern Sami","se"],["Samoan","sm"],["Sango","sg"],["Serbian","sr"],["Scottish Gaelic; Gaelic","gd"],["Shona","sn"],["Sinhala, Sinhalese","si"],["Slovak","sk"],["Slovene","sl"],["Somali","so"],["Southern Sotho","st"],["Spanish; Castilian","es"],["Sundanese","su"],["Swahili","sw"],["Swati","ss"],["Swedish","sv"],["Tamil","ta"],["Telugu","te"],["Tajik","tg"],["Thai","th"],["Tigrinya","ti"],["Tibetan Standard, Tibetan, Central","bo"],["Turkmen","tk"],["Tagalog","tl"],["Tswana","tn"],["Tonga (Tonga Islands)","to"],["Turkish","tr"],["Tsonga","ts"],["Tatar","tt"],["Twi","tw"],["Tahitian","ty"],["Uighur, Uyghur","ug"],["Ukrainian","uk"],["Urdu","ur"],["Uzbek","uz"],["Venda","ve"],["Vietnamese","vi"],["Volap\u00fck","vo"],["Walloon","wa"],["Welsh","cy"],["Wolof","wo"],["Western Frisian","fy"],["Xhosa","xh"],["Yiddish","yi"],["Yoruba","yo"],["Zhuang, Chuang","za"],["Zulu","zu"]];
    var countries = [["Afghanistan","AF"],["\u00c5land Islands","AX"],["Albania","AL"],["Algeria","DZ"],["American Samoa","AS"],["Andorra","AD"],["Angola","AO"],["Anguilla","AI"],["Antarctica","AQ"],["Antigua and Barbuda","AG"],["Argentina","AR"],["Armenia","AM"],["Aruba","AW"],["Australia","AU"],["Austria","AT"],["Azerbaijan","AZ"],["Bahamas","BS"],["Bahrain","BH"],["Bangladesh","BD"],["Barbados","BB"],["Belarus","BY"],["Belgium","BE"],["Belize","BZ"],["Benin","BJ"],["Bermuda","BM"],["Bhutan","BT"],["Bolivia, Plurinational State of","BO"],["Bonaire, Sint Eustatius and Saba","BQ"],["Bosnia and Herzegovina","BA"],["Botswana","BW"],["Bouvet Island","BV"],["Brazil","BR"],["British Indian Ocean Territory","IO"],["Brunei Darussalam","BN"],["Bulgaria","BG"],["Burkina Faso","BF"],["Burundi","BI"],["Cambodia","KH"],["Cameroon","CM"],["Canada","CA"],["Cape Verde","CV"],["Cayman Islands","KY"],["Central African Republic","CF"],["Chad","TD"],["Chile","CL"],["China","CN"],["Christmas Island","CX"],["Cocos (Keeling) Islands","CC"],["Colombia","CO"],["Comoros","KM"],["Congo","CG"],["Congo, the Democratic Republic of the","CD"],["Cook Islands","CK"],["Costa Rica","CR"],["C\u00f4te d'Ivoire","CI"],["Croatia","HR"],["Cuba","CU"],["Cura\u00e7ao","CW"],["Cyprus","CY"],["Czech Republic","CZ"],["Denmark","DK"],["Djibouti","DJ"],["Dominica","DM"],["Dominican Republic","DO"],["Ecuador","EC"],["Egypt","EG"],["El Salvador","SV"],["Equatorial Guinea","GQ"],["Eritrea","ER"],["Estonia","EE"],["Ethiopia","ET"],["Falkland Islands (Malvinas)","FK"],["Faroe Islands","FO"],["Fiji","FJ"],["Finland","FI"],["France","FR"],["French Guiana","GF"],["French Polynesia","PF"],["French Southern Territories","TF"],["Gabon","GA"],["Gambia","GM"],["Georgia","GE"],["Germany","DE"],["Ghana","GH"],["Gibraltar","GI"],["Greece","GR"],["Greenland","GL"],["Grenada","GD"],["Guadeloupe","GP"],["Guam","GU"],["Guatemala","GT"],["Guernsey","GG"],["Guinea","GN"],["Guinea-Bissau","GW"],["Guyana","GY"],["Haiti","HT"],["Heard Island and McDonald Islands","HM"],["Holy See (Vatican City State)","VA"],["Honduras","HN"],["Hong Kong","HK"],["Hungary","HU"],["Iceland","IS"],["India","IN"],["Indonesia","ID"],["Iran, Islamic Republic of","IR"],["Iraq","IQ"],["Ireland","IE"],["Isle of Man","IM"],["Israel","IL"],["Italy","IT"],["Jamaica","JM"],["Japan","JP"],["Jersey","JE"],["Jordan","JO"],["Kazakhstan","KZ"],["Kenya","KE"],["Kiribati","KI"],["Korea, Democratic People's Republic of","KP"],["Korea, Republic of","KR"],["Kuwait","KW"],["Kyrgyzstan","KG"],["Lao People's Democratic Republic","LA"],["Latvia","LV"],["Lebanon","LB"],["Lesotho","LS"],["Liberia","LR"],["Libyan Arab Jamahiriya","LY"],["Liechtenstein","LI"],["Lithuania","LT"],["Luxembourg","LU"],["Macao","MO"],["Macedonia, the former Yugoslav Republic of","MK"],["Madagascar","MG"],["Malawi","MW"],["Malaysia","MY"],["Maldives","MV"],["Mali","ML"],["Malta","MT"],["Marshall Islands","MH"],["Martinique","MQ"],["Mauritania","MR"],["Mauritius","MU"],["Mayotte","YT"],["Mexico","MX"],["Micronesia, Federated States of","FM"],["Moldova, Republic of","MD"],["Monaco","MC"],["Mongolia","MN"],["Montenegro","ME"],["Montserrat","MS"],["Morocco","MA"],["Mozambique","MZ"],["Myanmar","MM"],["Namibia","NA"],["Nauru","NR"],["Nepal","NP"],["Netherlands","NL"],["New Caledonia","NC"],["New Zealand","NZ"],["Nicaragua","NI"],["Niger","NE"],["Nigeria","NG"],["Niue","NU"],["Norfolk Island","NF"],["Northern Mariana Islands","MP"],["Norway","NO"],["Oman","OM"],["Pakistan","PK"],["Palau","PW"],["Palestinian Territory, Occupied","PS"],["Panama","PA"],["Papua New Guinea","PG"],["Paraguay","PY"],["Peru","PE"],["Philippines","PH"],["Pitcairn","PN"],["Poland","PL"],["Portugal","PT"],["Puerto Rico","PR"],["Qatar","QA"],["R\u00e9union","RE"],["Romania","RO"],["Russian Federation","RU"],["Rwanda","RW"],["Saint Barth\u00e9lemy","BL"],["Saint Helena, Ascension and Tristan da Cunha","SH"],["Saint Kitts and Nevis","KN"],["Saint Lucia","LC"],["Saint Martin (French part)","MF"],["Saint Pierre and Miquelon","PM"],["Saint Vincent and the Grenadines","VC"],["Samoa","WS"],["San Marino","SM"],["Sao Tome and Principe","ST"],["Saudi Arabia","SA"],["Senegal","SN"],["Serbia","RS"],["Seychelles","SC"],["Sierra Leone","SL"],["Singapore","SG"],["Sint Maarten (Dutch part)","SX"],["Slovakia","SK"],["Slovenia","SI"],["Solomon Islands","SB"],["Somalia","SO"],["South Africa","ZA"],["South Georgia and the South Sandwich Islands","GS"],["Spain","ES"],["Sri Lanka","LK"],["Sudan","SD"],["Suriname","SR"],["Svalbard and Jan Mayen","SJ"],["Swaziland","SZ"],["Sweden","SE"],["Switzerland","CH"],["Syrian Arab Republic","SY"],["Taiwan, Province of China","TW"],["Tajikistan","TJ"],["Tanzania, United Republic of","TZ"],["Thailand","TH"],["Timor-Leste","TL"],["Togo","TG"],["Tokelau","TK"],["Tonga","TO"],["Trinidad and Tobago","TT"],["Tunisia","TN"],["Turkey","TR"],["Turkmenistan","TM"],["Turks and Caicos Islands","TC"],["Tuvalu","TV"],["Uganda","UG"],["Ukraine","UA"],["United Arab Emirates","AE"],["United Kingdom","GB"],["United States","US"],["United States Minor Outlying Islands","UM"],["Uruguay","UY"],["Uzbekistan","UZ"],["Vanuatu","VU"],["Venezuela, Bolivarian Republic of","VE"],["Viet Nam","VN"],["Virgin Islands, British","VG"],["Virgin Islands, U.S.","VI"],["Wallis and Futuna","WF"],["Western Sahara","EH"],["Yemen","YE"],["Zambia","ZM"],["Zimbabwe","ZW"]];

    /**
     *
     */
    function indexOf(value, array, property) {
        if(isEmpty(array)) {
            return -1
        }
        if(!jQuery.isArray(array)) {
            return -1
        }
        for(i in array) {
            if(isEmpty(property)) {
                if(array[i] == value) {
                    return i;
                }
            } else {
                if(array[i][property] == value) {
                    return i;
                }
            }
        };
        return -1;
    }

    /**
     *
     */
    function isEmpty(val) {
        if(val === undefined || val == null) {
            return true;
        }
        if(( typeof val) == 'string' && !val.length) {
            return true;
        }
        if(( typeof val) == 'number' && !val) {
            return true;
        }
        if(jQuery.isArray(val) && !val.length) {
            return true;
        }
        if(jQuery.isPlainObject(val) && jQuery.isEmptyObject(val)) {
            return true;
        }
        return false;
    };

    /**
     *
     */
    function getRegionName(region) {
        if(region == 'EU_W1') {
            return 'EU (Ireland)';
        } else if(region == 'US_E1') {
            return 'US (Virginia)';
        } else if(region == 'US_W1') {
            return 'US (Northen California)';
        } else if(region == 'APAC_SE1') {
            return 'Asia Pacific (Singapore)';
        } else if(region == 'APAC_NE1') {
            return 'Asia Pacific (Tokyo)';
        }
        return null;
    };

    /**
     *
     */
    function getRegionCode(region) {
        if(region == 'EU_W1') {
            return 'eu-w1';
        } else if(region == 'US_E1') {
            return 'us-e1';
        } else if(region == 'US_W1') {
            return 'us-w1';
        } else if(region == 'APAC_SE1') {
            return 'apac-se1';
        } else if(region == 'APAC_NE1') {
            return 'apac-ne1';
        }
        return null;
    };

    /**
     * 
     */
    function getRegionByCode(code) {
        if (code == 'eu-w1') {
            return 'EU_W1';
        } else if (code == 'us-e1') {
            return 'US_E1'
        } else if (code == 'us-w1') {
            return 'US_W1'
        } else if (code == 'apac-se1') {
            return 'APAC_SE1'
        } else if (code == 'apac-ne1') {
            return 'APAC_NE1'
        }
        return null;
    };

    /**
     *
     */
    function allowed(resource) {
        console.log(resource);
        if(pub.acl.admin) {
            console.log('1 true');
            return true;
        }
        if(isEmpty(pub.acl.resources)) {
            console.log('2 false');
            return false;
        }
        if(!isEmpty(pub.acl.resources[resource])) {
            console.log('3 true');
            return true;
        }
        console.log('4 false');
        return false;
    }

    var pub = {
        languages : languages,
        countries : countries,
        acl : {},
        accountType : "",
        staticRepo : "",
        repo: "",
        account: "",
        allowed : allowed,
        indexOf : indexOf,
        isEmpty : isEmpty,
        getRegionName : getRegionName,
        getRegionCode : getRegionCode,
        getRegionByCode : getRegionByCode
    };

    return pub;
}(jQuery));

/**
 *
 */
function onChangeAccount() {
    var id = $('#accounts :selected').attr("value");
    console.info('onChangeAccoun id: ' + id);
    $('#accounts :selected').attr("selected", true);
    console.info('select: ' + $('#accounts'));
    $.ajax({
        url : '/home/change?id=' + id,
        datatype : 'json',
        success : function(data, textStatus, jqXHR) {
            HB2.admin.account = id;
            window.location = "/home";
        },
        error : function(jqXHR, textStatus, errorThrown) {
            console.info(textStatus);
            console.info(errorThrown);
        }
    });
};

/**
 *
 */
function getRepoByRegion(region) {
    if(region == 'EU_W1') {
        return 'repo.eu-w1.hollybyte.com';
    } else if(region == 'US_E1') {
        return 'repo.us-e1.hollybyte.com';
    } else if(region == 'US_W1') {
        return 'repo.us-w1.hollybyte.com';
    } else if(region == 'APAC_SE1') {
        return 'repo.apac-se1.hollybyte.com';
    } else if(region == 'APAC_NE1') {
        return 'repo.apac-ne1.hollybyte.com';
    }
    return undefined;
}

function checkExtension(filename, arExtensiones) {
    // arExtensiones = new Array(".gif", ".jpg", ".doc", ".pdf");

    //recupero la extensión de este nombre de archivo
    extension = (filename.substring(filename.lastIndexOf("."))).toLowerCase();
    //alert (extension);
    //compruebo si la extensión está entre las permitidas
    permitida = false;
    for(var i = 0; i < arExtensiones.length; i++) {
        if(arExtensiones[i] == extension) {
            permitida = true;
            break;
        }
    }

    if(permitida) {
        return true;
    } else {
        return false;
    }

}

/**
 *
 */
function getRtmpsByRegion(region) {
    var rtmps = new Array();
    if(region == 'EU_W1') {
        rtmps[0] = 'rtmp1.eu.hollybyte.com';
        rtmps[1] = 'rtmp2.eu.hollybyte.com';
        rtmps[2] = 'rtmp3.eu.hollybyte.com';
    } else if(region == 'US_E1') {
        rtmps[0] = 'rtmp1.us-e1.hollybyte.com';
        rtmps[1] = 'rtmp2.us-e1.hollybyte.com';
        rtmps[2] = 'rtmp3.us-e1.hollybyte.com';
    } else if(region == 'US_W1') {
        rtmps[0] = 'rtmp1.us-w1.hollybyte.com';
        rtmps[1] = 'rtmp2.us-w1.hollybyte.com';
        rtmps[2] = 'rtmp3.us-w1.hollybyte.com';
    } else if(region == 'APAC_NE1') {
        rtmps[0] = 'rtmp1.apac-ne1.hollybyte.com';
        rtmps[1] = 'rtmp2.apac-ne1.hollybyte.com';
        rtmps[2] = 'rtmp3.apac-ne1.hollybyte.com';
    } else if(region == 'APAC_SE1') {
        rtmps[0] = 'rtmp1.apac-se1.hollybyte.com';
        rtmps[1] = 'rtmp2.apac-se1.hollybyte.com';
        rtmps[2] = 'rtmp3.apac-se1.hollybyte.com';
    }
    return rtmps;
}

/**
 *
 */
function getStreamingByRegion(region) {
    if(region == 'EU_W1') {
        return 'streaming1.eu.hollybyte.com';
    } else if(region == 'US_E1') {
        return 'streaming1.us-e1.hollybyte.com';
    } else if(region == 'US_W1') {
        return 'streaming1.us-w1.hollybyte.com';
    } else if(region == 'APAC_NE1') {
        return 'streaming1.apac-ne1.hollybyte.com';
    } else if(region == 'APAC_SE1') {
        return 'streaming1.apac-se1.hollybyte.com';
    }
    return 'undefined';
}

/*
 * 
 */
function getStreamByRegion(region) {
    if(region == 'EU_W1') {
        return 'stream.eu-w1.hollybyte.com';
    } else if(region == 'US_E1') {
        return 'stream.us-e1.hollybyte.com';
    } else if(region == 'US_W1') {
        return 'stream.us-w1.hollybyte.com';
    } else if(region == 'APAC_NE1') {
        return 'stream.apac-ne1.hollybyte.com';
    } else if(region == 'APAC_SE1') {
        return 'stream.apac-se1.hollybyte.com';
    }
    return 'undefined';
}

/*
 * 
 */
function loadVideoPlayer(obj, id) {
    if(HB2.admin.isEmpty(id)) {
        var id = "player";
    }
    console.info('player id: ' + id);
    //var repo = getRepoByRegion(obj.region);
    var repo = "hollybyte.s3.amazonaws.com";
    var stream = getStreamByRegion(obj.region);
    var ext = obj.source.path.split('.').pop();

    if(!HB2.admin.isEmpty(obj.contents)) {
        for(var i = 0; i < obj.contents.length; i++) {
            var cont = obj.contents[i];
            ext = cont.path.split('.').pop();
            if(ext == 'mp4') {
                var url = 'mp4:' + cont.path;
            }
        }
    }

    var conf = {
        "key" : '#@0b3272bb43eff43967a',
        "play" : {
            "url" : "https://" + repo + "/public/players/img/play.png",
            "width" : 78,
            "height" : 78
        },
        "clip" : {
            "autoPlay" : true,
            "autoBuffering" : true,
            "provider" : "rtmp",
            "url" : url
        },
        "plugins" : {
            "rtmp" : {
                "url" : "https://" + repo + "/public/players/flowplayer/swf/flowplayer.rtmp-3.2.3.swf",
                "netConnectionUrl" : "rtmp://" + stream + '/cfx/st'
            },
            "controls" : {
                "url" : "https://" + repo + "/public/players/flowplayer/swf/flowplayer.controls-3.2.5.swf",
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
    };
    console.log(conf);

    flowplayer(id, "https://" + repo + "/public/players/flowplayer/swf/flowplayer.commercial-3.2.7.swf", conf);

}
