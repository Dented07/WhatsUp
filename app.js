// Main App Logic
let userProfile = null;

// Initialize App
async function initializeApp(user) {
console.log(‘🚀 Initializing WhatsUp app…’);

```
// Load user profile
const userDoc = await db.collection('users').doc(user.uid).get();
userProfile = userDoc.data();

// Update UI with user info
updateUserUI(user);

// Load initial feed
loadFeed();

// Load conversations
loadConversations();

// Setup tab navigation
setupTabs();

// Setup post creation
setupPostCreation();

// Setup real-time listeners
setupRealtimeListeners();

console.log('✅ App initialized!');
```

}

// Update UI with user information
function updateUserUI(user) {
const avatar = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=6C5CE7&color=fff`;

```
document.getElementById('user-avatar').src = avatar;
document.getElementById('create-post-avatar').src = avatar;
document.getElementById('profile-avatar-large').src = avatar;
document.getElementById('profile-name').textContent = user.displayName || user.email.split('@')[0];
document.getElementById('profile-email').textContent = '@' + (user.displayName || user.email).toLowerCase().replace(/\s/g, '');
```

}

// Tab Navigation
function setupTabs() {
const navItems = document.querySelectorAll(’.nav-item’);
const tabContents = document.querySelectorAll(’.tab-content’);

```
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tabName = item.dataset.tab;
        
        // Remove active class from all
        navItems.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked
        item.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load tab content
        loadTabContent(tabName);
    });
});
```

}

// Load Tab Content
function loadTabContent(tabName) {
switch(tabName) {
case ‘feed’:
loadFeed();
break;
case ‘messages’:
loadConversations();
break;
case ‘profile’:
loadUserProfile();
break;
case ‘explore’:
loadExplore();
break;
}
}

// Load Feed
async function loadFeed() {
const feedContainer = document.getElementById(‘posts-feed’);
feedContainer.innerHTML = ‘<div class="loading">Loading feed…</div>’;

```
try {
    // Get posts from Firestore (ordered by timestamp)
    const postsSnapshot = await db.collection('posts')
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get();
    
    if (postsSnapshot.empty) {
        feedContainer.innerHTML = `
            <div class="empty-state">
                <p>📭</p>
                <p>No posts yet. Be the first to share!</p>
            </div>
        `;
        return;
    }
    
    feedContainer.innerHTML = '';
    
    postsSnapshot.forEach(doc => {
        const post = doc.data();
        feedContainer.appendChild(createPostElement(doc.id, post));
    });
    
} catch (error) {
    console.error('Error loading feed:', error);
    feedContainer.innerHTML = '<div class="error">Failed to load feed</div>';
}
```

}

// Create Post Element
function createPostElement(postId, post) {
const postDiv = document.createElement(‘div’);
postDiv.className = ‘post’;
postDiv.dataset.postId = postId;

```
const timeAgo = post.timestamp ? getTimeAgo(post.timestamp.toDate()) : 'Just now';
const isLiked = post.likes && post.likes.includes(getCurrentUser().uid);
const likeCount = post.likes ? post.likes.length : 0;
const commentCount = post.commentCount || 0;

postDiv.innerHTML = `
    <div class="post-header">
        <img src="${post.userPhoto || 'https://ui-avatars.com/api/?name=User&background=6C5CE7&color=fff'}" 
             alt="${post.userName}" class="post-avatar">
        <div class="post-user-info">
            <strong>${post.userName || 'Anonymous'}</strong>
            <span class="post-time">${timeAgo}</span>
        </div>
    </div>
    <div class="post-content">
        <p>${escapeHtml(post.content)}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" class="post-image">` : ''}
    </div>
    <div class="post-actions">
        <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${postId}')">
            ${isLiked ? '❤️' : '🤍'} <span>${likeCount}</span>
        </button>
        <button class="post-action-btn" onclick="showComments('${postId}')">
            💬 <span>${commentCount}</span>
        </button>
        <button class="post-action-btn" onclick="sharePost('${postId}')">
            🔄 Share
        </button>
    </div>
`;

return postDiv;
```

}

