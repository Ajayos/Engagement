(function ($) {
    "use strict";
    $('.sakura-falling').sakura();
})(jQuery);

// window.onload = function() {
//     document.getElementById("my_audio").play();
// };
window.onload = function() {
    // Play the muted audio immediately on page load
    var audio = document.getElementById("my_audio");
    audio.play();
    
    // After 2 seconds, unmute the audio
    setTimeout(function() {
      audio.muted = false;  // Unmute the audio
    }, 2000); // 2000 ms = 2 seconds
  };
  