// -------------設定和常數-------------
// carousel圖片熱點位置
const hotspotsConfig = {
    'row1-1': {
        0: [
            {
                area: { xStart: 20, yStart: 55, xEnd: 40, yEnd: 75 },
                text: '排柵支撐提供穩固防震力'
            },
            {
                area: { xStart: 50, yStart: 27, xEnd: 70, yEnd: 47 },
                text: '弧形造型與間接光源，擴展空間感'
            }
        ],
        // 1: [
        //     {
        //         area: { xStart: 30, yStart: 30, xEnd: 50, yEnd: 50 },
        //         text: 'B區域文字'
        //     }
        // ]
    },
    'row1-2': {
        0: [
            {
                area: { xStart: 13, yStart: 34, xEnd: 33, yEnd: 54 },
                text: '陽台側面簍空，改善通風'
            },
            {
                area: { xStart: 70, yStart: 30, xEnd: 80, yEnd: 65 },
                text: '內凹溝槽加速壁面排水'
            }
        ],
        // 1: [
        //     {
        //         area: { xStart: 30, yStart: 30, xEnd: 50, yEnd: 50 },
        //         text: 'D區域文字'
        //     }
        // ]
    },
    'row1-3': {
        0: [
            {
                area: { xStart: 20, yStart: 30, xEnd: 40, yEnd: 50 },
                text: '交差結構以利陽光折射，增加室內自然光線'
            }
        ],
        // 1: [
        //     {
        //         area: { xStart: 30, yStart: 30, xEnd: 50, yEnd: 50 },
        //         text: 'F區域文字'
        //     }
        // ]
    },
    'row1-4': {
        0: [
            {
                area: { xStart: 30, yStart: 20, xEnd: 40, yEnd: 75 },
                text: '上下提拉窗便於通風'
            }
        ]
    },
    'row1-5': {
        0: [
            {
                area: { xStart: 30, yStart: 32, xEnd: 45, yEnd: 85 },
                text: '玻璃光塔增加室內自然光'
            },
            {
                area: { xStart: 60, yStart: 1, xEnd: 80, yEnd: 85 },
                text: '外牆鑲嵌特殊形狀金屬板'
            }
        ]
    }
};

// -------------輔助函數-------------
// 優化 resize 事件處理
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// -------------核心功能函數-------------
// 計算實際熱點位置的函數
function calculateHotspotPosition(hotspot, $image) {
    const imageWidth = $image.width();
    const imageHeight = $image.height();

    return {
        x1: (hotspot.area.xStart / 100) * imageWidth,
        y1: (hotspot.area.yStart / 100) * imageHeight,
        x2: (hotspot.area.xEnd / 100) * imageWidth,
        y2: (hotspot.area.yEnd / 100) * imageHeight
    };
}

// 在適當的位置添加發光熱點元素
function addHotspotHighlights($slide, hotspots) {
    $slide.find('.hotspot-highlight').remove();
    if (!hotspots) return;
    
    const $image = $slide.find('img');
    hotspots.forEach((hotspot, index) => {
        const pos = calculateHotspotPosition(hotspot, $image);
        const $highlight = $('<div>')
            .addClass('hotspot-highlight')
            .css({
                position: 'absolute',
                left: pos.x1 + 'px',
                top: pos.y1 + 'px',
                width: (pos.x2 - pos.x1) + 'px',
                height: (pos.y2 - pos.y1) + 'px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                opacity: '0',
                pointerEvents: 'none'
            });
        $slide.append($highlight);
    });
}

// 更新所有輪播的熱點顯示
function updateAllHotspotHighlights() {
    $('[class^="row1-"] .slider .slide').each(function () {
        const $slide = $(this);
        const rowClass = $slide.closest('[class^="row1-"]').attr('class').split(' ')[0];
        const slideIndex = $slide.index();
        const hotspots = hotspotsConfig[rowClass]?.[slideIndex];
        addHotspotHighlights($slide, hotspots);
    });
}

// 箭頭左右距離依視窗調整
function updateArrowsWidth() {
    $('.carousel').each(function () {
        var $carousel = $(this);
        var $arrowsWrap = $carousel.find('.directional_nav');
        $arrowsWrap.css('width', $carousel.width() + 'px');
    });
}

