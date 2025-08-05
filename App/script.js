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

// Modules data with Bootstrap icons
const modulesData = {
  "modules": [
    {
      "id": "dashboard",
      "name": "Dashboard",
      "icon": "bi bi-speedometer2",
      "subSections": [
        { "id": "overview", "name": "Overview" },
        { "id": "reports", "name": "Reports" },
        { "id": "analytics", "name": "Analytics" }
      ]
    },
    {
      "id": "customers",
      "name": "Customers",
      "icon": "bi bi-people-fill",
      "subSections": [
        { "id": "all-customers", "name": "All Customers" },
        { "id": "leads", "name": "Leads" },
        { "id": "accounts", "name": "Accounts" },
        { "id": "contacts", "name": "Contacts" }
      ]
    },
    {
      "id": "deals",
      "name": "Deals",
      "icon": "bi bi-cash-stack",
      "subSections": [
        { "id": "active-deals", "name": "Active Deals" },
        { "id": "closed-deals", "name": "Closed Deals" },
        { "id": "pipeline-view", "name": "Pipeline View" },
        { "id": "forecasting", "name": "Forecasting" }
      ]
    },
    {
      "id": "tasks",
      "name": "Tasks",
      "icon": "bi bi-check2-square",
      "subSections": [
        { "id": "my-tasks", "name": "My Tasks" },
        { "id": "team-tasks", "name": "Team Tasks" },
        { "id": "overdue-tasks", "name": "Overdue Tasks" },
        { "id": "calendar", "name": "Calendar" }
      ]
    },
    {
      "id": "campaigns",
      "name": "Campaigns",
      "icon": "bi bi-megaphone-fill",
      "subSections": [
        { "id": "active-campaigns", "name": "Active Campaigns" },
        { "id": "past-campaigns", "name": "Past Campaigns" },
        { "id": "templates", "name": "Templates" }
      ]
    },
    {
      "id": "support",
      "name": "Support",
      "icon": "bi bi-headset",
      "subSections": [
        { "id": "open-tickets", "name": "Open Tickets" },
        { "id": "resolved-tickets", "name": "Resolved Tickets" },
        { "id": "knowledge-base", "name": "Knowledge Base" }
      ]
    },
    {
      "id": "settings",
      "name": "Settings",
      "icon": "bi bi-gear-fill",
      "subSections": [
        { "id": "user-management", "name": "User Management" },
        { "id": "integrations", "name": "Integrations" },
        { "id": "preferences", "name": "Preferences" },
        { "id": "data-import-export", "name": "Data Import/Export" }
      ]
    }
  ]
};

// DOM elements
const miniSidebar = document.getElementById("miniSidebar");
const subSidebar = document.getElementById("subSidebar");
const subList = document.getElementById("subList");
const searchInput = document.getElementById("searchInput");
const expandBtn = document.getElementById("expandBtn");
const mainContent = document.getElementById("mainContent");
const dragHandle = document.getElementById("dragHandle");

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    checkAuth();
    initializeDragAndExpand();
    renderIcons();
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
    } else {
        crmData = modulesData;
        saveCRMData();
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
    // Expand button functionality
    expandBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            miniSidebar.classList.add("hide");
            subSidebar.classList.add("hide");
            dragHandle.classList.add("hide");
            mainContent.style.width = "100%";
            expandBtn.innerHTML = `<i class="bi bi-arrow-left-right"></i>`;
        } else {
            miniSidebar.classList.remove("hide");
            subSidebar.classList.remove("hide");
            dragHandle.classList.remove("hide");
            mainContent.style.width = "auto";
            expandBtn.innerHTML = `<i class="bi bi-arrows-fullscreen"></i>`;
        }
    });

    // Drag handle functionality
    dragHandle.addEventListener('mousedown', () => {
        isDragging = true;
        document.body.style.cursor = "col-resize";
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        let newWidth = e.clientX - miniSidebar.offsetWidth;
        if (newWidth < 150) newWidth = 150;
        if (newWidth > 500) newWidth = 500;

        subSidebar.style.width = `${newWidth}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = "default";
    });

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

// Render Icons Function
function renderIcons(filter = "") {
    miniSidebar.innerHTML = "";
    modulesData.modules.forEach(module => {
        if (module.name.toLowerCase().includes(filter) ||
            module.subSections.some(s => s.name.toLowerCase().includes(filter))) {

            const iconDiv = document.createElement("div");
            iconDiv.innerHTML = `<i class="${module.icon} fs-4"></i>`;
            iconDiv.title = module.name;

            iconDiv.addEventListener("click", () => {
                loadSubSections(module);
            });

            miniSidebar.appendChild(iconDiv);
        }
    });
}

// Load Sub Sections Function
function loadSubSections(module) {
    currentModule = module.id;
    subSidebar.querySelector("h6").textContent = module.name;
    subList.innerHTML = "";

    module.subSections.forEach(sub => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = sub.name;

        li.addEventListener("click", () => {
            currentSection = sub.id;
            showSectionContent(module, sub);
        });

        subList.appendChild(li);
    });

    // Show module overview
    showModuleContent(module);
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

// Module Content Functions
function showModuleContent(module) {
    const dataDisplay = document.getElementById('dataDisplay');
    dataDisplay.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <i class="${module.icon} fs-1 me-3 text-primary"></i>
            <div>
                <h4 class="mb-0">${module.name}</h4>
                <p class="text-muted mb-0">Select a section to view details</p>
            </div>
        </div>
        <div class="row">
            ${module.subSections.map(section => `
                <div class="col-md-4 mb-3">
                    <div class="card h-100" onclick="showSectionContent('${module.id}', '${section.id}')" style="cursor: pointer;">
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

function showSectionContent(moduleId, sectionId) {
    const module = modulesData.modules.find(m => m.id === moduleId);
    const section = module.subSections.find(s => s.id === sectionId);
    
    if (section) {
        currentSection = sectionId;
        showSectionContent(module, section);
    }
}

function showSectionContent(module, section) {
    const dataDisplay = document.getElementById('dataDisplay');
    
    // Generate sample data based on section
    const sampleData = generateSampleData(module.id, section.id);
    
    dataDisplay.innerHTML = `
        <div class="d-flex align-items-center mb-3">
            <i class="${module.icon} fs-1 me-3 text-primary"></i>
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
searchInput.addEventListener('input', (e) => {
    renderIcons(e.target.value.toLowerCase());
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