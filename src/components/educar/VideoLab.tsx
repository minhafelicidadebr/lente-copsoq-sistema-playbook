import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Maximize2, X, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { TrailVideo } from "@/lib/copsoq/learningTrails";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoLabProps {
  video: TrailVideo;
  onComplete?: (videoId: string) => void;
  completed?: boolean;
  index?: number;
}

export default function VideoLab({ video, onComplete, completed = false, index = 0 }: VideoLabProps) {
  const [popout, setPopout] = useState(false);
  const [watched, setWatched] = useState(completed);

  const handleComplete = () => {
    setWatched(true);
    onComplete?.(video.id);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        className={`group relative rounded-xl border transition-all duration-300 overflow-hidden ${
          watched
            ? "border-[hsl(var(--copsoq-salus)/0.4)] bg-[hsl(var(--copsoq-salus)/0.05)]"
            : "border-border bg-card hover:shadow-card-hover hover:border-primary/30"
        }`}
      >
        {/* Thumbnail / Embed preview */}
        <div className="relative cursor-pointer" onClick={() => setPopout(true)}>
          <AspectRatio ratio={16 / 9}>
            <div className="w-full h-full bg-muted flex items-center justify-center relative overflow-hidden">
              {video.platform === "youtube" ? (
                <img
                  src={`https://img.youtube.com/vi/${video.embedUrl.split("/embed/")[1]?.split("?")[0]}/mqdefault.jpg`}
                  alt={video.titlePt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
              {/* Play overlay */}
              <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-hero"
                >
                  <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
                </motion.div>
              </div>
              {/* Duration badge */}
              {video.durationMin && (
                <Badge className="absolute bottom-2 right-2 bg-foreground/80 text-background text-[10px] gap-1">
                  <Clock className="h-3 w-3" /> {video.durationMin} min
                </Badge>
              )}
              {/* Completed checkmark */}
              {watched && (
                <div className="absolute top-2 right-2">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-[hsl(var(--copsoq-salus))] p-1">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </motion.div>
                </div>
              )}
            </div>
          </AspectRatio>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{video.titlePt}</h4>
            <button
              onClick={() => setPopout(true)}
              className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors"
              aria-label="Abrir em tela cheia"
            >
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{video.summary}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {video.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
              {video.platform}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Pop-out Dialog */}
      <Dialog open={popout} onOpenChange={setPopout}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 bg-card border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg">🎓</span>
              <h3 className="text-sm font-semibold text-foreground truncate">{video.titlePt}</h3>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-muted transition-colors">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              <button onClick={() => setPopout(false)} className="p-1 rounded hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={video.embedUrl}
              title={video.titlePt}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </AspectRatio>
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground max-w-lg">{video.summary}</p>
            {!watched ? (
              <Button size="sm" onClick={handleComplete} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Marcar como assistido
              </Button>
            ) : (
              <Badge className="bg-[hsl(var(--copsoq-salus))] text-primary-foreground gap-1">
                <CheckCircle2 className="h-3 w-3" /> Concluído
              </Badge>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
