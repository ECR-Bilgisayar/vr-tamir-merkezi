
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const GameVideoDialog = ({ game, open, onOpenChange }) => {
  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#0a0e27] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {game.name}
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={game.videoUrl}
            title={game.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameVideoDialog;
