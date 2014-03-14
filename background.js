function onRequest(request, sender, callback) {

  console.log(request);
  // map action request from page innjected script
  var action = request.action || null;
  if (request.action == '$.ajax') {

    request.params.success = function(data) {
      callback(data);
    }
    request.params.error = function(data, txt) {
      console.log(data);
      console.error(txt);
      callback(null);
    }
    $.ajax(request.url, request.params);
    return;
  }

  console.error('Unsupported Action: ' + action);

}
chrome.extension.onRequest.addListener(onRequest);
console.info("OPENMOUSE Background Jobs up and running");