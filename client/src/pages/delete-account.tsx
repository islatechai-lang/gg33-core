import React, { useState } from "react";
import { Link } from "wouter";
import { StarField } from "../components/StarField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2, ArrowLeft, Send, ShieldAlert, Clock, Database, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export default function DeleteAccountPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !fullName.trim()) {
      setError("Please fill in your email and full name.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/request-account-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), fullName: fullName.trim(), reason: reason.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 overflow-x-hidden">
      {/* Background Starfield effect */}
      <div className="fixed inset-0 z-0 opacity-40">
        <StarField />
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(212,163,62,0.1)_0%,transparent_70%)] blur-3xl z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Brand Header */}
        <div className="flex items-center justify-center mb-8">
          <span className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            GG33 CORE
          </span>
        </div>

        <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 border-b border-zinc-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
                  Delete Your Account
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-zinc-400 mt-1">
                  GG33 CORE — Account & Data Deletion Request
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8 text-sm leading-relaxed text-zinc-300">
            {/* Intro */}
            <section className="space-y-3">
              <p>
                We respect your right to control your personal data. If you would like to permanently delete your <strong className="text-zinc-100">GG33 CORE</strong> account and all associated data, please submit the form below. This process is irreversible.
              </p>
            </section>

            {/* Steps to Request Deletion */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                How It Works
              </h3>

              <div className="space-y-3">
                <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                    1
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-100">Submit the Deletion Request Form</h4>
                    <p>Fill out the form below with your account email and full name. You can optionally provide a reason.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                    2
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-100">Verification & Processing</h4>
                    <p>Our team will verify your identity and process your request within <strong className="text-zinc-100">7 business days</strong>.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    3
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-100">Deletion Complete</h4>
                    <p>You will receive a confirmation email once your account and all personal data have been permanently removed.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Deleted */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-red-400" />
                Data That Will Be Permanently Deleted
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Your account profile (name, email, profile picture)",
                  "Birth date, birth time, and birth location",
                  "All numerology calculations and readings",
                  "Astrology natal chart data and synthesis",
                  "Cue-based personality insights and daily energy data",
                  "Chat history and conversation logs",
                  "Course progress and learning history",
                  "Compatibility readings and saved results",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <Trash2 className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Retained */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Data That May Be Retained
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-300 block">Payment & Transaction Records</span>
                    <p className="text-xs text-zinc-400">
                      Records of past purchases and subscription payments may be retained for up to <strong className="text-zinc-300">90 days</strong> after deletion to comply with financial regulations. After 90 days, these records are permanently purged.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-300 block">Anonymized & Aggregated Analytics</span>
                    <p className="text-xs text-zinc-400">
                      Anonymized, non-personally-identifiable usage analytics (e.g. aggregate page view counts) may be retained indefinitely as they cannot be linked back to your identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-300 block">Legal & Compliance Obligations</span>
                    <p className="text-xs text-zinc-400">
                      If required by law, court order, or regulatory obligation, certain data may be retained for the legally mandated period.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Warning */}
            <section>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-300">This Action Is Irreversible</h4>
                  <p className="text-xs text-zinc-300">
                    Once your account is deleted, all your personal data, numerology readings, astrology charts, and progress will be permanently lost. If you have an active Pro subscription, it will be cancelled and no further charges will be made.
                  </p>
                </div>
              </div>
            </section>

            {/* Deletion Request Form */}
            <section className="space-y-4 pt-4 border-t border-zinc-800/80">
              <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Send className="w-5 h-5 text-red-400" />
                Request Account Deletion
              </h3>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-300">Request Submitted Successfully</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Your account deletion request has been received. Our team will verify your identity and process your request within <strong className="text-zinc-100">7 business days</strong>. You will receive a confirmation email once complete.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Account Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your-email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name as registered"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="reason" className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                      Reason for Deletion <span className="text-zinc-600">(optional)</span>
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Let us know why you'd like to delete your account..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold h-11 rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Submit Deletion Request
                        </>
                      )}
                    </Button>
                    <Link href="/">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-11 rounded-xl"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to App
                      </Button>
                    </Link>
                  </div>
                </form>
              )}

              <p className="text-xs text-zinc-500 text-center">
                Need help? Contact us at{" "}
                <a href="mailto:support@gg33core.space" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
                  support@gg33core.space
                </a>
              </p>
            </section>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-zinc-500">
          <Link href="/privacy" className="hover:text-amber-400 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-zinc-700">•</span>
          <Link href="/terms" className="hover:text-amber-400 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
