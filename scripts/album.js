var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.left-controls .previous');
var $nextButton = $('.left-controls .next');




var createSongRow = function(songNumber, songName, songLength) {
     
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
    var $row = $(template);
     
    

     var clickHandler = function() {
        var $songItem = $(this)
         
        var songNumber = $songItem.data('song-number');

        if (currentSongFromAlbum === null){
            $songItem.html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
         }
         
         if (currentlyPlayingSongNumber === songNumber) {
         
             if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
         } 
         
         if (currentlyPlayingSongNumber !== songNumber) {
             var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSongNumber + '"]');
             $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
             $songItem.html(pauseButtonTemplate);
             setSong(songNumber);
             updatePlayerBarSong();
             currentSoundFile.play();
             
             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});

         }
     };
 
    
    
     var onHover = function(event) { 
        $songItem = $(this).find(".song-item-number");

        if ($songItem.data('song-number') !== currentlyPlayingSongNumber) {
            $songItem.html(playButtonTemplate);
        }
    };
 
    var offHover = function(event) {
         var $leavingSongItem = $(this).find(".song-item-number");
         var leavingSongItemNumber = $leavingSongItem.data('song-number');

         if (leavingSongItemNumber !== currentlyPlayingSongNumber) {
             $leavingSongItem.html(leavingSongItemNumber);
         }
    };
     
    $row.find('.song-item-number').click(clickHandler);
    // #2
    $row.hover(onHover, offHover);
 
    // #3
    return $row;
 
 };

var filterTimeCode = function(timeInSeconds){
    var minutes = Math.floor(timeInSeconds/60)
    var seconds = Math.floor(timeInSeconds % 60)
    
    return minutes + ":" + seconds;
}

var nextSong = function() {
    currentSoundFile.play();
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    currentSoundFile.play();
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
  
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};


    

var setCurrentAlbum = function(album) {
    currentAlbum = album;

     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
       $albumSongList.empty();
 
     // #4
     for (i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
     }
 
 };
 
var setCurrentTimeInPlayerBar = function(currentTime){
    $(".current-time").text(filterTimeCode(currentTime));
}

var setupSeekBars = function() {

    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #1
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #2
        var seekBarFillRatio = offsetX / barWidth;

        // #3
        updateSeekPercentage($(this), seekBarFillRatio);
    });


    $seekBars.find('.thumb').mousedown(function(event) {
        // #2
        var $seekBar = $(this).parent();

        // #3
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        // #4
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });

    });    
    
    
    
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }

        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {

        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    });
}

var setSong = function(number){
    
   if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = number;

    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // #2
        formats: [ 'mp3' ],
        preload: true
    });
    updateSeekBarWhileSongPlays();
    
     setVolume(currentVolume);
}

var setTotalTimeInPlayerBar = function(time){
    $(".total-time").text(filterTimeCode(time))
}

var setVolume = function(volume) {

    if (currentSoundFile) {
     currentSoundFile.setVolume(volume);
    }

};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function(){
     if (currentSoundFile.isPaused()) {
        $(".album-song-button").replaceWith(pauseButtonTemplate);
        $('.left-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
    } else {
        $(".album-song-button").replaceWith(playButtonTemplate);
        $('.left-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();   
    }
}

var trackIndex = function(album, song) {
 return album.songs.indexOf(song);
};

var updatePlayerBarSong = function(){
    currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber-1]
    $(".song-name").html(currentSongFromAlbum.name);
    $(".artist-name").html(currentAlbum.artist);
    $('.left-controls .play-pause').html(playerBarPauseButton);
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        // #1
        currentSoundFile.bind('timeupdate', function(event) {
            // #2
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            setCurrentTimeInPlayerBar(this.getTime());
            setTotalTimeInPlayerBar(this.getDuration());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
 
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
 
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 
 }
 
 var seek = function(time) {
   
   if (currentSoundFile) {
       currentSoundFile.setTime(time);
   }
   
 }


    
    
    


    
window.onload = function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
     
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
     
    $('.left-controls .play-pause').click(function(){
        togglePlayFromPlayerBar()
    });
};
    
    