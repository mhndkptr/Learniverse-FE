'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function MentorRegistrationForm() {
  const [formData, setFormData] = useState({
    reason: '',
    motivation: '',
    cvUrl: '',
    portfolioUrl: '',
    paymentAccountName: '',
    paymentAccount: '',
  })

  const [showPaymentName, setShowPaymentName] = useState(false)
  const [showPaymentAccount, setShowPaymentAccount] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      // Reset form after successful submission
      setFormData({
        reason: '',
        motivation: '',
        cvUrl: '',
        portfolioUrl: '',
        paymentAccountName: '',
        paymentAccount: '',
      })
      setLoading(false)
      alert('Registration successful!')
    }, 1000)
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-8">
      <h1 className="text-foreground mb-8 text-center text-3xl font-bold">
        Mentor Registration Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reason Field */}
        <div>
          <label
            htmlFor="reason"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Enter your reasons for wanting to be a mentor"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            required
          />
        </div>

        {/* Motivation Field */}
        <div>
          <label
            htmlFor="motivation"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Motivation
          </label>
          <textarea
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleInputChange}
            placeholder="Enter your motivation"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            required
          />
        </div>

        {/* CV Url Field */}
        <div>
          <label
            htmlFor="cvUrl"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            CV Url
          </label>
          <input
            type="url"
            id="cvUrl"
            name="cvUrl"
            value={formData.cvUrl}
            onChange={handleInputChange}
            placeholder="https://drive.google.com..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Portfolio Url Field */}
        <div>
          <label
            htmlFor="portfolioUrl"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Portfolio Url
          </label>
          <input
            type="url"
            id="portfolioUrl"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleInputChange}
            placeholder="https://drive.google.com..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Payment Account Name Field */}
        <div>
          <label
            htmlFor="paymentAccountName"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Payment Account Name
          </label>
          <div className="relative">
            <input
              type={showPaymentName ? 'text' : 'password'}
              id="paymentAccountName"
              name="paymentAccountName"
              value={formData.paymentAccountName}
              onChange={handleInputChange}
              placeholder="Enter your name in payment account"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPaymentName(!showPaymentName)}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
            >
              {showPaymentName ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Payment Account Field */}
        <div>
          <label
            htmlFor="paymentAccount"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Payment Account
          </label>
          <div className="relative">
            <input
              type={showPaymentAccount ? 'text' : 'password'}
              id="paymentAccount"
              name="paymentAccount"
              value={formData.paymentAccount}
              onChange={handleInputChange}
              placeholder="Enter your payment account"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPaymentAccount(!showPaymentAccount)}
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
            >
              {showPaymentAccount ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-900 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-800 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
