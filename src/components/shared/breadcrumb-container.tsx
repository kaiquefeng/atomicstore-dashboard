import { useLocation } from "@tanstack/react-router";
import { BREADCRUMB_MAPPING } from "@/enums/breadcrumb-mapping";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";

export const BreadcrumbContainer = () => {
	const { pathname } = useLocation();

	const parts = pathname.split("/");
	const firstPartSlashIdx = parts.findIndex((p) => p.length > 0);
	if (firstPartSlashIdx !== -1) {
		parts.splice(firstPartSlashIdx, 1);
	}
	const breadcrumbItems = parts.filter((p) => p.length > 0);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="hidden md:block">
					<BreadcrumbLink href="/$store">Home</BreadcrumbLink>
				</BreadcrumbItem>
				{breadcrumbItems.length > 0 && (
					<BreadcrumbSeparator className="hidden md:block" />
				)}
				{breadcrumbItems.map((item, index) => (
					<>
						<BreadcrumbItem key={item}>
							<BreadcrumbPage>
								{BREADCRUMB_MAPPING[item as keyof typeof BREADCRUMB_MAPPING]}
							</BreadcrumbPage>
						</BreadcrumbItem>
						{index < breadcrumbItems.length - 1 && (
							<BreadcrumbSeparator className="hidden md:block" />
						)}
					</>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};
