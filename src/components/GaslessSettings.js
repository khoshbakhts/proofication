import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';

export default function GaslessSettings() {
  const { account, contract, gaslessEnabled, setGaslessEnabled } = useWeb3();

  const toggleGasless = async () => {
    try {
      const tx = await contract.setGaslessPreference(!gaslessEnabled);
      await tx.wait();
      setGaslessEnabled(!gaslessEnabled);
      alert('تنظیمات بدون گس با موفقیت بروزرسانی شد!');
    } catch (error) {
      console.error('خطا در بروزرسانی تنظیمات:', error);
      alert('خطا در بروزرسانی تنظیمات. جزئیات را در کنسول ببینید.');
    }
  };

  // Only show settings if wallet is connected
  if (!account) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 rtl-form">
      <h3 className="text-xl font-bold mb-4">تنظیمات تراکنش</h3>
      <div className="flex items-center space-x-4 flex-row-reverse">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={gaslessEnabled}
            onChange={toggleGasless}
            className="form-checkbox h-5 w-5 text-blue-600 ml-2"
          />
          <span>فعال‌سازی تراکنش‌های بدون گس</span>
        </label>
      </div>
    </div>
  );
}