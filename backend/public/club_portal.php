<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Club Leader Workspace | ASTU</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root { 
            --primary: #3b82f6;
            --primary-dark: #2563eb;
            --primary-light: #60a5fa;
            --danger: #ef4444;
            --danger-dark: #dc2626;
            --success: #10b981;
            --success-dark: #059669;
            --warning: #f59e0b;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --border: #e2e8f0;
        }

        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif; 
            background: var(--bg); 
            margin: 0; 
            padding: 0;
            color: var(--text-primary);
        }

        /* Navigation */
        nav { 
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white; 
            padding: 1rem 2rem; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            flex-wrap: wrap;
        }

        .nav-brand {
            font-weight: 700;
            font-size: 1.25rem;
            letter-spacing: -0.5px;
        }

        .nav-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        /* Button Styles */
        .btn { 
            padding: 0.6rem 1.2rem; 
            border-radius: 8px; 
            border: none; 
            cursor: pointer; 
            font-weight: 500;
            transition: all 0.2s ease;
            font-size: 0.875rem;
        }

        .btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-primary { 
            background: var(--primary); 
            color: white; 
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        .btn-success { 
            background: var(--success); 
            color: white; 
        }

        .btn-success:hover {
            background: var(--success-dark);
        }

        .btn-danger { 
            background: var(--danger); 
            color: white; 
            padding: 0.4rem 0.8rem; 
            font-size: 0.8rem; 
        }

        .btn-danger:hover {
            background: var(--danger-dark);
        }

        .btn-outline {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-secondary);
        }

        .btn-outline:hover {
            background: var(--bg);
            border-color: var(--primary);
            color: var(--primary);
        }

        /* Container */
        .container { 
            max-width: 1400px; 
            margin: 2rem auto; 
            padding: 0 1.5rem; 
        }

        /* Cards */
        .card { 
            background: var(--card-bg); 
            padding: 2rem; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
        }

        .card h2 {
            margin-bottom: 1.5rem;
            color: var(--text-primary);
        }

        /* Profile Card */
        .profile-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-bottom: 2rem;
        }

        .profile-card h3 {
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .profile-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }

        .profile-field {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }

        .profile-field label {
            display: block;
            font-size: 0.75rem;
            opacity: 0.8;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .profile-field p {
            font-size: 1rem;
            font-weight: 500;
            word-break: break-word;
        }

        .verification-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            background: rgba(255,255,255,0.2);
        }

        .verification-badge.verified {
            background: #10b981;
            color: white;
        }

        .verification-badge.unverified {
            background: #f59e0b;
            color: white;
        }

        /* Form Styles */
        .form-group { 
            margin-bottom: 1.5rem; 
        }

        label { 
            display: block; 
            margin-bottom: 0.5rem; 
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 0.875rem;
        }

        input, textarea, select { 
            width: 100%; 
            padding: 0.75rem; 
            border: 1px solid var(--border); 
            border-radius: 8px; 
            box-sizing: border-box;
            font-family: inherit;
            transition: all 0.2s ease;
        }

        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
            vertical-align: top;
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

        .description-cell {
            max-width: 300px;
            word-wrap: break-word;
            white-space: pre-wrap;
        }

        .description-preview {
            cursor: pointer;
            color: var(--primary);
        }

        .description-full {
            display: none;
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: #f8fafc;
            border-radius: 6px;
            font-size: 0.8rem;
            line-height: 1.4;
        }

        .description-full.show {
            display: block;
        }

        /* Status Badges */
        .status-badge { 
            padding: 0.25rem 0.75rem; 
            border-radius: 20px; 
            font-size: 0.75rem; 
            font-weight: 600;
            text-transform: uppercase;
            display: inline-block;
        }

        .status-badge.pending { 
            background: #fef3c7; 
            color: #92400e; 
        }

        .status-badge.live { 
            background: #dcfce7; 
            color: #166534; 
        }

        .status-badge.rejected { 
            background: #fee2e2; 
            color: #991b1b; 
        }

        .status-badge.expired {
            background: #e2e8f0;
            color: #475569;
        }

        /* Department Checkboxes */
        .dept-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.75rem;
            background: #f8fafc;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--border);
        }

        .dept-grid label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: normal;
            margin: 0;
        }

        .dept-grid input[type="checkbox"] {
            width: auto;
            cursor: pointer;
        }

        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }

        .modal-content {
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Loading State */
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
            border-top-color: var(--primary);
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
        .toast.info { background: var(--primary); }

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
 
        .hidden { display: none; }
        .flex { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .mt-3 { margin-top: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
 
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }

            .nav-actions {
                width: 100%;
                justify-content: center;
            }

            .container {
                margin: 1rem auto;
                padding: 0 1rem;
            }

            .card {
                padding: 1.5rem;
            }

            .profile-info {
                grid-template-columns: 1fr;
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
                align-items: flex-start;
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

            .dept-grid {
                grid-template-columns: 1fr;
            }
            
            .description-cell {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>

<nav>
    <div class="nav-brand">🎯 Club Leader Workspace</div>
    <div id="nav-actions" class="nav-actions hidden">
        <button class="btn btn-outline" onclick="showView('list')">📋 My Opportunities</button>
        <button class="btn btn-primary" onclick="loadNotifications()">🔔 Messages</button>
        <button class="btn btn-success" onclick="showPostForm()">➕ Post Opportunity</button>
        <button class="btn btn-danger" onclick="logout()">🚪 Logout</button>
    </div>
</nav>

<div class="container"> 
    <div id="login-view" class="card">
        <h2>Club Leader Login</h2>
        <div class="form-group">
            <label>📧 Email Address</label>
            <input type="email" id="login-email" placeholder="club@astu.edu.et">
        </div>
        <div class="form-group">
            <label>🔒 Password</label>
            <input type="password" id="login-pass" placeholder="Enter your password">
        </div>
        <button class="btn btn-primary" onclick="handleLogin()">Login to Dashboard</button>
    </div>
 
    <div id="profile-section" class="hidden">
        <div class="card profile-card">
            <h3>🏢 Club Profile</h3>
            <div class="profile-info" id="profile-info"></div>
        </div>
    </div>

    <!-- List View -->
    <div id="list-view" class="hidden">
        <div class="card">
            <h2>📊 My Opportunities</h2>
            <div id="opp-table-container">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Loading your opportunities...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Post View -->
    <div id="post-view" class="hidden">
        <div class="card">
            <h2 id="post-title-header">Create New Opportunity</h2>
            
            <div class="form-group">
                <label>📌 Opportunity Title</label>
                <input type="text" id="post-title" placeholder="e.g., Annual Coding Competition 2024">
            </div>

            <div class="form-group">
                <label>🏢 Organization / Club Name</label>
                <input type="text" id="post-org" disabled>
            </div>

            <div class="form-group">
                <label>📝 Description</label>
                <textarea id="post-desc" rows="5" placeholder="Describe the opportunity in detail..."></textarea>
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <div class="form-group" style="flex: 1;">
                    <label>📅 Deadline</label>
                    <input type="date" id="post-deadline">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label>🎓 Minimum Year Level</label>
                    <input type="number" id="post-min-year" value="1" min="1" max="5">
                </div>
            </div>

            <div class="form-group">
                <label>🎯 Target Departments (Select all that apply)</label>
                <div id="dept-checkboxes" class="dept-grid">
                    <label><input type="checkbox" value="Software Engineering"> 💻 Software Engineering</label>
                    <label><input type="checkbox" value="Computer Science"> 🖥️ Computer Science</label>
                    <label><input type="checkbox" value="Electrical Engineering"> ⚡ Electrical Engineering</label>
                    <label><input type="checkbox" value="Mechanical Engineering"> 🔧 Mechanical Engineering</label>
                    <label><input type="checkbox" value="Civil Engineering"> 🏗️ Civil Engineering</label>
                    <label><input type="checkbox" value="Architecture"> 🏛️ Architecture</label>
                </div>
            </div>

            <div class="flex">
                <button class="btn btn-success" onclick="submitOpportunity()">✅ Submit for Approval</button>
                <button class="btn btn-outline" onclick="showView('list')">❌ Cancel</button>
            </div>
        </div>
    </div>
</div>
 
<div id="notif-modal" class="modal hidden">
    <div class="card modal-content">
        <h3>📬 Admin Messages</h3>
        <div id="notif-list" style="max-height: 300px; overflow-y: auto;">
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Loading messages...</p>
            </div>
        </div>
        <button class="btn btn-primary mt-3" onclick="closeModal()">Close</button>
    </div>
</div>

<script>
const API_BASE = window.location.hostname === "localhost" 
    ? "http://localhost/University-Event-Opportunity-Hub/backend/" 
    : "https://astu-event-center-backend.onrender.com/";

let CLUB_ID = localStorage.getItem('club_id'); 
let organization_name = 'Club'; 
let currentEditId = null;
let currentEditData = null;
let CLUB_DATA = null;
 
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
} 

function closeModal() {
    document.getElementById('notif-modal').classList.add('hidden');
}
 
function displayClubProfile(clubData) {
    const profileContainer = document.getElementById('profile-info');
    organization_name = clubData.full_name;
    const fields = [
        { label: "Club ID", value: clubData.id, icon: "🆔" },
        { label: "Club Name", value: clubData.full_name, icon: "🏢" },
        { label: "Organization Type", value: clubData.email, icon: "📧" },
        { label: "Bio/Description", value: clubData.role || 'No bio provided', icon: "📝" },
        { label: "Total Posts", value: clubData.university || 0, icon: "📊" },
        { label: "Verification Status", value: clubData.department == 1 ? 'Verified' : 'Unverified', icon: "✅", isBadge: true }
    ];
    
    profileContainer.innerHTML = fields.map(field => `
        <div class="profile-field">
            <label>${field.icon} ${field.label}</label>
            <p>
                ${field.isBadge ? 
                    `<span class="verification-badge ${field.value === 'Verified' ? 'verified' : 'unverified'}">${field.value}</span>` : 
                    escapeHtml(String(field.value))
                }
            </p>
        </div>
    `).join('');
}
 
function showView(view) {
    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('list-view').classList.add('hidden');
    document.getElementById('post-view').classList.add('hidden');
    document.getElementById('profile-section').classList.remove('hidden');
    document.getElementById('nav-actions').classList.remove('hidden');

    document.getElementById(`${view}-view`).classList.remove('hidden');
    
    if (view === 'list') {
        loadMyPosts();
    }
}
 
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-pass').value;

    if (!email || !password) {
        showToast('Please enter both email and password', 'warning');
        return;
    }

    const loginBtn = event.target;
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';

    try {
        const res = await fetch(`${API_BASE}src/auth/club_member_login.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
         
        if (data.club) { 
            CLUB_DATA = data.club;
            CLUB_ID = data.club.id;  

            localStorage.setItem('club_id', CLUB_ID);
            localStorage.setItem('club_data', JSON.stringify(CLUB_DATA));
             
            displayClubProfile(CLUB_DATA);
            
            showToast(data.message || 'Login successful! Welcome back!', 'success');
            showView('list');
        } else {
            showToast('Login failed. Invalid credentials or access denied.', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Failed to connect to server. Please try again.', 'error');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login to Dashboard';
    }
}
 
function toggleDescription(id) {
    const fullDesc = document.getElementById(`desc-full-${id}`);
    const preview = document.getElementById(`desc-preview-${id}`);
    
    if (fullDesc.classList.contains('show')) {
        fullDesc.classList.remove('show');
        if (preview) preview.style.display = 'inline';
    } else {
        fullDesc.classList.add('show');
        if (preview) preview.style.display = 'none';
    }
}
 
async function loadMyPosts() {
    const container = document.getElementById('opp-table-container');
    
    if (!CLUB_ID) {
        container.innerHTML = '<div class="empty-state">Please login to view your opportunities.</div>';
        return;
    }

    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading your opportunities...</p>
        </div>
    `;

    try {
        const res = await fetch(`${API_BASE}club/list.php`, {
            headers: { 'User-ID': CLUB_ID }
        });
        
        const result = await res.json();
        
        if (!result.data || result.data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-6M4 13h6"/>
                    </svg>
                    <h3>No Opportunities Yet</h3>
                    <p>Create your first opportunity by clicking the "+ Post Opportunity" button.</p>
                </div>
            `;
            return;
        }
 
        let html = `
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        result.data.forEach(opp => {
            const statusClass = opp.status === 'rejected' ? 'rejected' : (opp.status === 'live' ? 'live' : 'pending');
            const statusText = opp.status === 'rejected' ? 'Rejected' : (opp.status === 'live' ? 'Live' : 'Pending Review');
            const description = opp.description || 'No description provided';
            const descriptionPreview = description.length > 100 ? description.substring(0, 100) + '...' : description;
            const uniqueId = opp.id.replace(/-/g, '');
            
            let actionButtons = `
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button class="btn btn-danger" onclick="deleteOpp('${opp.id}')">🗑️ Delete</button>
            `;
            
                if (opp.status === 'rejected') {
                const safeOppData = encodeURIComponent(JSON.stringify(opp));
                console.log('Storing opp data:', opp);  
                actionButtons += `
                    <button class="btn btn-primary" data-opp-data='${safeOppData}' onclick="editOpportunityFromData(this)">
                        ✏️ Fix & Resubmit
                    </button>
                `;
            }
            
            actionButtons += `</div>`;
            
            html += `
                <tr>
                    <td data-label="Title"><strong>${escapeHtml(opp.title)}</strong></td>
                    <td data-label="Description" class="description-cell">
                        <div class="description-preview" id="desc-preview-${uniqueId}" onclick="toggleDescription('${uniqueId}')">
                            ${escapeHtml(descriptionPreview)}
                            ${description.length > 100 ? '<small style="color: var(--primary);"> (click to expand)</small>' : ''}
                        </div>
                        <div class="description-full" id="desc-full-${uniqueId}">
                            ${escapeHtml(description)}
                        </div>
                    </td>
                    <td data-label="Status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        ${opp.rejection_reason ? `<br><small style="color: var(--danger); margin-top: 5px; display: inline-block;">Reason: ${escapeHtml(opp.rejection_reason)}</small>` : ''}
                    </td>
                    <td data-label="Deadline">${opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'N/A'}</td>
                    <td data-label="Created At">${opp.created_at ? new Date(opp.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td data-label="Actions">${actionButtons}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Load posts error:', error);
        container.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--danger);">Failed to load opportunities. Please refresh the page.</p>
                <button class="btn btn-primary mt-3" onclick="loadMyPosts()">🔄 Retry</button>
            </div>
        `;
    }
}
 
function editOpportunityFromData(buttonElement) {
    try {
        const encodedData = buttonElement.getAttribute('data-opp-data');
        const decodedData = decodeURIComponent(encodedData);
        const opp = JSON.parse(decodedData);
        editOpportunity(opp);
    } catch (error) {
        console.log('Error parsing opportunity data:', error);
        showToast('Failed to load opportunity data for editing', 'error');
    }
}
 
function showPostForm() {
    currentEditId = null;
    currentEditData = null;
    document.getElementById('post-title-header').innerText = "Create New Opportunity";
    document.getElementById('post-title').value = '';
    document.getElementById('post-org').value = organization_name;
    document.getElementById('post-desc').value = '';
    document.getElementById('post-min-year').value = '1';
    document.getElementById('post-deadline').value = '';
    document.querySelectorAll('#dept-checkboxes input').forEach(cb => cb.checked = false);
    showView('post');
}
 
function editOpportunity(opp) {
    console.log('Editing opportunity:', opp); 
    
    currentEditId = opp.id;
    currentEditData = opp;
    
    document.getElementById('post-title-header').innerText = "✏️ Edit & Resubmit Opportunity";
    document.getElementById('post-title').value = opp.title || '';
    document.getElementById('post-org').value = opp.organization_name || organization_name;
    document.getElementById('post-desc').value = opp.description || '';
    document.getElementById('post-min-year').value = opp.min_year || 1;
    
    if (opp.deadline) {
        const dateOnly = opp.deadline.split(' ')[0];
        document.getElementById('post-deadline').value = dateOnly;
    }
    
    if (opp.target_departments) {
        let depts = opp.target_departments;
        if (typeof depts === 'string') {
            depts = depts.replace(/^\{|\}$/g, '').split(',');
            depts = depts.map(d => d.trim());
        }
        document.querySelectorAll('#dept-checkboxes input').forEach(cb => {
            cb.checked = Array.isArray(depts) && depts.includes(cb.value);
        });
    }
    
    console.log('Current Edit ID set to:', currentEditId);  
    
    showView('post');
}

async function submitOpportunity() {
    const title = document.getElementById('post-title').value.trim();
    const orgName = document.getElementById('post-org').value.trim();
    const description = document.getElementById('post-desc').value.trim();
    const deadline = document.getElementById('post-deadline').value;
    const minYear = parseInt(document.getElementById('post-min-year').value);
    const selectedDepts = Array.from(document.querySelectorAll('#dept-checkboxes input:checked')).map(cb => cb.value);
 
    if (!title) {
        showToast('Please enter an opportunity title', 'warning');
        return;
    }
    if (!orgName) {
        showToast('Please enter organization/club name', 'warning');
        return;
    }
    if (!description) {
        showToast('Please enter a description', 'warning');
        return;
    }
    if (!deadline) {
        showToast('Please select a deadline date', 'warning');
        return;
    }
    if (selectedDepts.length === 0) {
        showToast('Please select at least one target department', 'warning');
        return;
    }
    if (new Date(deadline) < new Date()) {
        showToast('Deadline cannot be in the past', 'warning');
        return;
    }

    const postgresArray = `{${selectedDepts.join(',')}}`;
     
    const payload = {
        action: currentEditId ? 'resubmit' : 'delete',  
        title: title,
        organization_name: orgName,
        description: description,
        deadline: deadline,
        min_year: minYear,
        opp_id : currentEditId,
        target_departments: postgresArray
    };
 

    const submitBtn = event.target;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try { 
        const endpoint = !currentEditId ? '/club/post.php' : '/club/action.php'; 
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'User-ID': CLUB_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if (data.success) {
            showToast(currentEditId ? 'Opportunity updated successfully!' : 'Opportunity submitted for approval!', 'success');
            currentEditId = null;
            currentEditData = null;
            showView('list');
        } else {
            console.log(data.error);
            showToast(data.message || 'Failed to submit opportunity' + data.error, 'error');
        }
    } catch (error) {
        console.error('Submit error:', error);
        showToast('Network error. Please check your connection.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit for Approval';
    }
}
async function deleteOpp(id) {
    if (!confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE}club/action.php`, {
            method: 'POST',
            headers: {
                'User-ID': CLUB_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'delete', opp_id: id })
        });

        const data = await res.json();
        
        if (data.success) {
            showToast('Opportunity deleted successfully', 'success');
            loadMyPosts();
        } else {
            showToast(data.message || 'Failed to delete opportunity', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Failed to delete opportunity', 'error');
    }
}

// Load notifications
async function loadNotifications() {
    const modal = document.getElementById('notif-modal');
    const notifList = document.getElementById('notif-list');
    
    modal.classList.remove('hidden');
    notifList.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Loading messages...</p>
        </div>
    `;

    try {
        const res = await fetch(`${API_BASE}club/notification.php`, {
            headers: { 'User-ID': CLUB_ID }
        });
        
        const result = await res.json();
        
        if (!result.data || result.data.length === 0) {
            notifList.innerHTML = `
                <div class="empty-state">
                    <p>📭 No messages yet</p>
                    <small>You'll receive notifications here when admins contact you.</small>
                </div>
            `;
            return;
        }

        notifList.innerHTML = result.data.map(n => `
            <div style="border-bottom: 1px solid var(--border); padding: 1rem 0;">
                <strong style="color: var(--primary);">${escapeHtml(n.title)}</strong>
                <p style="margin: 0.5rem 0; color: var(--text-primary);">${escapeHtml(n.message)}</p>
                <small style="color: var(--text-secondary);">📅 ${new Date(n.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load notifications error:', error);
        notifList.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--danger);">Failed to load messages</p>
                <button class="btn btn-primary mt-3" onclick="loadNotifications()">🔄 Retry</button>
            </div>
        `;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '<br>');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        CLUB_ID = null;
        CLUB_DATA = null;
        showToast('Logged out successfully', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('notif-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Check for existing session
if (CLUB_ID) {
    const savedClubData = localStorage.getItem('club_data');
    if (savedClubData) {
        CLUB_DATA = JSON.parse(savedClubData);
        displayClubProfile(CLUB_DATA);
    }
    showView('list');
} else {
    document.getElementById('login-view').classList.remove('hidden');
}
</script>
</body>
</html>