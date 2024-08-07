function checkOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth <= 932;
    const landscapeWarningElement = document.getElementById('landscape-warning');

    if (landscapeWarningElement) {
        if (isMobile && isLandscape) {
            landscapeWarningElement.classList.add('visible');
        } else {
            landscapeWarningElement.classList.remove('visible');
        }
    } else {
        console.warn('Landscape warning element not found.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    includeHTML().then(() => {
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
    });
});
