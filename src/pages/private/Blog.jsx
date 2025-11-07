import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Blog = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    category: 'actualites',
    image: ''
  });

  const categories = [
    { id: 'all', name: 'Tous les Articles', icon: '📚', color: 'bg-gray-500' },
    { id: 'actualites', name: 'Actualités CAST', icon: '📢', color: 'bg-blue-500' },
    { id: 'concerts', name: 'Concerts & Événements', icon: '🎵', color: 'bg-purple-500' },
    { id: 'spiritualite', name: 'Spiritualité & Foi', icon: '🙏', color: 'bg-green-500' },
    { id: 'temoignages', name: 'Témoignages Vivants', icon: '👥', color: 'bg-orange-500' },
    { id: 'musique', name: 'Art & Musique Sacrée', icon: '🎼', color: 'bg-red-500' },
    { id: 'prieres', name: 'Intentions de Prière', icon: '🕊️', color: 'bg-indigo-500' },
    { id: 'ressources', name: 'Ressources Spirituelles', icon: '📖', color: 'bg-teal-500' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Notre Concert de Noël 2023 : Une Nuit de Grâce et de Beauté Sacrée",
      excerpt: "Retour en images et en témoignages sur notre célébration de Noël à la Cathédrale d'Andohalo, où la musique sacrée a touché près de 500 âmes réunies dans la prière et l'émotion.",
      content: "Le 24 décembre 2023 restera gravé dans nos mémoires comme un moment de grâce exceptionnel. La Cathédrale d'Andohalo, remplie de près de 500 fidèles, a vibré au rythme des chants sacrés de l'Avent. Chaque note portait une prière, chaque silence était une offrande. La présence de l'Esprit Saint était palpable dans l'assemblée, unissant les cœurs dans une même louange. Les choristes, portés par une ferveur particulière, ont offert leur voix comme un encens montant vers le Créateur. Ce concert fut bien plus qu'une prestation musicale : une véritable expérience spirituelle collective.",
      category: "concerts",
      date: "26 Décembre 2023",
      author: "Père Lucien",
      authorRole: "Aumônier Spiritual",
      authorAvatar: "⛪",
      image: "/images/concert1.jpg",
      readTime: "5 min",
      featured: true,
      likes: 24,
      comments: [
        {
          id: 1,
          author: "Marie L.",
          authorRole: "Soprano",
          content: "Quelle grâce de chanter ce soir-là ! Je sentais chaque note comme une prière montant vers le Ciel. L'émotion était si forte que les larmes coulaient pendant le 'Minuit Chrétien'.",
          date: "27 Décembre 2023",
          type: "temoignage",
          likes: 5
        },
        {
          id: 2,
          author: "Jean P.",
          authorRole: "Auditeur",
          content: "Merci pour ce moment de recueillement. La beauté de votre chant m'a profondément touché. J'ai senti une paix intérieure que je cherchais depuis longtemps.",
          date: "26 Décembre 2023",
          type: "impression",
          likes: 3
        },
        {
          id: 3,
          author: "Sophie M.",
          authorRole: "Alto",
          content: "Ce concert a été l'aboutissement de mois de travail et de prière. Voir l'assemblée si recueillie nous a confirmé que notre mission dépasse la simple performance artistique.",
          date: "28 Décembre 2023",
          type: "reflexion",
          likes: 7
        }
      ],
      prayers: [
        {
          id: 1,
          author: "Sophie R.",
          content: "🙏 Prions pour que cette beauté sacrée continue de toucher les cœurs et d'ouvrir les âmes à la grâce divine. Que chaque note semée porte du fruit dans les cœurs.",
          date: "26 Décembre 2023"
        },
        {
          id: 2,
          author: "Pierre D.",
          content: "💫 Seigneur, merci pour ces voix qui Te louent. Qu'elles continuent à être des instruments de Ta paix et de Ta beauté dans notre monde.",
          date: "27 Décembre 2023"
        }
      ],
      views: 156
    },
    {
      id: 2,
      title: "La Musique Sacrée : Ce Pont Mystérieux Entre le Ciel et la Terre",
      excerpt: "Exploration profonde de la dimension spirituelle de la musique sacrée à travers les siècles, des psaumes grégoriens aux polyphonies contemporaines.",
      content: "Depuis les premiers chants des moines copistes jusqu'aux compositions modernes, la musique sacrée a toujours été ce pont mystériqueux reliant le terrestre au divin. Elle n'est pas simple divertissement, mais véritable chemin d'élévation spirituelle. À C.A.S.T., nous croyons que chaque mélodie peut devenir une échelle de Jacob pour l'âme en quête de transcendance. Le chant grégorien, avec son dépouillement, nous apprend la sobriété et l'abandon. La polyphonie renaissance nous enseigne l'harmonie dans la diversité. La musique baroque nous révèle la complexité des émotions humaines offertes à Dieu. Chaque style musical sacré est une porte ouverte sur le mystère divin.",
      category: "spiritualite",
      date: "15 Décembre 2023",
      author: "Dr. Marie Rakoto",
      authorRole: "Théologienne & Musicologue",
      authorAvatar: "🎓",
      image: "/images/inspiration/inspiration2.jpg",
      readTime: "8 min",
      featured: true,
      likes: 31,
      comments: [
        {
          id: 1,
          author: "Pierre M.",
          authorRole: "Ténor",
          content: "Cet article résonne profondément avec mon expérience. Chanter en chorale, c'est vraiment prier deux fois ! Je sens souvent une présence particulière pendant les répétitions.",
          date: "16 Décembre 2023",
          type: "reflexion",
          likes: 8
        },
        {
          id: 2,
          author: "Lucie B.",
          authorRole: "Musicienne",
          content: "Merci pour ces réflexions éclairantes. La musique sacrée est effectivement un langage universel qui parle directement à l'âme, au-delà des mots.",
          date: "17 Décembre 2023",
          type: "impression",
          likes: 4
        }
      ],
      prayers: [
        {
          id: 1,
          author: "Lucie D.",
          content: "🕊️ Que l'Esprit Saint continue d'inspirer nos compositeurs et d'ouvrir les cœurs à la beauté sacrée. Que la musique soit toujours au service de la louange.",
          date: "15 Décembre 2023"
        }
      ],
      views: 203
    },
    {
      id: 3,
      title: "3 Ans à C.A.S.T. : Comment le Chant a Transformé Ma Vie Spirituelle",
      excerpt: "Jean nous ouvre son cœur et partage son parcours émouvant de transformation personnelle et spirituelle au sein de notre chorale sacrée.",
      content: "Quand j'ai rejoint C.A.S.T. il y a trois ans, je ne m'attendais pas à ce que le chant devienne un véritable chemin de conversion. Au-delà de la technique vocale, j'ai découvert une communauté fraternelle où la prière et la beauté s'unissent pour transformer les cœurs. Chaque répétition est devenue un temps de ressourcement, chaque concert une mission d'évangélisation par la beauté. J'ai appris à écouter non seulement les autres voix, mais aussi la voix de Dieu qui murmure dans le silence entre les notes. Le chant n'est plus pour moi un simple hobby, mais une véritable école de vie spirituelle où j'apprends chaque jour l'humilité, l'écoute et le don de soi.",
      category: "temoignages",
      date: "8 Décembre 2023",
      author: "Jean R.",
      authorRole: "Membre Actif - Ténor",
      authorAvatar: "🎤",
      image: "/images/pcast01.jpg",
      readTime: "4 min",
      featured: false,
      likes: 18,
      comments: [
        {
          id: 1,
          author: "Sarah K.",
          authorRole: "Nouvelle Membre",
          content: "Merci Jean pour ce beau témoignage ! Cela m'encourage dans mes premiers pas à C.A.S.T. J'espère vivre une transformation similaire.",
          date: "9 Décembre 2023",
          type: "encouragement",
          likes: 3
        }
      ],
      prayers: [
        {
          id: 1,
          author: "Annie K.",
          content: "💫 Merci Jean pour ce beau témoignage qui m'encourage dans mon propre cheminement spirituel. Prions pour que de nombreuses vocations naissent à C.A.S.T.",
          date: "9 Décembre 2023"
        }
      ],
      views: 89
    },
    {
      id: 4,
      title: "Intentions de Prière du Mois : Portons Ensemble Nos Fardeaux",
      excerpt: "Partageons nos intentions de prière pour ce mois de mars. Ensemble, portons nos fardeaux au Seigneur dans la confiance et l'espérance.",
      content: "Chers membres de la communauté C.A.S.T., ce mois de mars nous invite à approfondir notre vie de prière. Partagez ici vos intentions, vos demandes, vos actions de grâce. Prions les uns pour les autres, comme une seule famille spirituelle unie dans le Christ. N'oublions pas que la prière d'intercession est un acte de charité fraternelle. En portant les fardeaux de nos frères et sœurs, nous imitons le Christ qui porte nos croix avec nous.",
      category: "prieres",
      date: "1 Mars 2024",
      author: "Son Excellence Liva Ramanalinarivo",
      authorRole: "Fondateur & Guide Spirituel",
      authorAvatar: "🕊️",
      image: "/images/inspiration/inspiration1.jpg",
      readTime: "3 min",
      featured: true,
      likes: 42,
      comments: [],
      prayers: [
        {
          id: 1,
          author: "Marie L.",
          content: "🙏 Pour ma mère malade, qu'elle retrouve la santé et la paix du cœur. Qu'elle sente la présence réconfortante du Christ dans son épreuve.",
          date: "1 Mars 2024"
        },
        {
          id: 2,
          author: "Paul D.",
          content: "💫 Action de grâce pour la guérison de mon fils. Merci Seigneur pour ta miséricorde et ton amour infini !",
          date: "2 Mars 2024"
        },
        {
          id: 3,
          author: "Sophie R.",
          content: "🕊️ Pour toutes les vocations sacerdotales et religieuses de notre diocèse. Qu'elles soient fidèles à l'appel du Seigneur.",
          date: "3 Mars 2024"
        },
        {
          id: 4,
          author: "Jean-Pierre M.",
          content: "🌟 Pour la paix dans le monde, spécialement dans les zones de conflit. Que l'Esprit Saint transforme les cœurs endurcis.",
          date: "4 Mars 2024"
        }
      ],
      views: 278
    },
    {
      id: 5,
      title: "Le Répertoire Baroque : Un Voyage Musical au Cœur de la Foi",
      excerpt: "Plongée mystique dans les œuvres baroques qui font vibrer notre chorale, entre ferveur spirituelle et perfection technique.",
      content: "La musique baroque, avec ses ornements délicats et ses émotions exacerbées, nous offre un langage unique pour exprimer la complexité de l'expérience religieuse. Des motets de Bach aux œuvres de Charpentier, chaque composition est une méditation musicale sur les mystères de la foi. Le baroque nous apprend que la spiritualité n'exclut pas la passion, mais la transfigure. En travaillant ces œuvres exigeantes, nous découvrons que la technique vocale la plus raffinée doit toujours être au service de l'expression authentique de la foi.",
      category: "musique",
      date: "10 Novembre 2023",
      author: "Prof. Andriana",
      authorRole: "Spécialiste Musique Baroque",
      authorAvatar: "🏛️",
      image: "/images/partition-sacree.jpg",
      readTime: "7 min",
      featured: false,
      likes: 19,
      comments: [
        {
          id: 1,
          author: "Thomas L.",
          authorRole: "Basse",
          content: "Travailler le répertoire baroque est un vrai défi technique, mais quelle récompense spirituelle ! Les ornementations deviennent comme des prières ajoutées.",
          date: "11 Novembre 2023",
          type: "experience",
          likes: 2
        }
      ],
      prayers: [],
      views: 112
    },
    {
      id: 6,
      title: "Guide Spirituel : Préparer son Cœur au Temps du Carême",
      excerpt: "Ressources et conseils pour vivre pleinement le temps du Carême en harmonie avec notre pratique chorale et notre vie spirituelle.",
      content: "Le Carême est un temps privilégié pour approfondir notre relation avec Dieu. À C.A.S.T., nous proposons un accompagnement spirituel spécifique pour ce temps de conversion. Du mercredi des Cendres à Pâques, chaque répétition intégrera des moments de prière particuliers, et notre répertoire s'adaptera au caractère pénitentiel de cette période. Ce guide vous aidera à unifier votre pratique musicale et votre cheminement spirituel durant ces quarante jours.",
      category: "ressources",
      date: "14 Février 2024",
      author: "Équipe Spirituelle C.A.S.T.",
      authorRole: "Accompagnement Spirituel",
      authorAvatar: "📖",
      image: "/images/inspiration/inspiration3.jpg",
      readTime: "6 min",
      featured: false,
      likes: 27,
      comments: [
        {
          id: 1,
          author: "Michelle R.",
          authorRole: "Membre",
          content: "Ce guide est très utile pour harmoniser ma pratique chorale avec mon cheminement carémal. Merci pour ces ressources précieuses !",
          date: "15 Février 2024",
          type: "remerciement",
          likes: 1
        }
      ],
      prayers: [
        {
          id: 1,
          author: "Patrick L.",
          content: "🙏 Que ce Carême soit pour chacun de nous un vrai temps de conversion et de renouveau spirituel.",
          date: "14 Février 2024"
        }
      ],
      views: 145
    }
  ];

  // Filtrage et tri des articles
  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
    const searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'popular':
        return (b.likes + b.comments.length + b.prayers.length) - (a.likes + a.comments.length + a.prayers.length);
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  // Gestion des interactions
  const handleWriteArticle = () => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour écrire un article');
      return;
    }
    setShowWriteModal(true);
  };

  const handleSubmitArticle = (e) => {
    e.preventDefault();
    console.log('Nouvel article:', newArticle);
    setShowWriteModal(false);
    setNewArticle({ title: '', content: '', category: 'actualites', image: '' });
    alert('Article soumis pour modération ! Il sera publié après validation.');
  };

  const handleAddComment = (postId) => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour commenter');
      return;
    }
    if (!newComment.trim()) return;

    // Simulation d'ajout - À remplacer par appel API
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: Date.now(),
        author: userProfile?.displayName || 'Membre C.A.S.T.',
        authorRole: userProfile?.role || 'Membre',
        content: newComment,
        date: new Date().toLocaleDateString('fr-FR'),
        type: 'commentaire',
        likes: 0
      });
    }

    setNewComment('');
    alert('Commentaire ajouté avec succès !');
  };

  const handleAddPrayer = (postId) => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour ajouter une prière');
      return;
    }
    
    const prayerText = prompt('Partagez votre intention de prière :');
    if (!prayerText) return;

    // Simulation d'ajout - À remplacer par appel API
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      post.prayers.push({
        id: Date.now(),
        author: userProfile?.displayName || 'Membre C.A.S.T.',
        content: prayerText,
        date: new Date().toLocaleDateString('fr-FR')
      });
    }

    alert('Intention de prière ajoutée ! Merci pour ce partage fraternel.');
  };

  const handleLikePost = (postId) => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour liker un article');
      return;
    }

    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      alert('Merci pour votre like !');
    }
  };

  const getCategoryColor = (categoryId) => {
    return categories.find(cat => cat.id === categoryId)?.color || 'bg-gray-500';
  };

  // Composant Modal de détail d'article
  const PostDetailModal = ({ post, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-8">
          {/* En-tête */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <span className={`${getCategoryColor(post.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {categories.find(cat => cat.id === post.category)?.icon} {categories.find(cat => cat.id === post.category)?.name}
                </span>
                {post.featured && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    ⭐ À la Une
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Auteur et métadonnées */}
          <div className="flex items-center space-x-4 mb-6 text-gray-600">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                {post.authorAvatar}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{post.author}</div>
                <div className="text-sm text-gray-500">{post.authorRole}</div>
              </div>
            </div>
            <span className="text-gray-300">•</span>
            <span>📅 {post.date}</span>
            <span className="text-gray-300">•</span>
            <span>⏱️ {post.readTime}</span>
            <span className="text-gray-300">•</span>
            <span>👁️ {post.views} vues</span>
          </div>

          {/* Image */}
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-80 object-cover rounded-2xl mb-8 shadow-lg"
          />

          {/* Contenu */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Interactions */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">❤️</span>
                  <span className="font-semibold">{post.likes}</span>
                </button>
                <button 
                  onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                  <span className="font-semibold">{post.comments.length} commentaires</span>
                </button>
                <button 
                  onClick={() => handleAddPrayer(post.id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🕊️</span>
                  <span className="font-semibold">{post.prayers.length} prières</span>
                </button>
              </div>
            </div>

            {/* Section Commentaires */}
            {showComments === post.id && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">💬 Commentaires et Impressions</h3>
                
                {post.comments.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-900">{comment.author}</span>
                            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {comment.authorRole}
                            </span>
                            {comment.type && (
                              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                {comment.type}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                            <span>❤️</span>
                            <span>{comment.likes}</span>
                          </button>
                          <button className="hover:text-blue-500 transition-colors">
                            Répondre
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 mb-6">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-gray-500">Aucun commentaire pour le moment.</p>
                    <p className="text-gray-400 text-sm mt-1">Soyez le premier à partager votre impression !</p>
                  </div>
                )}

                {/* Formulaire de commentaire */}
                {currentUser ? (
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Partagez votre impression</h4>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Votre témoignage, réflexion ou impression..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                      rows="4"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">
                        Connecté en tant que <strong>{userProfile?.displayName || currentUser.email}</strong>
                      </span>
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComment.trim()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Publier mon commentaire
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                    <div className="text-3xl mb-2">🔐</div>
                    <p className="text-gray-600 mb-3">Connectez-vous pour partager vos impressions</p>
                    <Link 
                      to="/login" 
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold inline-block"
                    >
                      Se connecter
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Section Prières */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">🕊️ Intentions de Prière</h3>
              {post.prayers.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {post.prayers.map(prayer => (
                    <div key={prayer.id} className="bg-green-50 border border-green-200 rounded-2xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-green-800">{prayer.author}</span>
                        <span className="text-sm text-green-600">{prayer.date}</span>
                      </div>
                      <p className="text-green-700 leading-relaxed">{prayer.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-green-50 rounded-2xl border-2 border-dashed border-green-300 mb-6">
                  <div className="text-4xl mb-2">🕊️</div>
                  <p className="text-green-600">Aucune intention de prière pour le moment.</p>
                  <p className="text-green-500 text-sm mt-1">Soyez le premier à partager une intention de prière</p>
                </div>
              )}

              {currentUser ? (
                <button
                  onClick={() => handleAddPrayer(post.id)}
                  className="w-full bg-green-100 text-green-700 py-4 rounded-2xl hover:bg-green-200 transition border-2 border-dashed border-green-300 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>+</span>
                  <span>Ajouter une intention de prière</span>
                </button>
              ) : (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-2xl">
                  <p className="text-gray-600">Connectez-vous pour ajouter une intention de prière</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      {/* Hero Section Inspirante */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/images/partition-sacree.jpg')] bg-cover bg-center opacity-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white/10 backdrop-blur rounded-full px-6 py-3 mb-6">
              <span className="text-lg mr-2">✍️</span>
              <span className="font-semibold">Blog Communautaire C.A.S.T.</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif leading-tight">
              Espace de <span className="text-yellow-300">Partage Spirituel</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto text-blue-100">
              "Là où nos voix se rencontrent, nos âmes se racontent"<br />
              <span className="text-lg text-blue-200 italic">- La communauté C.A.S.T.</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => document.getElementById('articles').scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg flex items-center"
              >
                <span className="mr-2">📚</span>
                Découvrir les Articles
              </button>
              {currentUser && (
                <button
                  onClick={handleWriteArticle}
                  className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition transform hover:scale-105 shadow-lg flex items-center"
                >
                  <span className="mr-2">🖊️</span>
                  Écrire un Article
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Barre de Recherche et Filtres */}
      <section className="py-8 bg-white/80 backdrop-blur-sm sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Barre de recherche */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Rechercher un article, un témoignage, une prière..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tri */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">Plus récent</option>
                <option value="popular">Plus populaire</option>
                <option value="views">Plus vus</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres par Catégorie */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                  {blogPosts.filter(post => post.category === category.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <main id="articles" className="pb-20">
        {/* Articles à la Une */}
        {featuredPosts.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Articles Sacrés à la Une</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Les récits et réflexions qui illuminent notre chemin spirituel commun
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map(post => (
                  <article 
                    key={post.id} 
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ À la Une
                      </div>
                      <div className={`absolute top-4 right-4 ${getCategoryColor(post.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        {categories.find(cat => cat.id === post.category)?.icon}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <span>📅 {post.date}</span>
                        <span className="mx-3">•</span>
                        <span>⏱️ {post.readTime}</span>
                        <span className="mx-3">•</span>
                        <span>👁️ {post.views} vues</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                            {post.authorAvatar}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{post.author}</div>
                            <div className="text-sm text-gray-500">{post.authorRole}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-6 text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span>❤️</span>
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>💬</span>
                            <span>{post.comments.length}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>🕊️</span>
                            <span>{post.prayers.length}</span>
                          </div>
                        </div>
                        
                        <div className="text-blue-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                          Lire la suite
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grille des Articles Réguliers */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 font-serif">
                  {activeCategory === 'all' ? 'Tous les Articles' : categories.find(cat => cat.id === activeCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                </p>
              </div>
              
              {!currentUser && (
                <Link
                  to="/login"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold flex items-center"
                >
                  <span className="mr-2">🎤</span>
                  Rejoindre pour Participer
                </Link>
              )}
            </div>

            {regularPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map(post => (
                  <article 
                    key={post.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute top-4 right-4 ${getCategoryColor(post.category)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        {categories.find(cat => cat.id === post.category)?.icon}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <span>📅 {post.date}</span>
                        <span className="mx-2">•</span>
                        <span>⏱️ {post.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed text-sm">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                            {post.authorAvatar}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{post.author}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-gray-500 text-sm">
                          <span className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>💬</span>
                            <span>{post.comments.length}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>🕊️</span>
                            <span>{post.prayers.length}</span>
                          </span>
                        </div>
                        
                        <div className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                          Lire
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `Aucun résultat pour "${searchTerm}"` 
                    : `Aucun article dans la catégorie "${categories.find(cat => cat.id === activeCategory)?.name}"`
                  }
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchTerm('');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Voir tous les articles
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Appel à l'Écriture */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Votre Voix Compte</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Que vous soyez membre de C.A.S.T., ancien choriste, ou simplement touché par notre mission, 
              votre témoignage, votre réflexion spirituelle ou votre analyse musicale peut inspirer toute notre communauté.
              Partagez votre expérience, vos prières, vos découvertes... chaque voix unique enrichit notre chorale spirituelle.
            </p>
            
            {currentUser ? (
              <div className="space-y-6">
                <button
                  onClick={handleWriteArticle}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
                >
                  <span className="mr-2">🖊️</span>
                  Rédiger mon Premier Article
                </button>
                <p className="text-gray-500 text-sm">
                  ✨ Votre article sera soumis à modération avant publication pour maintenir la qualité spirituelle de notre espace
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-lg text-gray-600">
                  Rejoignez notre communauté pour partager vos écrits et vos prières
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/login"
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <span className="mr-2">🔑</span>
                    Se Connecter
                  </Link>
                  <Link 
                    to="/join"
                    className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-green-600 hover:text-white transition transform hover:scale-105 flex items-center justify-center"
                  >
                    <span className="mr-2">👥</span>
                    Nous Rejoindre
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal d'écriture d'article */}
      {showWriteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Rédiger un Article pour C.A.S.T.</h3>
                <button
                  onClick={() => setShowWriteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitArticle} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre inspirant *</label>
                  <input
                    type="text"
                    required
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Donnez un titre inspirant qui reflète l'esprit C.A.S.T..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie spirituelle *</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Votre message spirituel *</label>
                  <textarea
                    required
                    rows={8}
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Partagez votre témoignage, votre réflexion spirituelle, votre analyse musicale ou votre expérience à C.A.S.T..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Votre article sera lu par l'équipe de modération avant publication.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image d'illustration (URL)</label>
                  <input
                    type="url"
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({...newArticle, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg (optionnel)"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowWriteModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Soumettre pour Modération
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail d'article */}
      {selectedPost && (
        <PostDetailModal 
          post={selectedPost} 
          onClose={() => {
            setSelectedPost(null);
            setShowComments(null);
            setNewComment('');
          }} 
        />
      )}
    </div>
  );
};

export default Blog;