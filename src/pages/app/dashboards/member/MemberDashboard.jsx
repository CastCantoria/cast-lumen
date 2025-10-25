import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
	const { userProfile, currentUser } = useAuth();
	const [upcomingEvents, setUpcomingEvents] = useState([]);
	const [repertoire, setRepertoire] = useState([]);

	useEffect(() => {
		// Simuler le chargement des données
		setUpcomingEvents([
			{ id: 1, title: 'Concert de Noël', date: '2024-12-24', location: 'Cathédrale' },
			{ id: 2, title: 'Répétition Générale', date: '2024-12-20', location: 'Salle de répétition' }
		]);
    
		setRepertoire([
			{ id: 1, title: 'Ave Maria', composer: 'Schubert', status: 'À réviser' },
			{ id: 2, title: 'Gloria', composer: 'Vivaldi', status: 'Maîtrisé' }
		]);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
			{/* Header */}
			<div className="bg-black bg-opacity-50 text-white p-6">
				<div className="max-w-7xl mx-auto">
					<h1 className="text-3xl font-bold mb-2">Tableau de Bord Membre</h1>
					<p className="text-green-200">
						Bienvenue dans l'espace membre de C.A.S.T.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-6">
				{/* Informations Personnelles */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h2 className="text-xl font-bold mb-4 text-gray-800">Mon Profil</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl font-bold">
								{userProfile?.displayName?.charAt(0) || 'M'}
							</div>
							<div>
								<h3 className="font-bold text-lg">{userProfile?.displayName || 'Membre'}</h3>
								<p className="text-gray-600">{currentUser?.email}</p>
								<span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm mt-1">
									Membre Actif
								</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600">Date d'adhésion:</span>
								<span className="font-medium">
									{userProfile?.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Rôle:</span>
								<span className="font-medium capitalize">{userProfile?.role}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Événements à Venir */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-bold mb-4 text-gray-800">Événements à Venir</h2>
						<div className="space-y-4">
							{upcomingEvents.map(event => (
								<div key={event.id} className="border-l-4 border-green-500 pl-4 py-2">
									<h3 className="font-semibold">{event.title}</h3>
									<p className="text-sm text-gray-600">
										📅 {event.date} • 📍 {event.location}
									</p>
									<Link 
										to={`/events/${event.id}`}
										className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
									>
										Voir les détails
									</Link>
								</div>
							))}
						</div>
					</div>

					{/* Répertoire Personnel */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h2 className="text-xl font-bold mb-4 text-gray-800">Mon Répertoire</h2>
						<div className="space-y-3">
							{repertoire.map(piece => (
								<div key={piece.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
									<div>
										<div className="font-medium">{piece.title}</div>
										<div className="text-sm text-gray-600">{piece.composer}</div>
									</div>
									<span className={`px-2 py-1 rounded text-xs ${
										piece.status === 'Maîtrisé' 
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									}`}>
										{piece.status}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Actions Membres - CORRIGÉ AVEC LIENS FONCTIONNELS */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
					<Link 
						to="/repertoire" 
						className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition text-center block"
					>
						<div className="text-2xl mb-2">🎵</div>
						<div className="font-semibold">Partitions</div>
						<div className="text-sm opacity-90">Accéder au répertoire</div>
					</Link>
          
					<Link 
						to="/events" 
						className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition text-center block"
					>
						<div className="text-2xl mb-2">📅</div>
						<div className="font-semibold">Calendrier</div>
						<div className="text-sm opacity-90">Voir tous les événements</div>
					</Link>
          
					<Link 
						to="/members" 
						className="bg-orange-600 text-white p-6 rounded-lg hover:bg-orange-700 transition text-center block"
					>
						<div className="text-2xl mb-2">👥</div>
						<div className="font-semibold">Annuaire</div>
						<div className="text-sm opacity-90">Contacter les membres</div>
					</Link>
				</div>

				{/* Section Actions Rapides Additionnelles */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
					<Link 
						to="/profile/edit"
						className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center block"
					>
						<div className="text-xl mb-1">👤</div>
						<div className="font-medium text-sm">Mon Profil</div>
					</Link>
          
					<Link 
						to="/messages"
						className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition text-center block"
					>
						<div className="text-xl mb-1">💬</div>
						<div className="font-medium text-sm">Messages</div>
					</Link>
          
					<Link 
						to="/documents"
						className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition text-center block"
					>
						<div className="text-xl mb-1">📋</div>
						<div className="font-medium text-sm">Documents</div>
					</Link>
          
					<Link 
						to="/settings"
						className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition text-center block"
					>
						<div className="text-xl mb-1">⚙️</div>
						<div className="font-medium text-sm">Paramètres</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MemberDashboard;