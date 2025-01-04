// JQuery
$(function () {
    // 漢堡按鈕-右
    $('.hamburger').click(function () {
        $(this).toggleClass('is-active');
        $('#menuOverlay-right').toggleClass('show');
    });

    $('.ham-inside-R').click(function () {
        $(this).toggleClass('is-active');
        $('#menuOverlay-right').toggleClass('show');
    });

    // 漢堡按鈕-左
    $('.hamburger').click(function () {
        $(this).toggleClass('is-active');
        $('#menuOverlay-left').toggleClass('show');
    });

    $('.ham-inside-L').click(function () {
        $(this).toggleClass('is-active');
        $('#menuOverlay-left').toggleClass('show');
    });
})



