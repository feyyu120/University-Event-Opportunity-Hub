<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Portal | Authenticate</title>
    <style>
        :root { --admin-blue: #0f172a; --accent: #38bdf8; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: radial-gradient(circle at top left, #1e293b, #0f172a);
            height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0;
            color: white;
        }
        .login-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            padding: 2.5rem; border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            width: 100%; max-width: 400px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        h1 { font-size: 1.5rem; margin-bottom: 1.5rem; text-align: center; color: var(--accent); }
        .form-group { margin-bottom: 1.2rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #94a3b8; }
        input {
            width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #334155;
            background: #0f172a; color: white; box-sizing: border-box; outline: none;
        }
        input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2); }
        .btn-login {
            width: 100%; padding: 0.8rem; border: none; border-radius: 8px;
            background: var(--accent); color: #0f172a; font-weight: bold;
            cursor: pointer; transition: transform 0.2s, background 0.2s;
        }
        .btn-login:hover { background: #7dd3fc; transform: translateY(-1px); }
        #msg { text-align: center; margin-top: 1rem; font-size: 0.85rem; min-height: 1.2rem; }
        .error { color: #f87171; }
        .success { color: #4ade80; }
    </style>
</head>
<body>

<div class="login-card">
    <h1>Admin Access</h1>
    <form id="loginForm">
        <div class="form-group">
            <label>Staff Email</label>
            <input type="email" id="email" required placeholder="admin@astu.edu.et">
        </div>
        <div class="form-group">
            <label>Secret Password</label>
            <input type="password" id="password" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn-login">Verify Identity</button>
    </form>
    <div id="msg"></div>
</div>

<script>
    const url = 'http://localhost/University-Event-Opportunity-Hub/backend/';
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const msg = document.getElementById('msg');
        msg.innerText = "Authenticating...";
        msg.className = "";

        const payload = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const res = await fetch(`${url}src/auth/admin_login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(payload)
            }); 
            console.log(res);

            const data = await res.json();
           
            if (data.success) {
                msg.innerText = "Access Granted. Redirecting...";
                msg.className = "success"; 
                setTimeout(() => {
                    window.location.href = data.redirect || "admin_dashboard.php";
                }, 1000);
            } else {
                msg.innerText = data.message || "Unauthorized access attempt.";
                msg.className = "error";
            }
        } catch (err) {
            console.log(err);
            msg.innerText = "Connection failed. Check server." + err;
            msg.className = "error";
        }
    };
</script>

</body>
</html>