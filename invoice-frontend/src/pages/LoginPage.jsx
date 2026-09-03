import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const APP_NAME = "SoloPilot";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onValid = async (data) => {
    try {
      await login(data);
      navigate("/hub");
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        setError("root", {
          message: "Invalid email or password",
        });
      } else {
        setError("root", {
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    const message = localStorage.getItem("toastMessage");

    if (message) {
      toast.error(message);
      localStorage.removeItem("toastMessage");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        {/* App Name */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            {APP_NAME}
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Log In
        </h2>

        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />

            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                className="w-full px-3 py-2 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* General Error */}
          {errors.root && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.root.message}
              </p>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white shrink-0" />
                <span>Logging in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
