import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavigationBar from "@/Layouts/Navbar";
import { useAdminData } from "@/hooks/admin/useAdminData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  RefreshCw,
  Key,
  Users,
  TrendingUp,
  Activity,
  Zap,
  Trash2,
  Shield,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const {
    adminInfo,
    users,
    totalUsers,
    loading,
    error,
    refetchData,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    addTokensToUser,
    deductTokensFromUser,
    setUserTokens,
    verifyUser,
    grantAdmin,
    revokeAdmin,
    deleteUser,
  } = useAdminData();

  const [tokenAmount, setTokenAmount] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tokenAction, setTokenAction] = useState<"add" | "deduct" | "set">(
    "add",
  );
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTokenAction = async () => {
    if (!selectedUser || !tokenAmount || isNaN(Number(tokenAmount))) {
      return;
    }

    setIsProcessing(true);
    try {
      const amount = Number(tokenAmount);
      if (tokenAction === "add") {
        await addTokensToUser(selectedUser.id, amount);
      } else if (tokenAction === "deduct") {
        await deductTokensFromUser(selectedUser.id, amount);
      } else {
        await setUserTokens(selectedUser.id, amount);
      }
      setTokenAmount("");
      setShowTokenDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteDialog(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (error && error !== "Unauthorized access") {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <NavigationBar />
          </header>
          <div className="w-full p-6">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <p className="text-destructive font-medium">{error}</p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const pieData = [
    {
      name: "Verified",
      value: adminInfo?.summary.verified_users || 0,
      color: "#10b981",
    },
    {
      name: "Unverified",
      value: adminInfo?.summary.unverified_users || 0,
      color: "#f59e0b",
    },
  ];

  const totalPages = Math.ceil(totalUsers / 20);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <NavigationBar />
          </header>

          <div className="w-full max-w-full overflow-x-hidden overflow-y-auto p-6">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetchData}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold">
                          {adminInfo?.summary.total_users || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          All time
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Tokens Issued
                    </CardTitle>
                    <Zap className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold">
                          {(
                            adminInfo?.token_stats.total_tokens_issued || 0
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Platform
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Tokens per User
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold">
                          {adminInfo?.token_stats.average_tokens_per_user || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Average</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Verified Users
                    </CardTitle>
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <>
                        <p className="text-2xl font-bold">
                          {adminInfo?.summary.verified_users || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Verified
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="users">Users Management</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="recent">Recent Users</TabsTrigger>
                </TabsList>

                {/* Users Management Tab */}
                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search by email or name..."
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="max-w-sm"
                        />
                        <Button variant="outline" size="icon">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Users ({totalUsers})</CardTitle>
                        <Badge variant="outline">{totalUsers} Total</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : users.length > 0 ? (
                        <>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Tokens</TableHead>
                                  <TableHead>Verified</TableHead>
                                  <TableHead>Admin</TableHead>
                                  <TableHead>Joined</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {users.map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                      {user.first_name && user.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : "Unknown"}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {user.email}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="secondary">
                                        {user.tokens.toLocaleString()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {user.is_verified ? (
                                        <Badge
                                          variant="default"
                                          className="bg-green-600"
                                        >
                                          ✓ Verified
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">
                                          Not Verified
                                        </Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {user.is_admin ? (
                                        <Badge className="bg-purple-600">
                                          Admin
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">User</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {new Date(
                                        user.created_at,
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setSelectedUser(user);
                                            setTokenAmount("");
                                            setTokenAction("add");
                                            setShowTokenDialog(true);
                                          }}
                                        >
                                          Tokens
                                        </Button>
                                        {!user.is_verified && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => verifyUser(user.id)}
                                          >
                                            Verify
                                          </Button>
                                        )}
                                        {!user.is_admin ? (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => grantAdmin(user.id)}
                                          >
                                            <Shield className="w-3 h-3 mr-1" />
                                            Grant
                                          </Button>
                                        ) : (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => revokeAdmin(user.id)}
                                          >
                                            <Shield className="w-3 h-3 mr-1" />
                                            Revoke
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => {
                                            setSelectedUser(user);
                                            setShowDeleteDialog(true);
                                          }}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Pagination */}
                          <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                              Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No users found
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Verification Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <Skeleton className="h-64 w-full" />
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Platform Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-8 w-full" />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Total Users:
                              </span>
                              <span className="text-lg font-bold">
                                {adminInfo?.summary.total_users || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Admin Users:
                              </span>
                              <span className="text-lg font-bold">
                                {adminInfo?.summary.admin_users || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Verified Users:
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                {adminInfo?.summary.verified_users || 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Unverified Users:
                              </span>
                              <span className="text-lg font-bold text-amber-600">
                                {adminInfo?.summary.unverified_users || 0}
                              </span>
                            </div>
                            <div className="flex justify-between pt-4 border-t">
                              <span className="text-sm font-medium">
                                Total Token Pool:
                              </span>
                              <span className="text-lg font-bold">
                                {(
                                  adminInfo?.token_stats.total_token_pool || 0
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Recent Users Tab */}
                <TabsContent value="recent" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : adminInfo?.recent_users &&
                        adminInfo.recent_users.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tokens</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Verified</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {adminInfo.recent_users.map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">
                                    {user.first_name && user.last_name
                                      ? `${user.first_name} ${user.last_name}`
                                      : "Unknown"}
                                  </TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    <Badge variant="secondary">
                                      {user.tokens.toLocaleString()}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(
                                      user.created_at,
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    {user.is_verified ? (
                                      <Badge className="bg-green-600">
                                        ✓ Verified
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">Pending</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No recent users
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Token Management Dialog */}
      <AlertDialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Manage Tokens for {selectedUser?.email}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Current balance: {selectedUser?.tokens.toLocaleString()} tokens
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={tokenAction === "add" ? "default" : "outline"}
                onClick={() => setTokenAction("add")}
                className="flex-1"
              >
                Add
              </Button>
              <Button
                variant={tokenAction === "deduct" ? "default" : "outline"}
                onClick={() => setTokenAction("deduct")}
                className="flex-1"
              >
                Deduct
              </Button>
              <Button
                variant={tokenAction === "set" ? "default" : "outline"}
                onClick={() => setTokenAction("set")}
                className="flex-1"
              >
                Set
              </Button>
            </div>

            <Input
              type="number"
              placeholder="Enter amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              min="0"
            />
          </div>

          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleTokenAction}
            disabled={isProcessing || !tokenAmount}
          >
            {isProcessing ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.email}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteUser}
            disabled={isProcessing}
            className="bg-destructive"
          >
            {isProcessing ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </>
  );
}
