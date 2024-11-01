'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddFamilyMemberPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (newMember: { name: string; relationship: string }) => void
}

const relationshipOptions = [
  "Father",
  "Mother",
  "Grandfather",
  "Grandmother",
  "Sibling",
  "Spouse",
  "Child"
]

export function AddFamilyMemberPopup({ isOpen, onClose, onSubmit }: AddFamilyMemberPopupProps) {
  const [newMember, setNewMember] = useState<{ name: string; relationship: string }>({ name: '', relationship: '' })

  const handleSubmit = () => {
    if (newMember.name && newMember.relationship) {
      onSubmit(newMember)
      setNewMember({ name: '', relationship: '' })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="relationship" className="text-right">
              Relationship
            </Label>
            <Select value={newMember.relationship} onValueChange={(value) => setNewMember({ ...newMember, relationship: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {relationshipOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={!newMember.name || !newMember.relationship}>
          Add Family Member
        </Button>
      </DialogContent>
    </Dialog>
  )
}
