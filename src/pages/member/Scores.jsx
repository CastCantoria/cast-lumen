// src/pages/member/Scores.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { hasPermission, PERMISSIONS } from "../../../config/roles";

const Scores = () => {
  const { userProfile } = useAuth();
  const [currentSection, setCurrentSection] = useState("All");
  const [isEditing, setIsEditing] = useState(null);

  // état pour les partitions (exemple local)
  const [scores, setScores] = useState([
    {
      id: 1,
      title: "Ave Maria",
      composer: "Franz Schubert",
      voice: "Soprano",
      uploadDate: "2025-10-15",
      fileUrl: "/scores/ave-maria.pdf"
    },
    {
      id: 2,
      title: "Hallelujah",
      composer: "Leonard Cohen",
      voice: "All",
      uploadDate: "2025-10-20",
      fileUrl: "/scores/hallelujah.pdf"
    }
  ]);

  // modal / formulaire d'ajout
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newComposer, setNewComposer] = useState("");
  const [newVoice, setNewVoice] = useState("Soprano");
  const [newDate, setNewDate] = useState("");
  const [newFile, setNewFile] = useState(null);

  const handleAddScore = () => {
    setShowAddModal(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setNewFile(f || null);
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const id = Date.now();
    const fileUrl = newFile ? URL.createObjectURL(newFile) : "#"; // temporaire
    const newScore = {
      id,
      title: newTitle || "Nouvelle partition",
      composer: newComposer || "Inconnu",
      voice: newVoice || "All",
      uploadDate: newDate || new Date().toISOString().slice(0, 10),
      fileUrl
    };
    setScores((prev) => [newScore, ...prev]);
    // reset
    setNewTitle("");
    setNewComposer("");
    setNewVoice("Soprano");
    setNewDate("");
    setNewFile(null);
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleEditScore = (score) => {
    setIsEditing(score.id);
    console.log("Éditer la partition:", score);
  };

  const handleDeleteScore = (score) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la partition "${score.title}" ?`)) {
      // TODO: Implémenter la suppression
      console.log("Supprimer la partition:", score);
    }
  };

  // NOTE: `scores` est désormais défini plus haut comme useState

  const voiceTypes = ["All", "Soprano", "Alto", "Ténor", "Basse"];

  const filteredScores = (currentSection === "All" || currentSection === "all") 
    ? scores 
    : scores.filter(score => score.voice === currentSection);

  const userRole = userProfile?.role;
  const canCreate = hasPermission(userRole, PERMISSIONS.CREATE_MEMBER_CONTENT);
  const canEdit = hasPermission(userRole, PERMISSIONS.EDIT_MEMBER_CONTENT);
  const canDelete = hasPermission(userRole, PERMISSIONS.DELETE_MEMBER_CONTENT);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* En-tête */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Partitions</h1>
            <p className="mt-1 text-sm text-gray-500">
              Accédez à toutes vos partitions numériques
            </p>
            <div className="mt-4 flex items-center justify-end">
              {canCreate && (
                <button
                  onClick={handleAddScore}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                >
                   Ajouter une partition
                </button>
              )}
            </div>
          </div>

          {/* Filtres */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {voiceTypes.map((voice) => (
                <button
                  key={voice}
                  onClick={() => setCurrentSection(voice)}
                  className={"px-4 py-2 rounded-full text-sm font-medium " + 
                    (currentSection === voice
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300")}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des partitions */}
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compositeur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'ajout
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredScores.map((score) => (
                    <tr key={score.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{score.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{score.composer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {score.voice}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(score.uploadDate).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <a
                          href={score.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        >
                           Télécharger
                        </a>
                        {canEdit && (
                          <button
                            onClick={() => handleEditScore(score)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                          >
                             Éditer
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteScore(score)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors duration-200 shadow-sm"
                          >
                             Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredScores.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4"></div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucune partition trouvée
                        </h3>
                        <p className="text-gray-500">
                          Aucune partition n'est disponible pour cette voix pour le moment.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
    
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Ajouter une partition</h3>
                  <form onSubmit={handleSubmitAdd} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fichier (PDF)</label>
                      <input type="file" accept=".pdf" onChange={handleFileChange} className="mt-1 block w-full" />
                      {newFile && <div className="text-xs text-gray-500 mt-1">Fichier sélectionné: {newFile.name}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Titre</label>
                      <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Compositeur / Auteur</label>
                      <input value={newComposer} onChange={(e) => setNewComposer(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Voix</label>
                        <select value={newVoice} onChange={(e) => setNewVoice(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2">
                          {voiceTypes.map((v) => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date d'ajout</label>
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded-md">Annuler</button>
                      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Ajouter</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
      </div>
    </div>
  );
};

export default Scores;