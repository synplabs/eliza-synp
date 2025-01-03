import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

function Particles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<
        Array<{
            x: number;
            y: number;
            speed: number;
            size: number;
            color: string;
        }>
    >([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        // Create particles
        const colors = ["#00D2BE", "#00FFE5"];
        const createParticles = () => {
            particlesRef.current = Array.from({ length: 50 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 0.2 + Math.random() * 0.3,
                size: 1 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
        };
        createParticles();

        // Animation loop
        let animationFrame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle) => {
                // Move particle up
                particle.y -= particle.speed;

                // Reset position if out of bounds
                if (particle.y < -10) {
                    particle.y = canvas.height + 10;
                    particle.x = Math.random() * canvas.width;
                }

                // Draw particle with enhanced glow
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Draw stronger glow effect
                const gradient = ctx.createRadialGradient(
                    particle.x,
                    particle.y,
                    0,
                    particle.x,
                    particle.y,
                    particle.size * 3
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(
                    0.5,
                    particle.color.replace(")", ", 0.3)")
                );
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            animationFrame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", updateSize);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full -z-10"
        />
    );
}

export function GeneratingAnimation() {
    return (
        <div className="relative h-10">
            <Particles />
            <div className="relative flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#00D2BE]/20 border-t-[#00D2BE] rounded-full animate-spin" />
                <span>Generating</span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                        },
                    }}
                >
                    ...
                </motion.span>
            </div>
            <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-r from-[#00D2BE]/5 to-[#00FFE5]/5 blur-xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                }}
            />
        </div>
    );
}
