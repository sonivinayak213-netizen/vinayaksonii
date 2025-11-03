import Card from '../components/Card'
import QuickLinks from '../components/QuickLinks'
export default function Home(){
  return (
    <main className="container">
      <header className="header">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted">VT-2025-1103-01</div>
      </header>

      <QuickLinks />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card title="NIFTY 50" symbol="^NSEI" />
        <Card title="India VIX" symbol="^INDIAVIX" />
        <Card title="Top Delivery Movers" symbol="" />
      </section>
    </main>
  )
}
