import React from 'react';
import { useTranslation } from '../i18n';
import { kaiComicPhotos } from '../assets';

interface ComicPageProps {
    onNavigate: (page: string) => void;
}

const ComicPage: React.FC<ComicPageProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    return (
        <main className="bg-[#001D3D] min-h-screen pt-40 pb-24 selection:bg-yellow-300 overflow-x-hidden font-sans relative">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-blue-500/10 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Comic Header Area */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-yellow-400 text-[#002D5B] text-[10px] font-black uppercase tracking-[0.5em] mb-8 shadow-[0_10px_30px_rgba(250,204,21,0.3)] border-2 border-[#002D5B] animate-bounce-slow">
                        First Edition // Jan 2025
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-none uppercase tracking-tighter italic mb-4 drop-shadow-[8px_8px_0_#007AFF]">
                        KAI <span className="text-yellow-400">UNLEASHED</span>
                    </h1>
                    <p className="text-blue-200/50 font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                        The Official Graphic Novel Series
                    </p>
                </div>

                {/* The "Portada" (Cover) */}
                <div className="max-w-[550px] mx-auto relative group">
                    
                    {/* Cover Frame */}
                    <div className="relative bg-white border-[10px] border-white rounded-lg shadow-[30px_30px_0_0_rgba(0,122,255,0.3)] overflow-hidden transition-all duration-700 group-hover:shadow-[40px_40px_0_0_rgba(0,122,255,0.4)] group-hover:-rotate-1 group-hover:scale-[1.01]">
                        
                        {/* Artwork Container - 2:3 Vertical Ratio */}
                        <div className="relative aspect-[2/3] overflow-hidden bg-slate-900">
                            <img 
                                src={kaiComicPhotos.photo1} 
                                alt="Kai Comic Cover" 
                                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
                            />
                            
                            {/* Glossy Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"></div>
                            
                            {/* Cover Branding Overlays */}
                            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                                <div className="bg-[#EE4444] text-white px-4 py-2 font-black text-2xl skew-x-[-12deg] shadow-lg border-2 border-white">
                                    #1
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="bg-white text-[#002D5B] px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-[#002D5B] shadow-md">Collector's Edition</span>
                                    <span className="text-white font-black text-xs mt-2 drop-shadow-md">FREE PROMO</span>
                                </div>
                            </div>

                            {/* Bottom Cover Title / Tagline */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
                                <h2 className="text-white font-black text-3xl md:text-4xl italic uppercase tracking-tighter leading-none mb-2">
                                    Legend of the <span className="text-cyan-400">Rhine Falls</span>
                                </h2>
                                <p className="text-white/70 text-xs font-bold uppercase tracking-widest border-l-2 border-yellow-400 pl-3">
                                    A different kind of Kraken is born.
                                </p>
                            </div>
                        </div>

                        {/* Caption / Narration Box */}
                        <div className="p-8 bg-[#f8fafc] border-t-8 border-[#002D5B] relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-[#002D5B]/5 rounded-full -mr-12 -mt-12"></div>
                             <p className="font-black text-[#002D5B] text-lg md:text-xl leading-tight uppercase tracking-tight italic relative z-10">
                                WHILE THE WORLD FEARED THE <span className="text-[#007AFF]">NORDIC KRAKEN</span>, A DIFFERENT LEGEND WAS BORN IN <span className="text-[#007AFF]">SCHAFFHAUSEN</span>. KAI TRAINS TO BRING <span className="text-[#007AFF]">ORDER TO CHAOS</span>.
                             </p>
                        </div>
                    </div>

                    {/* Barcode Mockup */}
                    <div className="absolute -bottom-16 right-0 md:-right-20 bg-white p-3 rounded shadow-xl border border-gray-200 hidden md:block rotate-1 opacity-80">
                         <div className="flex gap-0.5 items-end h-8">
                             {[1,2,4,1,3,1,5,2,1,4,1].map((w,i) => <div key={i} className="bg-black" style={{width: `${w}px`, height: '100%'}}></div>)}
                         </div>
                         <p className="text-[7px] font-mono font-bold mt-1 text-center">KRAKEN // 8203 SHF</p>
                    </div>
                </div>

                {/* Coming Soon Call to Action */}
                <div className="mt-40 flex flex-col items-center">
                    <div className="relative">
                        {/* Action Lines Decoration */}
                        <div className="absolute -inset-20 flex items-center justify-center pointer-events-none opacity-20">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="absolute h-1 w-64 bg-white" style={{ transform: `rotate(${i * 45}deg) translateX(120px)` }}></div>
                            ))}
                        </div>
                        
                        <div className="bg-yellow-400 text-[#002D5B] px-16 py-10 rounded-[3rem] shadow-[0_20px_60px_rgba(250,204,21,0.4)] flex flex-col items-center gap-4 transform transition-all hover:scale-105 border-[6px] border-[#002D5B] relative z-20">
                            <span className="text-[#002D5B] font-black uppercase tracking-[0.4em] text-xs">Full Saga Deploying</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-center">Chapters 2-8<br/>COMING SOON!</h2>
                            <p className="text-[11px] text-[#002D5B]/60 font-black uppercase tracking-[0.3em] text-center mt-2">The missions of Zurich & Winterthur are being rendered.</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => onNavigate('about')}
                        className="mt-16 bg-white border-[6px] border-[#002D5B] px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-tighter italic shadow-[15px_15px_0px_#007AFF] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all active:scale-95 text-[#002D5B]"
                    >
                        Back to Origin
                    </button>
                </div>
            </div>

            <style>{`
                .bg-halftone {
                    background-image: radial-gradient(circle at center, currentColor 2px, transparent 2px);
                    background-size: 12px 12px;
                }
                .bg-gradient-radial {
                    background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </main>
    );
};

export default ComicPage;