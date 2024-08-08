/**
 * Checks the device orientation and shows or hides a warning message
 * if the device is in landscape mode and is considered mobile.
 * The warning message is controlled by adding or removing the 'visible' class
 * to/from the DOM element with the ID 'landscape-warning'.
 * This function is called both when the page is loaded and when the window is resized
 * or the orientation of the device changes.
 * @function
 * @memberof module:landscape
 * @returns {void}
 */
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


/**
 * Initializes the HTML content, checks the device orientation, and sets up
 * event listeners for window resize and orientation change.
 * This function is called when the DOM content is loaded, ensuring that
 * the `checkOrientation` function runs after the HTML content has been successfully loaded.
 * @function
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function () {
    includeHTML().then(() => {
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
    });
});