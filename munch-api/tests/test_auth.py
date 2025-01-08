def test_signup(client):
    """Test user registration"""
    response = client.post('/api/auth/signup', json={
        'username': 'newuser',
        'password': 'password123'
    })
    
    assert response.status_code == 201
    assert 'access_token' in response.json
    assert 'user' in response.json
    
    refresh_token = client.get_cookie('refresh_token_cookie')
    assert refresh_token is not None, "Refresh token not found in cookies"

def test_login(client, test_user):
    """Test user login"""
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'user' in response.json

    refresh_token = client.get_cookie('refresh_token_cookie')
    assert refresh_token is not None, "Refresh token not found in cookies"

def test_logout(client, test_user):
    """Test logout"""
    # First login to get tokens
    login_response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    
    data = login_response.get_json()
    access_token = data['access_token']

    refresh_token = client.get_cookie('refresh_token_cookie')
    assert refresh_token is not None, "Refresh token not found in login response cookies"
    client.set_cookie('refresh_token', refresh_token.value)

    # Logout
    logout_response = client.post('/api/auth/logout',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    print(logout_response)
    
    assert logout_response.status_code == 200
    
    # Try to use the access token after logout (should fail)
    protected_response = client.get('/api/user/me',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    
    assert protected_response.status_code == 401 