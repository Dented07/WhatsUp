// Authentication Handler
let currentUser = null;

// DOM Elements
const authScreen = document.getElementById(‘auth-screen’);
const appContainer = document.getElementById(‘app’);
const googleSignInBtn = document.getElementById(‘google-signin-btn’);
const toggleEmailAuthBtn = document.getElementById(‘toggle-email-auth’);
const emailAuthForm = document.getElementById(‘email-auth-form’);
const emailSignInBtn = document.getElementById(‘email-signin-btn’);
const emailSignUpBtn = document.getElementById(‘email-signup-btn’);
const logoutBtn = document.getElementById(‘logout-btn’);
const loadingOverlay = document.getElementById(‘loading-overlay’);

// Show loading
function showLoading() {
loadingOverlay.style.display = ‘flex’;
}

// Hide loading
function hideLoading() {
loadingOverlay.style.display = ‘none’;
}

// Google Sign-In
googleSignInBtn.addEventListener(‘click’, async () => {
showLoading();
try {
const result = await auth.signInWithPopup(googleProvider);
const user = result.user;

```
    // Save user profile to Firestore
    await db.collection('users').doc(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Signed in with Google:', user.displayName);
} catch (error) {
    console.error('❌ Google Sign-In Error:', error);
    alert(`Sign-in failed: ${error.message}`);
    hideLoading();
}
```

});

// Toggle Email Auth Form
toggleEmailAuthBtn.addEventListener(‘click’, () => {
if (emailAuthForm.style.display === ‘none’) {
emailAuthForm.style.display = ‘block’;
toggleEmailAuthBtn.textContent = ‘Use Google instead’;
} else {
emailAuthForm.style.display = ‘none’;
toggleEmailAuthBtn.textContent = ‘Use email instead’;
}
});

// Email Sign-In
emailSignInBtn.addEventListener(‘click’, async () => {
const email = document.getElementById(‘email-input’).value;
const password = document.getElementById(‘password-input’).value;

```
if (!email || !password) {
    alert('Please enter both email and password');
    return;
}

showLoading();
try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    console.log('✅ Signed in with email:', result.user.email);
} catch (error) {
    console.error('❌ Email Sign-In Error:', error);
    alert(`Sign-in failed: ${error.message}`);
    hideLoading();
}
```

});

// Email Sign-Up
emailSignUpBtn.addEventListener(‘click’, async () => {
const email = document.getElementById(‘email-input’).value;
const password = document.getElementById(‘password-input’).value;

```
if (!email || !password) {
    alert('Please enter both email and password');
    return;
}

if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
}

showLoading();
try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;
    
    // Create user profile
    await db.collection('users').doc(user.uid).set({
        email: user.email,
        displayName: email.split('@')[0],
        photoURL: `https://ui-avatars.com/api/?name=${email}&background=6C5CE7&color=fff`,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Account created:', user.email);
} catch (error) {
    console.error('❌ Sign-Up Error:', error);
    alert(`Sign-up failed: ${error.message}`);
    hideLoading();
}
```

});

// Logout
logoutBtn.addEventListener(‘click’, async () => {
try {
await auth.signOut();
console.log(‘✅ Signed out’);
} catch (error) {
console.error(‘❌ Logout Error:’, error);
}
});

// Auth State Observer
auth.onAuthStateChanged(async (user) => {
hideLoading();

```
if (user) {
    // User is signed in
    currentUser = user;
    
    // Update last login
    await db.collection('users').doc(user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.log('Could not update last login:', err));
    
    // Show app, hide auth screen
    authScreen.style.display = 'none';
    appContainer.style.display = 'block';
    
    // Initialize app with user data
    initializeApp(user);
    
    console.log('👤 Current user:', user.displayName || user.email);
} else {
    // User is signed out
    currentUser = null;
    
    // Show auth screen, hide app
    authScreen.style.display = 'flex';
    appContainer.style.display = 'none';
    
    console.log('👋 No user signed in');
}
```

});

// Get current user
function getCurrentUser() {
return currentUser;
}

// Export for use in other scripts
window.getCurrentUser = getCurrentUser;
