import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./styles/BuyerLanding.css"

export default function BuyerLanding() {
  const navigate = useNavigate()
  const [monthlyBill, setMonthlyBill] = useState("")
  const [systemSize, setSystemSize] = useState(0)
  const [installationCost, setInstallationCost] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [annualSavings, setAnnualSavings] = useState(0)
  const [paybackPeriod, setPaybackPeriod] = useState(0)

  const calculateSolarCost = () => {
    if (!monthlyBill || monthlyBill <= 0) {
      alert("Please enter a valid monthly electric bill")
      return
    }

    // Average solar system costs approximately 2.50-3.50 per watt installed
    // Average household uses about 30 kWh per day
    // For every Rs. 1000 monthly bill, need approx 3-4 kW system
    const estimatedSystemSize = (monthlyBill / 1000) * 3.5 // kW
    const costPerWatt = 90000 // Rs. per kW (approximately)
    const totalCost = estimatedSystemSize * costPerWatt

    // Assume 25% reduction in electricity bill with solar
    const monthlyReduction = (monthlyBill * 0.25)
    const yearlyReduction = monthlyReduction * 12

    // Add 20% savings after battery backup or efficiency
    const totalAnnualSavings = yearlyReduction * 1.2

    const payback = totalCost / totalAnnualSavings

    setSystemSize(estimatedSystemSize.toFixed(2))
    setInstallationCost(Math.round(totalCost))
    setMonthlySavings(Math.round(monthlyReduction))
    setAnnualSavings(Math.round(totalAnnualSavings))
    setPaybackPeriod(payback.toFixed(1))
  }

  const handleWantToBuy = () => {
    navigate("/login")
  }

  return (
    <div className="buyer-app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">☀️</span>
            <h1>PV MART</h1>
          </div>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#calculator">Calculator</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to PV MART</h2>
          <p>Go Solar, Save Money, Save the Planet</p>
          <p className="hero-subtitle">
            Transform your home with clean, renewable solar energy and reduce your electricity bills by up to 60%
          </p>
          <button className="cta-button" onClick={handleWantToBuy}>
            Start Your Solar Journey
          </button>
        </div>
        <div className="hero-image">
          <div className="solar-panels-illustration">
            <div className="panel panel-1"></div>
            <div className="panel panel-2"></div>
            <div className="panel panel-3"></div>
          </div>
        </div>
      </section>

      {/* About Company */}
      <section className="about" id="about">
        <h2>About PV MART</h2>
        <div className="about-content">
          <div className="about-card">
            <div className="about-icon">🌍</div>
            <h3>Our Mission</h3>
            <p>
              We believe that solar energy should be accessible to everyone. PV MART connects buyers with trusted solar installers to make your transition to clean energy seamless and affordable.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">⚡</div>
            <h3>Why Solar?</h3>
            <p>
              Solar energy is the cleanest source of electricity. With rising electricity costs, going solar helps you save money while reducing your carbon footprint and environmental impact.
            </p>
          </div>
          <div className="about-card">
            <div className="about-icon">🤝</div>
            <h3>Our Promise</h3>
            <p>
              We connect you with certified solar experts, ensure transparent pricing, provide quality installations, and support you throughout your solar journey.
            </p>
          </div>
        </div>
      </section>

      {/* Solar Cost Calculator */}
      <section className="calculator" id="calculator">
        <h2>Solar Cost & Savings Calculator</h2>
        <p className="calculator-subtitle">
          Discover how much you can save with solar energy
        </p>

        <div className="calculator-container">
          <div className="calculator-input">
            <label htmlFor="monthly-bill">Monthly Electricity Bill (₹)</label>
            <input
              id="monthly-bill"
              type="number"
              placeholder="Enter your monthly bill"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              onKeyPress={(e) => e.key === "Enter" && calculateSolarCost()}
            />
            <button className="calculate-btn" onClick={calculateSolarCost}>
              Calculate Now
            </button>
          </div>

          {systemSize > 0 && (
            <div className="calculator-results">
              <div className="results-grid">
                <div className="result-card">
                  <span className="result-label">System Size</span>
                  <span className="result-value">{systemSize} kW</span>
                </div>
                <div className="result-card">
                  <span className="result-label">Installation Cost</span>
                  <span className="result-value">₹{installationCost.toLocaleString()}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">Monthly Savings</span>
                  <span className="result-value">₹{monthlySavings.toLocaleString()}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">Annual Savings</span>
                  <span className="result-value">₹{annualSavings.toLocaleString()}</span>
                </div>
                <div className="result-card">
                  <span className="result-label">Payback Period</span>
                  <span className="result-value">{paybackPeriod} years</span>
                </div>
                <div className="result-card">
                  <span className="result-label">25-Year Savings</span>
                  <span className="result-value">₹{(annualSavings * 25).toLocaleString()}</span>
                </div>
              </div>
              <button className="connect-btn" onClick={handleWantToBuy}>
                Get Free Quote Now
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Key Features */}
      <section className="features" id="features">
        <h2>Why Choose PV MART?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>Certified Installers</h3>
            <p>We partner only with verified, certified solar installers with proven track records</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>Transparent Pricing</h3>
            <p>No hidden costs. Get detailed quotes upfront and know exactly what you're paying for</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">03</div>
            <h3>Expert Guidance</h3>
            <p>Our solar experts guide you through every step of your solar journey</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">04</div>
            <h3>Quality Assurance</h3>
            <p>All installations come with warranties and we ensure quality at every stage</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">05</div>
            <h3>Financing Options</h3>
            <p>Flexible payment plans and financing options to make solar affordable for everyone</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">06</div>
            <h3>Lifetime Support</h3>
            <p>Ongoing maintenance and support to ensure your system performs optimally</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <h2>Benefits of Going Solar</h2>
        <div className="benefits-container">
          <div className="benefit-item">
            <div className="benefit-icon">💰</div>
            <h3>Save Money</h3>
            <p>Reduce your electricity bills by 60-80% and earn from surplus energy</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🌱</div>
            <h3>Eco-Friendly</h3>
            <p>Eliminate your carbon footprint and contribute to a cleaner planet</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📈</div>
            <h3>Increase Property Value</h3>
            <p>Solar installations increase your home's market value significantly</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🔒</div>
            <h3>Energy Independence</h3>
            <p>Protect yourself from rising electricity rates and power outages</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Go Solar?</h2>
        <p>Join thousands of homeowners saving money and helping the planet</p>
        <button className="cta-button-large" onClick={handleWantToBuy}>
          I Want to Buy Solar
        </button>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-section">
            <h4>PV MART</h4>
            <p>Making solar energy accessible to every home</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#calculator">Calculator</a></li>
              <li><a href="#features">Features</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: hello@pvmart.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 PV MART. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
