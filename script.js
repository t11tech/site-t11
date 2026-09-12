(function(){
  var track = document.querySelector('#heroCarousel .carousel-track');
  var dots = document.querySelectorAll('#heroCarousel .dot');
  var prevBtn = document.querySelector('#heroCarousel .carousel-arrow.prev');
  var nextBtn = document.querySelector('#heroCarousel .carousel-arrow.next');
  var total = dots.length;
  var index = 0;
  var timer;
  var startX = 0;
  var currentX = 0;
  var isDragging = false;
  var width = track.parentElement.getBoundingClientRect().width;

  function goTo(i){
    index = (i + total) % total;
    track.style.opacity = '0.55';
    window.setTimeout(function(){
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      track.style.opacity = '1';
    }, 20);
    dots.forEach(function(d){ d.classList.remove('active'); });
    dots[index].classList.add('active');
  }

  function startAutoplay(){
    clearInterval(timer);
    timer = setInterval(function(){ goTo(index + 1); }, 2700);
  }

  dots.forEach(function(d, i){
    d.addEventListener('click', function(){
      goTo(i);
      startAutoplay();
    });
  });

  if(prevBtn) prevBtn.addEventListener('click', function(){ goTo(index - 1); startAutoplay(); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ goTo(index + 1); startAutoplay(); });

  function onDragStart(x){
    isDragging = true;
    startX = x;
    currentX = x;
    width = track.parentElement.getBoundingClientRect().width;
    track.classList.add('dragging');
    clearInterval(timer);
  }
  function onDragMove(x){
    if(!isDragging) return;
    currentX = x;
    var delta = currentX - startX;
    var percent = (delta / width) * 100;
    track.style.transform = 'translateX(calc(' + (-index * 100) + '% + ' + delta + 'px))';
  }
  function onDragEnd(){
    if(!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    var delta = currentX - startX;
    if(Math.abs(delta) > width * 0.15){
      goTo(delta < 0 ? index + 1 : index - 1);
    } else {
      goTo(index);
    }
    startAutoplay();
  }

  track.addEventListener('mousedown', function(e){ onDragStart(e.clientX); });
  window.addEventListener('mousemove', function(e){ onDragMove(e.clientX); });
  window.addEventListener('mouseup', onDragEnd);

  track.addEventListener('touchstart', function(e){ onDragStart(e.touches[0].clientX); }, {passive:true});
  track.addEventListener('touchmove', function(e){ onDragMove(e.touches[0].clientX); }, {passive:true});
  track.addEventListener('touchend', onDragEnd);

  startAutoplay();
})();

(function(){
  var items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  items.forEach(function(el){ observer.observe(el); });
})();

(function(){
  var hint = document.querySelector('.scroll-hint');
  if(!hint) return;
  function updateHint(){
    var scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    var viewport = window.innerHeight;
    var full = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var distanceToBottom = full - (scrollY + viewport);
    hint.classList.toggle('is-hidden', distanceToBottom < 80);
  }
  window.addEventListener('scroll', updateHint, {passive:true});
  window.addEventListener('resize', updateHint);
  updateHint();
  setInterval(updateHint, 500);
})();

(function(){
  var nav = document.querySelector('.subnav-inner');
  var fade = document.querySelector('.subnav-fade');
  if(!nav || !fade) return;
  function updateFade(){
    var atEnd = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4;
    var scrollable = nav.scrollWidth > nav.clientWidth + 4;
    fade.classList.toggle('is-hidden', atEnd || !scrollable);
  }
  nav.addEventListener('scroll', updateFade, {passive:true});
  window.addEventListener('resize', updateFade);
  updateFade();
})();
