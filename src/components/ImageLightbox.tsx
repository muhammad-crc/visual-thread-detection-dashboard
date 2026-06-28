import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download } from 'lucide-react';

interface ImageLightboxProps {
  url: string | null;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

/** Full-screen in-app image viewer (closes on backdrop click or Esc). */
export const ImageLightbox = ({ url, title, subtitle, onClose }: ImageLightboxProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-surface-low border border-primary-glow/30"
          >
            <div className="flex justify-between items-center p-4 bg-surface-high border-b border-white/10">
              <div>
                {title && <h3 className="font-headline font-black text-sm tracking-widest uppercase text-white">{title}</h3>}
                {subtitle && <p className="font-mono text-[10px] text-text-dim uppercase mt-0.5">{subtitle}</p>}
              </div>
              <div className="flex gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="w-8 h-8 flex items-center justify-center bg-surface-highest/60 border border-white/10 text-text-dim hover:text-primary-glow transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center bg-surface-highest/60 border border-white/10 text-text-dim hover:text-accent-error transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-surface-lowest flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img src={url} alt={title || 'snapshot'} className="max-h-[75vh] w-auto object-contain" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
