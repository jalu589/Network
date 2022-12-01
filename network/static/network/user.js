document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#follow-button').addEventListener('click', () => follow());
});


function follow() {
    console.log('clicked')
    // Get user to be followed
    const followee = document.querySelector('#follow-button').value
    console.log(followee)

    fetch('/follow', {
        method: 'POST',
        body: JSON.stringify({
            followee: followee
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log('Error: ', error)
    });

    // Refresh page to load follow
    window.location.reload()
}
