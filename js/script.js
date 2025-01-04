// JQuery
$(function () {
    // 漢堡按鈕
    $('.hamburger').click(function () {
        $(this).toggleClass('is-active');
        $('#menuOverlay-right').toggleClass('show');
    });

    $('.ham-inside').click(function () {
        $(this).toggleClass('is-active');
        $('#menuOverlay-right').toggleClass('show');
    });
})

// const divBelow = document.getElementById('mainLeft');
// const menuOverlay = document.getElementById('menuOverlay-left');

// function updatemenuOverlayWidth() {
//     menuOverlay.style.width = `${divBelow.offsetWidth}px`;
// }

// // 初始化
// updatemenuOverlayWidth();

// // 當窗口大小改變時自動更新
// window.addEventListener('resize', updatemenuOverlayWidth);

