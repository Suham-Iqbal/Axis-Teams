// CRM Dashboard with Original UI and Functionality

// Global variables
let currentUser = null;
let users = [];
let currentModule = null;
let currentSection = null;
let crmData = {};
let isExpanded = false;
let isDragging = false;
let startX = 0;
let startWidth = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    checkAuth();
    loadCRMData();
    initializeDragAndExpand();
});

// Data Management Functions
function loadData() {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('crm_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Create some default users for testing
        users = [
            { username: 'john_doe', email: 'john@example.com', password: 'password123', status: 'online' },
            { username: 'jane_smith', email: 'jane@example.com', password: 'password123', status: 'online' },
            { username: 'mike_wilson', email: 'mike@example.com', password: 'password123', status: 'away' },
            { username: 'sarah_jones', email: 'sarah@example.com', password: 'password123', status: 'offline' }
        ];
        saveUsers();
    }

    // Load CRM data from localStorage
    const savedCRMData = localStorage.getItem('crm_data');
    if (savedCRMData) {
        crmData = JSON.parse(savedCRMData);
    }
}

function saveUsers() {
    localStorage.setItem('crm_users', JSON.stringify(users));
}

function saveCRMData() {
    localStorage.setItem('crm_data', JSON.stringify(crmData));
}

// Drag and Expand Functionality
function initializeDragAndExpand() {
    const expandBtn = document.getElementById('expandBtn');
    const dragHandle = document.getElementById('dragHandle');
    const subSidebar = document.getElementById('subSidebar');
    const miniSidebar = document.getElementById('miniSidebar');

    // Expand button functionality
    expandBtn.addEventListener('click', function() {
        if (isExpanded) {
            // Collapse
            subSidebar.style.width = '250px';
            miniSidebar.style.width = '5%';
            expandBtn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
            isExpanded = false;
        } else {
            // Expand
            subSidebar.style.width = '400px';
            miniSidebar.style.width = '8%';
            expandBtn.innerHTML = '<i class="bi bi-arrows-collapse"></i>';
            isExpanded = true;
        }
    });

    // Drag handle functionality
    dragHandle.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startWidth = subSidebar.offsetWidth;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Prevent text selection while dragging
        e.preventDefault();
    });

    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(150, Math.min(500, startWidth + deltaX));
        
        subSidebar.style.width = newWidth + 'px';
    }

    function handleMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    // Add visual feedback for drag handle
    dragHandle.addEventListener('mouseenter', function() {
        this.style.background = '#999';
    });

    dragHandle.addEventListener('mouseleave', function() {
        if (!isDragging) {
            this.style.background = '#ccc';
        }
    });
}

// Authentication Functions
function checkAuth() {
    const savedUser = localStorage.getItem('crm_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showApp();
    } else {
        showAuthModal();
    }
}

function showAuthModal() {
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
}

function showApp() {
    document.getElementById('currentUsername').textContent = currentUser.username;
    updateUserStatus('online');
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('crm_currentUser', JSON.stringify(user));
        
        // Close modal
        const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
        authModal.hide();
        
        showApp();
        showAlert('Login successful!', 'success');
    } else {
        showAlert('Invalid username or password', 'danger');
    }
}

function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!username || !email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (users.find(u => u.username === username)) {
        showAlert('Username already exists', 'danger');
        return;
    }

    if (users.find(u => u.email === email)) {
        showAlert('Email already registered', 'danger');
        return;
    }

    const newUser = {
        username: username,
        email: email,
        password: password,
        status: 'online'
    };

    users.push(newUser);
    saveUsers();
    currentUser = newUser;
    localStorage.setItem('crm_currentUser', JSON.stringify(newUser));
    
    // Close modal
    const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
    authModal.hide();
    
    showApp();
    showAlert('Account created successfully!', 'success');
}

function logout() {
    updateUserStatus('offline');
    localStorage.removeItem('crm_currentUser');
    currentUser = null;
    showAuthModal();
    showAlert('Logged out successfully', 'info');
}

function updateUserStatus(status) {
    if (currentUser) {
        currentUser.status = status;
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex].status = status;
            saveUsers();
        }
    }
}

