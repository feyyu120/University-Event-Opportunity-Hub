<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Admin Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root { 
            --sidebar-w: 260px; 
            --bg: #f8fafc; 
            --dark: #0f172a; 
            --accent: #3b82f6;
            --accent-hover: #2563eb;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #8b5cf6;
            --border: #e2e8f0;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
        }

        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', sans-serif; 
            background: var(--bg); 
            margin: 0; 
            display: flex;
            color: var(--text-primary);
        }

        /* Sidebar Styles */
        .sidebar { 
            width: var(--sidebar-w); 
            background: var(--dark); 
            height: 100vh; 
            position: fixed; 
            left: 0;
            top: 0;
            overflow-y: auto;
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        .sidebar h2 { 
            color: var(--accent); 
            font-size: 1.5rem; 
            margin-bottom: 2rem; 
            padding-bottom: 1rem;
            border-bottom: 2px solid #1e293b;
        }

        .nav-link { 
            display: block; 
            color: #94a3b8; 
            text-decoration: none; 
            padding: 0.75rem 1rem; 
            border-radius: 8px; 
            cursor: pointer; 
            transition: all 0.3s ease;
            margin-bottom: 0.25rem;
            font-weight: 500;
        }

        .nav-link:hover { 
            background: #1e293b; 
            color: white; 
            transform: translateX(4px);
        }

        .nav-link.active { 
            background: var(--accent); 
            color: white; 
            box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        hr { 
            border: none; 
            border-top: 1px solid #334155; 
            margin: 1rem 0; 
        }

        /* Main Content */
        .main { 
            margin-left: var(--sidebar-w); 
            flex: 1; 
            padding: 2rem;
            min-height: 100vh;
            transition: margin-left 0.3s ease;
        }

        /* Stats Grid */
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 1.5rem; 
            margin-bottom: 2rem; 
        }

        .stat-card { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 16px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid var(--border);
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-card h3 {
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 0.75rem;
        }

        .stat-card p {
            font-size: 2rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .stat-card small {
            color: var(--text-secondary);
            font-size: 0.75rem;
        }

        /* Content Card */
        .content-card { 
            background: white; 
            padding: 1.5rem; 
            border-radius: 16px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
            overflow-x: auto;
        }

        /* Add Leader Form Styles */
        .add-leader-form { 
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
            padding: 1.5rem; 
            border-radius: 12px; 
            margin-bottom: 1.5rem; 
            border: 1px solid var(--border);
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .add-leader-form h3 {
            color: var(--text-primary);
            margin-bottom: 1rem;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            gap: 1rem;
            align-items: end;
        }

        .form-field {
            flex: 1;
        }

        .form-field label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 0.875rem;
        }

        .form-field input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 0.875rem;
            transition: all 0.2s ease;
        }

        .form-field input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-actions {
            display: flex;
            gap: 0.75rem;
            align-items: center;
        }

        .btn-view {
            background: var(--info);
            color: white;
            margin-bottom: 1rem;
        }

        .btn-view:hover {
            background: #7c3aed;
        }

        .btn-secondary {
            background: #64748b;
            color: white;
        }

        .btn-secondary:hover {
            background: #475569;
        }

        /* Table Styles */
        table { 
            width: 100%; 
            border-collapse: collapse; 
        }

        th, td { 
            text-align: left; 
            padding: 1rem; 
            border-bottom: 1px solid var(--border);
            font-size: 0.875rem;
        }

        th { 
            background: #f8fafc; 
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        tr:hover {
            background: #f8fafc;
        }

        /* Input Styles for Club Management */
        .table-input {
            padding: 0.5rem;
            border: 1px solid var(--border);
            border-radius: 6px;
            font-size: 0.875rem;
            width: 100%;
            max-width: 200px;
        }

        .table-input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        /* Button Styles */
        .btn { 
            padding: 0.5rem 1rem; 
            border-radius: 8px; 
            border: none; 
            cursor: pointer; 
            font-size: 0.75rem;
            font-weight: 500;
            transition: all 0.2s ease;
            margin: 0 0.25rem;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-approve { 
            background: #dcfce7; 
            color: #166534; 
        }

        .btn-approve:hover {
            background: #bbf7d0;
        }

        .btn-reject { 
            background: #fee2e2; 
            color: #991b1b; 
        }

        .btn-reject:hover {
            background: #fecaca;
        }

        .btn-unban { 
            background: #f1f5f9; 
            color: #475569; 
        }

        .btn-unban:hover {
            background: #e2e8f0;
        }

        .btn-save {
            background: var(--success);
            color: white;
            padding: 0.5rem 1rem;
        }

        .btn-save:hover {
            background: var(--success-dark);
        }

        .btn-delete {
            background: var(--danger);
            color: white;
            padding: 0.5rem 1rem;
        }

        .btn-delete:hover {
            background: var(--danger-dark);
        }

        /* Badge Styles */
        .badge { 
            padding: 0.25rem 0.75rem; 
            border-radius: 20px; 
            font-size: 0.75rem; 
            font-weight: 600;
            display: inline-block;
        }

        .badge.admin { 
            background: #dbeafe; 
            color: #1e40af; 
        }

        .badge.club_leader { 
            background: #fef3c7; 
            color: #92400e; 
        }

        .badge.banned { 
            background: #fee2e2; 
            color: #991b1b; 
        }

        .badge.verified {
            background: #dcfce7;
            color: #166534;
        }

        .badge.unverified {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Loading States */
        .loading {
            text-align: center;
            padding: 3rem;
            color: var(--text-secondary);
        }

        .loading-spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-secondary);
        }

        .empty-state svg {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        /* Error Message */
        .error-message {
            background: #fee2e2;
            border-left: 4px solid var(--danger);
            color: #991b1b;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }

        /* Toast Notification */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            z-index: 1100;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .toast.success { background: var(--success); }
        .toast.error { background: var(--danger); }
        .toast.warning { background: var(--warning); }
        .toast.info { background: var(--info); }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        /* Utility Classes */
        .hidden { display: none; }

        /* Responsive Design */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }

            .sidebar.mobile-open {
                transform: translateX(0);
            }

            .main {
                margin-left: 0;
                padding: 1rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .form-actions {
                justify-content: flex-end;
            }

            table, thead, tbody, th, td, tr {
                display: block;
            }

            thead {
                display: none;
            }

            tr {
                margin-bottom: 1rem;
                border: 1px solid var(--border);
                border-radius: 8px;
                padding: 0.5rem;
            }

            td {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                border: none;
                border-bottom: 1px solid var(--border);
                flex-wrap: wrap;
            }

            td:last-child {
                border-bottom: none;
            }

            td::before {
                content: attr(data-label);
                font-weight: 600;
                color: var(--text-secondary);
                margin-right: 1rem;
                min-width: 120px;
            }

            .table-input {
                max-width: 150px;
            }

            .menu-toggle {
                display: block;
                position: fixed;
                top: 1rem;
                left: 1rem;
                z-index: 1001;
                background: var(--accent);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
            }
        }

        @media (min-width: 769px) {
            .menu-toggle {
                display: none;
            }
        }
    </style>
</head>
<body>

<button class="menu-toggle" onclick="toggleSidebar()">☰ Menu</button>

<div class="sidebar" id="sidebar">
    <div style="padding: 1.5rem;">
        <h2>🏛️ ASTU Admin</h2>
        <div class="nav-link active" data-tab="dashboard" onclick="loadTab('dashboard')">📊 Dashboard</div>
        <div class="nav-link" data-tab="moderation" onclick="loadTab('moderation')">⚖️ Moderation</div>
        <div class="nav-link" data-tab="reports" onclick="loadTab('reports')">🚩 Reports</div>
        <div class="nav-link" data-tab="club_management" onclick="loadTab('club_management')">🏢 Club Management</div>
        <div class="nav-link" data-tab="users" onclick="loadTab('users')">👥 Users</div>
        <div class="nav-link" data-tab="blacklist" onclick="loadTab('blacklist')">🚫 Blacklist</div>
        <hr>
        <div class="nav-link" onclick="logout()" style="color: #f87171;">🚪 Logout</div>
    </div>
</div>

<div class="main">
    <div id="view-title"><h1>Dashboard Overview</h1></div>

    <div id="tab-dashboard" class="tab-content">
        <div class="stats-grid" id="stats-container">
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        </div>
    </div>

    <div id="tab-data" class="tab-content hidden"> 
        <div id="club-management-container"></div>
         
        <div id="data-container" class="content-card">
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading data...</p>
            </div>
        </div>
    </div>
</div>

<script> 

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
 
const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost/University-Event-Opportunity-Hub/backend/admin/" 
    : "https://astu-event-center-backend.onrender.com/admin";

async function apiFetch(endpoint, method = 'POST', body = null) {
    const user_id = localStorage.getItem('storedUserId');
     
    const url = `${API_BASE}${endpoint}`;  

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user_id || '',  
        } 
    };

    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(url, options);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast(error.message || 'Failed to connect to server', 'error');
        throw error;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
}

document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('mobile-open') &&
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
    }
});
 
