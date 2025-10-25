import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const ProfilePage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-gray-700">
            Page de profil - En construction
          </p>
          {userProfile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Rôle:</strong> {userProfile.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;