// CRM Data Loading
function loadCRMData() {
    // Load CRM modules from the JSON file
    fetch('crm_modules.json')
        .then(response => response.json())
        .then(data => {
            crmData = data;
            saveCRMData();
            displayCRMData(data);
        })
        .catch(error => {
            console.error('Error loading CRM data:', error);
            // Fallback data
            const fallbackData = {
                modules: [
                    { id: "dashboard", name: "Dashboard", icon: "🏠", subSections: [
                        { id: "overview", name: "Overview" },
                        { id: "reports", name: "Reports" },
                        { id: "analytics", name: "Analytics" }
                    ]},
                    { id: "customers", name: "Customers", icon: "👤", subSections: [
                        { id: "all-customers", name: "All Customers" },
                        { id: "leads", name: "Leads" },
                        { id: "accounts", name: "Accounts" },
                        { id: "contacts", name: "Contacts" }
                    ]},
                    { id: "deals", name: "Deals", icon: "💰", subSections: [
                        { id: "active-deals", name: "Active Deals" },
                        { id: "closed-deals", name: "Closed Deals" },
                        { id: "pipeline-view", name: "Pipeline View" },
                        { id: "forecasting", name: "Forecasting" }
                    ]},
                    { id: "tasks", name: "Tasks", icon: "📋", subSections: [
                        { id: "my-tasks", name: "My Tasks" },
                        { id: "team-tasks", name: "Team Tasks" },
                        { id: "overdue-tasks", name: "Overdue Tasks" },
                        { id: "calendar", name: "Calendar" }
                    ]},
                    { id: "campaigns", name: "Campaigns", icon: "📢", subSections: [
                        { id: "active-campaigns", name: "Active Campaigns" },
                        { id: "past-campaigns", name: "Past Campaigns" },
                        { id: "templates", name: "Templates" }
                    ]},
                    { id: "support", name: "Support", icon: "🎧", subSections: [
                        { id: "open-tickets", name: "Open Tickets" },
                        { id: "resolved-tickets", name: "Resolved Tickets" },
                        { id: "knowledge-base", name: "Knowledge Base" }
                    ]},
                    { id: "settings", name: "Settings", icon: "⚙️", subSections: [
                        { id: "user-management", name: "User Management" },
                        { id: "integrations", name: "Integrations" },
                        { id: "preferences", name: "Preferences" },
                        { id: "data-import-export", name: "Data Import/Export" }
                    ]}
                ]
            };
            crmData = fallbackData;
            saveCRMData();
            displayCRMData(fallbackData);
        });
}

function displayCRMData(data) {
    const subList = document.getElementById('subList');
    subList.innerHTML = '';

    data.modules.forEach(module => {
        const moduleItem = document.createElement('li');
        moduleItem.textContent = module.name;
        moduleItem.onclick = () => showModule(module.id);
        subList.appendChild(moduleItem);
    });
}

// Module Navigation Functions
function showModule(moduleId) {
    currentModule = moduleId;
    const module = crmData.modules.find(m => m.id === moduleId);
    
    if (module) {
        // Update sub sidebar
        const subList = document.getElementById('subList');
        subList.innerHTML = '';
        
        module.subSections.forEach(section => {
            const sectionItem = document.createElement('li');
            sectionItem.textContent = section.name;
            sectionItem.onclick = () => showSection(moduleId, section.id);
            subList.appendChild(sectionItem);
        });
        
        // Update main content
        showModuleContent(module);
    }
}

function showSection(moduleId, sectionId) {
    currentSection = sectionId;
    const module = crmData.modules.find(m => m.id === moduleId);
    const section = module.subSections.find(s => s.id === sectionId);
    
    if (section) {
        showSectionContent(module, section);
    }
}

