"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/data-display/page-header";
import { DataPagination } from "@/components/data-display/pagination";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { QUERY_KEYS } from "@/lib/constants";
import { adminService } from "@/modules/admin/services/admin.service";
import { formatError } from "@/utils/format-error";
import { parsePositiveInteger, updateQueryParams } from "@/utils/query-params";

export function AdminUsersView() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();

	const queryClient = useQueryClient();

	const page = parsePositiveInteger(params.get("page"), 1);

	const search = params.get("search") ?? "";

	const role = params.get("role") ?? undefined;

	const status = params.get("status") ?? undefined;

	const replace = (updates: Record<string, string | number | null>) => {
		const next = updateQueryParams(params.toString(), updates);

		router.replace(next ? `${pathname}?${next}` : pathname, {
			scroll: false,
		});
	};

	const query = useQuery({
		queryKey: [
			...QUERY_KEYS.ADMIN,
			"users",
			{
				page,
				search,
				role,
				status,
			},
		],

		queryFn: () =>
			adminService.getUsers({
				page,
				limit: 10,
				search: search || undefined,
				role,
				status,
			}),

		placeholderData: keepPreviousData,
	});

	const mutation = useMutation({
		mutationFn: ({ id, status: nextStatus }: { id: string; status: "ACTIVE" | "BLOCKED" }) =>
			adminService.updateUserStatus(id, nextStatus),

		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.ADMIN,
			});

			toast.success("User status updated");
		},

		onError: (error) => toast.error(formatError(error)),
	});

	if (query.isPending) {
		return <PageSkeleton />;
	}

	return (
		<div className="space-y-6">
			<PageHeader title="User management" description="Search users and manage account access." />

			<div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

					<Input
						defaultValue={search}
						className="pl-9"
						placeholder="Search name or email"
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								replace({
									search: event.currentTarget.value || null,

									page: 1,
								});
							}
						}}
					/>
				</div>

				<Select
					value={role ?? "ALL"}
					onValueChange={(value) =>
						replace({
							role: value === "ALL" ? null : value,

							page: 1,
						})
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All roles</SelectItem>

						<SelectItem value="ADMIN">Admin</SelectItem>

						<SelectItem value="RECRUITER">Recruiter</SelectItem>

						<SelectItem value="CANDIDATE">Candidate</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={status ?? "ALL"}
					onValueChange={(value) =>
						replace({
							status: value === "ALL" ? null : value,

							page: 1,
						})
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="ALL">All statuses</SelectItem>

						<SelectItem value="ACTIVE">Active</SelectItem>

						<SelectItem value="BLOCKED">Blocked</SelectItem>

						<SelectItem value="DELETED">Deleted</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{query.isError ? (
				<ErrorState description={formatError(query.error)} />
			) : query.data.items.length === 0 ? (
				<EmptyState title="No users found" description="No users match the selected filters." />
			) : (
				<div className="space-y-4">
					<div className="overflow-hidden rounded-xl border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>

									<TableHead>Role</TableHead>

									<TableHead>Status</TableHead>

									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{query.data.items.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<p className="font-medium">{user.legalName}</p>

											<p className="text-xs text-muted-foreground">{user.email}</p>
										</TableCell>

										<TableCell>{user.role}</TableCell>

										<TableCell>
											<Badge variant="outline">{user.status}</Badge>
										</TableCell>

										<TableCell>
											{user.role !== "ADMIN" && user.status !== "DELETED" && (
												<Button
													type="button"
													size="sm"
													variant="outline"
													disabled={mutation.isPending}
													onClick={() =>
														mutation.mutate({
															id: user.id,

															status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
														})
													}
												>
													{user.status === "ACTIVE" ? "Block" : "Activate"}
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<DataPagination
						page={page}
						totalPages={query.data.meta.totalPages}
						onPageChange={(nextPage) =>
							replace({
								page: nextPage,
							})
						}
					/>
				</div>
			)}
		</div>
	);
}
