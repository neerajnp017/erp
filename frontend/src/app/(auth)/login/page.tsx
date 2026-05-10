import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.2fr_1fr]">
      {/* Left Side - Branding & Copy */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-emerald-950 p-12 text-emerald-50 lg:flex">
        {/* Decorative Background Elements */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-800/40 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-600/30 blur-[120px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-semibold tracking-wide text-emerald-300">
            <span>TEMPLE ERP</span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
            Calm operations for every temple department.
          </h1>
          <p className="mt-6 text-lg text-emerald-200/80 leading-relaxed">
            Manage donations, expenses, festivals, kitchen, volunteers, inventory, and reporting in one centralized, highly secure dashboard.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-emerald-500">
          &copy; {new Date().getFullYear()} Temple Management Systems.
        </div>
      </section>

      {/* Right Side - Form */}
      <section className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden flex items-center justify-center gap-2 font-semibold tracking-wide text-emerald-800">
            <span className="text-xl">TEMPLE ERP</span>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
