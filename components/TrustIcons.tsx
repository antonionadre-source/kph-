import React from 'react';

const TrustIcons: React.FC = () => {
  return (
    <section className="py-12 bg-white border-t border-gray-50">
      <div className="container mx-auto px-4 flex justify-center">
        <img 
          src="https://www.dropbox.com/scl/fi/gxi2nh8v7wrtx760y2u4p/iconos-why-us.jpg?rlkey=blznhae1xrcsi5vcqrvvquio8&st=nahvgjck&raw=1" 
          alt="Trust Icons" 
          className="max-w-4xl w-full h-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
};

export default TrustIcons;
