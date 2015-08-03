 var pointsArray = document.getElementsByClassName('point');
 
 var animatePoints = function(points) {

     
    var revealFirstPoint = function(node) {
         node.style.opacity = 1;
         node.style.transform = "scaleX(1) translateY(0)";
         node.style.msTransform = "scaleX(1) translateY(0)";
         node.style.WebkitTransform = "scaleX(1) translateY(0)";   
     };

    forEach(points, revealFirstPoint);

 };

 window.onload = function() {
     
    if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }

     window.addEventListener('scroll', function(event) {
         if (pointsArray[0].getBoundingClientRect().top <= 500) {
             animatePoints(pointsArray);
         }
     });

 }