// 輪播功能
function initializeCarousel($slider) {
    var $group = $slider.find('.slide_group');
    var $slides = $slider.find('.slide');
    var bulletArray = [];
    var currentIndex = 0;
    var timeout;

    // 滑鼠熱點功能
    // 添加tooltip文字方塊的HTML
    const tooltipHTML = `
<div class="tooltip" style="display: none; position: fixed; padding: 8px; background: white; border: 1px solid #ccc; pointer-events: none;">
    <span class="tooltip-text"></span>
</div>
`;
    $('body').append(tooltipHTML);
    const $tooltip = $('.tooltip');

    // 定義每張圖片的熱點區域和對應文字
    const hotspots = {
        0: [ // 第一張圖片
            { area: { x1: 0, y1: 0, x2: 200, y2: 200 }, text: 'a文字' },
            { area: { x1: 200, y1: 200, x2: 400, y2: 400 }, text: 'b文字' }
        ],
        1: [ // 第二張圖片
            { area: { x1: 100, y1: 100, x2: 300, y2: 300 }, text: 'c文字' }
        ]
    };
    // 滑鼠移動出現tooltip事件處理
    $slides.on('mousemove', function (e) {
        const slideIndex = $(this).index();
        if (!hotspots[slideIndex]) return;

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 檢查是否在任何熱點區域內
        const activeHotspot = hotspots[slideIndex].find(hotspot => {
            return x >= hotspot.area.x1 && x <= hotspot.area.x2 &&
                y >= hotspot.area.y1 && y <= hotspot.area.y2;
        });

        if (activeHotspot) {
            $tooltip.show()
                .css({
                    left: e.pageX + 15,
                    top: e.pageY + 15
                })
                .find('.tooltip-text')
                .text(activeHotspot.text);
        } else {
            $tooltip.hide();
        }
    });

    // 為每個輪播創建獨立的導航點容器
    var $slideButtons = $('<div class="slide_buttons"></div>');
    $slider.append($slideButtons);


    // 滑鼠移入停止播放
    $slides.on('mouseenter', function (e) {
        isHovered = true;
        clearTimeout(timeout); // 停止自動播放
    });

    $slides.on('mouseleave', function (e) {
        isHovered = false;
        // $tooltip.hide();
        advance(); // 恢復自動播放
    });

    // slide動作
    function move(newIndex) {
        var animateLeft, slideLeft;

        advance();

        if ($group.is(':animated') || currentIndex === newIndex) {
            return;
        }

        bulletArray[currentIndex].removeClass('active');
        bulletArray[newIndex].addClass('active');

        if (newIndex > currentIndex) {
            slideLeft = '100%';
            animateLeft = '-100%';
        } else {
            slideLeft = '-100%';
            animateLeft = '100%';
        }

        $slides.eq(newIndex).css({
            display: 'block',
            left: slideLeft
        });
        $group.animate({
            left: animateLeft
        }, function () {
            $slides.eq(currentIndex).css({
                display: 'none'
            });
            $slides.eq(newIndex).css({
                left: 0
            });
            $group.css({
                left: 0
            });
            currentIndex = newIndex;
        });
    }

    function advance() {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (currentIndex < ($slides.length - 1)) {
                move(currentIndex + 1);
            } else {
                move(0);
            }
        }, 4000);
    }

    // 前進/後退按鈕
    $('.next_btn').on('click', function () {
        if (currentIndex < ($slides.length - 1)) {
            move(currentIndex + 1);
        } else {
            move(0);
        }
    });

    $('.previous_btn').on('click', function () {
        if (currentIndex !== 0) {
            move(currentIndex - 1);
        } else {
            move($slides.length - 1);
        }
    });

    
    // 為每個輪播創建導航點
    $.each($slides, function (index) {
        var $button = $('<a class="slide_btn">&bull;</a>');

        if (index === currentIndex) {
            $button.addClass('active');
        }
        $button.on('click', function () {
            move(index);
        }).appendTo($slideButtons);
        bulletArray.push($button);
    });

    advance();
}

// 頁面載入時初始化所有輪播
$(document).ready(function () {
    // 為每個 row1-1 和 row1-2 中的輪播分別初始化
    $('.row1-1 .slider, .row1-2 .slider').each(function () {
        initializeCarousel($(this));
    });
});

// 箭頭寬度調整
function updateArrowsWidth() {
    $('.carousel').each(function () {
        var $carousel = $(this);
        var $arrowsWrap = $carousel.find('.directional_nav');
        $arrowsWrap.css('width', $carousel.width() + 'px');
    });
}

// 初始化箭頭寬度
$(document).ready(function () {
    updateArrowsWidth();
    // 當窗口大小改變時更新箭頭寬度
    $(window).on('resize', updateArrowsWidth);
});













// 切換案件頁面功能
$(document).ready(function () {
    // 設置初始狀態
    const $contents = $('.row1 > div');
    let currentIndex = 0;
    let isAnimating = false;

    // 初始化：為第一個內容設置 show class，其他設為 wait-right
    $contents.first().addClass('show');
    $contents.not(':first').addClass('wait-right');

    // 為列表項目加上 data-index 屬性
    $('.project-list li').each(function (index) {
        $(this).attr('data-index', index);
    }).first().addClass('active');

    // 點擊處理函數
    $('.project-list li').click(function () {
        if (isAnimating) return; // 如果正在動畫中，忽略點擊

        const newIndex = parseInt($(this).attr('data-index'));
        if (newIndex === currentIndex) return; // 如果點擊當前項目，不做任何事

        isAnimating = true;

        // 更新列表項目狀態
        $('.project-list li').removeClass('active');
        $(this).addClass('active');

        const $current = $contents.eq(currentIndex);
        const $next = $contents.eq(newIndex);

        // 決定滑動方向
        if (newIndex > currentIndex) {
            // 向左滑動
            $next.removeClass('hide-left wait-right').addClass('wait-right');
            setTimeout(() => {
                $current.addClass('hide-left').removeClass('show');
                $next.addClass('show').removeClass('wait-right');
            }, 50);
        } else {
            // 向右滑動
            $next.removeClass('hide-left wait-right').addClass('hide-left');
            setTimeout(() => {
                $current.addClass('wait-right').removeClass('show');
                $next.addClass('show').removeClass('hide-left');
            }, 50);
        }

        // 動畫完成後重置狀態
        setTimeout(() => {
            isAnimating = false;
            currentIndex = newIndex;
        }, 500); // 與 CSS transition 時間相同
    });
})


