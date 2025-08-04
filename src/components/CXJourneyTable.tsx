'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Customer { id: number; name: string; }
interface Activity { id: string; name: string; statuses: { [key: string]: string }; notes: { [key: string]: string }; }
interface ActivityGroup { group_name: string; activities: Activity[]; }
interface JourneyData { name: string; customers: Customer[]; groups: ActivityGroup[]; }

export const CXJourneyTable = ({ data }: { data: JourneyData }) => {
  const [localData, setLocalData] = React.useState(data);

  const handleStatusChange = (customerId: number, activityId: string, newStatus: string) => {
    setLocalData(prevData => {
      const newData = { ...prevData };
      newData.groups = newData.groups.map(group => ({
        ...group,
        activities: group.activities.map(activity => {
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
        })
      }));
      return newData;
    });
  };

  if (!localData || !localData.customers || !localData.groups) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-yellow-600 text-center">Data tidak valid atau sedang dimuat...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{localData.name} Journey</CardTitle>
          <Button>
            + Tambah Pelanggan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Aktivitas</TableHead>
                {localData.customers.map(customer => (
                  <TableHead key={customer.id} className="text-center min-w-[150px]">
                    {customer.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {localData.groups.map(group => (
                <React.Fragment key={group.group_name}>
                  <TableRow>
                    <TableCell colSpan={localData.customers.length + 1} className="bg-blue-50 font-bold text-blue-700">
                      {group.group_name}
                    </TableCell>
                  </TableRow>
                  {group.activities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      {localData.customers.map(customer => (
                        <TableCell key={customer.id} className="text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Select 
                              value={activity.statuses[customer.id.toString()] || 'to do'} 
                              onValueChange={(value) => handleStatusChange(customer.id, activity.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="to do">Belum Dikerjakan</SelectItem>
                                <SelectItem value="in progress">Dikerjakan</SelectItem>
                                <SelectItem value="done">Selesai</SelectItem>
                              </SelectContent>
                            </Select>
                            {activity.notes[customer.id.toString()] && (
                              <div className="text-xs text-gray-500 max-w-24 truncate" title={activity.notes[customer.id.toString()]}>
                                {activity.notes[customer.id.toString()]}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};