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
import { MoreHorizontal, Edit } from 'lucide-react';

interface Customer { id: number; name: string; }
interface Activity { id: string; name: string; statuses: { [key: string]: string }; notes: { [key: string]: string }; uic?: string; }
interface TableData { customers: Customer[]; activities: Activity[]; }
interface JourneyData { 
  name: string; 
  bs_table?: TableData;
  gs_table?: TableData;
  // Legacy support
  customers?: Customer[];
  groups?: any[];
}

export const CXJourneyTable = ({ data }: { data: JourneyData }) => {
  const [localData, setLocalData] = React.useState(data);

  const handleStatusChange = (customerId: number, activityId: string, newStatus: string, tableType: 'bs' | 'gs') => {
    setLocalData(prevData => {
      const newData = { ...prevData };
      
      if (tableType === 'bs' && newData.bs_table) {
        newData.bs_table.activities = newData.bs_table.activities.map(activity => {
          if (activity.id === activityId) {
            return {
              ...activity,
              statuses: {
                ...activity.statuses,
                [customerId.toString()]: newStatus
              }
            };
          }
          return activity;
        });
      } else if (tableType === 'gs' && newData.gs_table) {
        newData.gs_table.activities = newData.gs_table.activities.map(activity => {
          if (activity.id === activityId) {
            return {
              ...activity,
              statuses: {
                ...activity.statuses,
                [customerId.toString()]: newStatus
              }
            };
          }
          return activity;
        });
      }
      
      return newData;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-[#ABD0FF] text-black hover:bg-[#9BC0EF] transition-colors';
      case 'in progress':
        return 'bg-[#F59E0B] text-black hover:bg-[#E58E0A] transition-colors';
      case 'done':
        return 'bg-[#10B981] text-black hover:bg-[#0FA876] transition-colors';
      default:
        return 'bg-[#ABD0FF] text-black hover:bg-[#9BC0EF] transition-colors';
    }
  };

  if (!localData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-yellow-600 text-center">Data tidak valid atau sedang dimuat...</div>
        </CardContent>
      </Card>
    );
  }

  const renderTable = (tableData: TableData | undefined, title: string, tableType: 'bs' | 'gs') => {
    if (!tableData) return null;

    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-700">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E4F2FF] hover:bg-[#E4F2FF]">
                  <TableHead className="w-1/4">Aktivitas</TableHead>
                  <TableHead className="w-1/6 text-center">UIC</TableHead>
                  {tableData.customers.map(customer => (
                    <TableHead key={customer.id} className="text-center min-w-[120px]">
                      {customer.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.activities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell className="text-center font-semibold text-blue-600">
                      {activity.uic || '-'}
                    </TableCell>
                    {tableData.customers.map(customer => (
                      <TableCell key={customer.id} className="text-center">
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
                                  setLocalData(prevData => {
                                    const newData = { ...prevData };
                                    if (tableType === 'bs' && newData.bs_table) {
                                      newData.bs_table.activities = newData.bs_table.activities.map(act => {
                                        if (act.id === activity.id) {
                                          return {
                                            ...act,
                                            notes: {
                                              ...act.notes,
                                              [customer.id.toString()]: notes
                                            }
                                          };
                                        }
                                        return act;
                                      });
                                    } else if (tableType === 'gs' && newData.gs_table) {
                                      newData.gs_table.activities = newData.gs_table.activities.map(act => {
                                        if (act.id === activity.id) {
                                          return {
                                            ...act,
                                            notes: {
                                              ...act.notes,
                                              [customer.id.toString()]: notes
                                            }
                                          };
                                        }
                                        return act;
                                      });
                                    }
                                    return newData;
                                  });
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      
      {renderTable(localData.bs_table, 'List Business Service (BS)', 'bs')}
      {renderTable(localData.gs_table, 'List Government Service (GS)', 'gs')}
    </div>
  );
};

// Customer Cell Editor Component
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