'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FamilyTreePopup } from './FamilyTreePopup'
import { AddFamilyMemberPopup } from './AddFamilyMemberPopup'

export default function LandingPage() {
  const router = useRouter()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isFamilyTreePopupOpen, setIsFamilyTreePopupOpen] = useState(false)
  const [isAddFamilyMemberPopupOpen, setIsAddFamilyMemberPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckFinancialAccounts = () => {
    setIsPopupOpen(true)
  }

  const handleCheckFamilyTree = () => {
    setIsFamilyTreePopupOpen(true)
  }

  const handleAddFamilyMember = () => {
    setIsAddFamilyMemberPopupOpen(true)
  }

  const handleSubmit = async () => {
    // ... (rest of the handleSubmit function remains unchanged)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Financial Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <Button 
                className="h-32 w-full text-lg"
                onClick={handleCheckFinancialAccounts}
              >
                Check Financial Accounts
              </Button>
              <Button 
                className="h-32 w-full text-lg"
                onClick={handleCheckFamilyTree}
              >
                Check Family Tree
              </Button>
              <Button 
                className="h-32 w-full text-lg"
                onClick={handleAddFamilyMember}
              >
                Add Family Member
              </Button>
              <Link href="/unclaimed-accounts" passHref>
                <Button className="h-32 w-full text-lg">Check Unclaimed Accounts</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        {/* ... (Financial accounts popup content remains unchanged) */}
      </Dialog>

      <FamilyTreePopup 
        isOpen={isFamilyTreePopupOpen} 
        onClose={() => setIsFamilyTreePopupOpen(false)}
        onAddFamilyMember={handleAddFamilyMember}
      />

      <AddFamilyMemberPopup
        isOpen={isAddFamilyMemberPopupOpen}
        onClose={() => setIsAddFamilyMemberPopupOpen(false)}
      />
    </div>
  )
}
