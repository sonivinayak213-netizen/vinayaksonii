export default function Page() {
  return (
    <main className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Options & Greeks</h2>

      <section className="bg-gray-100 p-4 rounded-xl shadow-md">
        <p className="text-gray-700 mb-2">
          Welcome to the <strong>Options & Greeks</strong> page! 🚀
        </p>
        <p className="text-gray-600">
          Here you can explore details about options trading, delta, gamma, theta, vega,
          and more. Future updates will include live calculators and visual tools.
        </p>
      </section>

      <div className="mt-6 text-sm text-gray-500">
        <p>Version 1.0 — Developed by @vinayaksonii</p>
      </div>
    </main>
  );
}
