import React from "react";
import { Link } from "wouter";
import { StarField } from "../components/StarField";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-black text-zinc-100 overflow-x-hidden">
      {/* Background Starfield effect */}
      <div className="fixed inset-0 z-0 opacity-40">
        <StarField />
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(212,163,62,0.1)_0%,transparent_70%)] blur-3xl z-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Navigation / Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-amber-400 hover:bg-zinc-900/50 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-widest bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              GG33 CORE
            </span>
          </div>
        </div>

        <Card className="bg-zinc-950/80 border-zinc-800/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-2 border-b border-zinc-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
                  Privacy Policy
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-8 text-sm leading-relaxed text-zinc-300">
            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">1.</span> Information We Collect
              </h3>
              <p>
                When you create an account and use GG33 CORE, we collect the following personal information:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li><strong className="text-zinc-100">Account Credentials:</strong> Email address and authentication tokens via Firebase or Google Sign-In.</li>
                <li><strong className="text-zinc-100">Numerology & Astrology Profile Data:</strong> Full name, date of birth, birth time, and birth location provided during onboarding.</li>
                <li><strong className="text-zinc-100">Usage Information:</strong> Interactions with AI CueChats, saved compatibility pairs, and module reading preferences.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">2.</span> How We Use Your Data
              </h3>
              <p>
                We use the information we collect strictly to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li>Calculate accurate personal Life Path numbers, universal daily energies, planetary aspects, and astrological charts.</li>
                <li>Deliver personalized AI chatbot interactions tailored to your specific numerological blueprint.</li>
                <li>Manage Pro membership access, subscription statuses, and feature unlocks.</li>
                <li>Maintain application stability, security, and performance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">3.</span> Payment & Billing Data
              </h3>
              <p>
                All payment transactions are processed securely through <strong className="text-zinc-100">Whop Payments</strong>. GG33 CORE does not store, process, or have access to your credit card numbers, CVVs, or sensitive payment details on our servers.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">4.</span> Data Sharing & Third Parties
              </h3>
              <p>
                We do <strong className="text-zinc-100">not</strong> sell, rent, or trade your personal data to third parties. We share data only with necessary service infrastructure providers:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
                <li><strong className="text-zinc-100">Google Firebase:</strong> For secure authentication and database persistence.</li>
                <li><strong className="text-zinc-100">Whop:</strong> For secure checkout processing and subscription verification.</li>
                <li><strong className="text-zinc-100">AI Processing Services:</strong> To generate AI-based personalized interpretations.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">5.</span> Data Security & Storage
              </h3>
              <p>
                We employ industry-standard encryption protocols (SSL/TLS) and secure database access rules to protect your personal information against unauthorized access, alteration, or disclosure.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">6.</span> Your Rights & Account Deletion
              </h3>
              <p>
                You have the right to request access to, correction of, or deletion of your personal account data at any time. You can request account data deletion by contacting our support team.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="text-amber-400">7.</span> Contact Us
              </h3>
              <p>
                If you have questions or concerns about this Privacy Policy or our data handling practices, please contact us via our official support channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
