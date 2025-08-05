"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Info, X, ChevronDown } from "lucide-react";

// Tipe data untuk setiap baris issue
export type Issue = {
  no: number;
  week: string;
  tanggal: string;
  witel: string;
  issueDetail: {
    title: string;
    impact: string;
  };
  actionPlanM2: {
    main: string;
    sub: string;
  };
  actionPlanM3: string;
  actionPlanM4: string;
  startDate: string;
  endDate: string;
  weight: string;
  uicWitel: string;
  eskalasiTreg: "Y" | "T";
  supportNeeded: string;
  picTreg: string;
  responTreg: string;
  progress: number;
  status: "Done" | "OGP";
};

export const Eskalasi = ({ initialData }: { initialData: Issue[] }) => {
  const [issues, setIssues] = useState<Issue[]>(initialData);

  const handleStatusChange = (issueId: number, newStatus: Issue["status"]) => {
    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.no === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const getStatusBadgeStyle = (status: Issue["status"]) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "OGP":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="font-sans">
      <Card className="rounded-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-[16px] font-semibold text-gray-800">
              LIST 3 BIG ISSUE Eskalasi TREG
            </CardTitle>
            <Button className="bg-[#4E80EE] hover:bg-[#4E80EE]/90 text-white w-[128px] h-[30px] text-[12px]">
              <Plus className="h-4 w-4" /> Tambah Issue
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="gap-x-1 gap-y-2">
              <TableHeader className="bg-[#E4F2FF] align-middle h-[88px] text-[12px] font-medium">
                <TableRow>
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center min-w-[88.36px]">Week</TableHead>
                  <TableHead className="text-center min-w-[88.36px]">Tanggal</TableHead>
                  <TableHead className="text-center min-w-[136px]">Witel</TableHead>
                  <TableHead className="text-center min-w-[220px]">
                    3 BIG ISSUE ESKALASI <br /> TREG/EMRM/BUD/BUS
                  </TableHead>
                  <TableHead className="text-center min-w-[220px]">
                    Action Plan M2 Jun
                  </TableHead>
                  <TableHead className="text-center min-w-[220px]">
                    Action Plan M3 Jun
                  </TableHead>
                  <TableHead className="text-center min-w-[220px]">
                    Action Plan M4 Jun
                  </TableHead>
                  <TableHead className="text-center min-w-[88.36px]">
                    Start Date <br /> (DD/MM/YYYY)
                  </TableHead>
                  <TableHead className="text-center min-w-[88.36px]">
                    End Date <br /> (DD/MM/YYYY)
                  </TableHead>
                  <TableHead className="text-center min-w-[88.36px]">Weight</TableHead>
                  <TableHead className="text-center min-w-[88.36px]">UIC Witel</TableHead>
                  <TableHead className="text-center min-w-[88.36px]">
                    Eskalasi ke TREG <br /> (Y/T)
                  </TableHead>
                  <TableHead className="text-center min-w-[88.36px]">
                    Support Needed ke <br /> TREG/EBIS/BUD/AP
                  </TableHead>
                  <TableHead className="text-center min-w-[88.36px]">PIC TREG</TableHead>
                  <TableHead className="text-center min-w-[109px]">
                    Respon Support <br />Needed dari TREG
                  </TableHead>
                  <TableHead className="text-center min-w-[88.36px]">Progres (%)</TableHead>
                  <TableHead className="text-center min-w-[88.36px]">
                    Status <br /> (OGP/Done)
                  </TableHead>
                  <TableHead className="text-center min-w-[69px]">Follow Up</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="font-medium text-[12px]">
                {issues.map((issue) => (
                  <TableRow key={issue.no}>
                    <TableCell className="text-center">
                      {issue.no}
                    </TableCell>
                    <TableCell className="text-center">{issue.week}</TableCell>
                    <TableCell className="text-center">
                      {issue.tanggal}
                    </TableCell>
                    <TableCell className="text-center">{issue.witel}</TableCell>
                    <TableCell className="max-w-sm">
                      <div className="text-xs whitespace-pre-wrap text-center">
                        {issue.issueDetail.title}
                        <p className="text-gray-500 italic mt-1">
                          {issue.issueDetail.impact}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-sm">
                      <div className="text-xs whitespace-pre-wrap text-center">
                        <p>{issue.actionPlanM2.main}</p>
                        <p className="mt-1">{issue.actionPlanM2.sub}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.actionPlanM3}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.actionPlanM4}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.startDate}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.endDate}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.weight}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.uicWitel}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.eskalasiTreg}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.supportNeeded}
                    </TableCell>
                    <TableCell className="text-center">
                      {issue.picTreg}
                    </TableCell>

                    <TableCell className="text-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-white bg-[#4E80EE] hover:bg-[#4E80EE]/10 hover:text-[#4E80EE]"
                          >
                            Tampilkan Respon
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="sm:max-w-2xl bg-white text-black border-gray-300">
                          <button
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                            onClick={() => {
                              document
                                .getElementById("alert-dialog-cancel-button")
                                ?.click();
                            }}
                          >
                            <X className="h-5 w-5" />
                          </button>

                          <AlertDialogHeader className="pb-3 border-b border-gray-500">
                            <AlertDialogTitle className="text-black font-semibold font-sans">
                              Respon TREG
                            </AlertDialogTitle>
                          </AlertDialogHeader>

                          <div className="text-[12px] font-sans font-medium text-black py-1 max-h-[60vh] overflow-y-auto scroll-smooth">
                            <ol className="list-decimal list-inside space-y-3">
                              {issue.responTreg
                                .split("\n")
                                .map((line, index) => (
                                  <li key={index}>
                                    {line.replace(/^\d+\.\s*/, "")}
                                  </li>
                                ))}
                            </ol>
                          </div>

                          <AlertDialogFooter>
                            <AlertDialogCancel
                              id="alert-dialog-cancel-button"
                              className="hidden"
                            >
                              Tutup
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>

                    <TableCell className="text-center text-[#159168] font-bold">
                      {issue.progress}%
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-[65px] h-[24px] p-1.5 text-[12px] font-medium gap-1 ${getStatusBadgeStyle(
                              issue.status
                            )}`}
                          >
                            {issue.status}
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-1 min-w-0 w-auto">
                          <DropdownMenuItem
                            className="justify-center text-xs"
                            onClick={() => handleStatusChange(issue.no, "Done")}
                          >
                            Done
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="justify-center text-xs"
                            onClick={() => handleStatusChange(issue.no, "OGP")}
                          >
                            OGP
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        className="text-white bg-[#4E80EE] hover:bg-[#4E80EE]/10 hover:text-[#4E80EE]"
                      >
                        Follow Up
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Kartu Rekap Total dalam satu Card */}
      <div className="mt-6" style={{ width: "361px", height: "131px" }}>
        <Card>
          <CardHeader className="-mt-2">
            <CardTitle>Rekap Total</CardTitle>
          </CardHeader>
          <CardContent className="-mt-4">
            {/* Grid dengan 3 kolom untuk layout */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              {/* Baris 1: Judul untuk setiap kolom */}
              <p className="font-semibold text-[#323232] text-[12px]">
                Issues
              </p>
              <p className="font-semibold text-[#323232] text-[12px]">
                Done
              </p>
              <p className="font-semibold text-[#323232] text-[12px]">
                In Progress
              </p>
              {/* Baris 2: Blok data untuk setiap kolom */}
              {/* Blok Issues */}
              <div className="w-[101.67px] flex flex-col items-center justify-center space-y-1 rounded-lg bg-[#3892F3] p-3 text-white h-[52px]">
                {/* Angka utama */}
                <p className="text-[13px] font-semibold">30</p>
              </div>
              {/* Blok Done */}
              <div className="w-[101.67px] flex flex-col items-center justify-center space-y-1 rounded-lg bg-[#10B981] p-3 text-white h-[52px]">
                {/* Angka utama */}
                <p className="text-[13px] font-semibold">10</p>
              </div>
              {/* Blok In Progress */}
              <div className="w-[101.67px] flex flex-col items-center justify-center rounded-lg bg-amber-500 text-white h-[52px]">
                {/* Angka utama */}
                <p className="text-[13px] font-semibold text-center">20</p>
                <div className="flex items-center">
                  <Info className="h-2 w-2" />
                  <span className="ml-1 text-[8px]">Sedang dilakukan</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
