import React, { useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";

interface YOLOProcessingModalProps {
  open: boolean;
  onClose: () => void;
  duration?: number;
}

export const YOLOProcessingModal: React.FC<YOLOProcessingModalProps> = ({ open, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, onClose, duration]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-xs bg-zinc-950 text-zinc-100 border-zinc-700 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 py-4">
          <span className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></span>
          <span className="text-lg font-semibold text-green-400">Running YOLO detection...</span>
          <span className="text-xs text-zinc-400">This may take a few seconds</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
