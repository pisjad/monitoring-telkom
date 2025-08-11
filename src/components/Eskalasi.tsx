"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Info, X, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { supabase } from "@/lib/supabaseClient";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Tipe data untuk setiap baris issue
export type Issue = {
  no: number;
  week: string;
  tanggal: string;
  witel: string;
  issueDetail: string;
  actionPlanM2: string;
  actionPlanM3: string;
  actionPlanM4: string;
  startDate: string;
  endDate: string;
  weight: number;
  uicWitel: string;
  eskalasiTreg: "Y" | "T";
  supportNeeded: string;
  picTreg: string;
  responTreg: string;
  progress: number;
  status: "Done" | "OGP";
};

const initialFormState: NewIssueFormState = {
  week: "",
  witel: "",
  issueDetail: "",
  actionPlanM2: "",
  actionPlanM3: "",
  actionPlanM4: "",
  weight: 0,
  uicWitel: "",
  eskalasiTreg: "T",
  supportNeeded: "",
  picTreg: "",
  responTreg: "Belum ada respon.",
  progress: 0,
  status: "OGP",
  tanggal: new Date(),
  startDate: new Date(),
  endDate: new Date(),
};

type NewIssueFormState = Omit<
  Partial<Issue>,
  "tanggal" | "startDate" | "endDate"
> & {
  tanggal?: Date;
  startDate?: Date;
  endDate?: Date;
};

