const socket = io();

window.onload = () => {
    socket.on('new-notification', notification => {
        document.body.innerHTML += `<div id="new-notification">
            <div class="alert alert-primary" role="alert">
                <div class="cut-text-noti">Có thông báo mới -
                    <span>${ notification.title }</span>
                    <a href="/notification/detail?id=${ notification._id }" onclick="closeSocketNoti()">Xem chi tiết</a>
                    <button type="button" class="btn btn-danger btn-sm" onclick="closeSocketNoti()"><i class="fa fa-times" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>`;
    });
}

function closeSocketNoti() {
    const newNotification = document.getElementById('new-notification');
    newNotification.style.display = 'none';
}

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

// Register update categories
if (window.location.pathname === '/register/update-categories') {
    $('.js-register-category-multiple').select2({
        placeholder: "Chọn chuyên mục",
    });
    
    const alertError = document.getElementById('alert-error-register');
    const alertSuccess = document.getElementById('alert-success-register');

    const username = document.getElementById('username');
    username.addEventListener('change', changeUserName);

    function changeUserName() {
        alertSuccess.style.display = 'none';
        alertError.style.display = 'none';
        const _id = $('#username').val();
        if (_id === '') {
            $('#categories').val(null);
            $('#categories').select2().trigger('change');
            return;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id
            })
        };
     
        fetch('/register/get-categories', options)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                let categorySelect = [];
                data.user[0].categories.forEach(category => {
                    categorySelect.push(category);
                });
                $('#categories').val(categorySelect);
                $('#categories').select2().trigger('change');
            }
            else {
                alertSuccess.style.display = 'none';
                alertError.style.display = 'block';
                alertError.innerText = 'Đã xảy ra lỗi';
            }
        });
    }
    
    const updateRegisterForm = document.getElementById('register-form');
    updateRegisterForm.addEventListener('submit', updateRegisterUser);

    function updateRegisterUser (event) {
        event.preventDefault();
        const _id = $('#username').val();
        const categories = $("#categories").val();
        if (_id === '') {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Chưa chọn tên đăng nhập';
            return;
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                categories
            })
        };
     
        fetch('/register/update-categories', options)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'fail') {
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
        return true;
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
        let check = true;
        
        const checkUpload = uploadAvatar(avatar.files[0]);
        await checkUpload.then(data => {
            if (data === false) return check = false;
            if (data.uploaded) {
                url = data.url;
            }
        }).catch(() => {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Hình ảnh không hợp lệ';
        });

        if (!check) return;

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
        let check = true;
        
        const checkUpload = uploadAvatar(avatar.files[0]);
        await checkUpload.then(data => {
            if (data === false) return check = false;
            if (data.uploaded) {
                url = data.url;
            }
        }).catch(() => {
            alertSuccess.style.display = 'none';
            alertError.style.display = 'block';
            alertError.innerText = 'Hình ảnh không hợp lệ';
        });

        if (!check) return;

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

// Notification detail
if (window.location.pathname === '/notification/detail') {
    let editor;
    ClassicEditor
        .create(document.querySelector('#notification-editor'), {
            placeholder: 'Nội dung thông báo...',
            toolbar: [ 'heading', '|', 
            'fontsize', '|', 
            'bold', 'italic', '|',
            'bulletedList', 'numberedList', '|',
            'insertTable', '|',
            'undo', 'redo' ],
        })
        .then(newEditor => {
            editor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

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

    const notificationForm = document.getElementById('notification-form');
    notificationForm.addEventListener('submit', createNotification);

    async function uploadFiles(files) {
        if (files.length !== 0) {
            const fd = new FormData();

            for (const file of files) {
                fd.append('files[]', file);
            }
        
            const options = {
                method: 'POST',
                body: fd 
            };
            
            return fetch('/notification/upload-files', options)
            .then(res => res.json());
        }
        return true;
    }

    const title = document.getElementById('title');
    const category = document.getElementById('category');
    const formFileMultiple = document.getElementById('formFileMultiple');

    async function createNotification(event) {
        event.preventDefault();
        const content = editor.getData();

        if (!content) {
            alertify.error('Nội dung không được để trống');
            return;
        }

        let files = [];
        const checkUpload = uploadFiles(formFileMultiple.files);
        await checkUpload.then(data => {
            if (data.uploaded) {
                files = data.urls;
            }
        }).catch(() => {
            alertify.error('Tệp tin không hợp lệ');
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.value,
                content,
                category: category.value,
                files
            })
        };

        fetch('/notification', options)
            .then(res => res.json())
            .then(data => {
                socket.emit('create-notification', data.notification);
                window.location.href = '/notification';
            });
    }

    async function updateNotification(event) {
        event.preventDefault();

        const _id = event.currentTarget._id;
        const content = editor.getData();

        if (!content) {
            alertify.error('Nội dung không được để trống');
            return;
        }

        let files = [];
        const checkUpload = uploadFiles(formFileMultiple.files);
        await checkUpload.then(data => {
            if (data.uploaded) {
                files = data.urls;
            }
        }).catch(() => {
            alertify.error('Tệp tin không hợp lệ');
        });

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                title: title.value,
                content,
                category: category.value,
                files
            })
        };

        fetch('/notification', options)
            .then(res => res.json())
            .then(data => {
                editor.setData('');
                title.value = '';
                category.selectedIndex = '0';
                formFileMultiple.value = '';
                $('#notificationModal .modal-footer .btn-primary').text('Đăng'); 
                $('#notificationModal').modal('hide');
                $('#my-col-n2').load('/notification/detail-content?id=' + _id);
                notificationForm.removeEventListener('submit', updateNotification);
                notificationForm.addEventListener('submit', createNotification); 
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function getContentNotification(event) {
        const _id = event.dataset.id;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id
            })
        };
        fetch('/notification/get-content-by-id', options)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    editor.setData(data.notification.content);
                    title.value = data.notification.title;
                    category.value = data.notification.category;
                    notificationForm.removeEventListener('submit', createNotification);
                    notificationForm.addEventListener('submit', updateNotification);
                    notificationForm._id = _id;
                }
                $('#notificationModal .modal-footer .btn-primary').text('Cập nhật');
                $('#notificationModal').modal('show');
            });
    }

    function closeNotification() {
        editor.setData('');
        title.value = '';
        category.selectedIndex = '0';
        formFileMultiple.value = '';
        $('#notificationModal .modal-footer .btn-primary').text('Đăng');
        notificationForm.removeEventListener('submit', updateNotification);
        notificationForm.addEventListener('submit', createNotification); 
    }

    function showDeleteModal(event) {
        const btn = document.querySelector('#deleteNotiModal .modal-footer .btn');
        btn.dataset.id = event.dataset.id;
    }

    function deleteNotification(event) {
        const _id = event.dataset.id;
        const currentPage = event.dataset.page;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
            })
        };
        fetch('/notification', options)
            .then(res => res.json())
            .then(data => {
                window.location.href = '/notification';
            });
    }

    function showSortCategory() {
        const sortCategory = document.getElementById('sort-category');
        if (sortCategory.style.display === 'block') {
            sortCategory.style.display = 'none';
        }
        else {
            sortCategory.style.display = 'block';
        }
    }

    function deleteFile(event) {
        const _id = event.dataset.id;
        const path = event.dataset.path;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                path
            })
        };

        fetch('/notification/delete-file', options)
            .then(res => res.json())
            .then(data => {
                $('#my-col-n2').load('/notification/detail-content?id=' + _id);
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }
}

