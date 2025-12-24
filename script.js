// 用户数据
const users = {
    'F20251024': {
        password: '10242048',
        name: '管理员',
        role: 'admin'
    },
    'M': {
        password: 'cme354533',
        name: '访客',
        role: 'viewer'
    }
};

// 模拟博文数据
let blogPosts = [
    {
        id: 1,
        title: '2025.11.10',
        content: '我不是给你写信的最佳人选，所以就这样。'
    }
];

// 当前登录用户
let currentUser = null;
// 当前编辑的博文ID
let currentEditingPostId = null;

// DOM 元素
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const closeModalBtns = document.querySelectorAll('.close-button');
const submitLoginBtn = document.getElementById('submit-login');
const errorMessage = document.getElementById('error-message');
const blogPage = document.getElementById('blog-page');
const backBtn = document.getElementById('back-btn');
const userInfo = document.getElementById('user-info');
const blogActions = document.getElementById('blog-actions');
const blogList = document.getElementById('blog-list');
const blogModal = document.getElementById('blog-modal');
const blogModalTitle = document.getElementById('blog-modal-title');
const submitBlogBtn = document.getElementById('submit-blog');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 绑定事件
    loginBtn.addEventListener('click', openLoginModal);
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
    submitLoginBtn.addEventListener('click', handleLogin);
    backBtn.addEventListener('click', goBack);
    submitBlogBtn.addEventListener('click', handleBlogSubmit);
    window.addEventListener('click', handleOutsideClick);

    // 阻止弹窗内点击事件冒泡
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => e.stopPropagation());
    });
  document.addEventListener('DOMContentLoaded', () => {
    // 新增：刷新后自动恢复登录状态
    const loggedUsername = localStorage.getItem('loggedUser');
    if (loggedUsername && users[loggedUsername]) {
        currentUser = {
            ...users[loggedUsername],
            username: loggedUsername
        };
        showBlogPage(); // 自动显示博文页，无需重新登录
    }

    // 原有事件绑定逻辑（保留）
    loginBtn.addEventListener('click', openLoginModal);
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
    submitLoginBtn.addEventListener('click', handleLogin);
    backBtn.addEventListener('click', goBack);
    submitBlogBtn.addEventListener('click', handleBlogSubmit);
    window.addEventListener('click', handleOutsideClick);

    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => e.stopPropagation());
    });
});
});

// 打开登录弹窗
function openLoginModal() {
    loginModal.style.display = 'block';
    // 清空表单
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    errorMessage.textContent = '';
}

// 关闭弹窗
function closeModal() {
    loginModal.style.display = 'none';
    blogModal.style.display = 'none';
    // 清空博文表单
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-content').value = '';
    currentEditingPostId = null;
}

// 处理弹窗外部点击
function handleOutsideClick(e) {
    if (e.target === loginModal) {
        closeModal();
    }
    if (e.target === blogModal) {
        closeModal();
    }
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 验证用户
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        showBlogPage();
        closeModal();
    } else {
        errorMessage.textContent = '用户名或密码错误';
      function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (users[username] && users[username].password === password) {
        currentUser = {
            ...users[username],
            username: username
        };
        // 新增：保存登录用户名到本地存储（刷新不丢）
        localStorage.setItem('loggedUser', username);
        showBlogPage();
        closeModal();
    } else {
        errorMessage.textContent = '用户名或密码错误';
    }
}
    }
}

// 显示博文页面
function showBlogPage() {
    blogPage.classList.remove('hidden');
    // 读取本地存储的登录用户名（刷新后仍能获取）
    const loggedUsername = localStorage.getItem('loggedUser');
    // 强制设置目标欢迎语（仅M登录时显示）
    if (loggedUsername === 'M') {
        userInfo.textContent = 'M，你又打开了这个界面。';
    } else {
        userInfo.textContent = 'M，你又打开了这个界面。';
    }
    // 原有逻辑不变
    renderBlogActions();
    renderBlogList();
}

// 渲染博文操作按钮
function renderBlogActions() {
    blogActions.innerHTML = '';
    
    if (currentUser.role === 'admin') {
        // 管理员可以添加、编辑、删除
        const addButton = document.createElement('button');
        addButton.className = 'action-button';
        addButton.innerHTML = '<i class="fas fa-plus"></i> 添加博文';
        addButton.addEventListener('click', () => {
            blogModalTitle.textContent = '添加博文';
            blogModal.style.display = 'block';
        });
        blogActions.appendChild(addButton);
    }
}

// 渲染博文列表
function renderBlogList() {
    blogList.innerHTML = '';
    
    blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'blog-post';
        
        let postHTML = `
            <div class="blog-post-header">
                <h3 class="blog-post-title">${post.title}</h3>
                <div class="blog-post-actions">
        `;
        
        // 根据用户角色显示不同操作按钮
        if (currentUser.role === 'admin') {
            postHTML += `
                <button class="action-button delete" onclick="deleteBlogPost(${post.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-button" onclick="editBlogPost(${post.id})">
                    <i class="fas fa-edit"></i>
                </button>
            `;
        }
        
        postHTML += `
                </div>
            </div>
            <p class="blog-post-content">${post.content}</p>
        `;
        
        postElement.innerHTML = postHTML;
        blogList.appendChild(postElement);
    });
}

// 返回主页
function goBack() {
    blogPage.classList.add('hidden');
    currentUser = null;
}

// 编辑博文
function editBlogPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (post) {
        currentEditingPostId = id;
        document.getElementById('blog-title').value = post.title;
        document.getElementById('blog-content').value = post.content;
        blogModalTitle.textContent = '编辑博文';
        blogModal.style.display = 'block';
    }
}

// 删除博文
function deleteBlogPost(id) {
    alert('删除按钮被点击，博文ID：' + id);
    if (confirm('确定要删除这篇博文吗？')) {
        blogPosts = blogPosts.filter(p => p.id !== id);
        renderBlogList();
    }
}

// 处理博文提交
function handleBlogSubmit() {
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    
    if (!title || !content) {
        alert('请填写标题和内容');
        return;
    }
    
    if (currentEditingPostId) {
        // 编辑现有博文
        const postIndex = blogPosts.findIndex(p => p.id === currentEditingPostId);
        if (postIndex !== -1) {
            blogPosts[postIndex] = {
                ...blogPosts[postIndex],
                title,
                content
            };
        }
    } else {
        // 添加新博文
        const newId = blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 1;
        blogPosts.push({
            id: newId,
            title,
            content
        });
    }
    
    closeModal();
    renderBlogList();
}