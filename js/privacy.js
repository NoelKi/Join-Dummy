/**
 * Initializes the application by fetching user lists and including HTML templates.
 * This function is executed on page load.
 */
function init() {
    getUserLists();
    includeHTML();
}


/**
 * Fetches the current user's data and sets the user's initials.
 * This function handles the asynchronous fetching of user data and updates the user interface accordingly.
 * 
 * @async
 * @function
 * @returns {Promise<void>}
 * @throws {Error} If there is an error while fetching the user data.
 */
async function getUserLists() {
    try {
        CURRENT_USER_DATA = await getUserData(USER_ID);
        setUserInitals();
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    }
}