// src/pages/private/Blog.jsx
import React from 'react';

const Blog = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* En-tête */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Blog</h1>
            <p className="mt-1 text-sm text-gray-500">
              Articles et actualités de la communauté
            </p>
          </div>

          {/* Liste des articles */}
          <div className="divide-y divide-gray-200">
            {/* Article exemple */}
            <article className="p-6">
              <div className="flex items-start space-x-3">
                <img
                  src="/path/to/profile-photo.jpg"
                  alt="Author"
                  className="h-10 w-10 rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    John Doe
                  </p>
                  <p className="text-sm text-gray-500">
                    <time dateTime="2025-10-31">31 Octobre 2025</time>
                  </p>
                </div>
              </div>
              <h2 className="mt-4 text-base font-medium text-gray-900">
                Titre de l'article
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <button
                  type="button"
                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">12</span>
                  <span className="sr-only">likes</span>
                </button>
                <button
                  type="button"
                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-gray-900">8</span>
                  <span className="sr-only">réponses</span>
                </button>
                <button
                  type="button"
                  className="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span className="font-medium text-gray-900">4</span>
                  <span className="sr-only">partages</span>
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;