// Notification
if (window.location.pathname === '/notification') {
    let editor;
    ClassicEditor
        .create(document.querySelector('#notification-editor'), {
            placeholder: 'Nội dung thông báo...',
            toolbar: [ 'heading', '|', 
            'fontsize', '|', 
            'bold', 'italic', '|',
            'bulletedList', 'numberedList', '|',
            'insertTable', '|',
            'undo', 'redo' ],
        })
        .then(newEditor => {
            editor = newEditor;
        })
        .catch(error => {
            console.error(error);
        });

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

    const notificationForm = document.getElementById('notification-form');
    notificationForm.addEventListener('submit', createNotification);

    async function uploadFiles(files) {
        if (files.length !== 0) {
            const fd = new FormData();

            for (const file of files) {
                fd.append('files[]', file);
            }
        
            const options = {
                method: 'POST',
                body: fd 
            };
            
            return fetch('/notification/upload-files', options)
            .then(res => res.json());
        }
        return true;
    }

    const title = document.getElementById('title');
    const category = document.getElementById('category');
    const formFileMultiple = document.getElementById('formFileMultiple');

    async function createNotification(event) {
        event.preventDefault();
        const content = editor.getData();

        if (!content) {
            alertify.error('Nội dung không được để trống');
            return;
        }

        let files = [];
        const checkUpload = uploadFiles(formFileMultiple.files);
        await checkUpload.then(data => {
            if (data.uploaded) {
                files = data.urls;
            }
        }).catch(() => {
            alertify.error('Tệp tin không hợp lệ');
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.value,
                content,
                category: category.value,
                files
            })
        };

        fetch('/notification', options)
            .then(res => res.json())
            .then(data => {
                editor.setData('');
                title.value = '';
                category.selectedIndex = '0';
                formFileMultiple.value = ''; 
                $('#notificationModal').modal('hide');
                $('#notifications').load('/notification/table');
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
                socket.emit('create-notification', data.notification);
            });
    }

    async function updateNotification(event) {
        event.preventDefault();

        const _id = event.currentTarget._id;
        const currentPage = event.currentTarget.currentPage;
        const content = editor.getData();

        if (!content) {
            alertify.error('Nội dung không được để trống');
            return;
        }

        let files = [];
        const checkUpload = uploadFiles(formFileMultiple.files);
        await checkUpload.then(data => {
            if (data.uploaded) {
                files = data.urls;
            }
        }).catch(() => {
            alertify.error('Tệp tin không hợp lệ');
        });

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
                title: title.value,
                content,
                category: category.value,
                files
            })
        };

        fetch('/notification', options)
            .then(res => res.json())
            .then(data => {
                editor.setData('');
                title.value = '';
                category.selectedIndex = '0';
                formFileMultiple.value = '';
                $('#notificationModal .modal-footer .btn-primary').text('Đăng'); 
                $('#notificationModal').modal('hide');
                $('#notifications').load('/notification/table?page=' + currentPage);
                notificationForm.removeEventListener('submit', updateNotification);
                notificationForm.addEventListener('submit', createNotification); 
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function pagination(event) {
        const page = event.dataset.page;
        const categoryId = event.dataset.categoryid;
        notificationForm.currentPage = page;
        $('#notifications').load('/notification/table?categoryId=' + categoryId + '&page=' + page);
        window.scrollTo(0, 0);
    }

    function getContentNotification(event) {
        const _id = event.dataset.id;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id
            })
        };
        fetch('/notification/get-content-by-id', options)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    editor.setData(data.notification.content);
                    title.value = data.notification.title;
                    category.value = data.notification.category;
                    notificationForm.removeEventListener('submit', createNotification);
                    notificationForm.addEventListener('submit', updateNotification);
                    notificationForm._id = _id;
                }
                $('#notificationModal .modal-footer .btn-primary').text('Cập nhật');
                $('#notificationModal').modal('show');
            });
    }

    function closeNotification() {
        editor.setData('');
        title.value = '';
        category.selectedIndex = '0';
        formFileMultiple.value = '';
        $('#notificationModal .modal-footer .btn-primary').text('Đăng');
        notificationForm.removeEventListener('submit', updateNotification);
        notificationForm.addEventListener('submit', createNotification); 
    }

    function showDeleteModal(event) {
        const btn = document.querySelector('#deleteNotiModal .modal-footer .btn');
        btn.dataset.id = event.dataset.id;
    }

    function deleteNotification(event) {
        const _id = event.dataset.id;
        const currentPage = event.dataset.page;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id,
            })
        };
        fetch('/notification', options)
            .then(res => res.json())
            .then(data => {
                $('#deleteNotiModal').modal('hide');
                $('#notifications').load('/notification/table?page=' + currentPage);
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function showSortCategory() {
        const sortCategory = document.getElementById('sort-category');
        if (sortCategory.style.display === 'block') {
            sortCategory.style.display = 'none';
        }
        else {
            sortCategory.style.display = 'block';
        }
    }
}

// Home
if (window.location.pathname === '/') {
    let pagePost = 10;
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
                $('#posts').load('/post?page=' + pagePost);
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
                $('#posts').load('/post?page=' + pagePost);
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function showDeleteModal(event) {
        const btn = document.querySelector('#deletePostModal .modal-footer .btn');
        btn.dataset.id = event.dataset.id;
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
                $('#deletePostModal').modal('hide');
                $('#posts').load('/post?page=' + pagePost);
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
                    if (data.status === 'success') {
                        event.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i> Thích';
                    }
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
                    if (data.status === 'success') {
                        event.innerHTML = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Thích';
                    }
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

    function showUpdateCmtModal(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const content = document.getElementById('content-cmt-' + _id).innerText;
        const textarea = document.querySelector('#updateCommentModal .modal-body textarea');
        textarea.value = content;
        const btn = document.querySelector('#updateCommentModal .modal-footer .btn');
        btn.dataset.id = _id;
        btn.dataset.postid = postId;
    }

    function updateComment(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const btnSubmitCmt = document.getElementById('btn-submit-cmt-' + postId);
        const page = btnSubmitCmt.dataset.page || 5;
        const textarea = document.querySelector('#updateCommentModal .modal-body textarea');
        let comment = textarea.value;
        let commentLength = document.getElementById('cmt-length-' + postId);
        if (comment !== '') {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    postId,
                    comment,
                })
            };
            fetch('/post/comment', options)
                .then(res => res.json())
                .then(data => {
                    $('#updateCommentModal').modal('hide');
                    $('#comments-' + postId).load('/post/comment?_id=' + postId + '&page=' + page);
                    commentLength.innerHTML = '<i class="fa fa-comments" aria-hidden="true"></i> ' + data.commentLength + ' bình luận';
                });
        }
    }

    function showDeleteCmtModal(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const btn = document.querySelector('#deleteCommentModal .modal-footer .btn');
        btn.dataset.id = _id;
        btn.dataset.postid = postId;
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
                $('#deleteCommentModal').modal('hide');
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

    $(window).scroll(function() {
        let loadingPost = document.getElementsByClassName('lds-facebook')[0];
        
        if(Math.ceil($(window).scrollTop()) === ($(document).height() - $(window).height())) {
            pagePost += 10;
            loadingPost.style.display = 'inline-block';
            $('#posts').load('/post?page=' + pagePost);
        }
    });
}

