import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = () => {
    // TODO: Implement API login/auth
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-900">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4 text-center">
          SEI SENTINEL Login
        </h1>
        <input type="email" placeholder="Email" className="w-full p-2 border mb-3"/>
        <input type="password" placeholder="Password" className="w-full p-2 border mb-4"/>
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <button onClick={() => navigate("/dashboard")} className="mt-2 w-full text-sm underline text-gray-500">
          Try Demo Mode →
        </button>
      </div>
    </div>
  );
}