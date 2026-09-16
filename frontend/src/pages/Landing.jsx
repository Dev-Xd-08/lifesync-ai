import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import InfoSection from "../components/InfoSection";
import Footer from "../components/Footer"; 

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Hero />

      {/* Features Grid */}
      <section id="features" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              One secure platform for managing the most important parts of your
              digital life.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="📄"
              title="Documents"
              description="Securely store, organize, and access your important documents."
            />
            <FeatureCard
              icon="💰"
              title="Expenses"
              description="Track your income and spending with simple financial insights."
            />
            <FeatureCard
              icon="❤️"
              title="Health Records"
              description="Keep your health reports and medical information organized."
            />
            <FeatureCard
              icon="✓"
              title="Tasks"
              description="Manage your daily tasks, deadlines, and personal goals."
            />
            <FeatureCard
              icon="🤖"
              title="AI Assistant"
              description="Get intelligent insights and answers based on your information."
            />
            <FeatureCard
              icon="🔐"
              title="Security"
              description="Protect your personal information with modern security practices."
            />
          </div>
        </div>
      </section>

      {/* AI Assistant Spotlight */}
      <InfoSection
        tag="Intelligent Assistant"
        badgeIcon="🤖"
        title="Ask Anything About Your Life & Records"
        description="LifeSync AI links your files, expenditures, and schedules so you can query your life in plain English."
        points={[
          "Instant answers based on your uploaded tax forms, receipts, and health files",
          "Automated monthly expenditure summaries and category breakdowns",
          "Proactive reminders for prescription refills and upcoming bill dates",
        ]}
        cardTitle="LifeSync Copilot"
        cardSubtitle="Context: Expenses & Health records active"
        cardContent={
          <div className="space-y-3 font-sans">
            <div className="rounded-lg bg-slate-200/70 p-3 text-xs text-slate-800">
              <span className="font-semibold text-slate-900">User:</span> How
              much did I spend on medical visits this quarter?
            </div>
            <div className="rounded-lg bg-white p-3 text-xs shadow-sm border border-slate-200 text-slate-800">
              <span className="font-semibold text-slate-900">LifeSync AI:</span>{" "}
              You spent <strong>$340.00</strong> across 3 visits. All 3 receipts
              are stored in your <em>Health</em> folder.
            </div>
          </div>
        }
      />

      {/* Security Spotlight */}
      <div id="security">
        <InfoSection
          reverse={true}
          tag="Privacy First"
          badgeIcon="🔐"
          title="Bank-Grade Security Built from Ground Up"
          description="Your personal information belongs to you. Every document, metric, and log is shielded behind advanced encryption standards."
          points={[
            "End-to-end client encryption for all sensitive documents",
            "Zero unauthorized data sharing or third-party ad training",
            "Granular permission controls for biometric and multi-factor auth",
          ]}
          cardTitle="Security Status: Active"
          cardSubtitle="SHA-256 / Zero-Knowledge Protocol"
          cardContent={
            <div className="space-y-2 font-mono text-xs text-slate-600">
              <p className="text-emerald-600 font-semibold">● AES-256 Vault: LOCKED</p>
              <p>● Document Shredder: READY</p>
              <p>● Session Key: VALID (TLS 1.3)</p>
              <p className="text-slate-400">----------------------------</p>
              <p className="text-slate-800">Status: All personal data fully protected.</p>
            </div>
          }
        />
      </div>

      {/* FOOTER ADDED HERE */}
      <Footer />
      
    </div>
  );
}

export default Landing;