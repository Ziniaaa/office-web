// jQuery
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

    // 點擊導覽列外關閉
    $('#menuOverlay-right').click(function (e) {
        if ($(e.target).is('#menuOverlay-right')) {
            $(this).toggleClass('show');
            $('.hamburger, .ham-inside-R').removeClass('is-active');
        }
    });

    $('#menuOverlay-left').click(function (e) {
        if ($(e.target).is('#menuOverlay-left')) {
            $(this).toggleClass('show');
            $('.hamburger, .ham-inside-L').removeClass('is-active');
        }
    });


// ----------切換project案件頁面功能-------------
    // 初始化 project 頁面
    function initProjectPage() {
        if (window.location.pathname.includes('project.html')) {
            const selectedProject = sessionStorage.getItem('selectedProject');
            if (selectedProject) {
                const index = parseInt(selectedProject) - 1;// 減 1 因為索引從 0 開始
                // 使用動畫系統切換到選定的內容
                showProjectContent(index);
                // 更新列表項目狀態
                updateProjectListStatus(index);
                sessionStorage.removeItem('selectedProject');
            } else {
                // 首次載入時的預設狀態
                const $firstContent = $('.row1 > div').first();
                const $firstListItem = $('.project-list li').first();
                
                // 確保其他內容區塊處於正確的初始狀態
                $('.row1 > div').not($firstContent)
                    .removeClass('show')
                    .addClass('wait-right');
                
                // 顯示第一個內容區塊
                $firstContent.addClass('show')
                    .removeClass('wait-right hide-left');
                
                // 設置第一個列表項為 active
                $firstListItem.addClass('active')
                    .siblings().removeClass('active');
            }
        }
    }
    // 更新列表項目狀態的函數
    function updateProjectListStatus(index) {
        $('.project-list li').removeClass('active');
        $(`.project-list li:eq(${index})`).addClass('active');
    }


    // 為每個thumbnail添加點擊事件
    $('.thumbnail-pic figure').click(function () {
        const index = $(this).index();

        if (window.location.pathname.includes('project.html')) {
            showProjectContent(index);
            updateProjectListStatus(index);
        } else {
            sessionStorage.setItem('selectedProject', index + 1); // 加 1 以匹配 CSS 類名
            window.location.href = './project.html';
        }
    });

    function showProjectContent(index) {
        // 檢查是否有動畫正在進行
        if ($('.row1 > div').is(':animated')) return;

        const $contents = $('.row1 > div');
        const currentIndex = $contents.filter('.show').index();
        const $current = $contents.eq(currentIndex);
        const $next = $contents.eq(index);

        // // 更新project-list的選中狀態
        // $('.project-list li').removeClass('active');
        // $(`.project-list li[data-index="${index}"]`).addClass('active');

        // 如果點擊的是當前項目，只關閉選單
        if (currentIndex === index) {
            closeMenus();
            return;
        }

        // 更新列表狀態
        updateProjectListStatus(index);
        
        
        // 根據方向設置適當的動畫類
        $contents.removeClass('wait-right hide-left'); // 重置其他項目的狀態
        
        if (index > currentIndex) {
            // 向左滑動
            $contents.not($current).not($next).addClass('wait-right');
            $next.removeClass('hide-left wait-right').addClass('wait-right');
            setTimeout(() => {
                $current.addClass('hide-left').removeClass('show');
                $next.addClass('show').removeClass('wait-right');
            }, 50);
        } else {
            // 向右滑動
            $contents.not($current).not($next).addClass('wait-right');
            $next.removeClass('hide-left wait-right').addClass('hide-left');
            setTimeout(() => {
                $current.addClass('wait-right').removeClass('show');
                $next.addClass('show').removeClass('hide-left');
            }, 50);
        }

        // 關閉選單
        closeMenus();
    }

    function closeMenus() {
        if ($('#menuOverlay-right').hasClass('show')) {
            $('#menuOverlay-right').removeClass('show');
            $('.hamburger, .ham-inside-R').removeClass('is-active');
        }
        if ($('#menuOverlay-left').hasClass('show')) {
            $('#menuOverlay-left').removeClass('show');
            $('.hamburger, .ham-inside-L').removeClass('is-active');
        }
    }

 // 同步列表點擊事件
 $('.project-list li').click(function() {
    const index = $(this).index();
    showProjectContent(index);
    updateProjectListStatus(index);
});

    // 頁面加載時初始化，確保在所有其他初始化完成後再執行
    initProjectPage();
});