import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
  loginThunk,
  logout,
  clearError,
} from "../../../store/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loginLoading,
    error,
    isAuthenticated,
    user,
  } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // ==========================================================
  // SUBMIT
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setLocalError("");
    dispatch(clearError());

    try {
      const result = await dispatch(
        loginThunk({
          email: email.trim(),
          password,
        })
      ).unwrap();

      const role = result?.user?.role;

      // ------------------------------------------------------
      // Validate selected login tab
      // ------------------------------------------------------
      if (activeTab === "admin" && role !== "admin") {
        dispatch(logout());

        setLocalError(
          "Access denied. Please use the Botanist tab to sign in."
        );

        return;
      }

      if (
        activeTab === "botanist" &&
        role !== "botanist"
      ) {
        dispatch(logout());

        setLocalError(
          "Access denied. Please use an approved botanist account."
        );

        return;
      }

      // ------------------------------------------------------
      // Navigate after successful + valid login
      // ------------------------------------------------------
      if (role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else if (role === "botanist") {
        navigate("/botanist/dashboard", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }

    } catch (err) {
      /*
       * IMPORTANT:
       * loginThunk.rejectWithValue() causes .unwrap()
       * to throw the rejected payload here.
       */

      const message =
        typeof err === "string"
          ? err
          : err?.message ||
            "Incorrect email or password. Please try again.";

      setLocalError(message);

      // Make sure we stay on /login.
      // No navigation is performed here.
    }
  };

  // ==========================================================
  // TAB SWITCH
  // ==========================================================
  const switchTab = (tab) => {
    setActiveTab(tab);

    setLocalError("");
    dispatch(clearError());

    setEmail("");
    setPassword("");
  };

  // ==========================================================
  // REDIRECT IF ALREADY AUTHENTICATED
  // ==========================================================
  useEffect(() => {
    /*
     * This is only relevant when LoginPage is rendered while
     * an authenticated session already exists.
     *
     * During a failed login, authSlice clears authentication,
     * so this effect will NOT redirect the user.
     */
    if (!isAuthenticated || !user) {
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard", {
        replace: true,
      });
    } else if (user.role === "botanist") {
      navigate("/botanist/dashboard", {
        replace: true,
      });
    } else {
      navigate("/", {
        replace: true,
      });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex min-h-screen font-sans">

      {/* =====================================================
          LEFT PANEL
      ====================================================== */}
      <div
        className="flex-1 flex flex-col justify-center px-12 py-16 text-white"
        style={{
          background: "#1a2e1a",
          backgroundImage: `
            radial-gradient(
              circle at 20% 50%,
              rgba(45,106,79,0.3) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(45,106,79,0.2) 0%,
              transparent 50%
            )
          `,
        }}
      >
        <Link
          to="/"
          className="inline-flex items-center text-md font-bold text-gray-100 hover:text-emerald-700 transition-colors mb-4"
        >
          <span className="mr-2 mt-2">
            <span className="material-symbols-outlined">
              keyboard_backspace
            </span>
          </span>

          Go back to KUH Digital Herbarium
        </Link>

        <div className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-[#2d6a4f] rounded-xl flex items-center justify-center text-2xl">
            🌿
          </div>

          <div>
            <div className="font-bold text-lg text-white">
              KUH
            </div>

            <div className="text-xs tracking-widest text-[#95d5b2]">
              Karachi University Herbarium
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-5 text-white">
          Digital Herbarium &
          <br />
          Botanical Data System
        </h1>

        <p className="text-[#95d5b2] text-sm leading-relaxed mb-12 max-w-md">
          Preserving and digitising Pakistan's rich botanical
          heritage for researchers, scientists and future
          generations.
        </p>

        <div className="flex flex-wrap gap-4">
          {[
            {
              value: "12,400+",
              label: "Plant Records",
            },
            {
              value: "340+",
              label: "Botanists",
            },
            {
              value: "4",
              label: "Provinces Covered",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl px-6 py-5 min-w-[120px]"
              style={{
                background: "rgba(45,106,79,0.3)",
                border:
                  "1px solid rgba(149,213,178,0.2)",
              }}
            >
              <div className="text-2xl font-bold text-[#52b788] mb-1">
                {stat.value}
              </div>

              <div className="text-xs text-[#95d5b2]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          RIGHT PANEL
      ====================================================== */}
      <div className="flex-1 bg-[#f8f9f8] flex items-center justify-center px-12 py-16">
        <div className="bg-white rounded-2xl p-10 w-full max-w-[480px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">

          {/* Tabs */}
          <div className="flex bg-[#f0f0f0] rounded-xl p-1 mb-8 gap-1">
            {["botanist", "admin"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchTab(tab)}
                disabled={loginLoading}
                className={`
                  flex-1 py-2.5 rounded-lg text-sm
                  font-medium transition-all duration-200
                  capitalize
                  ${
                    activeTab === tab
                      ? "bg-[#2d6a4f] text-white shadow-[0_2px_8px_rgba(45,106,79,0.3)]"
                      : "bg-transparent text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                {tab === "admin"
                  ? "Administrator"
                  : "Botanist"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>

          <p className="text-sm text-gray-400 mb-7">
            {activeTab === "admin"
              ? "Sign in to your admin account"
              : "Sign in to your botanist account"}
          </p>

          {/* Error */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-5">
              {localError || error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col"
            noValidate={false}
          >
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                }}
                placeholder={
                  activeTab === "admin"
                    ? "dr.ahmed@unikarachi.edu.pk"
                    : "botanist@institution.edu.pk"
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-[#f0faf4] text-gray-900 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-lg text-sm bg-[#f0faf4] text-gray-900 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base p-1 bg-transparent border-none cursor-pointer"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-[#2d6a4f] font-medium hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginLoading}
              className={`
                w-full bg-[#2d6a4f]
                hover:bg-[#245a41]
                text-white font-semibold
                py-3.5 rounded-lg text-sm
                tracking-wide transition-colors duration-200
                ${
                  loginLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "cursor-pointer"
                }
              `}
            >
              {loginLoading
                ? "Signing in..."
                : "Sign In →"}
            </button>
          </form>

          {/* Apply */}
          {activeTab === "botanist" && (
            <p className="text-center mt-5 text-sm text-gray-500">
              Not a member yet?{" "}
              <Link
                to="/apply"
                className="text-[#2d6a4f] font-semibold hover:underline"
              >
                Apply as Botanist
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;