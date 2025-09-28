import React from 'react';

const RedirectTest: React.FC = () => {
  const testRedirects = () => {
    const testUrls = [
      '/dashboard?role=ADMIN',
      '/dashboard?role=POLICE',
      '/dashboard?role=SAFEHOUSE',
      '/dashboard?role=MEDICAL',
      '/dashboard?role=NGO'
    ];

    console.log('🧪 Testing redirects...');
    
    testUrls.forEach((url, index) => {
      setTimeout(() => {
        console.log(`🧪 Testing redirect ${index + 1}: ${url}`);
        window.location.href = url;
      }, index * 2000); // 2 seconds between each test
    });
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h3>🧪 Redirect Test</h3>
      <button 
        onClick={testRedirects}
        style={{ padding: '10px', margin: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Test All Redirects
      </button>
      <div style={{ margin: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <p>This will test redirects to:</p>
        <ul>
          <li>/dashboard?role=ADMIN</li>
          <li>/dashboard?role=POLICE</li>
          <li>/dashboard?role=SAFEHOUSE</li>
          <li>/dashboard?role=MEDICAL</li>
          <li>/dashboard?role=NGO</li>
        </ul>
        <p>Watch the console for results!</p>
      </div>
    </div>
  );
};

export default RedirectTest;
