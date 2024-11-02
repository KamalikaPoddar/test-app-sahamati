'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddFamilyMemberPopup } from './AddFamilyMemberPopup'

interface FamilyMember {
  id: number
  name: string
  relationship: string
}

interface FamilyTreePopupProps {
  isOpen: boolean
  onClose: () => void
}

const dummyFamilyMembers: FamilyMember[] = [
  { id: 1, name: "Arun Sharma", relationship: "Father" },
  { id: 2, name: "Rupa Sharma", relationship: "Mother" },
  { id: 3, name: "Jaya Sharma", relationship: "Spouse" },
  { id: 4, name: "Varun Sharma", relationship: "Child" }, 
  { id: 5, name: "Tarun Sharma", relationship: "Self" }
]

export function FamilyTreePopup({ isOpen, onClose }: FamilyTreePopupProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(dummyFamilyMembers)
  const [isAddingMember, setIsAddingMember] = useState(false)

  const renderFamilyMember = (member: FamilyMember) => (
    <Card key={member.id} className="w-full">
      <CardHeader>
        <CardTitle>{member.relationship}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{member.name}</p>
      </CardContent>
    </Card>
  )

  const handleAddMember = (newMember: Omit<FamilyMember, 'id'>) => {
    const newId = Math.max(...familyMembers.map(m => m.id)) + 1
    setFamilyMembers([...familyMembers, { ...newMember, id: newId }])
    setIsAddingMember(false)
  }

  const grandparents = familyMembers.filter(m => m.relationship === "Grandfather" || m.relationship === "Grandmother")
  const parents = familyMembers.filter(m => m.relationship === "Father" || m.relationship === "Mother")
  const self = familyMembers.find(m => m.relationship === "Self")
  const spouseAndSiblings = familyMembers.filter(m => m.relationship === "Spouse" || m.relationship === "Sibling")
  const children = familyMembers.filter(m => m.relationship === "Child")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Family Tree</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {grandparents.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {grandparents.map(renderFamilyMember)}
            </div>
          )}
          {parents.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {parents.map(renderFamilyMember)}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {self && renderFamilyMember(self)}
            {spouseAndSiblings.map(renderFamilyMember)}
          </div>
          {children.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {children.map(renderFamilyMember)}
            </div>
          )}
          <Button onClick={() => setIsAddingMember(true)} className="w-full">Add Family Member</Button>
        </div>
      </DialogContent>
      <AddFamilyMemberPopup
        isOpen={isAddingMember}
        onClose={() => setIsAddingMember(false)}
        onSubmit={handleAddMember}
      />
    </Dialog>
  )
}
