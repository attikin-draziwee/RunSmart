$('.catalog__more').on('click', e => {
  const parent = e.target.parentNode;
  e.preventDefault();
  $(parent).addClass('dn');
  $(parent).next().removeClass('dn');
});
$('.catalog__info').on('click', e => {
  const parent = e.target.parentNode;
  e.preventDefault();
  $(parent).addClass('dn');
  $(parent).prev().removeClass('dn');
});

$('.catalog__tab').on('click', e => {
  const dataList = $(e.currentTarget).data('list');
  $(`.catalog__tab:not([data-list='${dataList}'])`).removeClass('catalog__tab--active');
  $(e.currentTarget).addClass('catalog__tab--active');
  $('.catalog__list').removeClass('catalog__list--active');
  $('.catalog__list').each((ind, el) => {
    if ($(el).data('list') == dataList) {
      $(el).addClass('catalog__list--active');
    }
  });
});