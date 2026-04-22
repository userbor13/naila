'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Circle, Sparkles } from 'lucide-react';

// --- Background Particles ---
const BackgroundParticles = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="particle-container">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    initial={{
                        opacity: 0,
                        y: '110vh',
                        x: `${Math.random() * 100}%`,
                        scale: Math.random() * 0.5 + 0.2
                    }}
                    animate={{
                        opacity: [0, Math.random() * 0.5 + 0.2, 0],
                        y: '-10vh',
                        x: `+=${Math.random() * 100 - 50}px`
                    }}
                    transition={{
                        duration: 10 + Math.random() * 15,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear"
                    }}
                    className={`particle w-3 h-3 ${['particle-pink', 'particle-red', 'particle-purple'][i % 3]}`}
                />
            ))}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={`h-${i}`}
                    initial={{
                        opacity: 0,
                        y: '110vh',
                        x: `${(i * 10) + Math.random() * 5}%`,
                        scale: 0.3 + Math.random() * 0.4
                    }}
                    animate={{
                        opacity: [0, 0.3, 0],
                        y: '-10vh',
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                    className="absolute text-red-500/20"
                >
                    <Heart size={30} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// --- Step 1: Love Mode ---
const LoveModeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        if (isOn) {
            const timer = setTimeout(() => onComplete(), 3000);
            return () => clearTimeout(timer);
        }
    }, [isOn, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            className="flex flex-col items-center justify-center relative z-10"
        >
            <div className={`glass-card p-12 rounded-[3rem] transition-all duration-1000 ease-in-out flex flex-col items-center space-y-10 shimmer-border ${isOn ? 'glass-card-love pulse-glow' : ''}`}>
                <div className="relative">
                    <motion.div
                        animate={isOn ? {
                            scale: [1, 1.2, 1],
                        } : {}}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className={isOn ? 'heartbeat' : 'float'}
                    >
                        <Heart className={`w-28 h-28 transition-all duration-1000 ${isOn ? 'text-red-500 fill-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'text-white/20'}`} />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center space-y-6">
                    <span className={`text-5xl font-playfair transition-colors duration-1000 ${isOn ? 'text-white text-glow' : 'text-white/50'}`}>
                        Love Mode
                    </span>

                    <button
                        onClick={() => setIsOn(!isOn)}
                        className={`group relative w-36 h-16 rounded-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] p-1.5 focus:outline-none overflow-hidden ${isOn ? 'bg-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer-rotate_2s_infinite]" />
                        <motion.div
                            animate={{ x: isOn ? 80 : 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="w-13 h-13 bg-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-none relative z-10"
                        >
                            <Heart
                                size={24}
                                className={`transition-colors duration-500 ${isOn ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                            />
                        </motion.div>

                        <AnimatePresence>
                            {!isOn && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50"
                                >
                                    Turn On
                                </motion.span>
                            )}
                            {isOn && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute left-8 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                                >
                                    Active
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- Step 2: Tic-Tac-Toe ---
const TicTacToeStep = ({ onComplete }: { onComplete: () => void }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isUserTurn, setIsUserTurn] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [message, setMessage] = useState("Let's play a little game...");

    const checkWinner = useCallback((squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return squares.includes(null) ? null : 'draw';
    }, []);

    const makeAIMove = useCallback((currentBoard: (string | null)[]) => {
        const emptyIndices = currentBoard.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
        if (emptyIndices.length === 0) return;

        const nonCenterIndices = emptyIndices.filter(i => i !== 4);
        const targetIndex = nonCenterIndices.length > 0
            ? nonCenterIndices[Math.floor(Math.random() * nonCenterIndices.length)]
            : 4;

        const newBoard = [...currentBoard];
        newBoard[targetIndex] = 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
        } else {
            setIsUserTurn(true);
        }
    }, [checkWinner]);

    const handleSquareClick = (index: number) => {
        if (board[index] || winner || !isUserTurn) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
        } else {
            setIsUserTurn(false);
            setTimeout(() => makeAIMove(newBoard), 600);
        }
    };

    useEffect(() => {
        if (winner === 'X') {
            setMessage("Kamu Menang!");
            setTimeout(() => onComplete(), 3500);
        } else if (winner === 'O' || winner === 'draw') {
            setMessage(winner === 'draw' ? "Seri! Coba lagi yaa ❤️" : "Hampir! Sekali lagi...");
            setTimeout(() => {
                setBoard(Array(9).fill(null));
                setWinner(null);
                setIsUserTurn(true);
            }, 1500);
        }
    }, [winner, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            className="flex flex-col items-center justify-center space-y-10 relative z-10"
        >
            <motion.h2 
                className={`text-4xl md:text-5xl font-playfair text-white text-center drop-shadow-2xl max-w-xs whitespace-pre-line leading-tight ${winner === 'X' ? 'text-glow text-red-100' : 'text-glow-soft'}`}
            >
                {message}
            </motion.h2>
            
            <div className={`grid grid-cols-3 gap-4 p-6 glass-card rounded-3xl ${winner === 'X' ? 'glass-card-love pulse-glow' : ''}`}>
                {board.map((square, i) => (
                    <button
                        key={i}
                        onClick={() => handleSquareClick(i)}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center border transition-all duration-300 group overflow-hidden relative
                            ${square ? 'bg-white/5 border-white/10' : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-inner'}`}
                    >
                        <AnimatePresence mode="wait">
                            {square === 'X' ? (
                                <motion.div
                                    key={winner === 'X' ? "heart" : "x"}
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={winner === 'X' ? { delay: i * 0.15, type: 'spring' } : { type: 'spring', bounce: 0.5 }}
                                    className={winner === 'X' ? 'heartbeat' : ''}
                                >
                                    {winner === 'X' ?
                                        <Heart className="w-14 h-14 text-red-500 fill-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" /> :
                                        <X className="w-14 h-14 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    }
                                </motion.div>
                            ) : square === 'O' ? (
                                <motion.div 
                                    key="o" 
                                    initial={{ scale: 0, opacity: 0 }} 
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.4 }}
                                >
                                    <Circle className="w-12 h-12 text-pink-300 opacity-60 drop-shadow-[0_0_10px_rgba(244,114,182,0.4)]" />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {winner === 'X' && (
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="text-3xl font-playfair text-pink-200 text-center text-glow mt-4"
                    >
                        Ada sesuatu untukmu...
                    </motion.h2>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Step 3: Love Meter ---
const LoveMeterStep = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onComplete(), 2000);
                    return 100;
                }
                const increment = prev > 80 ? 0.5 : (prev > 50 ? 1 : 2);
                return Math.min(100, prev + increment);
            });
        }, 30);
        return () => clearInterval(interval);
    }, [onComplete]);

    const radius = 100;
    const circumference = Math.PI * radius;
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
            className="flex flex-col items-center justify-center space-y-16 w-full max-w-lg px-6 relative z-10"
        >
            <div className={`glass-card p-10 rounded-[3rem] w-full flex flex-col items-center relative overflow-hidden ${progress === 100 ? 'glass-card-love pulse-glow' : ''}`}>
                {progress === 100 && (
                    <div className="absolute inset-0 aurora-glow opacity-50 mix-blend-screen" />
                )}
                
                <div className="relative w-full aspect-[2/1.4] flex flex-col items-center justify-end overflow-visible z-10 pt-6">
                    <svg viewBox="0 0 240 140" className="w-full h-full absolute top-0 overflow-visible">
                        <path
                            d="M 20,120 A 100,100 0 0 1 220,120"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="16"
                            strokeLinecap="round"
                            className="drop-shadow-sm"
                        />
                        <motion.path
                            d="M 20,120 A 100,100 0 0 1 220,120"
                            fill="none"
                            stroke="url(#loveGradientMeter)"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            style={{ filter: `drop-shadow(0 0 ${10 + (progress/5)}px rgba(239, 68, 68, ${0.4 + (progress/200)}))` }}
                        />
                        <defs>
                            <linearGradient id="loveGradientMeter" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#ec4899" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="z-10 flex flex-col items-center pb-2">
                        <motion.div
                            animate={{ 
                                scale: progress === 100 ? [1, 1.3, 1] : [1, 1.05, 1],
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: progress === 100 ? 0.8 : 2 - (progress/100),
                            }}
                        >
                            <Heart className={`w-16 h-16 md:w-20 md:h-20 text-red-500 fill-red-500 mb-2 ${progress === 100 ? 'drop-shadow-[0_0_25px_rgba(239,68,68,1)]' : 'drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                        </motion.div>
                        <div className="text-5xl md:text-7xl font-black text-white font-mono tracking-tighter text-glow-soft">
                            {Math.floor(progress)}<span className="text-pink-400 text-3xl md:text-4xl">%</span>
                        </div>
                        <span className="text-sm md:text-xl text-white/70 font-playfair italic mt-2 md:mt-3 tracking-[0.2em] md:tracking-[0.3em] uppercase">Love Intensity</span>
                    </div>
                </div>

                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 mt-8 shadow-inner relative">
                    <div className="absolute inset-0 bg-white/5" />
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 relative"
                        animate={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Step 4: Typewriter ---
const TypewriterStep = ({ onComplete }: { onComplete: () => void }) => {
    const text = "Happy Birthday Naila";
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isDeleting && displayedText !== text) {
            timer = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, 120);
        } else if (!isDeleting && displayedText === text) {
            timer = setTimeout(() => setIsDeleting(true), 3000);
        } else if (isDeleting && displayedText !== "") {
            timer = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length - 1));
            }, 60);
        } else if (isDeleting && displayedText === "") {
            onComplete();
        }
        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, onComplete, text]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(40px)' }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center p-8 relative z-10 w-full h-full"
        >
            <div className="absolute inset-0 aurora-glow opacity-30" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-center z-10"
            >
                <div className="flex items-center justify-center mb-8 gap-4 opacity-70">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Sparkles className="text-pink-400 w-8 h-8" />
                    </motion.div>
                    <Heart className="text-red-500 fill-red-500 w-6 h-6 heartbeat" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                        <Sparkles className="text-pink-400 w-8 h-8" />
                    </motion.div>
                </div>
                
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-playfair text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white text-center leading-tight tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                    {displayedText}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 sm:w-3 md:w-4 h-[1em] bg-gradient-to-b from-red-400 to-pink-600 ml-2 sm:ml-4 align-text-bottom rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                    />
                </h1>
                
                <AnimatePresence>
                    {displayedText === text && !isDeleting && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-10 text-xl md:text-3xl text-pink-200 font-playfair italic font-light tracking-wide text-glow-soft"
                        >
                            A special gift awaits you...
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default function InteractionFlow({ onFlowComplete }: { onFlowComplete: () => void }) {
    const [step, setStep] = useState(1);

    return (
        <div className="fixed inset-0 z-50 animated-gradient-bg flex items-center justify-center overflow-hidden noise-overlay">
            {/* Visual background layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_60%)]" />
            
            <BackgroundParticles />

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <LoveModeStep key="step1" onComplete={() => setStep(2)} />
                )}
                {step === 2 && (
                    <TicTacToeStep key="step2" onComplete={() => setStep(3)} />
                )}
                {step === 3 && (
                    <LoveMeterStep key="step3" onComplete={() => setStep(4)} />
                )}
                {step === 4 && (
                    <TypewriterStep key="step4" onComplete={() => onFlowComplete()} />
                )}
            </AnimatePresence>

            {/* Corner Glows */}
            <div className="absolute -top-[20vh] -left-[10vw] w-[50vw] h-[50vw] bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-[20vh] -right-[10vw] w-[50vw] h-[50vw] bg-pink-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[20vh] right-[20vw] w-[30vw] h-[30vw] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}
