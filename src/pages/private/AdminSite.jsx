import React from 'react';

const AdminSite = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administrer le Site</h1>
      <p>Bienvenue sur la page d'administration globale. Ajoutez ici les fonctionnalités nécessaires pour gérer le site.</p>
      <ul className="list-disc pl-5 mt-4">
        <li>Gestion des rôles</li>
        <li>Configuration du site</li>
        <li>Gestion des permissions</li>
        <li>Et plus encore...</li>
      </ul>
    </div>
  );
};

export default AdminSite;
