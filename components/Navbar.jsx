import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold text-warning" href="/">
        🧭 VinayakTrader
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link href="/fundamental" className="nav-link">Fundamental</Link></li>
          <li className="nav-item"><Link href="/technical" className="nav-link">Technical</Link></li>
          <li className="nav-item"><Link href="/delivery" className="nav-link">Delivery</Link></li>
          <li className="nav-item"><Link href="/vix" className="nav-link">VIX</Link></li>
          <li className="nav-item"><Link href="/options" className="nav-link">Options</Link></li>
          <li className="nav-item"><Link href="/mutualfund" className="nav-link">Mutual Fund</Link></li>
          <li className="nav-item"><Link href="/ipo" className="nav-link">IPO</Link></li>
        </ul>
      </div>
    </nav>
  );
}
