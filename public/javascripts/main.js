// Register
if (window.location.pathname === '/register') {
    $('.js-register-category-multiple').select2({
        placeholder: "Chọn chuyên mục",
    });
    
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', registerUser);

    function registerUser (event) {
        event.preventDefault();
        const alertError = document.getElementById('alert-error-register');
        const alertSuccess = document.getElementById('alert-success-register');
        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const role = document.getElementById('role').value;
        const categories = $("#categories").val();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname,
                username,
                email,
                password,
                role,
                categories
            })
        };
        if (password !== confirmPassword) {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Mật khẩu xác nhận không hợp lệ';
        }
        else {
            fetch('/register', options)
            .then(res => res.json())
            .then(data => {
                if (data.error === 'true') {
                    alertSuccess.style.display = 'none';
                    alertError.style.display = 'block';
                    alertError.innerText = data.message;
                }
                else {
                    alertError.style.display = 'none';
                    alertSuccess.style.display = 'block';
                    alertSuccess.innerText = data.message;
                }
            });
        }
    }
}

// Update account
if (window.location.pathname === '/update-account') {

    const alertError = document.getElementById('alert-error-register');
    const alertSuccess = document.getElementById('alert-success-register');

    async function uploadAvatar(file) {
        if (file !== undefined) {
            if(!['image/jpg', 'image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'].includes(file.type)) {
                alertSuccess.style.display = 'none';
                alertError.style.display = 'block';
                alertError.innerText = 'Hình ảnh không hợp lệ';
                return false;
            }
        
            const fd = new FormData();
            fd.append('upload', file);
        
            const options = {
                method: 'POST',
                body: fd 
            };
            
            return fetch('/update-account/upload-avatar', options)
            .then(res => res.json());
        }
        return false;
    }
    
    const updateForm = document.getElementById('update-form');
    updateForm.addEventListener('submit', updateAccountFaculty);
    if (updateForm.dataset.role === 'student') {
        updateForm.addEventListener('submit', updateAccountStudent);
    }
    
    async function updateAccountFaculty (event) {
        event.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const avatar = document.getElementById('avatar');

        if (password !== confirmPassword) {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Mật khẩu xác nhận không hợp lệ';
            return;
        }

        let url = '';
        
        const checkUpload = uploadAvatar(avatar.files[0]);
        await checkUpload.then(data => {
            if (data === false) return;
            if (data.uploaded) {
                url = data.url;
            }
        }).catch(() => {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Hình ảnh không hợp lệ';
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname,
                password,
                avatar: url
            }) 
        };
        
        fetch('/update-account/faculty', options)
            .then(res => res.json())
            .then(data => {
                if (data.error === 'true') {
                    alertSuccess.style.display = 'none';
                    alertError.style.display = 'block';
                    alertError.innerText = data.message;
                }
                else {
                    window.location = '/';
                }
            });
    }

    async function updateAccountStudent (event) {
        event.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const classValue = document.getElementById('class').value;
        const faculty = document.getElementById('faculty').value;
        const avatar = document.getElementById('avatar');

        let url = '';
        
        const checkUpload = uploadAvatar(avatar.files[0]);
        await checkUpload.then(data => {
            if (data === false) return;
            if (data.uploaded) {
                url = data.url;
            }
        }).catch(() => {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Hình ảnh không hợp lệ';
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname,
                class: classValue,
                faculty,
                avatar: url
            }) 
        };
        
        fetch('/update-account/student', options)
            .then(res => res.json())
            .then(data => {
                if (data.error === 'true') {
                    alertSuccess.style.display = 'none';
                    alertError.style.display = 'block';
                    alertError.innerText = data.message;
                }
                else {
                    window.location = '/';
                }
            });
    }
}

// Notification
if (window.location.pathname === '/notification') {
    const itemTypeNoti = document.getElementById('item-type-noti');
    
    function openItemTypeNoti(event) {
        if (itemTypeNoti.style.display == 'initial') {
            event.childNodes[1].className = 'fa fa-angle-right pe-3 position-absolute top-50 end-0 translate-middle-y';
            itemTypeNoti.style.display = 'none';
        }
        else {
            event.childNodes[1].className = 'fa fa-angle-down pe-3 position-absolute top-50 end-0 translate-middle-y';
            itemTypeNoti.style.display = 'initial';
        }
    }
}

