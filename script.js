// Sample data for welfare schemes
const schemesData = [
    {
        id: 1,
        title: "National Food Security Scheme",
        category: "food",
        state: "all",
        description: "Provides subsidized food grains to eligible households through the Public Distribution System.",
        link: "apply.html?scheme=National%20Food%20Security%20Scheme&desc=Provides%20subsidized%20food%20grains%20to%20eligible%20households"
    },
    {
        id: 2,
        title: "PM Kisan Samman Nidhi",
        category: "employment",
        state: "all",
        description: "Financial support of ₹6,000 per year to small and marginal farmer families.",
        link: "apply.html?scheme=PM%20Kisan%20Samman%20Nidhi&desc=Financial%20support%20of%20%E2%82%B96%2C000%20per%20year%20to%20small%20and%20marginal%20farmer%20families"
    },
    {
        id: 3,
        title: "National Social Assistance Programme",
        category: "employment",
        state: "all",
        description: "Provides pension to the elderly, widows and persons with disabilities in BPL families.",
        link: "apply.html?scheme=National%20Social%20Assistance%20Programme&desc=Provides%20pension%20to%20the%20elderly%2C%20widows%20and%20persons%20with%20disabilities%20in%20BPL%20families"
    },
    {
        id: 4,
        title: "Delhi Scholarship for SC Students",
        category: "education",
        state: "delhi",
        description: "Scholarship for students belonging to Scheduled Castes in Delhi.",
        link: "apply.html?scheme=Delhi%20Scholarship%20for%20SC%20Students&desc=Scholarship%20for%20students%20belonging%20to%20Scheduled%20Castes%20in%20Delhi"
    },
    {
        id: 5,
        title: "Maharashtra Health Scheme",
        category: "healthcare",
        state: "maharashtra",
        description: "Free healthcare services for families below poverty line in Maharashtra.",
        link: "apply.html?scheme=Maharashtra%20Health%20Scheme&desc=Free%20healthcare%20services%20for%20families%20below%20poverty%20line%20in%20Maharashtra"
    },
    {
        id: 6,
        title: "UP Housing Scheme",
        category: "housing",
        state: "up",
        description: "Affordable housing for low-income families in Uttar Pradesh.",
        link: "#"
    },
    {
        id: 7,
        title: "Bihar Student Credit Card",
        category: "education",
        state: "bihar",
        description: "Education loan scheme for students in Bihar with low interest rates.",
        link: "#"
    },
    {
        id: 8,
        title: "West Bengal Kanyashree Prakalpa",
        category: "education",
        state: "west-bengal",
        description: "Conditional cash transfer scheme aiming at improving the status and well-being of girls.",
        link: "#"
    },
    {
        id: 9,
        title: "Ayushman Bharat Yojana",
        category: "healthcare",
        state: "all",
        description: "Provides health insurance coverage up to ₹5 lakhs per family per year for hospitalization.",
        link: "#"
    }    
];

// User state
let currentUser = null;
let bookmarkedSchemes = [];
let appliedSchemes = JSON.parse(localStorage.getItem('userApplications')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displaySchemes(schemesData);
    
    // Check if user is logged in (for demo purposes)
    if (localStorage.getItem('demoLoggedIn')) {
        currentUser = {
            name: localStorage.getItem('demoUserName') || 'User',
            email: localStorage.getItem('demoUserEmail') || 'user@example.com'
        };
        updateAuthState();
    }
    
    // Setup form submissions
    if(document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    if(document.getElementById('signupForm')) {
        document.getElementById('signupForm').addEventListener('submit', handleSignup);
    }
    
    // Update dashboard if it exists
    if(document.getElementById('dashboardModal')) {
        updateDashboard();
    }
});