// My profile
if (window.location.pathname === '/my-profile') {
    let pagePost = 10;
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
                $('#posts').load('/post/my-profile?page=' + pagePost);
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
                $('#posts').load('/post/my-profile?page=' + pagePost);
                if (data.status === 'success') alertify.success(data.message)
                else alertify.error(data.message);
            });
    }

    function showDeleteModal(event) {
        const btn = document.querySelector('#deletePostModal .modal-footer .btn');
        btn.dataset.id = event.dataset.id;
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
                $('#deletePostModal').modal('hide');
                $('#posts').load('/post/my-profile?page=' + pagePost);
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
                    if (data.status === 'success') {
                        event.innerHTML = '<i class="fa fa-thumbs-up" aria-hidden="true"></i> Thích';
                    }
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
                    if (data.status === 'success') {
                        event.innerHTML = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Thích';
                    }
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

    function showUpdateCmtModal(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const content = document.getElementById('content-cmt-' + _id).innerText;
        const textarea = document.querySelector('#updateCommentModal .modal-body textarea');
        textarea.value = content;
        const btn = document.querySelector('#updateCommentModal .modal-footer .btn');
        btn.dataset.id = _id;
        btn.dataset.postid = postId;
    }

    function updateComment(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const btnSubmitCmt = document.getElementById('btn-submit-cmt-' + postId);
        const page = btnSubmitCmt.dataset.page || 5;
        const textarea = document.querySelector('#updateCommentModal .modal-body textarea');
        let comment = textarea.value;
        let commentLength = document.getElementById('cmt-length-' + postId);
        if (comment !== '') {
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id,
                    postId,
                    comment,
                })
            };
            fetch('/post/comment', options)
                .then(res => res.json())
                .then(data => {
                    $('#updateCommentModal').modal('hide');
                    $('#comments-' + postId).load('/post/comment?_id=' + postId + '&page=' + page);
                    commentLength.innerHTML = '<i class="fa fa-comments" aria-hidden="true"></i> ' + data.commentLength + ' bình luận';
                });
        }
    }

    function showDeleteCmtModal(event) {
        const _id = event.dataset.id;
        const postId = event.dataset.postid;
        const btn = document.querySelector('#deleteCommentModal .modal-footer .btn');
        btn.dataset.id = _id;
        btn.dataset.postid = postId;
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
                $('#deleteCommentModal').modal('hide');
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

    $(window).scroll(function() {
        let loadingPost = document.getElementsByClassName('lds-facebook')[0];
        
        if(Math.ceil($(window).scrollTop()) === ($(document).height() - $(window).height())) {
            pagePost += 10;
            loadingPost.style.display = 'inline-block';
            $('#posts').load('/post/my-profile?page=' + pagePost);
        }
    });
}





