def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "test@test.com", "password": "password123", "full_name": "Test User", "role": "user"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@test.com"
    assert data["full_name"] == "Test User"
    assert data["role"] == "user"
    assert "hashed_password" not in data
    assert "password" not in data

def test_register_existing_email(client):
    client.post(
        "/api/auth/register",
        json={"email": "dup@test.com", "password": "password123", "full_name": "Test User", "role": "user"}
    )
    response = client.post(
        "/api/auth/register",
        json={"email": "dup@test.com", "password": "password123", "full_name": "Duplicate", "role": "user"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={"email": "login@test.com", "password": "password123", "full_name": "Test User", "role": "user"}
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "login@test.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_failure(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "wrong@test.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_me_endpoint(client):
    client.post(
        "/api/auth/register",
        json={"email": "me@test.com", "password": "password123", "full_name": "Test Me", "role": "user"}
    )
    login_res = client.post(
        "/api/auth/login",
        json={"email": "me@test.com", "password": "password123"}
    )
    token = login_res.json()["access_token"]
    
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "me@test.com"
