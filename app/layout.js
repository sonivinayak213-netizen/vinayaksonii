import '../styles/globals.css'
export const metadata = { title: 'VinayakTrader Pro' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="sidebar">
          <h2 className="text-xl font-bold mb-4">VinayakTrader</h2>
          <nav className="space-y-2 text-sm">
            <a href="/" className="block p-2 rounded hover:bg-gray-900">Dashboard</a>
            <a href="/fundamental" className="block p-2 rounded hover:bg-gray-900">Fundamental</a>
            <a href="/technical" className="block p-2 rounded hover:bg-gray-900">Technical</a>
            <a href="/swing" className="block p-2 rounded hover:bg-gray-900">Swing Screener</a>
            <a href="/delivery" className="block p-2 rounded hover:bg-gray-900">Delivery</a>
            <a href="/vix" className="block p-2 rounded hover:bg-gray-900">India VIX</a>
            <a href="/options" className="block p-2 rounded hover:bg-gray-900">Options</a>
            <a href="/mutualfund" className="block p-2 rounded hover:bg-gray-900">Mutual Funds</a>
            <a href="/overview" className="block p-2 rounded hover:bg-gray-900">Market Overview</a>
            <a href="/ai-summary" className="block p-2 rounded hover:bg-gray-900">AI Summary</a>
          </nav>
        </div>
        <div className="main">
          {children}
        </div>
      </body>
    </html>
  )
}
