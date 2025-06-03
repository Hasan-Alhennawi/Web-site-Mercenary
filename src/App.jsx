
import { useState } from 'react';
import { ethers } from 'ethers';
import hsnSaleAbi from './abi/hsnSale.json';

const SALE_CONTRACT = '0xYourSaleContractAddress';
const HSN_PRICE_ETH = 0.00003;

function App() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const connectAndBuy = async () => {
    if (!window.ethereum) return alert('MetaMask required');

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return setStatus('❌ Enter a valid HSN amount.');
    }

    try {
      setLoading(true);
      setStatus('🔄 Connecting wallet...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SALE_CONTRACT, hsnSaleAbi, signer);

      const ethValue = ethers.parseUnits((amount * HSN_PRICE_ETH).toFixed(18), 'ether');

      setStatus('🔄 Sending transaction...');
      const tx = await contract.buyTokens({ value: ethValue });

      setStatus('⏳ Waiting for confirmation...');
      await tx.wait();
      setStatus('✅ Purchase successful!');
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message || 'Transaction failed.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Buy HSN Tokens</h1>
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter HSN amount"
      />
      <button onClick={connectAndBuy} disabled={loading}>
        {loading ? 'Processing...' : 'Buy HSN'}
      </button>
      <p>{status}</p>
    </div>
  );
}

export default App;
