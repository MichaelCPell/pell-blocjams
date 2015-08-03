 // Example Album
 var albumPicasso = {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: '/assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: '4:26' },
         { name: 'Green', length: '3:14' },
         { name: 'Red', length: '5:01' },
         { name: 'Pink', length: '3:21'},
         { name: 'Queso', length: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}
     ]
 };

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
     var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';


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

        if (currentlyPlayingSong === null) {
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
         } else if (currentlyPlayingSong === songNumber) {
             $songItem.html(playButtonTemplate);
             currentlyPlayingSong = null;
         } else if (currentlyPlayingSong !== songNumber) {
             var $currentlyPlayingSongElement = $('[data-song-number="' + currentlyPlayingSong + '"]');
             $currentlyPlayingSongElement.html(songNumber);
             $songItem.html(pauseButtonTemplate);
             currentlyPlayingSong = songNumber;
         }
     };
 
    
    
     var onHover = function(event) { 
        $songItem = $(this).find(".song-item-number");

        if ($songItem.data('song-number') !== currentlyPlayingSong) {
            $songItem.html(playButtonTemplate);
        }
    };
 
    var offHover = function(event) {
         var $leavingSongItem = $(this).find(".song-item-number");
         var leavingSongItemNumber = $leavingSongItem.data('song-number');

         if (leavingSongItemNumber !== currentlyPlayingSong) {
             $leavingSongItem.html(leavingSongItemNumber);
         }
    };
     
    $row.find('.song-item-number').click(clickHandler);
    // #2
    $row.hover(onHover, offHover);
 
    // #3
    return $row;
 
 };

var setCurrentAlbum = function(album) {
 
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
 






var currentlyPlayingSong = null;

 window.onload = function() {
     setCurrentAlbum(albumPicasso);
 };