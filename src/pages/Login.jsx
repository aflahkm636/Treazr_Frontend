import { Link,  useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../common/context/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setRegistrationSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });


const formik = useFormik({
  initialValues: { email: "", password: "" },
  validationSchema,
  onSubmit: async (values) => {
    setIsLoading(true);
    setError("");

    const result = await login(values);
    console.log("Login result:", result);

    if (result.success) {
      if (result.role === "admin") {
        navigate("/admin"); // admin goes to admin dashboard
      } else {
        localStorage.setItem("loginSuccess", "Login successful!");
        navigate("/"); // standard user goes to landing page
      }
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  },
});


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="logo" src="src/assets/logo.png" className="mx-auto h-20 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {registrationSuccess && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 text-sm rounded">
            Registration successful! Please log in.
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{error}</div>
        )}

        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm mt-2"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-600 mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`block w-full rounded-md px-3 py-1.5 text-gray-900 outline outline-1 ${
                  formik.touched.password && formik.errors.password ? "outline-red-500" : "outline-gray-300"
                } focus:outline-indigo-600 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!formik.isValid || !formik.dirty || isLoading}
            className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${
              !formik.isValid || !formik.dirty || isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
