import React, { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

const Premium = () => {
  const {
    isPremium,
    appliedDiscount,
    discountCode,
    setDiscountCode,
    applyDiscount,
    removeDiscount,
    calculateDiscountedPrice,
    upgradeToPremium
  } = useContext(PlayerContext);

  const [inputCode, setInputCode] = useState(discountCode);
  const [message, setMessage] = useState('');

  const originalPrice = 19.99;
  const discountedPrice = calculateDiscountedPrice(originalPrice);

  const handleApplyDiscount = () => {
    const result = applyDiscount(inputCode);
    setMessage(result.message);
    if (result.success) {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpgrade = () => {
    upgradeToPremium();
    setMessage('Welcome to Musten Premium! 🎉');
    setTimeout(() => setMessage(''), 3000);
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Musten Premium</h1>
            <div className="bg-green-600 text-white px-4 py-2 rounded-full inline-block">
              ✓ Premium Member
            </div>
          </div>

          <div className="bg-[#121212] rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Your Premium Benefits</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">✓</div>
                <span>Ad-free listening experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">✓</div>
                <span>High-quality audio (320kbps)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">✓</div>
                <span>Unlimited downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">✓</div>
                <span>Exclusive premium content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Musten Premium</h1>
          <p className="text-gray-400 text-lg">Unlock the full music experience</p>
        </div>

        <div className="bg-[#121212] rounded-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">
              ${discountedPrice.toFixed(2)}
              <span className="text-lg text-gray-400">/month</span>
            </div>
            {appliedDiscount && (
              <div className="text-green-400 text-sm">
                {appliedDiscount.description} applied!
                <button
                  onClick={removeDiscount}
                  className="ml-2 text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            )}
            {!appliedDiscount && (
              <div className="text-gray-400 text-sm line-through">
                ${originalPrice.toFixed(2)}/month
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Have a discount code?</h3>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Enter discount code"
                className="flex-1 bg-[#2a2a2a] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleApplyDiscount}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
              >
                Apply
              </button>
            </div>
            {message && (
              <div className={`mt-2 text-center text-sm ${message.includes('Invalid') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Premium Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <span>Ad-free listening experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <span>High-quality audio (320kbps)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <span>Unlimited downloads</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <span>Exclusive premium content</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs">✓</div>
                  <span>Offline listening</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Why Premium?</h3>
              <div className="space-y-3 text-gray-300">
                <p>Enjoy uninterrupted music streaming with no advertisements.</p>
                <p>Experience crystal-clear audio quality for the best listening experience.</p>
                <p>Download your favorite songs and listen offline anywhere.</p>
                <p>Get access to exclusive content and early releases.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleUpgrade}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
