
function addHref(text,regexStr,keys,values) {

    regexStr = regexStr.replace(/([^|]+)/gm,"$1\\s*-\\s*\\d{1,5}");
    regexStr = "(" + regexStr + ")";
    var regex = new RegExp( regexStr ,"gm");

    return replaceProcessor("tag",regex,text);

    function getHrefPrefix(match) {
/*        var key = match.substring(0,match.indexOf("-"));
         for ( var i = 0; i < keys.length; i++){
            if ( keys[i] == key){
                return values[i];
            }
        } */
        return "http://support.grantstreet.com/browse/";
    }
    function replaceProcessor(seperatorType,targetRegex,text) {
        var urlPatten = /https?:\/\/[^<> ()]+|www.[^<> ()]*/gm;
        var tagPatten = /<[^>]*[^<]*>/gm;
        var seperatorRegex;
        var result = new Array();
        var targetStr ;
        var subResult ;
        var lastLocation = 0;

        if(seperatorType != "null" ) {
            if ( seperatorType == "tag"){
                seperatorRegex = tagPatten;
            }else {
                seperatorRegex = urlPatten;
            }
            var matches = seperatorRegex.exec(text);
            while (matches != null){
                targetStr = text.substring(lastLocation,matches.index);
                if (targetStr.length != 0){
                    if ( seperatorType == "tag"){
                        subResult = replaceProcessor("url",targetRegex,targetStr);
                    }else {
                        subResult = replaceProcessor("null",targetRegex,targetStr);
                    }
                    result += subResult;
                }
                result +=  matches[0];
                lastLocation = seperatorRegex.lastIndex;
                matches = seperatorRegex.exec(text);
            }
        }

        targetStr = text.substring(lastLocation);
        if ( seperatorType == "tag"){
            subResult = replaceProcessor("url",targetRegex,targetStr);
        }else if (seperatorType == "url"){
            subResult = replaceProcessor("null",targetRegex,targetStr);
        }else {
            subResult = targetStr.replace(regex,function (match) {
                return "<a href=\"" + getHrefPrefix(match) + match + "\">" + match + "</a>";
            });
        }

        return result + subResult;
    }
}
function link_to_jira(text) {
     var siteSettings = Discourse.SiteSettings;
    
     if (siteSettings.abbreviations_plugin_enabled) {
         var list = siteSettings.abbreviations_plugin_list;
    var regexStr = new String();
    var keys = new Array();
    var values = new Array();
    var start;
    list.trim().split("|").map(function(schema) {
        start = schema.indexOf(":");
        keys.push(schema.substring(0,start));
        values.push(schema.substring(start + 1, schema.length));
        regexStr += schema.substring(0,start) + "|";
    });
    regexStr = regexStr.substring(0,regexStr.length - 1) ;
    return addHref(text,regexStr,keys,values);

     }
}
