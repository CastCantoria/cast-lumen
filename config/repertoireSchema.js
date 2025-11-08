// src/config/repertoireSchema.js
export const repertoireSchema = {
  title: "",
  composer: "",
  style: "", // "Sacré", "Classique", "Contemporain", "Jazz", "Traditionnel"
  period: "", // "Médiéval", "Renaissance", "Baroque", "Classique", "Romantique", "Moderne", "Contemporain"
  difficulty: 1, // 1-5
  language: "", // "Latin", "Français", "Allemand", "Italien", "Anglais"
  duration: "", // "3:45"
  lyrics: "",
  pdfUrl: "",
  audioUrl: "",
  videoUrl: "",
  featured: false,
  createdBy: "",
  createdAt: new Date(),
  updatedAt: new Date()
};