$('.carousel__list').slick({
  dots: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  autoplay: true,
  prevArrow: '<svg class="carousel__arrow carousel__arrow--left"><use xlink:href="./icons/sprite.svg#arrow"></use></svg>',
  nextArrow: '<svg class="carousel__arrow carousel__arrow--right"><use xlink:href="./icons/sprite.svg#arrow"></use></svg>',
  responsive: [{
    breakpoint: 1200,
    settings: {
      slidesToShow: 1,
      infinite: true,
      arrows: false,
      dots: true,
      dotsClass: 'carousel__dot'
    }
  }]
});