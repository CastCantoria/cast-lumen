import fs from 'fs';
import path from 'path';

console.log('🔄 Mise à jour des composants admin...');

// Vérifier et créer les composants UI manquants
const uiComponents = {
  'Button.jsx': `import React from 'react';

const Button = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  return (
    <button className={\`\${baseClasses} \${variants[variant]}\`} {...props}>
      {children}
    </button>
  );
};

export default Button;
`,

  'Card.jsx': `import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={\`bg-white rounded-lg shadow-lg p-6 \${className}\`}>
      {children}
    </div>
  );
};

export default Card;
`,

  'LoadingSpinner.jsx': `import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <div className="flex items-center justify-center">
      <div className={\`\${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin\`}></div>
    </div>
  );
};

export default LoadingSpinner;
`
};

// Créer les composants UI
Object.entries(uiComponents).forEach(([fileName, content]) => {
  const filePath = `src/components/ui/${fileName}`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Créé: ${filePath}`);
  }
});

console.log('🎉 Composants admin mis à jour !');