import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubPageHeader = ({ title, backLabel = 'Retour au Dashboard', onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    // Try react-router navigation first
    try {
      navigate('/dashboard');
      // Also ensure hash is set for HashRouter fallback environments
      try { window.location.hash = '#/dashboard'; } catch (err) { /* ignore */ }
      return;
    } catch (e) {
      // ignore and try fallback
    }
    // Final fallback
    try { window.location.hash = '#/dashboard'; } catch (err) { /* ignore */ }
  };

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button type="button" onClick={handleBack} style={{ background: '#6b21a8', color: '#fff', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', zIndex: 50 }}>
            ← {backLabel}
          </button>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default SubPageHeader;
