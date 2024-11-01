'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FamilyTreePopup } from './FamilyTreePopup'

export default function LandingPage() {
  const router = useRouter()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isFamilyTreePopupOpen, setIsFamilyTreePopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckFinancialAccounts = () => {
    setIsPopupOpen(true)
  }

  const handleCheckFamilyTree = () => {
    setIsFamilyTreePopupOpen(true)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8080/v2/consents/request', {
        method: 'POST',
        headers: {
          'fiu_entity_id': 'Ice-FIU',
          'aa_entity_id': 'saafe-sandbox',
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWlfblhnelVVQ3VkQm56cDNwWURzRlZaNFFqNlZyb0FtY2c6YXNfS3VTaTJlSG12QVg3QXVzYzRHNHNrWXpwZ3pLcGR4bmk='
        },
        body: JSON.stringify({
          "redirect_params": {
            "callback_url": "LandingPage.tsx"
          },
          "consents": [
            {
              "consent_start": "2024-11-01T07:05:52.521Z",
              "consent_expiry": "2026-12-31T00:00:00.000Z",
              "consent_mode": "STORE",
              "fetch_type": "PERIODIC",
              "consent_types": [
                "PROFILE"
              ],
              "fi_types": [
                "DEPOSIT", "RECURRING_DEPOSIT", "TERM_DEPOSIT"
              ],
              "customer": {
                "identifiers": [
                  {
                    "type": "MOBILE",
                    "value": "8056277749"
                  }
                ]
              },
              "purpose": {
                "code": "101",
                "text": "Wealth management service"
              },
              "fi_data_range": {
                "from": "2023-01-01T00:00:00.000Z",
                "to": "2025-12-31T00:00:00.000Z"
              },
              "data_life": {
                "unit": "MONTH",
                "value": 10
              },
              "frequency": {
                "unit": "MONTH",
                "value": 31
              }
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch consent')
      }

      const data = await response.json()
      if (data.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        throw new Error('No redirect URL provided')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <Link href="/unclaimed-accounts" passHref>
                <Button className="h-32 w-full text-lg">Check Unclaimed Accounts</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fetching your financial accounts using Saafe, RBI registered Account Aggregator</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              We will be fetching all your financial accounts, using Saafe, in order to understand which bank accounts do not have your nominee details. And we will provide you with the ability to seamlessly update your nominee details using Fixerra's PIS APIs.
            </p>
            <h3 className="mt-4 font-semibold">Details of the consent</h3>
            <ul className="list-disc pl-5 text-sm text-gray-500">
              <li>Datatype: savings accounts, recurring deposits, term deposits</li>
              <li>Duration of the data: last 1 year</li>
              <li>How long we will keep the data: 1 year</li>
              <li>Purpose: To help identify Unregistered nominee accounts and safeguard them</li>
              <li>Periodicity: Monthly once</li>
            </ul>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'I Agree'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FamilyTreePopup 
        isOpen={isFamilyTreePopupOpen} 
        onClose={() => setIsFamilyTreePopupOpen(false)}
      />
    </div>
  )
}