// Setup Post Creation
function setupPostCreation() {
const postInput = document.getElementById(‘post-input’);
const submitBtn = document.getElementById(‘submit-post-btn’);

```
submitBtn.addEventListener('click', async () => {
    const content = postInput.value.trim();
    
    if (!content) {
        alert('Please write something!');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    
    try {
        const user = getCurrentUser();
        
        await db.collection('posts').add({
            content: content,
            userId: user.uid,
            userName: user.displayName || user.email.split('@')[0],
            userPhoto: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=6C5CE7&color=fff`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: [],
            commentCount: 0
        });
        
        postInput.value = '';
        alert('✅ Posted successfully!');
        loadFeed();
        
    } catch (error) {
        console.error('Error creating post:', error);
        alert('❌ Failed to post. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post';
    }
});
```

}

// Toggle Like
window.toggleLike = async function(postId) {
const user = getCurrentUser();
const postRef = db.collection(‘posts’).doc(postId);

```
try {
    await db.runTransaction(async (transaction) => {
        const postDoc = await transaction.get(postRef);
        const post = postDoc.data();
        const likes = post.likes || [];
        
        if (likes.includes(user.uid)) {
            // Unlike
            transaction.update(postRef, {
                likes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
        } else {
            // Like
            transaction.update(postRef, {
                likes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
        }
    });
    
    loadFeed(); // Refresh feed
} catch (error) {
    console.error('Error toggling like:', error);
}
```

};

// Show Comments (placeholder)
window.showComments = function(postId) {
alert(`💬 Comments feature coming soon! Post ID: ${postId}`);
};

// Share Post (placeholder)
window.sharePost = function(postId) {
alert(`🔄 Share feature coming soon! Post ID: ${postId}`);
};

// Load Conversations
async function loadConversations() {
const container = document.getElementById(‘conversations-container’);
container.innerHTML = ‘<div class="loading">Loading messages…</div>’;

```
try {
    const user = getCurrentUser();
    
    // Get conversations where user is a participant
    const conversationsSnapshot = await db.collection('conversations')
        .where('participants', 'array-contains', user.uid)
        .orderBy('lastMessageTime', 'desc')
        .limit(20)
        .get();
    
    if (conversationsSnapshot.empty) {
        container.innerHTML = `
            <div class="empty-state">
                <p>💬</p>
                <p>No messages yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    conversationsSnapshot.forEach(doc => {
        const conversation = doc.data();
        container.appendChild(createConversationElement(doc.id, conversation));
    });
    
} catch (error) {
    console.error('Error loading conversations:', error);
    container.innerHTML = '<div class="error">Failed to load messages</div>';
}
```

}

// Create Conversation Element
function createConversationElement(convId, conversation) {
const user = getCurrentUser();
const otherUserId = conversation.participants.find(id => id !== user.uid);

```
const convDiv = document.createElement('div');
convDiv.className = 'conversation-item';
convDiv.onclick = () => openChat(convId, conversation);

convDiv.innerHTML = `
    <img src="${conversation.otherUserPhoto || 'https://ui-avatars.com/api/?name=User'}" 
         alt="User" class="conversation-avatar">
    <div class="conversation-info">
        <strong>${conversation.otherUserName || 'User'}</strong>
        <p>${conversation.lastMessage || 'No messages yet'}</p>
    </div>
    ${conversation.unreadCount ? `<span class="badge">${conversation.unreadCount}</span>` : ''}
`;

return convDiv;
```

}

// Open Chat
function openChat(convId, conversation) {
const chatArea = document.getElementById(‘chat-area’);

```
chatArea.innerHTML = `
    <div class="chat-header">
        <img src="${conversation.otherUserPhoto || 'https://ui-avatars.com/api/?name=User'}" alt="User">
        <strong>${conversation.otherUserName || 'User'}</strong>
    </div>
    <div class="chat-messages" id="chat-messages-${convId}">
        <div class="loading">Loading messages...</div>
    </div>
    <div class="chat-input-area">
        <input type="text" id="message-input-${convId}" placeholder="Type a message..." class="message-input">
        <button onclick="sendMessage('${convId}')" class="send-btn">📤</button>
    </div>
`;

loadMessages(convId);
```

}

// Load Messages
async function loadMessages(convId) {
const messagesContainer = document.getElementById(`chat-messages-${convId}`);

```
try {
    const messagesSnapshot = await db.collection('conversations').doc(convId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .limit(50)
        .get();
    
    messagesContainer.innerHTML = '';
    
    messagesSnapshot.forEach(doc => {
        const message = doc.data();
        messagesContainer.appendChild(createMessageElement(message));
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
} catch (error) {
    console.error('Error loading messages:', error);
    messagesContainer.innerHTML = '<div class="error">Failed to load messages</div>';
}
```

}

// Create Message Element
function createMessageElement(message) {
const user = getCurrentUser();
const isOwnMessage = message.senderId === user.uid;

```
const msgDiv = document.createElement('div');
msgDiv.className = `message ${isOwnMessage ? 'own-message' : 'other-message'}`;
msgDiv.innerHTML = `
    <p>${escapeHtml(message.text)}</p>
    <span class="message-time">${message.timestamp ? getTimeAgo(message.timestamp.toDate()) : 'Now'}</span>
`;

return msgDiv;
```

}

// Send Message (placeholder)
window.sendMessage = function(convId) {
const input = document.getElementById(`message-input-${convId}`);
const text = input.value.trim();

```
if (!text) return;

alert('💬 Messaging feature coming soon!');
input.value = '';
```

};

// Load User Profile
async function loadUserProfile() {
const user = getCurrentUser();
const userPostsContainer = document.getElementById(‘user-posts’);

```
try {
    const postsSnapshot = await db.collection('posts')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .get();
    
    if (postsSnapshot.empty) {
        userPostsContainer.innerHTML = `
            <div class="empty-state">
                <p>No posts yet</p>
            </div>
        `;
        return;
    }
    
    userPostsContainer.innerHTML = '';
    postsSnapshot.forEach(doc => {
        const post = doc.data();
        const postCard = document.createElement('div');
        postCard.className = 'user-post-card';
        postCard.innerHTML = `
            <p>${escapeHtml(post.content).substring(0, 100)}...</p>
            <span>${post.timestamp ? getTimeAgo(post.timestamp.toDate()) : 'Just now'}</span>
        `;
        userPostsContainer.appendChild(postCard);
    });
    
} catch (error) {
    console.error('Error loading user posts:', error);
}
```

}

// Load Explore
function loadExplore() {
console.log(‘📍 Loading explore page…’);
}

// Setup Realtime Listeners
function setupRealtimeListeners() {
// Listen for new posts
db.collection(‘posts’)
.orderBy(‘timestamp’, ‘desc’)
.limit(1)
.onSnapshot(snapshot => {
snapshot.docChanges().forEach(change => {
if (change.type === ‘added’) {
console.log(‘✨ New post added!’);
}
});
});
}

// Utility Functions
function getTimeAgo(date) {
const seconds = Math.floor((new Date() - date) / 1000);

```
if (seconds < 60) return 'Just now';
if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
return date.toLocaleDateString();
```

}

function escapeHtml(text) {
const div = document.createElement(‘div’);
div.textContent = text;
return div.innerHTML;
}

// Export for global access
window.initializeApp = initializeApp;
