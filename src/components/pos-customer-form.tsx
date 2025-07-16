// src/components/pos-customer-form.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Building } from 'lucide-react';
import type { PosCustomer } from '@/app/sales/pos/page';

interface CustomerFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PosCustomer) => void;
    customer: PosCustomer | null;
}

export function PosCustomerFormDialog({ isOpen, onClose, onSave, customer }: CustomerFormDialogProps) {
    const [customerType, setCustomerType] = useState<'natural' | 'empresa'>('natural');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        identification: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (customer) {
            setCustomerType(customer.type);
            const { name, ...rest } = customer;
            let nameParts = { firstName: '', lastName: '', companyName: '' };
            if (customer.type === 'natural') {
                const parts = name.split(' ');
                nameParts.firstName = parts.slice(0, -1).join(' ') || parts[0] || '';
                nameParts.lastName = parts.length > 1 ? parts[parts.length - 1] : '';
            } else {
                nameParts.companyName = name;
            }
            setFormData({
                ...nameParts,
                identification: rest.identification || '',
                email: rest.email || '',
                phone: rest.phone || '',
                address: rest.address || '',
            });
        } else {
            // Reset form for new customer
            setCustomerType('natural');
            setFormData({
                firstName: '',
                lastName: '',
                companyName: '',
                identification: '',
                email: '',
                phone: '',
                address: ''
            });
        }
    }, [customer, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = customerType === 'natural'
            ? `${formData.firstName} ${formData.lastName}`
            : formData.companyName;

        const customerData: PosCustomer = {
            id: customer?.id || `pos_user_${Date.now()}`,
            name: name.trim(),
            email: formData.email,
            role: customer?.role || 'cliente',
            type: customerType,
            identification: formData.identification,
            phone: formData.phone,
            address: formData.address,
        };
        onSave(customerData);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{customer ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <RadioGroup value={customerType} onValueChange={(value: 'natural' | 'empresa') => setCustomerType(value)} className="grid grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="natural" id="natural" className="peer sr-only" />
                            <Label htmlFor="natural" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <User className="h-5 w-5" /> Persona Natural
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="empresa" id="empresa" className="peer sr-only" />
                            <Label htmlFor="empresa" className="flex items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <Building className="h-5 w-5" /> Empresa
                            </Label>
                        </div>
                    </RadioGroup>

                    {customerType === 'natural' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1"><Label htmlFor="firstName">Nombres</Label><Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                            <div className="space-y-1"><Label htmlFor="lastName">Apellidos</Label><Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
                        </div>
                    ) : (
                        <div className="space-y-1"><Label htmlFor="companyName">Razón Social</Label><Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required /></div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label htmlFor="identification">Identificación (Cédula/RUC)</Label><Input id="identification" name="identification" value={formData.identification} onChange={handleChange} required /></div>
                        <div className="space-y-1"><Label htmlFor="email">Correo Electrónico</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label htmlFor="phone">Teléfono</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required /></div>
                        <div className="space-y-1"><Label htmlFor="address">Dirección</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} required /></div>
                    </div>
                     <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Guardar Cliente</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
