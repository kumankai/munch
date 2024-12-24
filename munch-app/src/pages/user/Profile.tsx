import { useUser } from '../../context/UserContext'

const Profile = () => {
    const { user } = useUser()

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-info">
                <h2>Username: {user?.username}</h2>
            </div>
        </div>
    )
}

export default Profile