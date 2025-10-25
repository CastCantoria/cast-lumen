import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useAuthorization } from '../../../../hooks/useAuthorization';
import PermissionGuard from '../../../../components/auth/PermissionGuard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { ROLES, PERMISSIONS } from '../../../../config/roles';
import { Link, useNavigate } from 'react-router-dom';

// Import des nouveaux composants
import UserManagement from '../../../../components/admin/UserManagement';
import AdmissionManagement from '../../../../components/admin/AdmissionManagement';
import EventCreation from '../../../../components/admin/EventCreation';
import EventCalendar from '../../../../components/admin/EventCalendar';
import PartitionManager from '../../../../components/admin/PartitionManager';
import GalleryManager from '../../../../components/admin/GalleryManager';
import ArticlePublisher from '../../../../components/admin/ArticlePublisher';
import MemberInviter from '../../../../components/admin/MemberInviter';

const SuperAdminDashboard = () => {
	const { userProfile, currentUser } = useAuth();
	const { can, currentRole } = useAuthorization();
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalAdmins: 0,
		totalCoreTeam: 0,
		totalMembers: 0,
		totalEvents: 0,
		activeUsers: 0
	});
	const [recentActivity, setRecentActivity] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeComponent, setActiveComponent] = useState('dashboard'); // État pour gérer l'affichage

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			const usersSnapshot = await getDocs(collection(db, 'users'));
			const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
			const admins = users.filter(user => user.role === 'admin');
			const coreTeam = users.filter(user => user.role === 'core-team');
			const members = users.filter(user => user.role === 'membre');
			const activeUsers = users.filter(user => user.isActive);

			setStats({
				totalUsers: users.length,
				totalAdmins: admins.length,
				totalCoreTeam: coreTeam.length,
				totalMembers: members.length,
				totalEvents: 0,
				activeUsers: activeUsers.length
			});

			const recentUsers = users
				.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0))
				.slice(0, 5);
      
			setRecentActivity(recentUsers);
		} catch (error) {
			console.error('Erreur chargement dashboard:', error);
		} finally {
			setLoading(false);
		}
	};

	// Fonction pour revenir au dashboard principal
	const handleBackToDashboard = () => {
		setActiveComponent('dashboard');
	};

	// Navigation vers l'accueil du site
	const handleGoToHome = () => {
		navigate('/');
	};

	// Rendu conditionnel basé sur le composant actif
	const renderActiveComponent = () => {
		switch (activeComponent) {
			case 'UserManagement':
				return <UserManagement />;
			case 'AdmissionManagement':
				return <AdmissionManagement />;
			case 'EventCreation':
				return <EventCreation />;
			case 'EventCalendar':
				return <EventCalendar />;
			case 'PartitionManager':
				return <PartitionManager />;
			case 'GalleryManager':
				return <GalleryManager />;
			case 'ArticlePublisher':
				return <ArticlePublisher />;
			case 'MemberInviter':
				return <MemberInviter />;
			default:
				return renderMainDashboard();
		}
	};

	const renderMainDashboard = () => {
		if (loading) {
			return (
				<div className="flex items-center justify-center min-h-screen bg-gray-50">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Chargement du tableau de bord...</p>
					</div>
				</div>
			);
		}

		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
				{/* Header avec informations de rôle */}
				<div className="bg-black bg-opacity-50 text-white p-6">
					<div className="max-w-7xl mx-auto">
						<div className="flex justify-between items-center">
							<div>
								<h1 className="text-3xl font-bold mb-2">Tableau de Bord Super-Admin</h1>
								<p className="text-purple-200">
									Gestion complète de la plateforme C.A.S.T. • Rôle: <strong>{currentRole}</strong>
								</p>
							</div>
							<div className="flex items-center gap-4">
								{/* Bouton pour retourner à l'accueil du site */}
								<button
									onClick={handleGoToHome}
									className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
								>
									🏠 Accueil du Site
								</button>
								<div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium">
									👑 Super-Admin
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto p-6">
					{/* Statistiques avec liens fonctionnels */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
						<Link 
							to="/admin/users" 
							className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer block"
						>
							<div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
							<div className="text-gray-600">Utilisateurs Total</div>
						</Link>
						{/* autres liens... */}
					</div>

					{/* contenu abrégé pour archive: voir original complet si besoin */}
				</div>
			</div>
		);
	};

	// Si un composant spécifique est actif, afficher la barre de navigation
	if (activeComponent !== 'dashboard') {
		return (
			<div className="min-h-screen bg-gray-50">
				{/* Barre de navigation pour les sous-pages */}
				<div className="bg-white shadow-sm border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<button
									onClick={handleBackToDashboard}
									className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
								>
									← Retour au Dashboard
								</button>
								<h1 className="text-xl font-semibold text-gray-900">
									{/* titre dynamique */}
								</h1>
							</div>
							<div className="flex items-center gap-4">
								<button
									onClick={handleGoToHome}
									className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
								>
									🏠 Accueil du Site
								</button>
								<div className="bg-purple-600 px-3 py-1 rounded-full text-sm font-medium text-white">
									👑 Super-Admin
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Contenu du composant actif */}
				<div className="max-w-7xl mx-auto py-6">
					{renderActiveComponent()}
				</div>
			</div>
		);
	}

	// Sinon, afficher le dashboard principal
	return renderMainDashboard();
};

export default SuperAdminDashboard;