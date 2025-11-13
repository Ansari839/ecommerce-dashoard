'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Shield,
  Settings
} from 'lucide-react';

interface Permission {
  module: string;
  actions: string[];
}

interface Role {
  _id: string;
  name: string;
  permissions: Permission[];
}

const RoleManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/roles', {
        headers: {
          'Authorization': 'Bearer fake-token' // In a real app, use actual token
        }
      });
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token' // In a real app, use actual token
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        fetchRoles();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    try {
      const response = await fetch(`/api/roles/${selectedRole._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token' // In a real app, use actual token
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        fetchRoles();
        setSelectedRole(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer fake-token' // In a real app, use actual token
        }
      });
      
      const result = await response.json();
      if (result.success) {
        fetchRoles();
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      permissions: []
    });
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
          <p className="mt-4 text-lg text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-3 h-8 w-8" />
            Role Management
          </h1>
          <p className="text-muted-foreground">Manage roles and permissions</p>
        </div>
        <Dialog open={isDialogOpen || !!selectedRole} onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setSelectedRole(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
              <DialogDescription>
                {selectedRole 
                  ? 'Update the role details below.' 
                  : 'Enter the details for the new role.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={selectedRole ? handleUpdateRole : handleCreateRole} className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {[
                    { module: 'products', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'orders', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'users', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'roles', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'inventory', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'purchases', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'marketing', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'reports', actions: ['view', 'create', 'update', 'delete'] },
                    { module: 'settings', actions: ['view', 'create', 'update', 'delete'] },
                  ].map((mod, idx) => (
                    <div key={idx} className="border rounded p-3">
                      <h4 className="font-medium mb-2">{mod.module}</h4>
                      <div className="space-y-2">
                        {mod.actions.map((action, actIdx) => (
                          <div key={actIdx} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${mod.module}-${action}`}
                              checked={formData.permissions.some(p => 
                                p.module === mod.module && p.actions.includes(action)
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => {
                                  const existingPermIndex = prev.permissions.findIndex(p => p.module === mod.module);
                                  
                                  if (existingPermIndex !== -1) {
                                    const updatedPermissions = [...prev.permissions];
                                    const perm = {...updatedPermissions[existingPermIndex]};
                                    
                                    if (checked) {
                                      if (!perm.actions.includes(action)) {
                                        perm.actions.push(action);
                                      }
                                    } else {
                                      perm.actions = perm.actions.filter(a => a !== action);
                                    }
                                    
                                    updatedPermissions[existingPermIndex] = perm;
                                    return {...prev, permissions: updatedPermissions};
                                  } else if (checked) {
                                    const newPerm: Permission = {
                                      module: mod.module,
                                      actions: [action]
                                    };
                                    return {...prev, permissions: [...prev.permissions, newPerm]};
                                  }
                                  
                                  return prev;
                                });
                              }}
                              className="mr-2"
                            />
                            <Label htmlFor={`${mod.module}-${action}`}>{action}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedRole(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedRole ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map(role => (
                  <TableRow key={role._id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((perm, idx) => (
                          <div key={idx} className="mb-1">
                            <Badge variant="secondary" className="mr-1">
                              {perm.module}: {perm.actions.join(', ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRole(role._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagementPage;