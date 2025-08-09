export default function SettingsPage() {
  return (
    <section className="rounded-md bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-4 text-gray-600">Adjust your preferences.</p>
      <ul className="mt-4 list-disc pl-5 text-pink-700">
        <li>
          <a href="/settings/templates" className="underline hover:text-pink-900">
            Manage Session Templates
          </a>
        </li>
      </ul>
    </section>
  )
}
