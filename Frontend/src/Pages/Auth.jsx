import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/User.service";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form states
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle register form changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };
  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await UserService.login(loginData.email, loginData.password);
      setIsLoading(false);
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      setIsLoading(false);
      if (error.message) {
        setError(error.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };
  // Handle registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await UserService.register(
        registerData.username,
        registerData.email,
        registerData.password
      );
      setIsLoading(false);
      navigate("/"); 
    } catch (error) {
      setIsLoading(false);
      if (error.message) {
        setError(error.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };
  return (
    <div className="flex h-screen pt-16 bg-gray-100 overflow-hidden">
      {/* Auth Container with Tab Selector at the top */}
      <div className="w-full flex flex-col">
        {/* Tab Selector */}
        <div className="flex justify-center pt-4 border-b bg-white">
          <div className="container max-w-4xl px-4 flex">
            <button
              className={`w-1/2 pb-4 text-center font-medium text-lg ${
                activeTab === "login"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`w-1/2 pb-4 text-center font-medium text-lg ${
                activeTab === "register"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>
        </div>

        {/* Main Content Area with Sliding Panels */}
        <div className="flex flex-1 relative">
          {/* Content wrapper with sliding effect */}
          <div
            className="flex w-[200%] transition-transform duration-500 ease-in-out absolute inset-0"
            style={{
              transform:
                activeTab === "login" ? "translateX(0)" : "translateX(-50%)",
            }}
          >
            {/* Login Panel */}
            <div className="w-1/2 flex">
              {/* Login Form Section */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto w-full">
                  <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Welcome Back
                  </h2>

                  {/* Error Display */}
                  {error && activeTab === "login" && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="email@example.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                        disabled={isLoading && activeTab === "login"}
                      >
                        {isLoading && activeTab === "login"
                          ? "Signing in..."
                          : "Sign In"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Login Image Section */}
              <div className="hidden md:flex md:w-1/2 bg-gray-200 items-center justify-center p-8">
                <div className="text-center">
                  <img
                    src="/src/assets/login-image.svg"
                    alt="Login"
                    className="max-h-96 mx-auto mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://plus.unsplash.com/premium_photo-1661767467261-4a4bed92a507?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VGVhbXxlbnwwfHwwfHx8MA%3D%3D";
                    }}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Welcome back!
                  </h3>
                  <p className="text-gray-600">We're happy to see you again</p>
                </div>
              </div>
            </div>

            {/* Register Panel */}
            <div className="w-1/2 flex">
              {/* Register Image Section (appears on left when active) */}
              <div className="hidden md:flex md:w-1/2 bg-gray-200 items-center justify-center p-8">
                <div className="text-center">
                  <img
                    src="/src/assets/register-image.svg"
                    alt="Register"
                    className="max-h-96 mx-auto mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://plus.unsplash.com/premium_photo-1677529496297-fd0174d65941?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8VGVhbXxlbnwwfHwwfHx8MA%3D%3D";
                    }}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Join our community
                  </h3>
                  <p className="text-gray-600">
                    Start your journey with us today
                  </p>
                </div>
              </div>

              {/* Register Form Section */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto w-full">
                  <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Create Account
                  </h2>

                  {/* Error Display */}
                  {error && activeTab === "register" && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  {/* Register Form */}
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Your username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="register-email"
                      >
                        Email
                      </label>
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="email@example.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="register-password"
                      >
                        Password
                      </label>
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="confirm-password"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                        disabled={isLoading && activeTab === "register"}
                      >
                        {isLoading && activeTab === "register"
                          ? "Creating Account..."
                          : "Create Account"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
