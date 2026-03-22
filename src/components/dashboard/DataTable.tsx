import { useState } from "react";
import {
  MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight,
  Search, Filter, Download, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tableColumnsConfig, tableDataConfig } from "@/data/dashboardConfig";

interface DataTableProps {
  className?: string;
}

export function DataTable({ className }: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = tableDataConfig.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-base font-semibold">Team Members</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 hidden sm:flex">
              <Filter size={14} className="mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9 hidden md:flex">
              <Download size={14} className="mr-2" />
              Export
            </Button>
            <Button size="sm" className="h-9">
              <Plus size={14} className="mr-2" />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                {tableColumnsConfig.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      column.sortable && "cursor-pointer select-none",
                      column.id === "actions" && "w-12"
                    )}
                  >
                    {column.label && (
                      <div className="flex items-center gap-1">
                        {column.label}
                        {column.sortable && (
                          <ArrowUpDown size={12} className="text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(selectedRows.includes(row.id) && "bg-muted/50")}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={() => toggleRow(row.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.email}</TableCell>
                  <TableCell>{getStatusBadge(row.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {row.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {row.joined}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {selectedRows.length > 0
              ? `${selectedRows.length} of ${filteredData.length} selected`
              : `${filteredData.length} total members`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft size={14} className="mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataTable;
