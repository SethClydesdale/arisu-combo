define(function (require, exports, module) {
  'use strict';

  // Brackets modules
  var ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      EditorManager = brackets.getModule('editor/EditorManager'),
      _module = module;

  // Create Arisu and her combo counter
  var Arisu = $(
    '<div id="arisu-code">'+
      '<div id="combo-zone">'+
        '<div id="arisu-combo" class="good">0</div>'+
        '<div id="combo-bar"><div id="combo-bar-inner"></div></div>'+
      '</div>'+
      '<div id="cunny-zone">'+
        '<div id="arisu" class="dance-1"></div>'+
      '</div>'+
    '</div>'
  ),
      combo = 0,
      counter = null,
      arisuImg = null,
      comboBar = null;

  // Add Arisu to the editor
  $(document).ready(function() {
    $('body').append(Arisu);
    counter = document.getElementById('arisu-combo');
    arisuImg = document.getElementById('arisu');
    comboBar = document.getElementById('combo-bar');
  });

  // Show Arisu when typing and hide her after inactivity
  function showCunny() {
    Arisu.stop(true, true).fadeIn(200);
    
    // Update combo count
    ++combo
    counter.innerHTML = '<div data-combo="' + combo + '">' + combo + '</div>';
    comboBar.innerHTML = '<div id="combo-bar-inner"></div>';
    
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
    }, 5000);
    
    Arisu.data('hideTimeout', hideTimeout);
  }

  // Function for binding our cute and funny event to the editor
  function bindCunny() {
    var editor = EditorManager.getCurrentFullEditor();
    if (!editor) return;
    
    var editorElement = $(editor.getRootElement()),
        excludedKeys = [16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 80, 86, 91, 93, 145, 173, 174, 175, 176, 177, 179, 183],
        ctrlKey = false;

    // Listen for key presses
    editorElement.off('keydown.arisuCode').on('keydown.arisuCode', function (e) {
      // increase count/show arisu only when keys insert content into the editor or make a change to it's content
      if (!excludedKeys.includes(e.keyCode)) {
        showCunny();
        ctrlKey = false;
      }
      
      // ensures ctrl cmds are counted when keystrokes are in sequence instead of held (e.g. ctrl is released and V immediately pressed)
      if (e.ctrlKey) ctrlKey = true;
    });
    
    // Listen for commands that alter content
    editorElement.off('keyup.arisuCode').on('keyup.arisuCode', function (e) {
      if ((ctrlKey || e.ctrlKey) && /68|86|88|89|90/.test(e.keyCode)) {
        showCunny();
        ctrlKey = false;
      }
    });
  }

  // Whenever the active editor changes, rebind our cute and funny listener
  EditorManager.on("activeEditorChange", bindCunny);

  // Bind our cute and funny listener to the active editor
  bindCunny();
  
  // load our cute and funny styles
  ExtensionUtils.loadStyleSheet(module, "resources/styles.css");
});
