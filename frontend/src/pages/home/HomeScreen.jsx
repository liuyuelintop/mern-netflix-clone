import { useAuthStore } from "../../store/authUser"

const HomeScreen = () => {
    const { logout } = useAuthStore();
    return (
        <div className="flex flex-col space-y-4 justify-center items-center mx-auto max-w-6xl w-full">
            <h1>HomeScreen  </h1>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default HomeScreen