// Display schemes in the UI
function displaySchemes(schemes) {
    const container = document.getElementById('schemesContainer');
    if (!container) return;

    container.innerHTML = '';

    schemes.forEach(scheme => {
        const isBookmarked = bookmarkedSchemes.includes(scheme.id);
        const isApplied = appliedSchemes.some(app => app.scheme === scheme.title);

        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 p-2';

        card.innerHTML = `
            <div class="card scheme-card h-100 position-relative">
                <i class="bi bi-bookmark${isBookmarked ? '-fill' : ''} bookmark-icon ${isBookmarked ? 'active' : ''}" 
                   onclick="toggleBookmark(${scheme.id}, this)"></i>
                <div class="card-body">
                    <h5 class="card-title">${scheme.title}</h5>
                    <span class="badge bg-secondary mb-2">${getCategoryName(scheme.category)}</span>
                    ${scheme.state !== 'all' ? `<span class="badge bg-info mb-2 ms-1">${getStateName(scheme.state)}</span>` : ''}
                    <p class="card-text">${scheme.description}</p>
                    ${
                        isApplied
                            ? `<button class="btn btn-success w-100" disabled>Applied</button>`
                            : `<a href="${scheme.link}" class="btn btn-primary w-100">Apply Now</a>`
                    }
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}


// Search schemes based on input
function searchSchemes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = schemesData.filter(scheme => 
        scheme.title.toLowerCase().includes(searchTerm) || 
        scheme.description.toLowerCase().includes(searchTerm)
    );
    displaySchemes(filtered);
}

// Filter schemes based on category and state
function filterSchemes() {
    const category = document.getElementById('categoryFilter').value;
    const state = document.getElementById('stateFilter').value;
    
    let filtered = schemesData;
    
    if (category) {
        filtered = filtered.filter(scheme => scheme.category === category);
    }
    
    if (state) {
        filtered = filtered.filter(scheme => scheme.state === 'all' || scheme.state === state);
    }
    
    displaySchemes(filtered);
}

// Toggle bookmark for a scheme
function toggleBookmark(schemeId, icon) {
    if (!currentUser) {
        alert('Please login to bookmark schemes.');
        return;
    }
    
    const index = bookmarkedSchemes.indexOf(schemeId);
    if (index === -1) {
        bookmarkedSchemes.push(schemeId);
        icon.classList.add('bi-bookmark-fill');
        icon.classList.remove('bi-bookmark');
        icon.classList.add('active');
    } else {
        bookmarkedSchemes.splice(index, 1);
        icon.classList.remove('bi-bookmark-fill');
        icon.classList.add('bi-bookmark');
        icon.classList.remove('active');
    }
    
    // For demo purposes, update the dashboard if open
    updateDashboard();
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    
    // For demo purposes, we'll just set a user
    currentUser = {
        name: "Maaheer Furia",
        email: email
    };
    
    // Store in localStorage for demo persistence
    localStorage.setItem('demoLoggedIn', 'true');
    localStorage.setItem('demoUserEmail', email);
    localStorage.setItem('demoUserName', 'Maaheer Furia');
    
    // Close modal and update UI
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
    
    updateAuthState();
    alert('Login successful!');
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    // For demo purposes, we'll just set a user
    currentUser = {
        name: name,
        email: email
    };
    
    // Store in localStorage for demo persistence
    localStorage.setItem('demoLoggedIn', 'true');
    localStorage.setItem('demoUserEmail', email);
    localStorage.setItem('demoUserName', name);
    
    // Close modal and update UI
    const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
    signupModal.hide();
    
    updateAuthState();
    alert('Account created successfully! You are now logged in.');
}

// Logout function
// Logout function - updated version
function logout() {
    currentUser = null;
    bookmarkedSchemes = [];
    localStorage.removeItem('demoLoggedIn');
    localStorage.removeItem('demoUserEmail');
    localStorage.removeItem('demoUserName');
    
    const dashboardModal = bootstrap.Modal.getInstance(document.getElementById('dashboardModal'));
    if (dashboardModal) dashboardModal.hide();
    
    updateAuthState();
    
    // Force a small delay to ensure modal is closed before showing alert
    setTimeout(() => {
        alert('You have been logged out.');
        // Optional: reload the page to reset all states
        window.location.reload();
    }, 200);
}

// Update UI based on auth state
function updateAuthState() {
    const loginBtn = document.querySelector('.navbar button[data-bs-target="#loginModal"]');
    const signupBtn = document.querySelector('.navbar button[data-bs-target="#signupModal"]');
    
    if (currentUser) {
        loginBtn.textContent = 'Dashboard';
        loginBtn.setAttribute('data-bs-target', '#dashboardModal');
        signupBtn.style.display = 'none';
        
        // Update dashboard
        updateDashboard();
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.setAttribute('data-bs-target', '#loginModal');
        signupBtn.style.display = 'block';
    }
}

// Update dashboard content
function updateDashboard() {
    if (!currentUser) return;
    
    if(document.getElementById('userNameDisplay')) {
        document.getElementById('userNameDisplay').textContent = currentUser.name;
    }
    
    // Show bookmarked schemes
    const bookmarkedContainer = document.getElementById('bookmarkedSchemes');
    if(bookmarkedContainer) {
        bookmarkedContainer.innerHTML = '';
        
        if (bookmarkedSchemes.length === 0) {
            bookmarkedContainer.innerHTML = '<p>You have no bookmarked schemes yet.</p>';
        } else {
            const bookmarked = schemesData.filter(scheme => bookmarkedSchemes.includes(scheme.id));
            bookmarked.forEach(scheme => {
                const col = document.createElement('div');
                col.className = 'col-md-6 mb-3';
                col.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h6>${scheme.title}</h6>
                            <p class="small">${scheme.description.substring(0, 60)}...</p>
                            <a href="${scheme.link}" class="btn btn-sm btn-primary">View Scheme</a>
                            <button class="btn btn-sm btn-outline-danger ms-2" onclick="removeBookmark(${scheme.id})">Remove</button>
                        </div>
                    </div>
                `;
                bookmarkedContainer.appendChild(col);
            });
        }
    }
    
    // Show applications
    const applicationsContainer = document.getElementById('applicationsContainer');
    if(applicationsContainer) {
        applicationsContainer.innerHTML = '';
        
        if (appliedSchemes.length === 0) {
            applicationsContainer.innerHTML = '<p>You have no applications yet.</p>';
        } else {
            appliedSchemes.forEach((app, index) => {
                const appElement = document.createElement('div');
                appElement.className = 'card mb-3';
                appElement.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5>${app.scheme}</h5>
                            <span class="badge bg-${getStatusColor(app.status)}">${app.status}</span>
                        </div>
                        <p class="mb-1"><strong>Applied on:</strong> ${new Date(app.date).toLocaleDateString()}</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="viewApplicationDetails(${index})">View Details</button>
                    </div>
                `;
                applicationsContainer.appendChild(appElement);
            });
        }
    }
}

function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'approved': return 'success';
        case 'rejected': return 'danger';
        case 'pending': return 'warning';
        default: return 'primary';
    }
}

function viewApplicationDetails(index) {
    const app = appliedSchemes[index];
    alert(`Application Details:\n\nScheme: ${app.scheme}\nStatus: ${app.status}\nApplied on: ${new Date(app.date).toLocaleDateString()}\n\nName: ${app.personalInfo.name}\nEmail: ${app.personalInfo.email}`);
}

// Remove bookmark from dashboard
function removeBookmark(schemeId) {
    const index = bookmarkedSchemes.indexOf(schemeId);
    if (index !== -1) {
        bookmarkedSchemes.splice(index, 1);
        updateDashboard();
        
        // Also update the bookmark icon in the main schemes list if visible
        const icon = document.querySelector(`.bookmark-icon[onclick*="${schemeId}"]`);
        if (icon) {
            icon.classList.remove('bi-bookmark-fill', 'active');
            icon.classList.add('bi-bookmark');
        }
    }
}

// Helper functions
function getCategoryName(category) {
    const categories = {
        'education': 'Education',
        'healthcare': 'Healthcare',
        'employment': 'Employment',
        'housing': 'Housing',
        'food': 'Food Security'
    };
    return categories[category] || category;
}

function getStateName(state) {
    const states = {
        'delhi': 'Delhi',
        'maharashtra': 'Maharashtra',
        'up': 'Uttar Pradesh',
        'bihar': 'Bihar',
        'west-bengal': 'West Bengal'
    };
    return states[state] || state;
}