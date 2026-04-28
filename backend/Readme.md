# folder structure
```
astu_event_center-backend/
├── src/
│   ├── Auth/           # Registration, Login, OTP logic
│   ├── Opportunities/  # Feed, CRUD, Search
│   └── Shared/         # Database connection, Utilities
├── public/
│   └── index.php       # The main entry point for Render
├── Dockerfile          # For Render deployment
├── composer.json       # If you use libraries  
```
---

## this is the api endpoint structure 

## register sign in
```
https://astu-event-center-backend.onrender.com/auth/register

```
And it accepts data with POST method like this and in
```json
 {
  "full_name": "Abuki ",
  "email": "test@aau.edu.et",
  "password": "mypassword123",
  "department": "Software Engineering",
  "year": "3rd Year"
}
```
---
## login  
```
https://astu-event-center-backend.onrender.com/auth/login

```

it accepts data with POST method likethis
```json
 { 
  "email": "test@aau.edu.et",
  "password": "mypassword123",
 }
 ```

and the response will be 
```json
{
    "message": "Login successful",
    "user": {
        "id": "8ace104e-8528-4f22-a952-00ae3576f4b0",
        "full_name": "Abuki Developer",
        "email": "test@aau.edu.et",
        "role": "student",
        "university": "Addis Ababa University",
        "department": "Software Engineering",
        "year": "3rd Year"
    }
}
```
---
## Autorization

```url
https://astu-event-center-backend.onrender.com/auth/autorize
```

it accepts user_id and role like this with POST method
 ```json
 { 
  "user_id": "8ace104e-8528-4f22-a952-00ae3576f4b0",
  "role": "student"
 }
 ```
 and the response will be 
 ```json
 {
    "authorized": true,
    "message": "User has the required permissions",
    "current_role": "student"
}
``` 
---
## logout 
```url
https://astu-event-center-backend.onrender.com/auth/logout

```

it accepts user id In POST method like this 

```json
{
    "user_id" : "0ce732b3-bf37-406b-b983-2c09b8dbb183", 
}
```
and returns this 

```json
{
    "success": true,
    "message": "Logged out successfully. Account status set to inactive."
}
```
---

## profile (me)

the app sends user_id in GET method like this 

```
https://astu-event-center-backend.onrender.com/users/me?user_id=0ce732b3-bf37-406b-b983-2c09b8dbb183

```
and the response will be

```json
{
    "authorized": true,
    "data": {
        "id": "0ce732b3-bf37-406b-b983-2c09b8dbb183",
        "email": "test@aau.edu.et",
        "full_name": "Abuki ",
        "department": "Software Engineering",
        "year": "3rd Year",
        "role": "student",
        "interests": null,
        "goals": null,
        "is_active": true,
        "created_at": "2026-04-26 00:05:46.329996",
        "university_name": "Addis Ababa University"
    }
}
```
---
## partial user data update 
in this we use the PUT method for partial user data update like this 

```
https://astu-event-center-backend.onrender.com/users/me?user_id=0ce732b3-bf37-406b-b983-2c09b8dbb183

```
# Method PUT  then 
body

```json
{
    "full_name": "Abuki The Professional",
    "department": "Advanced Computing"
    // you can added also year 
}
```
then the response will be 

```json
{
    "message": "Profile updated successfully"
}
```
---
## Interests 
the app sends user_id,action, and interests with POST method  like this format in this API
```
https://astu-event-center-backend.onrender.com/users/interests

```

```json
{
    "user_id": "8ace104e-8528-4f22-a952-00ae3576f4b0",
    "action": "add",  //it may be remove (for remove interests for that user)
    "interest": "Hackatons"
}
```

then if succuss the request yoou get 

```json
{
    "message": "Interests updated"
}
```
## user apllied opportunities 

in this case we run with two options 

if the user wents to apply an opportunity we do this 

method  ## POST 

```
API https://astu-event-center-backend.onrender.com/users/applications?user_id=8ace104e-85284f22-a952-00ae3576f4b0
```

and  send data like this 

```json
{
    "user_id": "8ace104e-85284f22-a952-00ae3576f4b0",
    "opportunity_id": "2f23c9a4-af0a-4b39-8521-253ec1417ac6",
    "notes": "we have hackaton in the main gate front "
}
```
then if this application submitted you get 
```json
{
    "success": true,
    "message": "Application submitted successfully"
}
```
and the other is get the user applied opportunities before

method ## GET
```
API https://astu-event-center-backend.onrender.com/users/applications?user_id=8ace104e-85284f22-a952-00ae3576f4b0

<!-- in this part you can added in the api limit and offset like  
    url&limit=10&offset=1
 -->

```
and the response will be 
```json
{
    "message": "users applications list",
    "applications": [
        {
            "user_id": "8ace104e-8528-4f22-a952-00ae3576f4b0",
            "opportunity_id": "7bc23021-9988-4e44-b816-11bb22334455",
            "status": "applied",
            "notes": "I am a 3rd year Software Engineering student with Flutter experience.",
            "applied_at": "2026-04-28 06:16:40.449886"
        },
        {
            "user_id": "8ace104e-8528-4f22-a952-00ae3576f4b0",
            "opportunity_id": "2f23c9a4-af0a-4b39-8521-253ec1417ac6",
            "status": "applied",
            "notes": "we have hackaton in the main gate front ",
            "applied_at": "2026-04-28 06:29:59.47748"
        }
    ]
}
```