function showModuleContent(module) {
    const dataDisplay = document.getElementById('dataDisplay');
    dataDisplay.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <span style="font-size: 2rem; margin-right: 1rem;">${module.icon}</span>
            <div>
                <h4 class="mb-0">${module.name}</h4>
                <p class="text-muted mb-0">Select a section to view details</p>
            </div>
        </div>
        <div class="row">
            ${module.subSections.map(section => `
                <div class="col-md-4 mb-3">
                    <div class="card h-100" onclick="showSection('${module.id}', '${section.id}')" style="cursor: pointer;">
                        <div class="card-body">
                            <h6 class="card-title">${section.name}</h6>
                            <p class="card-text text-muted">Click to view ${section.name.toLowerCase()} details</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showSectionContent(module, section) {
    const dataDisplay = document.getElementById('dataDisplay');
    
    // Generate sample data based on section
    const sampleData = generateSampleData(module.id, section.id);
    
    dataDisplay.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <span style="font-size: 2rem; margin-right: 1rem;">${module.icon}</span>
            <div>
                <h4 class="mb-0">${section.name}</h4>
                <p class="text-muted mb-0">${module.name} > ${section.name}</p>
            </div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${section.name} Data</h6>
                        <button class="btn btn-primary btn-sm" onclick="addNewItem('${module.id}', '${section.id}')">
                            <i class="bi bi-plus"></i> Add New
                        </button>
                    </div>
                    <div class="card-body">
                        ${sampleData}
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Quick Actions</h6>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-outline-primary btn-sm w-100 mb-2" onclick="exportData('${module.id}', '${section.id}')">
                            <i class="bi bi-download"></i> Export
                        </button>
                        <button class="btn btn-outline-secondary btn-sm w-100 mb-2" onclick="importData('${module.id}', '${section.id}')">
                            <i class="bi bi-upload"></i> Import
                        </button>
                        <button class="btn btn-outline-info btn-sm w-100" onclick="generateReport('${module.id}', '${section.id}')">
                            <i class="bi bi-graph-up"></i> Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateSampleData(moduleId, sectionId) {
    const dataMap = {
        'dashboard-overview': `
            <div class="row">
                <div class="col-md-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h5>Total Customers</h5>
                            <h3>1,234</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h5>Active Deals</h5>
                            <h3>56</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <h5>Open Tasks</h5>
                            <h3>23</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h5>Revenue</h5>
                            <h3>$45,678</h3>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'customers-all-customers': `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>john@example.com</td>
                        <td>+1-555-0123</td>
                        <td><span class="badge bg-success">Active</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary">Edit</button>
                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Jane Smith</td>
                        <td>jane@example.com</td>
                        <td>+1-555-0124</td>
                        <td><span class="badge bg-warning">Pending</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary">Edit</button>
                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `,
        'deals-active-deals': `
            <table class="table">
                <thead>
                    <tr>
                        <th>Deal Name</th>
                        <th>Customer</th>
                        <th>Value</th>
                        <th>Stage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Software License Deal</td>
                        <td>ABC Corp</td>
                        <td>$25,000</td>
                        <td><span class="badge bg-primary">Proposal</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary">Edit</button>
                            <button class="btn btn-sm btn-outline-success">Close</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Consulting Project</td>
                        <td>XYZ Inc</td>
                        <td>$15,000</td>
                        <td><span class="badge bg-warning">Negotiation</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary">Edit</button>
                            <button class="btn btn-sm btn-outline-success">Close</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `,
        'tasks-my-tasks': `
            <div class="list-group">
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">Follow up with ABC Corp</h6>
                        <small class="text-muted">Due: Today</small>
                    </div>
                    <span class="badge bg-warning">High Priority</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">Prepare proposal for XYZ Inc</h6>
                        <small class="text-muted">Due: Tomorrow</small>
                    </div>
                    <span class="badge bg-info">Medium Priority</span>
                </div>
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">Update customer database</h6>
                        <small class="text-muted">Due: Next Week</small>
                    </div>
                    <span class="badge bg-secondary">Low Priority</span>
                </div>
            </div>
        `
    };
    
    const key = `${moduleId}-${sectionId}`;
    return dataMap[key] || `
        <div class="text-center py-4">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <h5 class="mt-3">No data available</h5>
            <p class="text-muted">This section is under development</p>
        </div>
    `;
}

// Action Functions
function addNewItem(moduleId, sectionId) {
    showAlert(`Add new item to ${moduleId} > ${sectionId}`, 'info');
}

function exportData(moduleId, sectionId) {
    showAlert(`Exporting data from ${moduleId} > ${sectionId}`, 'success');
}

function importData(moduleId, sectionId) {
    showAlert(`Importing data to ${moduleId} > ${sectionId}`, 'info');
}

function generateReport(moduleId, sectionId) {
    showAlert(`Generating report for ${moduleId} > ${sectionId}`, 'success');
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const subList = document.getElementById('subList');
    const items = subList.getElementsByTagName('li');
    
    Array.from(items).forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Utility Functions
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

function showProfile() {
    if (currentUser) {
        showAlert(`Profile: ${currentUser.username} (${currentUser.email})`, 'info');
    }
}

// Event Listeners
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
});

// Auto-save user status when page is unloaded
window.addEventListener('beforeunload', function() {
    if (currentUser) {
        updateUserStatus('offline');
    }
});

// Add logout functionality to user dropdown
document.addEventListener('click', function(e) {
    if (e.target.closest('#currentUsername')) {
        // Create dropdown menu
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu show position-absolute';
        dropdown.style.cssText = 'top: 100%; right: 0; z-index: 1000;';
        dropdown.innerHTML = `
            <a class="dropdown-item" href="#" onclick="showProfile()">Profile</a>
            <a class="dropdown-item" href="#" onclick="logout()">Logout</a>
        `;
        
        // Remove existing dropdown
        const existingDropdown = document.querySelector('.dropdown-menu');
        if (existingDropdown) {
            existingDropdown.remove();
        }
        
        // Add new dropdown
        e.target.parentNode.appendChild(dropdown);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function closeDropdown(event) {
            if (!dropdown.contains(event.target) && !e.target.contains(event.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }
});