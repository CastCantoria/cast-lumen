import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "Comment rejoindre la chorale ?",
      answer: "Contactez-nous via le formulaire de contact ou venez nous rencontrer lors d'une répétition."
    },
    {
      question: "Faut-il savoir lire la musique ?",
      answer: "Non, ce n'est pas obligatoire. Nous fournissons des outils d'apprentissage adaptés."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Foire aux questions</h1>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;