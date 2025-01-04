// 輪播
$('.slider').each(function () {
    var $this = $(this);
    var $group = $this.find('.slide_group');
    var $slides = $this.find('.slide');
    var bulletArray = [];
    var currentIndex = 0;
    var timeout;
    var isHovered = false;

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

    function move(newIndex) {
        var animateLeft, slideLeft;

        if (!isHovered) {
            advance();
        }

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
        if (!isHovered) {
            timeout = setTimeout(function () {
                if (currentIndex < ($slides.length - 1)) {
                    move(currentIndex + 1);
                } else {
                    move(0);
                }
            }, 1000);
        }
    }

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

    $.each($slides, function (index) {
        var $button = $('<a class="slide_btn">&bull;</a>');

        if (index === currentIndex) {
            $button.addClass('active');
        }
        $button.on('click', function () {
            move(index);
        }).appendTo('.slide_buttons');
        bulletArray.push($button);
    });

    advance();
});

// 箭頭寬度
const carousel = document.getElementById('carousel_project');
const arrowsWrap = document.getElementById('arrowsWrap');

function updatearrowsWrapWidth() {
    arrowsWrap.style.width = `${carousel.offsetWidth}px`;
}

// 初始化
updatearrowsWrapWidth();

// 當窗口大小改變時自動更新
window.addEventListener('resize', updatearrowsWrapWidth);