define(function (require, exports, module) {
  'use strict';

  // Brackets modules
  var FileUtils = brackets.getModule('file/FileUtils'),
      ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      EditorManager = brackets.getModule('editor/EditorManager'),
      _module = module;

  // Create Arisu and her combo counter
  var Arisu = $(
    '<div id="arisu-code">'+
      '<div id="combo-zone">'+
        '<span id="arisu-combo" class="good">0</span>'+
      '</div>'+
      '<div id="cunny-zone">'+
        '<div id="arisu" class="dance-1"></div>'+
      '</div>'+
    '</div>'
  ),
      combo = 0,
      counter = null,
      arisuImg = null;

  // Add Arisu to the editor
  $(document).ready(function() {
    $('body').append(Arisu);
    counter = document.getElementById('arisu-combo');
    arisuImg = document.getElementById('arisu');
  });

  // Show Arisu when typing and hide her after inactivity
  function showCunny() {
    Arisu.stop(true, true).fadeIn(200);
    
    // Update combo count
    counter.innerText = ++combo;
    
    // Change arisu image based on combo count
    if (combo >= 100 && !/dance-4/.test(arisuImg.className)) {
      arisuImg.className = 'dance-4';
      counter.className = 'super';
    } 
    
    else if (combo >= 50 && combo < 100 && !/dance-3/.test(arisuImg.className)) {
      arisuImg.className = 'dance-3';
      counter.className = 'great';
    }
    
    else if (combo >= 25 && combo < 50 && !/dance-2/.test(arisuImg.className)) {
      arisuImg.className = 'dance-2';
    }

    // Clear previous timeouts to prevent Arisu from disappearing prematurely
    clearTimeout(Arisu.data('hideTimeout'));

    // Timeout for hiding Arisu and resetting the combo when not typing
    var hideTimeout = setTimeout(function() {
      Arisu.fadeOut(500, function () {
        combo = 0;
        counter.className = 'good';
        arisuImg.className = 'dance-1';
      });
    }, 3000);
    
    Arisu.data("hideTimeout", hideTimeout);
  }

  // Function for binding our cute and funny event to the editor
  function bindCunny() {
    var editor = EditorManager.getCurrentFullEditor();
    if (!editor) return;
    
    var editorElement = $(editor.getRootElement());

    // Remove any previous listener to avoid duplicates.
    editorElement.off("keyup.arisuCode").on("keyup.arisuCode", function () {
      showCunny();
    });
  }

  // Whenever the active editor changes, rebind our cute and funny listener
  EditorManager.on("activeEditorChange", bindCunny);

  // Bind our cute and funny listener to the active editor
  bindCunny();
  
  // load our cute and funny styles
  ExtensionUtils.loadStyleSheet(module, "resources/styles.css");
});
