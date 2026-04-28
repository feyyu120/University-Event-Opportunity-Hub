<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Club Leader Workspace</title>
    <style>
        :root { --primary: #2563eb; --danger: #dc2626; --success: #16a34a; --bg: #f8fafc; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); margin: 0; padding: 0; }
        nav { background: #1e293b; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .btn { padding: 0.6rem 1.2rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; }
        .btn-primary { background: var(--primary); color: white; }
        .btn-danger { background: var(--danger); color: white; padding: 0.4rem 0.8rem; font-size: 0.8rem; }
        
        .container { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
        .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
         
        table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; color: #475569; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; }
        .pending { background: #fef3c7; color: #92400e; }
        .live { background: #dcfce7; color: #166534; }
        .rejected { background: #fee2e2; color: #991b1b; }
 
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; color: #475569; }
        input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
        .hidden { display: none; }
    </style>
</head>
<body>

<nav>
    <div style="font-weight: bold; font-size: 1.2rem;">Club Workspace</div>
    <div id="nav-actions" class="hidden">
        <button class="btn btn-primary" onclick="showView('list')">View List</button>
        <button class="btn" style="background:#6366f1; color:white;" onclick="loadNotifications()">🔔 Messages</button>
        <button class="btn btn-success" style="background:#16a34a; color:white;" onclick="showView('post'),showPostForm()">+ Post Opportunity</button>
        <button class="btn btn-danger" onclick="logout()" style="margin-left:10px;">Logout</button>
    </div>
</nav>

<div class="container">
    <div id="login-view" class="card">
        <h2>Club Leader Login</h2>
        <div class="form-group">
            <label>Email</label>
            <input type="email" id="login-email" placeholder="club@astu.edu.et">
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-pass">
        </div>
        <button class="btn btn-primary" onclick="handleLogin()">Login to Dashboard</button>
    </div>

    <div id="list-view" class="hidden">
        <div class="card">
            <h2>My Opportunities</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="opp-table-body">
                    </tbody>
            </table>
        </div>
    </div>

        <div id="notif-modal" class="hidden" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000;">
        <div class="card" style="width:400px; margin:100px auto;">
            <h3>Admin Messages</h3>
            <div id="notif-list" style="max-height:300px; overflow-y:auto;"></div>
            <button class="btn btn-primary" onclick="document.getElementById('notif-modal').classList.add('hidden')">Close</button>
        </div>
        </div>

    <div id="post-view" class="hidden">
    <div class="card">
        <h2>Create New Opportunity</h2>
        
        <div class="form-group">
            <label>Opportunity Title</label>
            <input type="text" id="post-title" placeholder="e.g. Coding Competition">
        </div>

        <div class="form-group">
            <label>Organization / Club Name</label>
            <input type="text" id="post-org" placeholder="e.g. Software Engineering Club">
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea id="post-desc" rows="4"></textarea>
        </div>

        <div style="display: flex; gap: 20px;">
            <div class="form-group" style="flex: 1;">
                <label>Deadline</label>
                <input type="date" id="post-deadline">
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Minimum Year Level</label>
                <input type="number" id="post-min-year" value="1" min="1" max="5">
            </div>
        </div>

        <div class="form-group">
            <label>Target Departments (Select all that apply)</label>
            <div id="dept-checkboxes" style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; background: #f1f5f9; padding: 10px; border-radius: 6px;">
                <label><input type="checkbox" value="Software Engineering"> Software</label>
                <label><input type="checkbox" value="Computer Science"> CS</label>
                <label><input type="checkbox" value="Electrical Engineering"> Electrical</label>
                <label><input type="checkbox" value="Mechanical Engineering"> Mechanical</label>
                <label><input type="checkbox" value="Civil Engineering"> Civil</label>
                <label><input type="checkbox" value="Architecture"> Architecture</label>
            </div>
        </div>

        <button class="btn btn-primary" onclick="submitOpportunity()">Submit for Approval</button>
        <button class="btn" onclick="showView('list')">Cancel</button>
    </div>
</div>
</div>

<script>
    const API_BASE = "https://astu-event-center-backend.onrender.com/"; 
    let USER_ID = localStorage.getItem('user_id'); 
    let currentEditId = null;
    if(USER_ID) {
        showView('list');
        loadMyPosts();
    } 


function showPostForm() {
    window.currentEditId = null;  
    document.getElementById('post-title').value = '';
    document.getElementById('post-desc').value = '';
    document.getElementById('post-org').value = '';
    document.querySelector('#post-view h2').innerText = "Create New Opportunity";
     
    document.querySelectorAll('#dept-checkboxes input').forEach(cb => cb.checked = false);
    
    showView('post');
}

function editOpportunity(opp) {
    showView('post');
     
    document.getElementById('post-title').value = opp.title || '';
    document.getElementById('post-org').value = opp.organization_name || '';
    document.getElementById('post-desc').value = opp.description || '';
    document.getElementById('post-min-year').value = opp.min_year || 1;
 
    if (opp.deadline) {
        const dateOnly = opp.deadline.split(' ')[0];  
        document.getElementById('post-deadline').value = dateOnly;
    }
 
    if (opp.target_departments) {
        const depts = opp.target_departments.replace(/[{}]/g, '').split(',');
        document.querySelectorAll('#dept-checkboxes input').forEach(cb => {
            cb.checked = depts.includes(cb.value);
        });
    }

    window.currentEditId = opp.id;
    document.querySelector('#post-view h2').innerText = "Update Rejected Post";
}

function showView(view) {
        document.getElementById('login-view').classList.add('hidden');
        document.getElementById('list-view').classList.add('hidden');
        document.getElementById('post-view').classList.add('hidden');
        document.getElementById('nav-actions').classList.remove('hidden');

        document.getElementById(`${view}-view`).classList.remove('hidden');
        if(view === 'list') loadMyPosts();
    }

async function handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if(data.user.role === 'club_leader') {
            localStorage.setItem('user_id', data.user.id); 
            USER_ID = data.user.id; 
            showView('list');
        } else {
            alert("Login Failed or Access Denied.");
        }
    }

async function loadMyPosts() {
    const res = await fetch(`${API_BASE}/club/list.php`, {
        headers: {  
            'User-ID': USER_ID
        }
    });
    
    const result = await res.json();
    const tbody = document.getElementById('opp-table-body');
    tbody.innerHTML = '';
 
    if (!result.data) return;
 
    result.data.forEach(opp => { 
    let actionBtn = `<button class="btn btn-danger" onclick="deleteOpp('${opp.id}')">Delete</button>`;
 
    if (opp.status === 'rejected') {
        const oppData = JSON.stringify(opp).replace(/"/g, '&quot;');
         
        actionBtn = `
            <button class="btn btn-primary" style="margin-right: 5px;" onclick="editOpportunity(${oppData})">Fix & Resubmit</button>
            ${actionBtn}
        `;
    }
 
    tbody.innerHTML += `
        <tr>
            <td>${opp.title}</td>
            <td>
                <span class="status-badge ${opp.status}">${opp.status}</span>
                ${opp.rejection_reason ? `<br><small style="color:red"><b>Reason:</b> ${opp.rejection_reason}</small>` : ''}
            </td>
            <td>${new Date(opp.created_at).toLocaleDateString()}</td>
            <td>
                <div style="display: flex; gap: 5px;">
                    ${actionBtn}
                </div>
            </td>
        </tr>
    `;
});
}

async function submitOpportunity() {
    const deadlineInput = document.getElementById('post-deadline').value;
 
    if (!deadlineInput) {
        alert("Please select a valid deadline date.");
        return;
    } 
    const selectedDepts = Array.from(document.querySelectorAll('#dept-checkboxes input:checked'))
                               .map(cb => cb.value);
     
    const postgresArray = `{${selectedDepts.join(',')}}`;

    const payload = {
        action: currentEditId ? 'update_and_resubmit' : 'create',
        opportunity_id: currentEditId, 
        title: document.getElementById('post-title').value,
        organization_name: document.getElementById('post-org').value,
        description: document.getElementById('post-desc').value,
        deadline: deadlineInput,  
        min_year: parseInt(document.getElementById('post-min-year').value) || 1,
        target_departments: postgresArray 
    };
 
    if (!payload.title || !payload.organization_name || selectedDepts.length === 0) {
        alert("Missing required fields!");
        return;
    }
    const endpoint = currentEditId ? '/club/action.php' : '/club/post.php';
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {  
                'User-ID': USER_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        
        if(data.success) {
            alert("Opportunity Submitted Successfully!");
            currentEditId = null; 
            document.querySelector('#post-view h2').innerText = "Create New Opportunity";
            showView('list');

        } else { 
            alert("Server Error: " + data.message);
        }
    } catch (err) {
        alert("Network error: Check console." +err);
    }
}

async function deleteOpp(id) {
        if(!confirm("Are you sure?")) return;

        console.log(id);
        await fetch(`${API_BASE}/club/action.php`, {
            method: 'POST',
            headers: { 
                'User-ID': USER_ID,
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({ action: 'delete', opportunity_id: id })
        });
        loadMyPosts();
    }

async function loadNotifications() {
    const res = await fetch(`${API_BASE}/club/notification.php`, {
        headers: {'User-ID': USER_ID }
    });
    const result = await res.json();
    
    const list = document.getElementById('notif-list');
    list.innerHTML = '';
    
    if(result.data.length === 0) {
        list.innerHTML = "<p>No messages yet.</p>";
    }

    result.data.forEach(n => {
        list.innerHTML += `
            <div style="border-bottom:1px solid #eee; padding:10px 0;">
                <strong>${n.title}</strong><br>
                <small>${n.message}</small><br>
                <em style="font-size:0.7rem; color:#999;">${new Date(n.created_at).toLocaleString()}</em>
            </div>
        `;
    });
    
    document.getElementById('notif-modal').classList.remove('hidden');
}

function logout() {
        localStorage.clear();
        window.location.reload();
    }
</script>

</body>
</html>