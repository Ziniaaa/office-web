// 首頁輪播套件配置
var timelineSwiper = new Swiper('.timeline .swiper-container', {
    direction: 'vertical',
    loop: false,
    speed: 1600,
    // Swiper 3.4.2 的自動播放設置
    autoplay: 5000, // 設置停留時間為 5 秒
    autoplayDisableOnInteraction: false,
    pagination: '.swiper-pagination',
    paginationClickable: true,
    paginationBulletRender: function (swiper, index, className) {
        var num = document.querySelectorAll('.swiper-slide')[index].getAttribute('data-num');
        return '<span class="' + className + '">' + num + '</span>';
    },
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    breakpoints: {
        768: {
            direction: 'horizontal',
        }
    }
});

// 為活動的幻燈片添加動畫
timelineSwiper.on('slideChangeStart', function () {
    var activeSlide = document.querySelectorAll('.swiper-slide')[this.activeIndex];
    if (activeSlide) {
        activeSlide.classList.add('swiper-slide-active');
    }
});