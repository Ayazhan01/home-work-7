const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const commentTemplate = document.getElementById('single-comment');
const fetchPostsButton = document.querySelector('#fetch-posts');

const COMMENTS_API_URL = 'https://jsonplaceholder.typicode.com/comments';
const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

let controller;

function sendHttpRequest(method, url, body) {
    controller = new AbortController();
    const signal = controller.signal;
    return fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer token',
            'Content-type': 'application/json; charset=UTF-8',
            // 'Authorization 2': 'Bearer token 2'
        },
        signal
    }).then(res => res.json());
}

fetchPostsButton.addEventListener('click', async() => {


    try {
        sendHttpRequest('GET', POSTS_API_URL).then(posts => {
            for (const post of posts) {
                const postEl = document.importNode(postTemplate.content, true);
                postEl.querySelector('h2').textContent = post.title.toUpperCase();
                postEl.querySelector('p').textContent = post.body;
                postEl.querySelector('.post-item').id = 'postId' + post.id;
                listElement.appendChild(postEl);
            }
        }).then(() => {
            sendHttpRequest('GET', COMMENTS_API_URL).then(comments => {
                for (const comment of comments) {
                    const commentsElement = document.querySelector('.posts #postId' + comment.postId);
                    const commentEl = document.importNode(commentTemplate.content, true);
                    commentEl.querySelector('#name').textContent = comment.name;
                    commentEl.querySelector('#email').textContent = comment.email;
                    commentEl.querySelector('#comment-body').textContent = comment.body;
                    commentEl.querySelector('.comment-item').id = comment.id;
                    commentsElement.appendChild(commentEl);
                }
            })
        })
    } catch (e) {
        alert(e)
    }
});