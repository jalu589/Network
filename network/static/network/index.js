document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#post-button').addEventListener('click', () => new_post());
});


function like_post(post) {
    console.log(post, 'liked')
    const likeButton = document.querySelector(`#like-button-${post}`)
    fetch(`/like/${post}`, {
        method: 'PUT'
    })
    .catch(error => {
        console.log('Error: ', error)
    });
    location.reload()
}


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
    location.reload()
}
