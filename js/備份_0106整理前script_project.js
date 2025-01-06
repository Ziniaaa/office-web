// 輪播功能
function initializeCarousel($slider) {
    var $group = $slider.find('.slide_group');
    var $slides = $slider.find('.slide');
    var bulletArray = [];
    var currentIndex = 0;
    var timeout;
    var isHovered = false;


    // -------------滑鼠熱點功能-------------
    // 檢查是在哪個row中的輪播
    const rowClass = $slider.closest('[class^="row1-"]').attr('class').split(' ')[0];

    // 定義熱點的相對位置（以百分比表示）
    const hotspotsConfig = {
        'row1-1': {
            0: [ // 第一張圖片的熱點
                {
                    area: {
                        xStart: 20,  // 左上角 x 位置（佔圖片寬度的百分比）
                        yStart: 30,  // 左上角 y 位置（佔圖片高度的百分比）
                        xEnd: 40,    // 右下角 x 位置（佔圖片寬度的百分比）
                        yEnd: 50     // 右下角 y 位置（佔圖片高度的百分比）
                    },
                    text: 'A區域文字'
                },
                {
                    area: {
                        xStart: 60,
                        yStart: 40,
                        xEnd: 80,
                        yEnd: 60
                    },
                    text: 'A-2區域文字'
                }
            ],
            1: [ // 第二張圖片的熱點
                {
                    area: {
                        xStart: 30,
                        yStart: 30,
                        xEnd: 50,
                        yEnd: 50
                    },
                    text: 'B區域文字'
                }
            ]
        },
        'row1-2': {
            // ... row1-2 的設定同上 ...
            0: [ // 第一張圖片的熱點
                {
                    area: {
                        xStart: 20,  // 左上角 x 位置（佔圖片寬度的百分比）
                        yStart: 30,  // 左上角 y 位置（佔圖片高度的百分比）
                        xEnd: 40,    // 右下角 x 位置（佔圖片寬度的百分比）
                        yEnd: 50     // 右下角 y 位置（佔圖片高度的百分比）
                    },
                    text: 'C區域文字'
                },
                {
                    area: {
                        xStart: 60,
                        yStart: 40,
                        xEnd: 80,
                        yEnd: 60
                    },
                    text: 'C-2區域文字'
                }
            ],
            1: [ // 第二張圖片的熱點
                {
                    area: {
                        xStart: 30,
                        yStart: 30,
                        xEnd: 50,
                        yEnd: 50
                    },
                    text: 'D區域文字'
                }
            ]
        },
        'row1-3': {
            0: [ // 第一張圖片的熱點
                {
                    area: {
                        xStart: 20,  // 左上角 x 位置（佔圖片寬度的百分比）
                        yStart: 30,  // 左上角 y 位置（佔圖片高度的百分比）
                        xEnd: 40,    // 右下角 x 位置（佔圖片寬度的百分比）
                        yEnd: 50     // 右下角 y 位置（佔圖片高度的百分比）
                    },
                    text: 'E區域文字'
                }
            ],
            1: [ // 第二張圖片的熱點
                {
                    area: {
                        xStart: 30,
                        yStart: 30,
                        xEnd: 50,
                        yEnd: 50
                    },
                    text: 'F區域文字'
                },
                {
                    area: {
                        xStart: 60,
                        yStart: 40,
                        xEnd: 80,
                        yEnd: 60
                    },
                    text: 'G區域文字'
                }
            ]
        },
        'row1-4': {
            0: [ // 第一張圖片的熱點
                {
                    area: {
                        xStart: 20,
                        yStart: 30,
                        xEnd: 40,
                        yEnd: 50
                    },
                    text: 'H區域文字'
                }
            ]
        },
        'row1-5': {
            0: [ // 第一張圖片的熱點
                {
                    area: {
                        xStart: 20,
                        yStart: 30,
                        xEnd: 40,
                        yEnd: 50
                    },
                    text: 'I區域文字'
                }
            ]
        }
    };
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
        // 先清除現有的熱點
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
                    background: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    opacity: '0', // 初始狀態設為完全透明
                    pointerEvents: 'none' // 確保不會影響滑鼠事件
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


    // (舊保留)確保每個輪播只有一個 tooltip
    if ($('.tooltip').length === 0) {
        $('body').append(`
        <div class="tooltip" style="display: none; position: fixed; padding: 8px; background: white; border: 1px solid #ccc; pointer-events: none; z-index: 1000;">
            <span class="tooltip-text"></span>
        </div>
    `);
    }
    const $tooltip = $('.tooltip');

    // 熱點-滑鼠移動事件處理
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
            return x >= pos.x1 && x <= pos.x2 &&
                y >= pos.y1 && y <= pos.y2;
        });

        // 更新熱點的視覺效果
        $(this).find('.hotspot-highlight').css({
            opacity: '1',
            background: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
        });

        if (activeHotspot) {
            const pos = calculateHotspotPosition(activeHotspot, $image);
            $(this).find('.hotspot-highlight').eq(hotspots.indexOf(activeHotspot)).css({
                background: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)',
                border: 'solid white 1px'

            });
        }

        // 顯示tooltip
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

    // 初始化時添加熱點高亮
    updateAllHotspotHighlights();

    // 視窗大小改變時重新計算熱點位置
    $(window).on('resize', debounce(function () {
        updateAllHotspotHighlights();
    }, 150));

    // 視窗大小改變時重新計算熱點位置
    $(window).on('resize', function () {
        // 如果正在顯示 tooltip，更新其位置
        if ($tooltip.is(':visible')) {
            $slides.trigger('mousemove');
        }
    });

    // 滑鼠移出圖片時隱藏 tooltip
    $slides.on('mouseleave', function () {
        $tooltip.hide();
        isHovered = false;
        advance();
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


    // ※※※※初始化第一張幻燈片的顯示狀態
    $slides.css('display', 'none'); // 先隱藏所有幻燈片
    $slides.eq(0).css({  // 設置第一張幻燈片的狀態
        'display': 'block',
        'left': 0
    });


    // -------------slide動作-------------
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


    // // ※添加繪製 debug 區域的函數
    // function drawDebugHotspots($slide, hotspots) {
    //     // 先清除現有的 debug 區域
    //     $slide.find('.debug-hotspot').remove();
    //     if (!hotspots) return;
    //     const $image = $slide.find('img');

    //     hotspots.forEach((hotspot, index) => {
    //         const pos = calculateHotspotPosition(hotspot, $image);
    //         const $debug = $('<div>')
    //             .addClass('debug-hotspot')
    //             .attr('data-area', hotspot.text)
    //             .css({
    //                 left: pos.x1 + 'px',
    //                 top: pos.y1 + 'px',
    //                 width: (pos.x2 - pos.x1) + 'px',
    //                 height: (pos.y2 - pos.y1) + 'px'
    //             });
    //         $slide.append($debug);
    //     });
    // }
    // // 在適當的時機繪製 debug 區域
    // function updateDebugHotspots() {
    //     $slides.each(function () {
    //         const slideIndex = $(this).index();
    //         const hotspots = hotspotsConfig[rowClass]?.[slideIndex];
    //         drawDebugHotspots($(this), hotspots);
    //     });
    // }

    // // 初始化時繪製debug 區域
    // updateDebugHotspots();

    // // 視窗大小改變時重新繪製debug 區域
    // $(window).on('resize', debounce(function () {
    //     updateDebugHotspots();
    // }, 150));



    advance();
}
// -------------slide輪播語法結束-------------


// // 確保圖片載入完成後再初始化所有輪播
// $(window).on('load', function () {
//     $('[class^="row1-"] .slider').each(function () {
//         initializeCarousel($(this));
//     });
// });

// 如果需要更快的初始化，也可以在DOM ready時就初始化
$(document).ready(function () {
    $('[class^="row1-"] .slider').each(function () {
        initializeCarousel($(this));
    });
});


// 可選：添加 debounce 函數來優化 resize 事件處理
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

// 使用 debounce 優化 resize 事件
$(window).on('resize', debounce(function () {
    $('.row1-1 .slider, .row1-2 .slider').each(function () {
        $(this).find('.slide').trigger('mousemove');
    });
}, 150)); // 150ms 延遲

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
