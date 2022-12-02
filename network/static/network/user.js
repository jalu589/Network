document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#follow-button').addEventListener('click', () => follow());
});


function edit_post(post) {
    console.log('editing', post)
    // show and hide text of selected post
    const postContent = document.querySelector(`#content-${post}`)
    postContent.style.display = 'none'
    const editText = document.querySelector(`#edit-${post}`)
    editText.style.display = 'block'
    document.querySelector(`#edit-button-${post}`).style.display = 'none'
    document.querySelector(`#save-button-${post}`).style.display = 'block'
}


function save_post(post) {
    console.log('saving', post)
    const editText = document.querySelector(`#edit-${post}`)
    // PUT updated content to api
    fetch(`/edit/${post}`, {
        method: 'PUT',
        body: JSON.stringify({
            content: editText.value
        })
    })
    .catch(error => {
        console.log('Error: ', error)
    });
    // Update post content in page using text area value
    const postContent = document.querySelector(`#content-${post}`)
    postContent.textContent = editText.value
    editText.style.display = 'none'
    postContent.style.display = 'block'
    document.querySelector(`#edit-button-${post}`).style.display = 'block'
    document.querySelector(`#save-button-${post}`).style.display = 'none'
}


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


function new_post() {
    // Get post content
    const postContent = document.querySelector('textarea').value
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

    // Refresh page to load new post
    window.location.reload()
}