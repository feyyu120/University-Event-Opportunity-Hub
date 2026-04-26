## folder structure

astu_event_center-backend/
├── src/
│   ├── Auth/           # Registration, Login, OTP logic
│   ├── Opportunities/  # Feed, CRUD, Search
│   └── Shared/         # Database connection, Utilities
├── public/
│   └── index.php       # The main entry point for Render
├── Dockerfile          # For Render deployment
├── composer.json       # If you use libraries (optional but recommended)
└── .env                # Local secrets (NEVER commit this to GitHub)


this is the api endpoint structure 

## register (sign in )
https://astu-event-center-backend.onrender.com/auth/register

And it accepts data with POST method like this and in
json'''
 {
  "full_name": "Abuki ",
  "email": "test@aau.edu.et",
  "password": "mypassword123",
  "department": "Software Engineering",
  "year": "3rd Year"
}
```
---
## next login  
https://astu-event-center-backend.onrender.com/auth/login

it also accepts data with POST method likethis
json```
 { 
  "email": "test@aau.edu.et",
  "password": "mypassword123",
 }
 ```
 