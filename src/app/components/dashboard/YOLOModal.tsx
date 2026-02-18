import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";

interface YOLOModalProps {
  open: boolean;
  onClose: () => void;
  onRun: () => void;
  isProcessing?: boolean;
  result?: string;
}

export const YOLOModal: React.FC<YOLOModalProps> = ({ open, onClose, onRun, isProcessing, result }) => {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md bg-zinc-950 text-zinc-100 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Run YOLO Detection</DialogTitle>
          <DialogDescription>
            Start the YOLO process to detect objects in the video feed. This may take a few seconds.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 min-h-[40px]">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-green-400">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></span>
              Processing YOLO detection...
            </div>
          ) : result ? (
            <div className="text-green-400">{result}</div>
          ) : null}
        </div>
        <DialogFooter>
          <Button onClick={onRun} disabled={isProcessing} className="bg-green-600 hover:bg-green-500 text-white">
            {isProcessing ? "Processing..." : "Run YOLO"}
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
