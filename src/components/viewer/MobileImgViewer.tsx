"use client";

interface MobileImgViewerProps {
  src: string;
  pageNumber: number;
}

/**
 * Mobile viewer. Renders each page as an <img>, but inside a container
 * with user-select / pointer-events / drag locked, plus right-click +
 * copy / cut suppressed. Mobile browsers vary; this raises the floor
 * against long-press save and drag-to-copy.
 */
export function MobileImgViewer({ src, pageNumber }: MobileImgViewerProps) {
  return (
    <div
      className="relative w-full select-none"
      style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Page ${pageNumber}`}
        draggable={false}
        className="block w-full h-auto shadow-md rounded-md bg-white pointer-events-none"
      />
    </div>
  );
}
