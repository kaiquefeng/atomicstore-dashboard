"use client";

import { IconPlayerPlay, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface VideoPreviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	videoUrl: string;
	title: string;
	thumbnail?: string;
}

function getEmbedUrl(url: string): string | null {
	// YouTube
	const youtubeMatch = url.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
	);
	if (youtubeMatch) {
		return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
	}

	// Vimeo
	const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
	if (vimeoMatch) {
		return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
	}

	// Direct video URL
	if (url.match(/\.(mp4|webm|ogg)$/i)) {
		return url;
	}

	return null;
}

function getYouTubeThumbnail(url: string): string | null {
	const youtubeMatch = url.match(
		/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
	);
	if (youtubeMatch) {
		return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
	}
	return null;
}

export function VideoPreviewModal({
	isOpen,
	onClose,
	videoUrl,
	title,
}: VideoPreviewModalProps) {
	const embedUrl = getEmbedUrl(videoUrl);
	const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)$/i);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-4xl p-0 overflow-hidden">
				<DialogHeader className="p-4 pb-0">
					<DialogTitle className="flex items-center gap-2">
						<IconPlayerPlay className="size-5" />
						{title || "Video Preview"}
					</DialogTitle>
				</DialogHeader>
				<div className="relative aspect-video w-full bg-black">
					{embedUrl ? (
						isDirectVideo ? (
							<video
								src={embedUrl}
								controls
								autoPlay
								className="size-full object-contain"
							>
								<track kind="captions" />
							</video>
						) : (
							<iframe
								src={embedUrl}
								title={title}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="size-full border-0"
							/>
						)
					) : (
						<div className="flex size-full flex-col items-center justify-center gap-3 text-white">
							<IconPlayerPlay className="size-12 opacity-50" />
							<p className="text-sm opacity-70">
								Unable to preview this video format
							</p>
							<a
								href={videoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline text-sm"
							>
								Open in new tab
							</a>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

interface VideoThumbnailProps {
	videoUrl: string;
	thumbnail?: string;
	title: string;
	onRemove: () => void;
	onPreview: () => void;
}

export function VideoThumbnail({
	videoUrl,
	thumbnail,
	title,
	onRemove,
	onPreview,
}: VideoThumbnailProps) {
	const autoThumbnail = thumbnail || getYouTubeThumbnail(videoUrl);

	return (
		<div className="group relative aspect-4/5 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-transparent bg-muted shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
			{/* Thumbnail or placeholder */}
			{autoThumbnail ? (
				<img
					src={autoThumbnail}
					alt={title}
					className="size-full object-cover transition-transform group-hover:scale-105"
				/>
			) : (
				<div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
					<IconPlayerPlay className="size-8 text-muted-foreground" />
				</div>
			)}

			{/* Remove button - always visible at top-right */}
			<Button
				type="button"
				variant="destructive"
				size="icon-xs"
				className="absolute right-1 top-1 z-10 size-5 rounded-full opacity-90 shadow-sm"
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
			>
				<IconX className="size-3" />
				<span className="sr-only">Remove video</span>
			</Button>

			{/* Play overlay on hover */}
			<button
				type="button"
				onClick={onPreview}
				className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<div className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110">
					<IconPlayerPlay className="size-5 text-slate-900 ml-0.5" />
				</div>
			</button>
		</div>
	);
}

export { getYouTubeThumbnail };
