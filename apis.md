

1. Login

POST `/api/auth/login`
Request

Input: 

{
  "email": "instructor@example.com",
  "password": "••••••••"
}

Response `200 OK`

output: 

{
  "token": "eyJhbGci…", 
  "user": {
    "id": "abc123",
    "role": "instructor",
    "name": "Jane Doe"
  }
}


2. Load All Students

GET `/api/students`
Headers:

```
Authorization: Bearer <token>
```

Response `200 OK`

Output: 

[
  { "id": "1", "name": "Juan Sebastian" },
  { "id": "2", "name": "Lisa Gorter" },
  { "id": "3", "name": "Wynold Feenstra" }
]


3. Start a Lesson for a Student

POST `/api/student`
Headers:

```
Authorization: Bearer <token>
```

Input:

{ "studentId": "2" }

Response `201 Created`

Output:

{
  "id": "2",
  "studentName": "Lisa Gorter",
  "date": "2025-05-26",
  "startTime": "21:15",
  "endTime": null,
  "linkedVideos": []
}



4. Stop a Lesson for a Student

PATCH `/api/student/stop?id=<studentid>`
Headers:

```
Authorization: Bearer <token>
```
Request

Input:

{ "stoptime": time.now() }


Response `200 OK`

Output:

{
  "id": "2",
  "studentName": "Lisa Gorter",
  "date": "2025-05-26",
  "startTime": "21:15",
  "endTime": "21:45",
  "linkedVideosCount": 2
}


5. Fetch Unlinked Videos

GET `/api/videos?linked=false`
Headers:

```
Authorization: Bearer <token>
```

Response `200 OK`

Output:

[
  {
    "id": "v3",
    url: url
    "timestamp": "2025-05-26T16:42:00",
    "isLinked": false
  },
  {
    "id": "v4",
    url : url
    "timestamp": "2025-05-26T16:39:00",
    "isLinked": false
  }
]


6. upload an Video to a selected student

POST `/api/student/stop?id=<studentid>`
Headers:

```
Authorization: Bearer <token>
```

Request

Input:

{
  "time": "21:25"
}

Form Data

file: <video file>

Response `200 OK`

Output:

{
  "id": "2",
  "studentName": "Lisa Gorter",
  "date": "2025-05-26",
  "startTime": "21:15",
  "endTime": null,
  "linkedVideos": [
    {
      "id": "v3",
      "timestamp": "2025-05-26T16:42:00",
    }
  ]
}


7. Upload a New Video

 a) Unlinked Upload

POST `/api/videos`
Headers:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form Data

file: <video file>

Response `201 Created`

output:

{
  "id": "v1634567890000",
  url : url
  "timestamp": "2025-05-26T21:20:00",
  "filename": "upload.mp4",
  "isLinked": false
}
