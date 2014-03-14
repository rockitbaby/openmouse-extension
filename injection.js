var OpenMouse = {};

(function($) {
  
	if(window.location.href.indexOf(OpenMouseSettings.url) == 7) {
		return;
	}
	
  var server = 'http://' + OpenMouseSettings.proxyUrl + '/logentries/';
  var id = null;
  var start = null;
  
  /**
  * UI
  */
  $om = $;
  function ui() {
    
    var ui = '<div id="openmouse"> \
      <div id="openmouse-logo">OPENMOUSE</div> \
    </div>';
    
    $('body').append(ui);
    $om = $('body').find('#openmouse');
    $om.hover(function() {
      $om.hide();
      window.setTimeout(function() {
        $om.show();
      }, 2000);
    })
  }
  
  ui();
  
  /**
  * Register Website
  */
  function ready() {
    
    start = new Date().getTime();
    
    function success(data) {
      if(!data) {
        error();
        return;
      }
      id = data.id;
      $om.addClass('om-attention');
      window.setTimeout(function() {
        $om.removeClass('om-attention');
      }, 1000);
    };

    function error() {
      $om.addClass('om-error');
      window.setTimeout(function() {
        $om.removeClass('om-error');
      }, 1000);
    }
    
    var data = {
      'event': 'website',
      'value': window.location.href
    }
    chrome.extension.sendRequest({
      action: '$.ajax',
      url: server + 'add',
      params: {
        data: data,
        dataType: 'json'
      }
    }, success);
    
    
  }
  ready();
  
  /**
  * Send Data
  */
  
  function finished() {

    if(!id) {
      return;
    }

    var time = new Date().getTime() - start;
    var title = document.title;

    var data = {
      'id': id,
      'data': {
        'time': time,
        'imgs' : imgs,
        'title' : title
      }
    }
    function success(data) {

    };
    chrome.extension.sendRequest({
      action: '$.ajax',
      url: server + 'data/' + id,
      params: {
        data: data,
        type: 'POST',
        dataType: 'json'
      }
    }, success);

  }
  $(window).unload(finished);
  

  /**
  * Debug
  */
  $('body').click(function(e) {
    var time = new Date().getTime() - start;
  });
  
  /**
  * collect images // hover > 500ms
  */
  var imgs = [];
  var lastImg = '';
  var currentImg = null;
  var currentImgEnteredOn = null;
  $('img').mouseenter(function(e) {
    if($(this).data('originalsrc')) {
      currentImg = $(this).data('originalsrc');
    } else {
      currentImg = $(this).attr('src');
    }
    currentImgEnteredOn = new Date().getTime();
  });
  
  $('img').mouseleave(function(e) {
    if($(this).data('originalsrc')) {
      src = $(this).data('originalsrc');
    } else {
      src = $(this).attr('src');
    }
    if(currentImg == src && (new Date().getTime() - currentImgEnteredOn) > 500) {
      var i = new Image();
      i.src = src;
      if(i.src != lastImg) {
        imgs.push(i.src);
        lastImg = i.src;
      }
    }
    currentImg = null;
    currentImgEnteredOn = null;
  });
  
  /**
  * Messure Time
  */
  var pauseStartTime = null;
  function pauseStart() {
    pauseStartTime = new Date().getTime();
    //$('body').fadeTo(400, 0.2);
  }
  
  function pauseStop() {
    if(pauseStartTime == null) {
      return;
    }
    
    pauseTime = new Date().getTime() - pauseStartTime;
    start += pauseTime;
    pauseStartTime = null;
    //$('body').fadeTo(200, 1);
  }
  
  $(window).blur(function(e) {
    pauseStart();
  });
  
  $(window).focus(function(e) {
    pauseStop();
  });

}(jQuery));