// Home
if (window.location.pathname === '/') {
    let editor;
    ClassicEditor
        .create(document.querySelector('#my-post-editor'), {
            toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'uploadImage', 'mediaEmbed', '|', 'undo', 'redo' ],
            ckfinder: {
                uploadUrl: '/post/upload'
            }
        })
        .then(newEditor => {
            editor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

    function createPost () {
        const content = editor.getData();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content,
            })
        };
        fetch('/post', options)
            .then(res => res.json())
            .then(data => {
                editor.setData(''); 
                $('#addPostModal').modal('hide');
                $('#posts').load('/post');
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function getContentPost (event) {
        const _id = event.dataset.id;
        let btn = document.getElementById('btn-cr-up-post');
        btn.setAttribute('onclick', 'updatePost("' + _id + '")');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id
            })
        };
        fetch('/post/get-content-by-id', options)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') editor.setData(data.allContent);
                $('#addPostModal .modal-title').text('Chỉnh sửa bài viết');
                $('#addPostModal .modal-body .btn').text('Cập nhật');
                $('#addPostModal').modal('show');
            });
    }

    function updatePost (_id) {
        const content = editor.getData();
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                content,
            })
        };
        fetch('/post', options)
            .then(res => res.json())
            .then(data => {
                editor.setData(''); 
                $('#addPostModal').modal('hide');
                $('#addPostModal .modal-title').text('Tạo bài viết');
                $('#addPostModal .modal-body .btn').text('Đăng');
                let btn = document.getElementById('btn-cr-up-post');
                btn.setAttribute('onclick', 'createPost()');
                $('#posts').load('/post');
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function deletePost (event) {
        const _id = event.dataset.id;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
            })
        };
        fetch('/post', options)
            .then(res => res.json())
            .then(data => {
                $('#posts').load('/post');
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function clickLike (event) {
        let like = true;
        const _id = event.dataset.id;
        let likeLength = document.getElementById('like-length-' + _id);
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                like
            })
        };
        if (event.children[0].className === 'fa fa-thumbs-o-up') {
            fetch('/post/like', options)
                .then(res => res.json())
                .then(data => {
                    event.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i> Thích';
                    likeLength.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i> ' + data.likeLength + ' lượt thích';
                });
        } 
        else {
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    like: false
                })
            };
            fetch('/post/like', options)
                .then(res => res.json())
                .then(data => {
                    event.innerHTML = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Thích';
                    likeLength.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i> ' + data.likeLength + ' lượt thích';
                });
        }
    }

    function clickComment(event) {
        const _id = event.dataset.id;
        const cmt = document.getElementById('cmt-' + _id);
        if (cmt.style.display == 'table-row') {
            event.innerHTML = '<i class="fa fa-comment-o" aria-hidden="true"></i> Bình luận'
            cmt.style.display = 'none';
        }
        else {
            event.innerHTML = '<i class="fa fa-comments" aria-hidden="true"></i> Bình luận'
            cmt.style.display = 'table-row';
        }
    }

    function submitComment(event) {
        const _id = event.dataset.id;
        const page = event.dataset.page || 5;
        let commentHtml = event.parentNode.nextElementSibling;
        let comment = commentHtml.value;
        let commentLength = document.getElementById('cmt-length-' + _id);
        if (comment !== '') {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    comment,
                })
            };
            fetch('/post/comment', options)
                .then(res => res.json())
                .then(data => {
                    commentHtml.value = '';
                    $('#comments-' + _id).load('/post/comment?_id=' + _id + '&page=' + page);
                    commentLength.innerHTML = '<i class="fa fa-comments" aria-hidden="true"></i> ' + data.commentLength + ' bình luận';
                });
        }
    }

    function seeMoreCmts(event) {
        const _id = event.dataset.id;
        const page = event.dataset.page;
        $('#comments-' + _id).load('/post/comment?_id=' + _id + '&page=' + page);
        event.dataset.page = parseInt(page) + 5;
        const btnSubmitCmt = document.getElementById('btn-submit-cmt-' + _id);
        btnSubmitCmt.dataset.page = parseInt(page);
    }

    function deleteComment(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const btnSubmitCmt = document.getElementById('btn-submit-cmt-' + postId);
        const page = btnSubmitCmt.dataset.page || 5;
        let commentLength = document.getElementById('cmt-length-' + postId);
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                postId
            })
        };
        fetch('/post/comment', options)
            .then(res => res.json())
            .then(data => {
                $('#comments-' + postId).load('/post/comment?_id=' + postId + '&page=' + page);
                commentLength.innerHTML = '<i class="fa fa-comments" aria-hidden="true"></i> ' + data.commentLength + ' bình luận';
            });
    }

    function closePostForm() {
        $('#addPostModal .modal-title').text('Tạo bài viết');
        $('#addPostModal .modal-body .btn').text('Đăng');
        editor.setData('');
        let btn = document.getElementById('btn-cr-up-post');
        btn.setAttribute('onclick', 'createPost()');
    }

    let pagePost = 10;
    $(window).scroll(function() {
        let loadingPost = document.getElementsByClassName('lds-facebook')[0];
        
        if(Math.ceil($(window).scrollTop()) === ($(document).height() - $(window).height())) {
            pagePost += 10;
            loadingPost.style.display = 'inline-block';
            $('#posts').load('/post?page=' + pagePost);
        }
    });
}





