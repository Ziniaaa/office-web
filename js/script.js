
const divBelow = document.getElementById('mainLeft');
const menuOverlay = document.getElementById('menuOverlay-left');

function updatemenuOverlayWidth() {
    menuOverlay.style.width = `${divBelow.offsetWidth}px`;
}

// 初始化
updatemenuOverlayWidth();

// 當窗口大小改變時自動更新
window.addEventListener('resize', updatemenuOverlayWidth);