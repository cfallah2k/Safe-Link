import React, { useState } from 'react';

const StakeholderTest: React.FC = () => {
  const [testCode, setTestCode] = useState('');
  const [result, setResult] = useState('');

  const stakeholderCodes: { [key: string]: string } = {
    'SAFELINK_ADMIN_2024': 'ADMIN',
    'SAFELINK_POLICE_2024': 'POLICE', 
    'SAFELINK_SAFE_2024': 'SAFEHOUSE',
    'SAFELINK_MED_2024': 'MEDICAL',
    'SAFELINK_NGO_2024': 'NGO'
  };

  const testCodeDetection = () => {
    console.log('🧪 Testing code:', testCode);
    console.log('🧪 Stakeholder codes:', stakeholderCodes);
    console.log('🧪 Match result:', stakeholderCodes[testCode]);
    
    if (stakeholderCodes[testCode]) {
      setResult(`✅ MATCH! Role: ${stakeholderCodes[testCode]}`);
      console.log('✅ Stakeholder code detected!');
    } else {
      setResult('❌ No match found');
      console.log('❌ Not a stakeholder code');
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h3>🧪 Stakeholder Code Test</h3>
      <input
        type="text"
        value={testCode}
        onChange={(e) => setTestCode(e.target.value.toUpperCase())}
        placeholder="Enter stakeholder code"
        style={{ padding: '10px', margin: '10px', width: '300px' }}
      />
      <button onClick={testCodeDetection} style={{ padding: '10px', margin: '10px' }}>
        Test Code Detection
      </button>
      <div style={{ margin: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        {result}
      </div>
      <div style={{ margin: '10px' }}>
        <h4>Test these codes:</h4>
        <ul>
          <li>SAFELINK_ADMIN_2024</li>
          <li>SAFELINK_POLICE_2024</li>
          <li>SAFELINK_SAFE_2024</li>
          <li>SAFELINK_MED_2024</li>
          <li>SAFELINK_NGO_2024</li>
        </ul>
      </div>
    </div>
  );
};

export default StakeholderTest;
