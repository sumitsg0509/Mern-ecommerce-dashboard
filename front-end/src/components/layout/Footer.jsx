export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} E-CommDash. All rights reserved.</p>
        <p>Built with React &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
