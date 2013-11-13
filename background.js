
/*
 * Чтобы комментарии всегда были в простом стиле:
 * http://www.livejournal.com/customize/options.bml
 * Disable customized comment pages for your journal
 */

function _hasParamValue( url, parampair )
{
	re = "[\\?&]"+parampair+"([&#]|$)";
	return url.search(re) != -1;
};

function _removeParam( url, paraname )
{
	//	http://stackoverflow.com/questions/1842681/regular-expression-to-remove-one-parameter-from-query-string
	//	/&foo(\=[^&]*)?(?=&|$)|^foo(\=[^&]*)?(&|$)/
	//re = "&"+paraname+"(\\=[^&]*)?(?=&|$)|^"+paraname+"(\\=[^&]*)?(&|$)";
	// удаляем параметр и предыдущий перед ним & если он есть
	//return url.replace(new RegExp(re,'g'),'');
	var urlparts = url.split('?');
	if (urlparts.length>=2)
	{
		var right = urlparts[1];
		re = "&"+paraname+"(\\=[^&#]*)?(?=&|$|#)|^"+paraname+"(\\=[^&#]*)?(&|$|#)";
		right = right.replace(new RegExp(re,'g'),'');
		url= urlparts[0]+( (right.length>0) ? ('?'+right) : '' );
	}
	return url;
};

function _addParamValue( url, parampair )
{
	var v = url.indexOf('?');
	if( v != -1 )
	{
		url = url.substr(0,v+1) + parampair + "&" + url.substr(v+1);
	}
	else
	{
		var r = url.indexOf('#');
		if( r != -1 )
		{
			url = url.substr(0,r) + '?' + parampair + '&' + url.substr(r);
		}
		else
		{
			url = url + '?' + parampair + '&';
		}
	}
	return url;
};

function onTabsUpdated(tabId, changeInfo, tab)
{
	//chrome.extension.getBackgroundPage().console.log("tabId="+tabId);
	// alert("tabId="+tabId+" | changeInfo.status="+changeInfo.status+" | changeInfo.pinned="+changeInfo.pinned+" | changeInfo.url="+changeInfo.url);
	// tabId=529 | changeInfo.status=loading | changeInfo.pinned=undefined | changeInfo.url=undefined
	// tabId=529 | changeInfo.status=complete | changeInfo.pinned=undefined | changeInfo.url=undefined
	// сразу проверяем надо ли что-нибудь делать TODO использовать changeInfo?
	if ( changeInfo.status=="loading" && tab.url.indexOf('livejournal.com') > -1 )
	{
		//alert("tabId="+tabId+" | changeInfo.status="+changeInfo.status+" | changeInfo.pinned="+changeInfo.pinned+" | changeInfo.url="+changeInfo.url);
		// style=mine&
		// format=light&
		// http://XXXX.livejournal.com/YYYYYY.html
		// http://users.livejournal.com/XXXX/YYYYYY.html
		re = /http\:\/\/.+\.livejournal\.com\/\d+\.html|http\:\/\/users\.livejournal\.com\/.+\/\d+\.html/
		if( tab.url.match(re) )
		{
			if( !_hasParamValue( tab.url, 'style=mine' ) )
			{
				var oldurl = tab.url;
				tab.url = _removeParam( tab.url, 'style' );
				tab.url = _removeParam( tab.url, 'format' );
				tab.url = _addParamValue( tab.url, 'style=mine' );
				// обновляемъ адрес
				chrome.tabs.update(tab.id,{url: tab.url});
				// удаляем из истории TODO
				//alert(oldurl);
				//chrome.history.deleteUrl({url: oldurl}, function() {alert('deleteUrl');});
				//alert(tab.url);
			}
			// показываем иконку в любом случае
			chrome.pageAction.show(tabId);
		}
	}
  //chrome.pageAction.setIcon.
  //chrome.pageAction.setTitle.
  //chrome.pageAction.setPopup.
  //
};


// tabs updated
chrome.tabs.onUpdated.addListener(onTabsUpdated);


var testnum = 0;
function _test( a, b )
{
	++testnum;
	if(a!==b)alert(a+"\n"+b+"\ntest "+testnum);
}

function _runtests()
{
	// _hasParamValue
	_test( _hasParamValue( "YYYYYY.html?style=mine", "style=mine" ), true );
	_test( _hasParamValue( "YYYYYY.html", "style=mine" ), false );
	_test( _hasParamValue( "YYYYYY.html?style=хуй", "style=mine" ), false );
	_test( _hasParamValue( "YYYYYY.html?style=хуй&style=mine&style=хуй", "style=mine" ), true );
	_test( _hasParamValue( "YYYYYY.html?style=хуй&sssstyle=mine&style=хуй", "style=mine" ), false );
	_test( _hasParamValue( "YYYYYY.html?style=хуй&style=mineT&style=хуй", "style=mine" ), false );
	_test( _hasParamValue( "YYYYYY.html?style=хуй&style=mine&style=mine&style=хуй", "style=mine" ), true );
	_test( _hasParamValue( "YYYYYY.html?style=хуй&style=mineT&style=mine&style=хуй", "style=mine" ), true );
	_test( _hasParamValue( "YYYYYY.html?style=хуй&ssstyle=mine&style=mine&style=хуй", "style=mine" ), true );
	// _removeParam
	_test( _removeParam( "YYYYYY.html?format=хуй&style=mine&format=хуй", "style" ), "YYYYYY.html?format=хуй&format=хуй" );
	_test( _removeParam( "YYYYYY.html?format=хуй&style=mine", "style" ), "YYYYYY.html?format=хуй" );
	_test( _removeParam( "YYYYYY.html?style=mine", "style" ), "YYYYYY.html" );
	_test( _removeParam( "YYYYYY.html?style=mine&format=хуй", "style" ), "YYYYYY.html?format=хуй" );
	_test( _removeParam( "YYYYYY.html?style=mine&format=хуй&style=mineT", "style" ), "YYYYYY.html?format=хуй" );
	_test( _removeParam( "YYYYYY.html?format=хуй&ssstyle=mine", "style" ), "YYYYYY.html?format=хуй&ssstyle=mine" );
	_test( _removeParam( "YYYYYY.html?format=хуй&style&format=хуй", "style" ), "YYYYYY.html?format=хуй&format=хуй" );
	_test( _removeParam( "YYYYYY.html?style", "style" ), "YYYYYY.html" );
	_test( _removeParam( "YYYYYY.html", "style" ), "YYYYYY.html" );
	_test( _removeParam( "YYYYYY.html?mode=reply&style=mine#add_comment", "style" ), "YYYYYY.html?mode=reply#add_comment" );
	// _addParamValue
	_test( _addParamValue( "YYYYYY.html", "style=mine" ), "YYYYYY.html?style=mine&" );
	_test( _addParamValue( "YYYYYY.html?", "style=mine" ), "YYYYYY.html?style=mine&" );
	_test( _addParamValue( "YYYYYY.html?&", "style=mine" ), "YYYYYY.html?style=mine&&" );
	_test( _addParamValue( "YYYYYY.html?style=mine", "style=mine" ), "YYYYYY.html?style=mine&style=mine" );
	_test( _addParamValue( "YYYYYY.html?style", "style=mine" ), "YYYYYY.html?style=mine&style" );
	_test( _addParamValue( "YYYYYY.html?style=mine#хуй", "style=mine" ), "YYYYYY.html?style=mine&style=mine#хуй" );
	_test( _addParamValue( "YYYYYY.html#хуй", "style=mine" ), "YYYYYY.html?style=mine&#хуй" );
};

_runtests();