function toggleAddForm() {
    const form = document.getElementById('add-leader-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}
 
async function submitNewLeader() {
    const userId = document.getElementById('new-leader-uid').value.trim();
    const clubName = document.getElementById('new-leader-club').value.trim();

    if (!userId || !clubName) {
        showToast('Please fill in both the User ID and the Club Name', 'warning');
        return;
    };

    
    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Adding...';

    try {
        const res = await apiFetch('/anylitics/club_managemet.php', 'POST', {
            action: 'add',
            user_id: userId,
            club_name: clubName
        });

        if (res.success) {
            showToast('User successfully promoted to Club Leader!', 'success'); 
            document.getElementById('new-leader-uid').value = '';
            document.getElementById('new-leader-club').value = '';
            toggleAddForm(); 
            await loadClubManagement();
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}
 
async function loadTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
     
    const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(
        link => link.getAttribute('data-tab') === tab || 
                (link.textContent.includes(tab) && tab !== 'dashboard')
    );
    if (activeLink) activeLink.classList.add('active');
    
    document.getElementById('view-title').innerHTML = `<h1>${getTabTitle(tab)}</h1>`;
    
    if (tab === 'dashboard') {
        document.getElementById('tab-dashboard').classList.remove('hidden');
        loadAnalytics();
    } else if (tab === 'club_management') {
        document.getElementById('tab-data').classList.remove('hidden');
        document.getElementById('data-container').classList.add('hidden');
        await loadClubManagement();
    } else {
        document.getElementById('tab-data').classList.remove('hidden');
        document.getElementById('club-management-container')?.classList.add('hidden');
        document.getElementById('data-container').classList.remove('hidden');
        await loadTableData(tab);
    }
    
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
}

function getTabTitle(tab) {
    const titles = {
        'dashboard': '📊 Dashboard Overview',
        'moderation': '⚖️ Content Moderation',
        'reports': '🚩 User Reports',
        'club_management': '🏢 Club Management',
        'users': '👥 User Management',
        'blacklist': '🚫 Blacklisted Users'
    };
    return titles[tab] || 'Admin Panel';
}

async function loadAnalytics() {
    const container = document.getElementById('stats-container');
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading dashboard data...</p>
        </div>
    `;

    try {
        const res = await apiFetch('/anylitics/dashboard.php' , 'GET');
        
        if (res.success && res.dashboard) {
            const d = res.dashboard;
            container.innerHTML = `
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <p>${d.users.total_users || 0}</p>
                    <small>${d.users.club_leader_count || 0} Club Leaders</small>
                </div>
                <div class="stat-card">
                    <h3>Opportunities</h3>
                    <p>${d.opportunities.total_opportunities || 0}</p>
                    <small>${d.opportunities.pending_moderation || 0} Pending</small>
                </div>
                <div class="stat-card">
                    <h3>System Health</h3>
                    <p>${d.system_health.unresolved_reports || 0}</p>
                    <small>Unresolved Reports</small>
                </div>
            `;
        } else {
            throw new Error('Invalid dashboard data structure');
        }
    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                ⚠️ Failed to load dashboard data. Please refresh the page.
            </div>
        `;
        showToast('Failed to load dashboard data', 'error');
    }
}
 
async function loadClubManagement() { 
    let container = document.getElementById('club-management-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'club-management-container';
        document.getElementById('tab-data').appendChild(container);
    }
    container.classList.remove('hidden');
     
    document.getElementById('data-container').classList.add('hidden');
     
    container.innerHTML = `
        <!-- Button to show the form -->
        <div style="margin-bottom: 1rem;">
            <button class="btn btn-view" onclick="toggleAddForm()">➕ Add New Club Leader</button>
        </div>

        <!-- Add Club Leader Form (Hidden by default) -->
        <div id="add-leader-form" class="add-leader-form" style="display: none;">
            <h3>🎯 Promote Student to Club Leader</h3>
            <div class="form-grid">
                <div class="form-field">
                    <label>👤 User ID (from Users tab)</label>
                    <input type="text" id="new-leader-uid" placeholder="e.g., b1b152d9-1234-5678-9abc-def012345678">
                </div>
                <div class="form-field">
                    <label>🏢 Club Name</label>
                    <input type="text" id="new-leader-club" placeholder="e.g., Software Engineering Society">
                </div>
                <div class="form-actions">
                    <button class="btn btn-approve" onclick="submitNewLeader()">➕ Add Leader</button>
                    <button class="btn btn-secondary" onclick="toggleAddForm()">❌ Cancel</button>
                </div>
            </div>
        </div>

        <!-- Club Leaders Table -->
        <div class="content-card" id="club-leaders-table">
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading club leaders...</p>
            </div>
        </div>
    `;
 
    await loadClubLeadersTable();
}
 
async function loadClubLeadersTable() {
    const tableContainer = document.getElementById('club-leaders-table');
    if (!tableContainer) return;

    tableContainer.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading club leaders...</p>
        </div>
    `;

    try {
        const res = await apiFetch('/clubs/clubs_list.php');
        
        if (!res.data || res.data.length === 0) {
            tableContainer.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <h3>No Club Leaders Found</h3>
                    <p>Use the "Add New Club Leader" button to promote a student.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="overflow-x: auto;">
                <h3 style="margin-bottom: 1rem;">📋 Current Club Leaders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Club Name</th>
                            <th>Leader Name</th>
                            <th>Email</th>
                            <th>Total Posts</th>
                            <th>Verification Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        res.data.forEach(club => {
            const isVerified = club.is_verified == 1;
            html += `
                <tr>
                    <td data-label="Club Name">
                        <input type="text" value="${escapeHtml(club.club_name)}" id="club-name-${club.id}" class="table-input">
                    </td>
                    <td data-label="Leader Name">${escapeHtml(club.full_name)}</td>
                    <td data-label="Email">${escapeHtml(club.email)}</td>
                    <td data-label="Total Posts">
                        <span class="badge ${club.posts_count > 0 ? 'verified' : 'unverified'}">
                            📄 ${club.posts_count || 0} Posts
                        </span>
                    </td>
                    <td data-label="Verification Status">
                        <label style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" ${isVerified ? 'checked' : ''} id="verify-${club.id}">
                            <span class="badge ${isVerified ? 'verified' : 'unverified'}">
                                ${isVerified ? '✓ Verified' : '⭘ Unverified'}
                            </span>
                        </label>
                    </td>
                    <td data-label="Actions">
                        <button class="btn btn-save" onclick="updateClub('${club.id}')">💾 Save</button>
                        <button class="btn btn-delete" onclick="removeClubLeader('${club.id}')">🗑️ Remove</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        tableContainer.innerHTML = html;
    } catch (error) {
        tableContainer.innerHTML = `
            <div class="error-message">
                ⚠️ Failed to load club leaders. Error: ${error.message}
                <br><br>
                <button onclick="loadClubLeadersTable()" class="btn btn-unban" style="margin-top: 1rem;">
                    🔄 Retry
                </button>
            </div>
        `;
        showToast('Failed to load club management data', 'error');
    }
}
 
async function updateClub(id) {
    const clubName = document.getElementById(`club-name-${id}`).value;
    const isVerified = document.getElementById(`verify-${id}`).checked;

    if (!clubName.trim()) {
        showToast('Club name cannot be empty', 'warning');
        return;
    }

    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Saving...';

    try {
        const res = await apiFetch('/anylitics/club_managemet.php', 'POST', {
            action: 'update',
            id: id,
            club_name: clubName.trim(),
            is_verified: isVerified ? 1 : 0
        });
        
        if (res.success) {
            showToast('Club information updated successfully!', 'success');
            await loadClubLeadersTable();  
        }
    } catch (error) {
        showToast(`Failed to update: ${error.message}`, 'error');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}
 
async function removeClubLeader(id) {
    if (!confirm('⚠️ WARNING: This will demote the club leader back to a regular student. All their club opportunities will be affected. Are you sure?')) {
        return;
    }

    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Removing...';

    try {
        const res = await apiFetch('/anylitics/club_managemet.php', 'POST', {
            action: 'remove',
            id: id
        });
        
        if (res.success) {
            showToast('Club leader has been removed and demoted to student', 'success');
            await loadClubLeadersTable();  
        }
    } catch (error) {
        showToast(`Failed to remove: ${error.message}`, 'error');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}
 
async function loadTableData(type) {
    const container = document.getElementById('data-container');
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading ${type} data...</p>
        </div>
    `;

    const endpoints = {
        moderation: '/moderation/pending.php',
        reports: '/reports/lists.php',
        users: '/users/list.php',
        blacklist: '/blacklist/list.php'
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
        container.innerHTML = '<div class="error-message">Invalid data type requested</div>';
        return;
    }

    try {
        const result = await apiFetch(endpoint);
        
        if (!result.data || result.data.length === 0) {
            showEmptyState(container, type);
            return;
        }

        renderTable(container, type, result.data);
    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                ⚠️ Failed to load ${type} data. Error: ${error.message}
                <br><br>
                <button onclick="loadTableData('${type}')" class="btn btn-unban" style="margin-top: 1rem;">
                    🔄 Retry
                </button>
            </div>
        `;
    }
}

function showEmptyState(container, type) {
    const messages = {
        moderation: 'No pending opportunities for moderation.',
        reports: 'No user reports to display.',
        users: 'No users found in the system.',
        blacklist: 'No users are currently blacklisted.'
    };
    
    container.innerHTML = `
        <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-6M4 13h6"/>
            </svg>
            <h3>No Data Available</h3>
            <p>${messages[type] || 'No data to display.'}</p>
            <button class="btn btn-primary mt-3" onclick="loadTableData('${type}')" style="margin-top: 1rem;">
                🔄 Refresh
            </button>
        </div>
    `;
}

function renderTable(container, type, data) {
    let html = '<div style="overflow-x: auto;"><table><thead><tr>';
    
    if (type === 'users') {
        html += '<th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>user_id</th><th>Actions</th>';
    } else if (type === 'moderation') {
        html += '<th>Title</th><th>Club</th><th>Actions</th>';
    } else if (type === 'blacklist') {
        html += '<th>User</th><th>IP Address</th><th>Reason</th><th>Banned By</th><th>Actions</th>';
    } else if (type === 'reports') {
        html += '<th>Reported By</th><th>Content</th><th>Reason</th><th>Status</th><th>Actions</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    data.forEach(item => {
        html += '<tr>';
        
        if (type === 'users') {
            html += `<td data-label="Name"><b>${escapeHtml(item.full_name)}</b></td>`;
            html += `<td data-label="Email">${escapeHtml(item.email)}</td>`;
            html += `<td data-label="Role"><span class="badge ${item.role}">${escapeHtml(item.role)}</span></td>`;
            html += `<td data-label="Department">${escapeHtml(item.department || 'N/A')}</td>`;
            html += `<td data-label="Department">${escapeHtml(item.id || 'N/A')}</td>`;
            html += `<td data-label="Actions">
                        <button class="btn btn-reject" onclick="blacklistUser('${item.id}', '${escapeHtml(item.full_name)}')">
                            🚫 Blacklist
                        </button>
                    </td>`;
        } else if (type === 'moderation') {
            const createdDate = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A';
            html += `<td data-label="Title"><strong>${escapeHtml(item.title)}</strong><br><small style="color: var(--text-secondary);">📅 ${createdDate}</small></td>`;
            html += `<td data-label="Club">${escapeHtml(item.organization_name)}</td>`;
            html += `<td data-label="Actions">
                        <button class="btn btn-approve" onclick="moderate('${item.id}', 'approve')">✓ Approve</button>
                        <button class="btn btn-reject" onclick="moderate('${item.id}', 'reject')">✗ Reject</button>
                    </td>`;
        } else if (type === 'blacklist') {
            html += `<td data-label="User">${escapeHtml(item.target_name || 'Guest/Unknown')}</td>`;
            html += `<td data-label="IP Address"><code>${escapeHtml(item.ip_address)}</code></td>`;
            html += `<td data-label="Reason">${escapeHtml(item.reason)}</td>`;
            html += `<td data-label="Banned By">${escapeHtml(item.blocked_by_name || 'System')}</td>`;
            html += `<td data-label="Actions">
                        <button class="btn btn-unban" onclick="unbanUser('${item.id}')">🔓 Unban</button>
                    </td>`;
        } else if (type === 'reports') {
            html += `<td data-label="Reported By">${escapeHtml(item.reporter_name || 'Anonymous')}</td>`;
            html += `<td data-label="Content">${escapeHtml(item.content_preview || 'N/A')}</td>`;
            html += `<td data-label="Reason">${escapeHtml(item.reason)}</td>`;
            html += `<td data-label="Status">
                        <span class="badge ${item.status === 'resolved' ? 'verified' : 'unverified'}">
                            ${escapeHtml(item.status || 'Pending')}
                        </span>
                    </td>`;
            html += `<td data-label="Actions">
                        <button class="btn btn-approve" onclick="resolveReport('${item.id}')">✓ Resolve</button>
                    </td>`;
        }
        
        html += '<tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}
  
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
 
async function blacklistUser(userId, name) {
    const reason = prompt(`Reason for blacklisting ${name}:`, "Violation of community terms");
    
    if (reason === null || reason.trim() === "") {
        showToast('Blacklisting cancelled', 'warning');
        return;
    }

    if (!confirm(`Are you sure you want to blacklist ${name}? This action can be reversed.`)) {
        return;
    }

    try {
        const res = await apiFetch('/blacklist/action.php', 'POST', { 
            action: 'ban',
            user_id: userId, 
            reason: reason.trim()
        });

        if (res.success) {
            showToast(`${name} has been blacklisted successfully`, 'success');
            loadTableData('users');
        }
    } catch (err) {
        showToast(`Failed to blacklist ${name}: ${err.message}`, 'error');
    }
}
 
async function unbanUser(blacklistId) {
    if (!confirm("Are you sure you want to lift this ban? The user/IP will regain access immediately.")) {
        return;
    }

    try { 
        const res = await apiFetch('/blacklist/action.php', 'POST', { 
            action: 'unban',
            id: blacklistId 
        });

        if (res.success) {
            showToast('Ban lifted successfully', 'success');
            loadTableData('blacklist');
        }
    } catch (err) {
        showToast(`Failed to lift ban: ${err.message}`, 'error');
    }
}
 
async function moderate(id, action) {
    let reason = "";
    if (action === 'reject') {
        reason = prompt("Enter rejection reason for the club leader:");
        if (reason === null) {
            showToast('Moderation cancelled', 'warning');
            return;
        }
        if (reason.trim() === "") {
            showToast('Please provide a reason for rejection', 'warning');
            return;
        }
    }

    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = action === 'approve' ? 'Approving...' : 'Rejecting...';

    try {
        const res = await apiFetch('/moderation/action.php', 'POST', { 
            id: id, 
            action: action, 
            reason: reason ? reason.trim() : null
        });

        if (res.success) {
            showToast(res.message || `Content ${action}ed successfully`, 'success');
            loadTableData('moderation');
        }
    } catch (err) {
        showToast(`Failed to ${action} content: ${err.message}`, 'error');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}
 
async function resolveReport(reportId) {
    if (!confirm("Mark this report as resolved?")) return;

    const button = event.target;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Resolving...';

    try {
        const res = await apiFetch('/reports/resolve.php', 'POST', { id: reportId });
        if (res.success) {
            showToast('Report marked as resolved', 'success');
            loadTableData('reports');
        }
    } catch (err) {
        showToast(`Failed to resolve report: ${err.message}`, 'error');
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}
 
async function logout() {
    if (!confirm('Are you sure you want to logout?')) return;
    localStorage.removeItem("storedUserId");
    try {  
        window.location.href = "admin_login.php";
    } catch (err) {
        console.error("Logout failed:", err);
        window.location.href = "admin_login.php";
    }
}
 
loadTab('dashboard');
</script>
</body>
</html>