export const Eskalasi = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<NewIssueFormState>(initialFormState);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [followUpData, setFollowUpData] = useState({
    responTreg: "",
    progress: 0,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1; 
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const totalIssues = issues.length;
  const doneIssues = issues.filter((issue) => issue.status === "Done").length;
  const inProgressIssues = totalIssues - doneIssues;

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("no", { ascending: true }); // Mengurutkan berdasarkan 'no'

      if (error) {
        console.error("Error fetching issues:", error);
      } else {
        setIssues(data as Issue[]);
      }
      setIsLoading(false);
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    if (editingIssue) {
      setFollowUpData({
        responTreg: editingIssue.responTreg,
        progress: editingIssue.progress,
      });
    }
  }, [editingIssue]);

  const handleFollowUpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFollowUpData((prev) => ({
      ...prev,
      [name]: name === "progress" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;
    const finalFollowUpData: Partial<Issue> = { ...followUpData };

    const { data, error } = await supabase
      .from("issues")
      .update(finalFollowUpData)
      .eq("no", editingIssue.no)
      .select();
    if (error) {
      console.error("Error updating issue:", error.message);
      alert("Gagal update!");
    } else if (data) {
      setIssues((current) =>
        current.map((issue) => (issue.no === editingIssue.no ? data[0] : issue))
      );
      setEditingIssue(null);
    }
  };

  const [openPopovers, setOpenPopovers] = useState({
    tanggal: false,
    startDate: false,
    endDate: false,
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof Issue, value: string) => {
    setNewIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    name: "tanggal" | "startDate" | "endDate",
    date: Date | undefined
  ) => {
    if (date) {
      setNewIssue((prev) => ({ ...prev, [name]: date }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...newIssue };
    const noBaru = issues.length ? issues[issues.length - 1].no + 1 : 1;
    const finalNewIssue = {
      ...initialFormState,
      ...dataToSubmit,
      no: noBaru,
      tanggal: format(dataToSubmit.tanggal!, "dd/MM/yyyy"),
      startDate: format(dataToSubmit.startDate!, "dd/MM/yyyy"),
      endDate: format(dataToSubmit.endDate!, "dd/MM/yyyy"),
    } as Issue;

    const { data, error } = await supabase
      .from("issues")
      .insert(finalNewIssue)
      .select();
    if (error) {
      console.error("Error adding issue:", error.message);
      alert("Gagal menambahkan issue!");
    } else if (data) {
      setIssues((prevIssues) => [...prevIssues, data[0]]);
      setIsFormOpen(false);
      setNewIssue(initialFormState);
    }
  };

  const handleStatusChange = async (
    issueId: number,
    newStatus: Issue["status"]
  ) => {
    const { data, error } = await supabase
      .from("issues")
      .update({ status: newStatus })
      .eq("no", issueId)
      .select();

    if (error) {
      console.error("Error updating status:", error);
    } else if (data) {
      setIssues((current) =>
        current.map((issue) => (issue.no === issueId ? data[0] : issue))
      );
    }
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

  const getProgressColorClass = (progress: number) => {
    if (progress === 100) {
      return "text-[#159168]";
    }
    if (progress >= 67) {
      return "text-blue-600";
    }
    if (progress >= 34) {
      return "text-orange-500";
    }
    return "text-red-600";
  };

  if (isLoading) {
    return <div className="p-8">Memuat data dari Supabase...</div>;
  }

  return (
    <div className="font-sans">
      <Card className="rounded-lg px-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-[16px] font-semibold text-gray-800">
              LIST 3 BIG ISSUE Eskalasi TREG
            </CardTitle>

            {/* Tambah Issue */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#4E80EE] text-white hover:bg-[#4E80EE]/80 hover:text-white w-[128px] h-[30px] text-[12px]">
                  <Plus className="h-4 w-4" /> Tambah Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-white">
                <DialogHeader>
                  <DialogTitle>Tambah Issue Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                  <div className="grid md:grid-col-1 gap-4 py-4">
                    {/* Kolom 1 */}
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-3 w-[720px]">
                      <div>
                        <Label htmlFor="week">Week</Label>
                        <Input
                          id="week"
                          name="week"
                          value={newIssue.week}
                          onChange={handleFormChange}
                          placeholder="Isikan week..."
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <Popover
                          open={openPopovers.tanggal}
                          onOpenChange={(isOpen) =>
                            setOpenPopovers((prev) => ({
                              ...prev,
                              tanggal: isOpen,
                            }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="tanggal"
                              className="w-full justify-start text-left font-normal"
                            >
                              {newIssue.tanggal ? (
                                format(newIssue.tanggal, "d MMMM yyyy", {
                                  locale: id,
                                })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={newIssue.tanggal}
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={2100}
                              onSelect={(date) => {
                                handleDateChange("tanggal", date);
                                setOpenPopovers((prev) => ({
                                  ...prev,
                                  tanggal: false,
                                }));
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="witel">Witel</Label>
                        <Input
                          id="witel"
                          name="witel"
                          value={newIssue.witel}
                          onChange={handleFormChange}
                          placeholder="Isikan witel..."
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div>
                        <Label htmlFor="issueDetail">
                          3 BIG ISSUE ESKALASI TREG/EMRM/BUD/BUS
                        </Label>
                        <Textarea
                          id="issueDetail"
                          name="issueDetail"
                          value={newIssue.issueDetail}
                          onChange={handleFormChange}
                          placeholder="Isikan issue..."
                          required
                          style={{ height: 95 }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="actionPlanM2">Action Plan M2</Label>
                        <Textarea
                          id="actionPlanM2"
                          name="actionPlanM2"
                          value={newIssue.actionPlanM2}
                          onChange={handleFormChange}
                          placeholder="Isikan action plan M2..."
                          required
                          style={{ height: 95 }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="actionPlanM3">Action Plan M3</Label>
                        <Textarea
                          id="actionPlanM3"
                          name="actionPlanM3"
                          value={newIssue.actionPlanM3}
                          onChange={handleFormChange}
                          placeholder="Isikan action plan M3..."
                          required
                          style={{ height: 95 }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="actionPlanM4">Action Plan M4</Label>
                        <Textarea
                          id="actionPlanM4"
                          name="actionPlanM4"
                          value={newIssue.actionPlanM4}
                          onChange={handleFormChange}
                          placeholder="Isikan action plan M2..."
                          required
                          style={{ height: 95 }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 gap-3 w-[720px]">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Popover
                          open={openPopovers.startDate}
                          onOpenChange={(isOpen) =>
                            setOpenPopovers((prev) => ({
                              ...prev,
                              startDate: isOpen,
                            }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="startDate"
                              className="w-full justify-start text-left font-normal"
                            >
                              {newIssue.startDate ? (
                                format(newIssue.startDate, "d MMMM yyyy", {
                                  locale: id,
                                })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={newIssue.startDate}
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={2100}
                              onSelect={(date) => {
                                handleDateChange("startDate", date);
                                setOpenPopovers((prev) => ({
                                  ...prev,
                                  startDate: false,
                                }));
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endDate">End Date</Label>
                        <Popover
                          open={openPopovers.endDate}
                          onOpenChange={(isOpen) =>
                            setOpenPopovers((prev) => ({
                              ...prev,
                              endDate: isOpen,
                            }))
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="endDate"
                              className="w-full justify-start text-left font-normal"
                            >
                              {newIssue.endDate ? (
                                format(newIssue.endDate, "d MMMM yyyy", {
                                  locale: id,
                                })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={newIssue.endDate}
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={2100}
                              onSelect={(date) => {
                                handleDateChange("endDate", date);
                                setOpenPopovers((prev) => ({
                                  ...prev,
                                  endDate: false,
                                }));
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          name="weight"
                          value={newIssue.weight}
                          onChange={handleFormChange}
                          placeholder="Isikan weight..."
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 grid-cols-1 gap-3 w-[720px]">
                      <div>
                        <Label htmlFor="uicWitel">UIC Witel</Label>
                        <Input
                          id="uicWitel"
                          name="uicWitel"
                          value={newIssue.uicWitel}
                          onChange={handleFormChange}
                          placeholder="Isikan UIC witel..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="supportNeeded">Support Needed</Label>
                        <Input
                          id="supportNeeded"
                          name="supportNeeded"
                          value={newIssue.supportNeeded}
                          onChange={handleFormChange}
                          placeholder="Isikan support needed..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="picTreg">PIC TREG</Label>
                        <Input
                          id="picTreg"
                          name="picTreg"
                          value={newIssue.picTreg}
                          onChange={handleFormChange}
                          placeholder="Isikan PIC TREG..."
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <Label htmlFor="eskalasiTreg">
                          Eskalasi ke TREG (Y/T)
                        </Label>
                        <RadioGroup
                          defaultValue={newIssue.eskalasiTreg}
                          onValueChange={(value) =>
                            handleSelectChange("eskalasiTreg", value)
                          }
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="Y" id="Y" />
                            <Label htmlFor="Y">Y</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="T" id="T" />
                            <Label htmlFor="T">T</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="bg-[#72747a] text-white hover:bg-[#72747a]/80"
                      >
                        Batal
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="bg-[#4E80EE] text-white hover:bg-[#4E80EE]/80"
                    >
                      Simpan Issue
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`max-h-[480px] overflow-x-auto scrollbar-hide font-sans ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <table className="w-full border-collapse text-center gap-x-3 gap-y-3 leading-relaxed scroll-smooth">
            <thead className="bg-[#E4F2FF] sticky top-0 z-10">
              <tr className="h-[88px] text-[12px] border-b-2">
                <th className="min-w-[36px] font-medium font-sans">No</th>
                <th className="min-w-[88.36px] font-medium font-sans">Week</th>
                <th className="min-w-[88.36px] font-medium font-sans">Tanggal</th>
                <th className="min-w-[136px] font-medium font-sans">Witel</th>
                <th className="min-w-[220px] font-medium font-sans">
                  3 BIG ISSUE ESKALASI <br /> TREG/EMRM/BUD/BUS
                </th>
                <th className="min-w-[220px] font-medium font-sans">Action Plan M2 Jun</th>
                <th className="min-w-[220px] font-medium font-sans">Action Plan M3 Jun</th>
                <th className="min-w-[220px] font-medium font-sans">Action Plan M4 Jun</th>
                <th className="min-w-[88.36px] px-2 font-medium font-sans">
                  Start Date <br /> (DD/MM/YYYY)
                </th>
                <th className="min-w-[88.36px] font-medium font-sans">
                  End Date <br /> (DD/MM/YYYY)
                </th>
                <th className="min-w-[88.36px] font-medium font-sans">Weight</th>
                <th className="min-w-[88.36px] font-medium font-sans">UIC Witel</th>
                <th className="min-w-[88.36px] font-medium font-sans">
                  Eskalasi ke TREG <br /> (Y/T)
                </th>
                <th className="min-w-[88.36px] font-medium font-sans">
                  Support Needed ke <br /> TREG/EBIS/BUD/AP
                </th>
                <th className="min-w-[88.36px] font-medium font-sans">PIC TREG</th>
                <th className="min-w-[109px] font-medium font-sans">
                  Respon Support <br />
                  Needed dari TREG
                </th>
                <th className="min-w-[88.36px] font-medium font-sans">Progres (%)</th>
                <th className="min-w-[88.36px] font-medium font-sans">
                  Status <br /> (OGP/Done)
                </th>
                <th className="min-w-[69px] font-medium font-sans">Follow Up</th>
              </tr>
            </thead>

            <tbody className="font-medium text-[12px]">
              {issues.map((issue) => (
                <tr key={issue.no}>
                  <td className="px-2 py-4 border-b-2">{issue.no}</td>
                  <td className="px-2 py-4 border-b-2">{issue.week}</td>
                  <td className="px-2 py-4 border-b-2">{issue.tanggal}</td>
                  <td className="px-2 py-4 border-b-2">{issue.witel}</td>
                  <td className="px-2 py-4 max-w-sm border-b-2">
                    <div className="whitespace-pre-wrap">
                      {issue.issueDetail}
                    </div>
                  </td>
                  <td className="px-2 whitespace-pre-wrap py-4 border-b-2">
                    {issue.actionPlanM2}
                  </td>
                  <td className="px-2 whitespace-pre-wrap py-4 border-b-2">
                    {issue.actionPlanM3}
                  </td>
                  <td className="px-2 whitespace-pre-wrap py-4 border-b-2">
                    {issue.actionPlanM4}
                  </td>
                  <td className="px-2 py-4 border-b-2">{issue.startDate}</td>
                  <td className="px-2 py-4 border-b-2">{issue.endDate}</td>
                  <td className="px-2 py-4 border-b-2">{issue.weight}%</td>
                  <td className="px-2 py-4 border-b-2">{issue.uicWitel}</td>
                  <td className="px-2 py-4 border-b-2">{issue.eskalasiTreg}</td>
                  <td className="px-2 py-4 border-b-2">{issue.supportNeeded}</td>
                  <td className="px-2 py-4 border-b-2">{issue.picTreg}</td>

                  <td className="px-2 py-4 border-b-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white bg-[#4E80EE] hover:bg-[#4E80EE]/80 hover:text-white min-w-[100px]"
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

                        <div className="text-[12px] font-sans font-medium text-black py-1 max-h-[60vh] overflow-y-auto scroll-smooth break-words">
                          <div className="space-y-2">
                            {(issue.responTreg || "")
                              .split("\n")
                              .map((line, index) => (
                                <p key={index}>
                                  {line}
                                </p>
                              ))}
                          </div>
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
                  </td>

                  <td
                    className={`font-bold px-2 py-4 border-b-2 ${getProgressColorClass(
                      issue.progress
                    )}`}
                  >
                    {issue.progress}%
                  </td>

                  <td className="px-2 py-4 border-b-2">
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
                  </td>

                  <td className="px-2 py-4 border-b-2">
                    <Button
                      size="sm"
                      className="text-white bg-[#4E80EE] hover:bg-[#4E80EE]/80 hover:text-white"
                      onClick={() => setEditingIssue(issue)}
                    >
                      Follow Up
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Kartu Rekap Total */}
      <div className="mt-6" style={{ width: "361px", height: "131px" }}>
        <Card>
          <CardHeader className="-mt-2">
            <CardTitle>Rekap Total</CardTitle>
          </CardHeader>
          <CardContent className="-mt-4">
            <div className="grid grid-cols-3 gap-x-4 gap-y-2">
              <p className="font-semibold text-[#323232] text-[12px]">Issues</p>
              <p className="font-semibold text-[#323232] text-[12px]">Done</p>
              <p className="font-semibold text-[#323232] text-[12px]">
                In Progress
              </p>

              <div className="w-[101.67px] flex flex-col items-center justify-center space-y-1 rounded-lg bg-[#3892F3] p-3 text-black h-[52px]">
                <p className="text-[13px] font-semibold">{totalIssues}</p>
              </div>

              <div className="w-[101.67px] flex flex-col items-center justify-center space-y-1 rounded-lg bg-[#10B981] p-3 text-black h-[52px]">
                <p className="text-[13px] font-semibold">{doneIssues}</p>
              </div>

              <div className="w-[101.67px] flex flex-col items-center justify-center rounded-lg bg-[#F59E0B] text-black h-[52px]">
                <p className="text-[13px] font-semibold text-center">
                  {inProgressIssues}
                </p>
                <div className="flex items-center">
                  <Info className="h-2 w-2" />
                  <span className="ml-1 text-[8px]">Sedang dilakukan</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Follow Up */}
      <Dialog
        open={!!editingIssue}
        onOpenChange={(isOpen) => !isOpen && setEditingIssue(null)}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-white">
          <DialogHeader>
            <DialogTitle>Follow Up Issue No: {editingIssue?.no}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFollowUpSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="responTreg">
                  Respon Support Needed dari TREG
                </Label>
                <Textarea
                  id="responTreg"
                  name="responTreg"
                  value={followUpData.responTreg}
                  onChange={handleFollowUpChange}
                  placeholder="Isikan respon..."
                  style={{ height: 95 }}
                />
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={followUpData.progress}
                  onChange={handleFollowUpChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="bg-[#72747a] text-white hover:bg-[#72747a]/80"
                >
                  Batal
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#4E80EE] text-white hover:bg-[#4E80EE]/80"
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
