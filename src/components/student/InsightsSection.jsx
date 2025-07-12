import React from 'react';

// Using the author data you provided
const authorsData = [
  { "_id": "user_2zduqAhjg77sFuN5DVBmfauvCpk", "name": "Kazi Md Twahanur Rahman", "email": "twahanur.info@gmail.com", "imageUrl": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yemR1cUM4VGNKdXp0NUFTNDdwZGw2RHhBUHoifQ", "role": "Author" },
  { "_id": "user_2hBxxxxxxxxxxxxxxxxx1", "name": "Fatima Chowdhury", "email": "fatima.chow.edu@example.com", "imageUrl": "https://i.pravatar.cc/150?u=user_2hBxxxxxxxxxxxxxxxxx1", "role": "Manager" },
  { "_id": "user_2hBxxxxxxxxxxxxxxxxx3", "name": "Sadia Islam", "email": "sadia.islam.edu@example.com", "imageUrl": "https://i.pravatar.cc/150?u=user_2hBxxxxxxxxxxxxxxxxx3", "role": "Manager" },
  { "_id": "user_2zg76alEHlMMA1qnSRgHEcV4sOz", "name": "Twahanur Rahman", "email": "twahanur.rahman@gmail.com", "imageUrl": "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yemI5V2FyN203V2lKQTlFY255TXNrUmp4WjciLCJyaWQiOiJ1c2VyXzJ6Zzc2YWxFSGxNTUExcW5TUmdIRWNWNHNPeiIsImluaXRpYWxzIjoiVFIifQ", "role": "Author" }
];

// Mock data for the blog posts
const blogPostsData = [
  { title: "How to Stay Motivated While Studying from Home", category: "Data Science", date: "2025-09-23T10:00:00.000Z" },
  { title: "Take your career Next Approach For Future Development", category: "Development", date: "2025-04-15T10:00:00.000Z" },
  { title: "Master in Artificial Intelligence Using Technology", category: "Development", date: "2025-01-05T10:00:00.000Z" },
];

const InsightsSection = () => {
  return (
    <section className="bg-[#FBF9F7] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="font-semibold text-orange-500 text-sm">( OUR INSIGHTS )</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-1">Discover, Learn, And Grow</h2>
          </div>
          <button className="btn btn-accent text-white rounded-full hidden sm:inline-flex">
            VIEW ALL BLOGS
            <div className="bg-white/20 rounded-full p-1 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </button>
        </div>

        {/* Blog Post List */}
        <div className="space-y-8">
          {blogPostsData.map((post, index) => {
            // Cycle through authors for each post
            const author = authorsData[index % authorsData.length];
            const buttonClass = index === 0 ? "btn-warning text-gray-800" : "btn-accent text-white";

            return (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 py-8 border-b border-gray-200">
                
                {/* Author Info */}
                <div className="lg:col-span-3 flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-14 rounded-full">
                      <img src={author.imageUrl} alt={author.name} />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{author.name}</p>
                    <p className="text-sm text-gray-500">{author.role}</p>
                  </div>
                </div>

                {/* Post Details */}
                <div className="lg:col-span-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="badge badge-info text-white badge-outline">{post.category}</span>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
                      </svg>
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 hover:text-accent transition-colors">
                    <a href="#">{post.title}</a>
                  </h3>
                </div>

                {/* Read More Button */}
                <div className="lg:col-span-3 lg:justify-self-end">
                  <button className={`btn ${buttonClass} rounded-full`}>
                    READ MORE
                    <div className={`${index === 0 ? "bg-black/10" : "bg-white/20"} rounded-full p-1 ml-2`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;