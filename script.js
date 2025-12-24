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

// 从本地存储读取博文数据，若无则用默认数据
function getBlogPostsFromLocalStorage() {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        return JSON.parse(savedPosts);
    }
    // 默认博文数据（首次加载用）
    return [
        {
            id: 1,
            title: '我的第一篇博文',
            content: '这是我在这个平台上发布的第一篇博文。在这里，我将分享我的工作心得和生活感悟。'
        },
        {
            id: 2,
            title: '财富管理的核心原则',
            content: '作为一名私人财富管理师，我认为风险管理比追求高收益更重要。资产配置是财富管理的基石。'
        },
        {
            id: 3,
            title: '香港大学学习生活回忆',
            content: '在港大的四年是我人生中最宝贵的时光之一。这里不仅有优秀的学术环境，还有多元的文化体验。'
        }
    ];
}

// 将博文数据保存到本地存储
function saveBlogPostsToLocalStorage(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// 初始化博文数据（优先读取本地存储）
let blogPosts = getBlogPostsFromLocalStorage();

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
    }
}

// 显示博文页面
function showBlogPage() {
    blogPage.classList.remove('hidden');
    // 对于用户 'M'，显示特定欢迎语
    if (currentUser.name === '访客') {
        userInfo.textContent = 'Ｍ，你打开了这个界面。';
    } else {
        userInfo.textContent = `欢迎，${currentUser.name}`;
    }
    
    // 根据用户角色显示不同操作按钮
    renderBlogActions();
    // 渲染博文列表
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
    if (confirm('确定要删除这篇博文吗？')) {
        blogPosts = blogPosts.filter(p => p.id !== id);
        // 删除后同步保存到本地存储
        saveBlogPostsToLocalStorage(blogPosts);
        renderBlogList();
    }
}

// 处理博文提交（新增/编辑）
function handleBlogSubmit() {
    const title = document.getElementById('blog-title').value.trim();
    const content = document.getElementById('blog-content').value.trim();
    
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
    
    // 提交后同步保存到本地存储
    saveBlogPostsToLocalStorage(blogPosts);
    closeModal();
    renderBlogList();
}