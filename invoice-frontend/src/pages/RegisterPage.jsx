import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters'),

  country: z.string().min(1, 'Country is required'),
});

const COUNTRIES = [
  'United States',
  'India',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Japan',
  'Singapore',
  'United Arab Emirates',
];

const APP_NAME = 'SoloPilot';

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      country: '',
    },
  });

  const onValid = async (data) => {
    try {
      await registerUser(data);

      setSuccess(true);

      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('root', {
          message: 'An account with this email already exists',
        });
      } else {
        setError('root', {
          message: 'Something went wrong. Please try again.',
        });
      }
    }
  };

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
          Create Account
        </h2>

        {success ? (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3">
            <p className="text-sm text-green-600 dark:text-green-400">
              Account created! Redirecting to login...
            </p>
          </div>
        ) : (
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
                {...register('email')}
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
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full px-3 py-2 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Country
              </label>

              <select
                id="country"
                {...register('country')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select your country</option>

                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              {errors.country && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {errors.country.message}
                </p>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Used to determine your dashboard's default currency.
              </p>
            </div>

            {/* General Error */}
            {errors.root && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white shrink-0" />
                  <span>Creating account...</span>
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>
        )}

        {/* Login Link */}
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
          Already have an account?{' '}

          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
