import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      loginSchema.parse(formData);

      // Check if user exists and password matches
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = existingUsers.find(
        (user) =>
          user.email === formData.email &&
          user.password === formData.password
      );

      if (!user) {
        setErrors({ general: "Invalid email or password" });
        return;
      }

      // Set current user
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Navigate to home and reload to update app state
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap = {};
        error.errors.forEach((err) => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#121212] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-[#2a2a2a] text-white rounded focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-[#2a2a2a] text-white rounded focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-xs text-center">{errors.general}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
