"use client";

import { IconPlus } from "@tabler/icons-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	VideoPreviewModal,
	VideoThumbnail,
} from "@/components/video-preview-modal";
import type { VideoItem } from "@/features/products/schemas/product-form";

interface ProductVideoSectionProps {
	videos: VideoItem[];
	onAddVideos: (files: File[]) => void;
	onRemoveVideo: (id: string) => void;
}

export function ProductVideoSection({
	videos,
	onAddVideos,
	onRemoveVideo,
}: ProductVideoSectionProps) {
	const [previewVideo, setPreviewVideo] = React.useState<VideoItem | null>(
		null,
	);
	const videoInputRef = React.useRef<HTMLInputElement>(null);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
						3
					</span>
					Video Thumbnails Cover
				</CardTitle>
				<CardDescription>
					Add product videos to showcase features and tutorials
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<input
					type="file"
					ref={videoInputRef}
					onChange={(e) => {
						if (e.target.files) {
							onAddVideos(Array.from(e.target.files));
						}
					}}
					accept="video/*"
					multiple
					className="hidden"
				/>

				<div className="rounded-xl border bg-muted/30 p-4">
					<div className="flex flex-wrap gap-3">
						{videos.map((video) => (
							<VideoThumbnail
								key={video.id}
								videoUrl={video.url}
								thumbnail={video.thumbnail}
								title={video.title}
								onRemove={() => onRemoveVideo(video.id)}
								onPreview={() => setPreviewVideo(video)}
							/>
						))}

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="outline"
									onClick={() => videoInputRef.current?.click()}
									className="aspect-4/5 w-28 h-auto shrink-0 flex-col gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
								>
									<div className="flex size-10 items-center justify-center rounded-full bg-muted">
										<IconPlus className="size-5 text-muted-foreground" />
									</div>
									<span className="text-muted-foreground text-xs">
										Add Video
									</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>Add product video</TooltipContent>
						</Tooltip>
					</div>
				</div>

				<p className="text-muted-foreground text-xs">
					Add YouTube, Vimeo links or upload video files. Videos help
					customers understand your product better.
				</p>
			</CardContent>

			<VideoPreviewModal
				isOpen={!!previewVideo}
				onClose={() => setPreviewVideo(null)}
				videoUrl={previewVideo?.url || ""}
				title={previewVideo?.title || ""}
				thumbnail={previewVideo?.thumbnail}
			/>
		</Card>
	);
}
