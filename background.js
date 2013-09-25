chrome.contextMenus.create({
  "title" : "Add to John VanOrange",
  "type" : "normal",
  "contexts" : ["image"],
  "onclick" : addImage()
});

var notMap = [];

function addImage() {
	return function(info) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://johnvanorange.com/api/image/addFromURL", true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var resp = JSON.parse(xhr.responseText);
				if (resp.error) {
					var opt = {
						type: "basic",
						title: "Error",
						message: resp.message,
						iconUrl: "icons/128.png"
					}
					chrome.notifications.create('', opt, function(){})
				}
				else {
					var opt = {
						type: "image",
						title: resp.message,
						message: '',
						iconUrl: "icons/128.png",
						imageUrl: resp.image,
						buttons: [
							{
								title: 'View image'
							}
						]
					}
					chrome.notifications.create('', opt, function(id){
						notMap[id] = resp.url;
					})
				}
			}
		}
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send('url=' + info.srcUrl);
	}
}

chrome.notifications.onButtonClicked.addListener(function(id, btn) {
	chrome.tabs.create({url: notMap[id]});
});