// 統一的 resize 處理函數
const handleResize = debounce(function() {
    updateAllHotspotHighlights();
    updateArrowsWidth();
    // 更新 tooltip 位置（如果正在顯示）
    if ($('.tooltip').is(':visible')) {
        $('[class^="row1-"] .slider .slide').trigger('mousemove');
    }
}, 150);

// -------------輪播核心功能-------------
// carousel slide輪播功能
function initializeCarousel($slider) {
    var $group = $slider.find('.slide_group');
    var $slides = $slider.find('.slide');
    var bulletArray = [];
    var currentIndex = 0;
    var timeout;
    var isHovered = false;

    // 檢查是在哪個row中的輪播
    const rowClass = $slider.closest('[class^="row1-"]').attr('class').split(' ')[0];

    // 確保每個輪播只有一個 tooltip
    if ($('.tooltip').length === 0) {
        $('body').append(`
            <div class="tooltip" style="display: none; position: fixed; padding: 8px; background: white; border: 1px solid #ccc; pointer-events: none; z-index: 1000;">
                <span class="tooltip-text"></span>
            </div>
        `);
    }
    const $tooltip = $('.tooltip');

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
        
        $group.animate({ left: animateLeft }, function () {
            $slides.eq(currentIndex).css({ display: 'none' });
            $slides.eq(newIndex).css({ left: 0 });
            $group.css({ left: 0 });
            currentIndex = newIndex;
        });
    }

    function advance() {
        clearTimeout(timeout);
        if (!isHovered) {
            timeout = setTimeout(function () {
                move(currentIndex < ($slides.length - 1) ? currentIndex + 1 : 0);
            }, 4000);
        }
    }

    // -------------事件處理器-------------
    // 滑鼠移動事件處理(圖片暫停、顯示tooltip與熱點)
    $slides.on('mousemove', function (e) {
        const slideIndex = $(this).index();
        const hotspots = hotspotsConfig[rowClass]?.[slideIndex];

        if (!hotspots) return;

        const $image = $(this).find('img');
        const rect = $image[0].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 檢查是否在任何熱點區域內
        const activeHotspot = hotspots.find(hotspot => {
            const pos = calculateHotspotPosition(hotspot, $image);
            return x >= pos.x1 && x <= pos.x2 && y >= pos.y1 && y <= pos.y2;
        });

        // 更新所有熱點的視覺效果
        $(this).find('.hotspot-highlight').css({
            opacity: '1',
            background: 'rgba(255, 255, 255, 0.5)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
        });

        // 更新活動熱點的視覺效果
        if (activeHotspot) {
            $(this).find('.hotspot-highlight').eq(hotspots.indexOf(activeHotspot)).css({
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)',
                border: 'solid white 1.5px',
            });
            
            // 顯示tooltip
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

    // 滑鼠進出事件處理
    $slides.on('mouseenter', function () {
        isHovered = true;
        clearTimeout(timeout);
    });

    $slides.on('mouseleave', function () {
        isHovered = false;
        $tooltip.hide();
        advance();
    });

    // 導航按鈕事件
    $('.next_btn').on('click', function () {
        move(currentIndex < ($slides.length - 1) ? currentIndex + 1 : 0);
    });

    $('.previous_btn').on('click', function () {
        move(currentIndex !== 0 ? currentIndex - 1 : $slides.length - 1);
    });

    // -------------初始化設定-------------
    // 初始化第一張幻燈片
    $slides.css('display', 'none');
    $slides.eq(0).css({
        'display': 'block',
        'left': 0
    });

    // 依照不同案件項目創建carousel導航點
    var $slideButtons = $('<div class="slide_buttons"></div>');
    $slider.append($slideButtons);

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

    // 初始化熱點
    updateAllHotspotHighlights();
    
    // 開始自動播放
    advance();
}

// -------------全域初始化-------------
$(document).ready(function () {
    // 初始化所有輪播
    $('[class^="row1-"] .slider').each(function () {
        initializeCarousel($(this));
    });

    // 註冊 resize 事件處理
    $(window).on('resize', handleResize);
});