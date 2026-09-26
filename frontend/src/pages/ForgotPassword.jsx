import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { validateEmail } from "../utils/validators";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);
    // Simulate secure reset link dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast("Password reset instructions dispatched to your email.", "success");
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
                <Sparkles className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">LifeSync AI</span>
            </Link>
            <h2 className="mt-6 text-2xl font-extrabold text-slate-900">Reset your Password</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your registered email and we'll send a cryptographic password reset token.
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-950">Reset Token Dispatched</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                If an account exists for <span className="font-semibold">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <div className="mt-1.5 relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
