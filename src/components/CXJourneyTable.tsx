'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TaskSelector } from './TaskSelector';
import { Edit } from 'lucide-react';

// Tipe data tidak berubah
interface Customer { id: number; name: string; }
interface Activity { id: string; name: string; statuses: { [key: string]: string }; notes: { [key: string]: string }; uic?: string; }
interface TableData { customers: Customer[]; activities: Activity[]; }
interface JourneyData { 
  name: string; 
  bs_table?: TableData;
  gs_table?: TableData;
}

export const CXJourneyTable = ({ data }: { data: JourneyData }) => {
  const [localData, setLocalData] = React.useState(data);

  // Fungsi handleStatusChange tidak perlu diubah
  const handleStatusChange = (customerId: number, activityId: string, newStatus: string, tableType: 'bs' | 'gs') => {
    setLocalData(prevData => {
      const newData = { ...prevData };
      const targetTable = tableType === 'bs' ? newData.bs_table : newData.gs_table;

      if (targetTable) {
        targetTable.activities = targetTable.activities.map(activity => {
          if (activity.id === activityId) {
            return {
              ...activity,
              statuses: { ...activity.statuses, [customerId.toString()]: newStatus }
            };
          }
          return activity;
        });
      }
      return newData;
    });
  };

  // Fungsi getStatusColor tidak perlu diubah
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-[#ABD0FF] text-black hover:bg-[#9BC0EF] transition-colors';
      case 'in progress': return 'bg-[#F59E0B] text-black hover:bg-[#E58E0A] transition-colors';
      case 'done': return 'bg-[#10B981] text-black hover:bg-[#0FA876] transition-colors';
      default: return 'bg-[#ABD0FF] text-black hover:bg-[#9BC0EF] transition-colors';
    }
  };

  if (!localData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">Memuat data...</CardContent>
      </Card>
    );
  }

  // Fungsi renderTable dengan perbaikan pada kolom Aktivitas
  const renderTable = (tableData: any, tableType: 'bs' | 'gs') => {
    // Calculate status counts for summary
    const statusCounts = {
      done: 0,
      todo: 0,
      'in progress': 0
    };

    tableData.activities.forEach((activity: any) => {
      tableData.customers.forEach((customer: any) => {
        const status = activity.statuses[customer.id.toString()] || 'todo';
        statusCounts[status as keyof typeof statusCounts]++;
      });
    });

    return (
      <Card className="w-full mb-6">
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {tableType === 'bs' ? 'Top Pelanggan Business Service (BS)' : 'List Pelanggan Government Service (GS)'}
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E4F2FF] hover:bg-[#E4F2FF]">
                    <TableHead className="px-6 min-w-[400px]">Aktivitas</TableHead>
                    <TableHead className="text-center px-4 min-w-[80px]">UIC</TableHead>
                    {tableData.customers.map((customer: any) => (
                      <TableHead key={customer.id} className="text-center min-w-[200px] px-4">
                        {customer.name}
                      </TableHead>
                    ))}
                    <TableHead className="text-center px-4 min-w-[150px]">Rekap</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.activities.map((activity: any) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium px-6 py-4 align-top">
                        <div className="whitespace-normal break-words text-sm">
                          {activity.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-blue-600 px-4 py-4 align-top">
                        {activity.uic || '-'}
                      </TableCell>
                      {tableData.customers.map((customer: any) => (
                        <TableCell key={customer.id} className="text-center px-4 py-4 align-top min-w-[200px]">
                          <div className="flex items-center justify-center gap-2">
                            <Select 
                              value={activity.statuses[customer.id.toString()] || 'todo'} 
                              onValueChange={(value) => handleStatusChange(customer.id, activity.id, value, tableType)}
                            >
                              <SelectTrigger className={`w-28 ${getStatusColor(activity.statuses[customer.id.toString()] || 'todo')}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4 text-black" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <CustomerCellEditor 
                                  customerId={customer.id}
                                  activityId={activity.id}
                                  currentNotes={activity.notes[customer.id.toString()] || ''}
                                  tableType={tableType}
                                  onSave={(notes) => {
                                    // Logika onSave tidak berubah
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="text-center px-4 py-4 align-top min-w-[150px]">
                        <div className="flex items-center justify-center gap-2">
                          {/* Done - Green Circle */}
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                              <span className="text-black text-xs font-bold">
                                {tableData.customers.filter((customer: any) => 
                                  activity.statuses[customer.id.toString()] === 'done'
                                ).length}
                              </span>
                            </div>
                          </div>
                          
                          {/* In Progress - Yellow Circle */}
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center">
                              <span className="text-black text-xs font-bold">
                                {tableData.customers.filter((customer: any) => 
                                  activity.statuses[customer.id.toString()] === 'in progress'
                                ).length}
                              </span>
                            </div>
                          </div>
                          
                          {/* Todo - Blue Circle */}
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-[#ABD0FF] flex items-center justify-center">
                              <span className="text-black text-xs font-bold">
                                {tableData.customers.filter((customer: any) => 
                                  activity.statuses[customer.id.toString()] === 'todo'
                                ).length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CardTitle className="text-2xl font-bold">{localData.name} Journey</CardTitle>
              <TaskSelector />
            </div>
            <Button>
              + Tambah Pelanggan
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {renderTable(localData.bs_table, 'bs')}
      {renderTable(localData.gs_table, 'gs')}
    </div>
  );
};

// Komponen CustomerCellEditor tidak perlu diubah
const CustomerCellEditor = ({ 
  customerId, 
  activityId, 
  currentNotes, 
  tableType,
  onSave 
}: { 
  customerId: number; 
  activityId: string; 
  currentNotes: string; 
  tableType: 'bs' | 'gs';
  onSave: (notes: string) => void; 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(currentNotes);
  const [date, setDate] = useState<string>('');

  const handleSave = () => {
    onSave(notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(currentNotes);
    setDate('');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Customer {customerId}</h4>
          <div className="text-sm text-gray-600 mb-2">
            <strong>Date:</strong> {date || 'Not set'}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Notes:</strong> {currentNotes || 'No notes'}
          </div>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Customer {customerId}</h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Enter notes..."
              className="mt-1"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Simpan
        </Button>
        <Button variant="ghost" onClick={handleCancel} className="flex-1">
          Batal
        </Button>
      </div>
    </div>
  );
};
