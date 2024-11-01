'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddFamilyMemberPopup } from './AddFamilyMemberPopup'
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // First API call
        const response1 = await fetch('https://apisetu.gov.in/certificate/v3/cbse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "txnId": "f7f1469c-29b0-4325-9dfc-c567200a70f7",
            "format": "xml",
            "certificateParameters": {
              "rollno": "1100040",
              "year": "20XX",
              "FullName": "Sunil Kumar"
            },
            "consentArtifact": {
              "consent": {
                "consentId": "ea9c43aa-7f5a-4bf3-a0be-e1caa24737ba",
                "timestamp": "2024-11-01T13:34:02.461Z",
                "dataConsumer": {
                  "id": "string"
                },
                "dataProvider": {
                  "id": "string"
                },
                "purpose": {
                  "description": "string"
                },
                "user": {
                  "idType": "string",
                  "idNumber": "string",
                  "mobile": "string",
                  "email": "string"
                },
                "data": {
                  "id": "string"
                },
                "permission": {
                  "access": "string",
                  "dateRange": {
                    "from": "2024-11-01T13:34:02.461Z",
                    "to": "2024-11-01T13:34:02.461Z"
                  },
                  "frequency": {
                    "unit": "string",
                    "value": 0,
                    "repeats": 0
                  }
                }
              },
              "signature": {
                "signature": "string"
              }
            }
          })
        })

        if (!response1.ok) {
          throw new Error('Failed to fetch CBSE certificate')
        }

        // Second API call
        const response2 = await fetch('https://apiset.gov.in/certificate/v3/lsgkerala/rmcer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "txnId": "f7f1469c-29b0-4325-9dfc-c567200a70f7",
            "format": "pdf",
            "certificateParameters": {
              "ApplicationNumber": "CRBR-00004151-2021"
            },
            "consentArtifact": {
              "consent": {
                "consentId": "ea9c43aa-7f5a-4bf3-a0be-e1caa24737ba",
                "timestamp": "2024-11-01T13:38:49.065Z",
                "dataConsumer": {
                  "id": "string"
                },
                "dataProvider": {
                  "id": "string"
                },
                "purpose": {
                  "description": "string"
                },
                "user": {
                  "idType": "string",
                  "idNumber": "string",
                  "mobile": "string",
                  "email": "string"
                },
                "data": {
                  "id": "string"
                },
                "permission": {
                  "access": "string",
                  "dateRange": {
                    "from": "2024-11-01T13:38:49.065Z",
                    "to": "2024-11-01T13:38:49.065Z"
                  },
                  "frequency": {
                    "unit": "string",
                    "value": 0,
                    "repeats": 0
                  }
                }
              },
              "signature": {
                "signature": "string"
              }
            }
          })
        })

        if (!response2.ok) {
          throw new Error('Failed to fetch Kerala certificate')
        }

        // For now, we're using dummy data regardless of API responses
        setFamilyMembers(dummyFamilyMembers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

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
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
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
        )}
      </DialogContent>
      <AddFamilyMemberPopup
        isOpen={isAddingMember}
        onClose={() => setIsAddingMember(false)}
        onSubmit={handleAddMember}
      />
    </Dialog>
  )
}
