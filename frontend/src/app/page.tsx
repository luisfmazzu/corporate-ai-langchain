import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Company's Private AI Document Q&A System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your company documents and ask questions using AI-powered retrieval
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/upload"
              className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-sm text-gray-500">
                  Upload CSV, PDF, or DOCX files to make them available for Q&A
                </p>
              </div>
            </Link>

            <Link
              href="/chat"
              className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start Chat
                </h3>
                <p className="text-sm text-gray-500">
                  Ask questions about your uploaded documents using AI
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>Supported file types: CSV, PDF, DOCX</p>
            <p className="mt-1">Maximum file size: 10MB per file</p>
          </div>
        </div>
      </div>
    </div>
  );
}
