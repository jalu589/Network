document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#post-button').addEventListener('click', () => new_post());

});


function new_post() {
    console.log('clicked')

    // Get post content
    const postContent = document.querySelector('textarea').value
    console.log(postContent)
    document.querySelector('textarea').value = ''

    // Convert content into json and POST to api
    fetch('/newpost', {
        method: 'POST',
        body: JSON.stringify({
            content: postContent
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
    .catch(error => {
        console.log('Error: ', error)
    });
}