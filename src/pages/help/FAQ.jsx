import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "Comment puis-je rejoindre Cast Cantoria ?",
      answer: "Pour rejoindre Cast Cantoria, vous pouvez visiter notre page 'Nous Rejoindre' et suivre le processus d'inscription. Nous évaluerons votre candidature et vous contacterons pour la suite.",
    },
    {
      question: "Quels sont les horaires de répétition ?",
      answer: "Les horaires de répétition sont disponibles dans votre espace membre. Généralement, nous nous réunissons une fois par semaine.",
    },
    {
      question: "Comment accéder aux partitions ?",
      answer: "Les partitions sont accessibles dans votre espace membre, sous la section 'Répertoire'. Vous devez être connecté pour y accéder.",
    },
    {
      question: "Comment contacter l'équipe administrative ?",
      answer: "Vous pouvez nous contacter via le formulaire de contact ou directement par email à l'adresse indiquée sur la page Contact.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Questions Fréquentes
        </h2>

        <dl className="space-y-6 divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className={index === 0 ? "pt-0" : "pt-6"}>
              <dt className="text-lg">
                <button
                  className="text-left w-full flex justify-between items-start text-gray-400"
                >
                  <span className="font-medium text-gray-900">
                    {faq.question}
                  </span>
                </button>
              </dt>
              <dd className="mt-2 pr-12">
                <p className="text-base text-gray-500">
                  {faq.answer}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FAQ;