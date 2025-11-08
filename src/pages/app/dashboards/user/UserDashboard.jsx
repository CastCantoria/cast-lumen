import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard = () => {
	const { userProfile, currentUser } = useAuth();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
			{/* Header */}
			<div className="bg-black bg-opacity-50 text-white p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-2">Mon Espace C.A.S.T.</h1>
					<p className="text-gray-300">
						Bienvenue dans votre espace personnel
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto p-6">
				{/* Carte de Bienvenue */}
				<div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
					<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
						{userProfile?.displayName?.charAt(0) || 'U'}
					</div>
					<h2 className="text-2xl font-bold mb-2">Bonjour, {userProfile?.displayName || 'Utilisateur'} !</h2>
					<p className="text-gray-600 mb-6">
						Merci de faire partie de la communauté C.A.S.T. Cantoria
					</p>
          
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<Link 
							to="/events" 
							className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition cursor-pointer block"
						>
							<div className="text-blue-600 font-bold text-lg">0</div>
							<div className="text-gray-600">Événements</div>
						</Link>
						<div className="text-center p-4 bg-green-50 rounded-lg">
							<div className="text-green-600 font-bold text-lg">Membre</div>
							<div className="text-gray-600">Statut</div>
						</div>
						<Link 
							to="/profile" 
							className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition cursor-pointer block"
						>
							<div className="text-purple-600 font-bold text-lg">Nouveau</div>
							<div className="text-gray-600">Profil</div>
						</Link>
					</div>

					{/* Actions Rapides */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<Link 
							to="/profile/edit"
							className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition text-center text-sm"
						>
							✏️ Profil
						</Link>
						<Link 
							to="/events"
							className="bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition text-center text-sm"
						>
							📅 Événements
						</Link>
						<Link 
							to="/repertoire"
							className="bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition text-center text-sm"
						>
							🎵 Répertoire
						</Link>
						<Link 
							to="/contact"
							className="bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition text-center text-sm"
						>
							💬 Contact
						</Link>
					</div>
				</div>

				{/* Actions Disponibles */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h3 className="text-lg font-bold mb-4 text-gray-800">Découvrir C.A.S.T.</h3>
						<div className="space-y-3">
							<Link 
								to="/about"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-blue-500 text-xl">ℹ️</span>
								<div>
									<div className="font-medium">Notre Histoire et Mission</div>
									<div className="text-sm text-gray-500">Découvrez notre chorale</div>
								</div>
							</Link>
							<Link 
								to="/repertoire"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-green-500 text-xl">📜</span>
								<div>
									<div className="font-medium">Explorer le Répertoire</div>
									<div className="text-sm text-gray-500">Nos œuvres musicales</div>
								</div>
							</Link>
							<Link 
								to="/gallery"
								className="w-full text-left p-3 hover:bg_gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-purple-500 text-xl">🖼️</span>
								<div>
									<div className="font-medium">Voir nos Galeries</div>
									<div className="text-sm text-gray-500">Photos et vidéos</div>
								</div>
							</Link>
							<Link 
								to="/spiritualite"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-red-500 text-xl">🙏</span>
								<div>
									<div className="font-medium">Dimension Spirituelle</div>
									<div className="text-sm text-gray-500">Notre approche</div>
								</div>
							</Link>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-lg p-6">
						<h3 className="text-lg font-bold mb-4 text-gray-800">Participer</h3>
						<div className="space-y-3">
							<Link 
								to="/events"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-orange-500 text-xl">🎵</span>
								<div>
									<div className="font-medium">Voir nos Concerts</div>
									<div className="text-sm text-gray-500">Prochains événements</div>
								</div>
							</Link>
							<Link 
								to="/blog"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-red-500 text-xl">📰</span>
								<div>
									<div className="font-medium">Lire notre Blog</div>
									<div className="text-sm text-gray-500">Actualités et articles</div>
								</div>
							</Link>
							<Link 
								to="/join"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-teal-500 text-xl">👥</span>
								<div>
									<div className="font-medium">Rejoindre la Chorale</div>
									<div className="text-sm text-gray-500">Devenir membre actif</div>
								</div>
							</Link>
							<Link 
								to="/partenaires"
								className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center gap-3 block"
							>
								<span className="text-yellow-500 text-xl">🤝</span>
								<div>
									<div className="font-medium">Devenir Partenaire</div>
									<div className="text-sm text-gray-500">Soutenir notre projet</div>
								</div>
							</Link>
						</div>
					</div>
				</div>

				{/* Mes Ressources */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
					<h3 className="text-lg font-bold mb-4 text-gray-800">📚 Mes Ressources</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<Link 
							to="/documents"
							className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition text-center block"
						>
							<div className="text-blue-600 text-2xl mb-2">📋</div>
							<div className="font-medium text-blue-800">Documents</div>
							<div className="text-sm text-blue-600">Ressources partagées</div>
						</Link>
            
						<Link 
							to="/messages"
							className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition text-center block"
						>
							<div className="text-green-600 text-2xl mb-2">💬</div>
							<div className="font-medium text-green-800">Messages</div>
							<div className="text-sm text-green-600">Communication</div>
						</Link>
            
						<Link 
							to="/settings"
							className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition text-center block"
						>
							<div className="text-purple-600 text-2xl mb-2">⚙️</div>
							<div className="font-medium text-purple-800">Paramètres</div>
							<div className="text-sm text-purple-600">Préférences</div>
						</Link>
            
						<Link 
							to="/help"
							className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition text-center block"
						>
							<div className="text-orange-600 text-2xl mb-2">❓</div>
							<div className="font-medium text-orange-800">Aide</div>
							<div className="text-sm text-orange-600">Support</div>
						</Link>
					</div>
				</div>

				{/* Prochaines Étapes Interactives */}
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
					<h3 className="text-lg font-bold mb-4 text-blue-800">🚀 Prochaines Étapes Recommandées</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between p-3 bg-white rounded-lg border">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
									1
								</div>
								<div>
									<div className="font-medium text-gray-800">Compléter votre profil</div>
									<div className="text-sm text-gray-600">Ajoutez vos informations personnelles</div>
								</div>
							</div>
							<Link 
								to="/profile/edit"
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
							>
								Compléter
							</Link>
						</div>

						<div className="flex items-center justify-between p-3 bg-white rounded-lg border">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
									2
								</div>
								<div>
									<div className="font-medium text-gray-800">Explorer le répertoire</div>
									<div className="text-sm text-gray-600">Découvrez nos œuvres musicales</div>
								</div>
							</div>
							<Link 
								to="/repertoire"
								className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm"
							>
								Explorer
							</Link>
						</div>

						<div className="flex items-center justify-between p-3 bg-white rounded-lg border">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
									3
								</div>
								<div>
									<div className="font-medium text-gray-800">Voir les prochains concerts</div>
									<div className="text-sm text-gray-600">Découvrez nos événements</div>
								</div>
							</div>
							<Link 
								to="/events"
								className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition text-sm"
							>
								Voir
							</Link>
						</div>

						<div className="flex items-center justify-between p-3 bg-white rounded-lg border">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
									4
								</div>
								<div>
									<div className="font-medium text-gray-800">Nous contacter</div>
									<div className="text-sm text-gray-600">Posez vos questions</div>
								</div>
							</div>
							<Link 
								to="/contact"
								className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
							>
								Contacter
							</Link>
						</div>
					</div>
				</div>

				{/* Section Contact Rapide */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
					<Link 
						to="/contact"
						className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center block"
					>
						<div className="text-blue-600 text-xl mb-2">📞</div>
						<div className="font-medium">Nous Contacter</div>
					</Link>
          
					<Link 
						to="/faq"
						className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center block"
					>
						<div className="text-green-600 text-xl mb-2">❓</div>
						<div className="font-medium">FAQ</div>
					</Link>
          
					<Link 
						to="/support"
						className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center block"
					>
						<div className="text-purple-600 text-xl mb-2">🛠️</div>
						<div className="font-medium">Support</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default UserDashboard;