'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { NomineeAllocationPopup } from './NomineeAllocationPopup'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Account {
  id: number
  BankName: string
  AccountType: string
  Nominee: string
}

const dummyAccounts: Account[] = [
  {id: 1, BankName: "ignosis", AccountType:"Savings", Nominee:"Registered"},
  {id: 2, BankName: "ignosis", AccountType:"Recurring-Deposit", Nominee:"Not Registered"}, 
  {id: 3, BankName: "ignosis", AccountType:"Term-Deposit", Nominee:"Not Registered"}, 
  {id: 4, BankName: "bankB", AccountType:"Savings", Nominee:"Not Registered"}
]

export default function FinancialAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(dummyAccounts)
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([])
  const [isNomineePopupOpen, setIsNomineePopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const consentHandle = searchParams.get('handle')

  useEffect(() => {
    const fetchData = async () => {
      if (!consentHandle) {
        console.warn('No consent handle provided, using dummy data')
        setAccounts(dummyAccounts)
        setIsLoading(false)
        return
      }

      try {
        // First API call
        const response1 = await fetch('http://localhost:8080/v2/data/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWlfblhnelVVQ3VkQm56cDNwWURzRlZaNFFqNlZyb0FtY2c6YXNfS3VTaTJlSG12QVg3QXVzYzRHNHNrWXpwZ3pLcGR4bmk='
          },
          body: JSON.stringify({
            consent_handle: consentHandle,
            from: "2023-09-26T00:00:00.000Z",
            to: "2024-11-01T07:31:17.224Z",
            curve: "Curve25519"
          })
        })

        if (!response1.ok) {
          throw new Error('Failed to fetch data request')
        }

        const data1 = await response1.json()
        const sessionId = data1.session_id

        // Second API call
        const response2 = await fetch('http://localhost:8080/v2/data/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YWlfblhnelVVQ3VkQm56cDNwWURzRlZaNFFqNlZyb0FtY2c6YXNfS3VTaTJlSG12QVg3QXVzYzRHNHNrWXpwZ3pLcGR4bmk='
          },
          body: JSON.stringify({   
            session_id: sessionId
          })
        })

        if (!response2.ok) {
          throw new Error('Failed to fetch data')
        }

        const data2 = await response2.json()
        console.log('Fetched data:', data2)

        // For now, we're still using the dummy data
        // In a real scenario, you would process data2 and update the accounts state
        setAccounts(dummyAccounts)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch account data. Using dummy data instead.')
        setAccounts(dummyAccounts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [consentHandle])

  const handleSelectAll = () => {
    const unregisteredIds = accounts
      .filter(account => account.Nominee === "Not Registered")
      .map(account => account.id)
    setSelectedAccounts(unregisteredIds)
  }

  const handleSelectAccount = (id: number) => {
    setSelectedAccounts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleNomineeAllocation = (allocations: { [key: string]: number }) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(account => 
        selectedAccounts.includes(account.id) 
          ? { ...account, Nominee: "Registering in progress" } 
          : account
      )
    )
    setSelectedAccounts([])
    setIsNomineePopupOpen(false)
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Financial Accounts</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mb-4">
        <Button onClick={handleSelectAll}>Select All Unregistered</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className={account.Nominee === "Not Registered" ? "border-red-500" : ""}>
            <CardHeader>
              <CardTitle>{account.BankName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Account Type: {account.AccountType}</p>
              <p>Nominee Status: {account.Nominee}</p>
              {account.Nominee === "Not Registered" && (
                <Checkbox
                  checked={selectedAccounts.includes(account.id)}
                  onCheckedChange={() => handleSelectAccount(account.id)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedAccounts.length > 0 && (
        <div className="mt-4">
          <Button onClick={() => setIsNomineePopupOpen(true)}>Add Nominee</Button>
        </div>
      )}
      <NomineeAllocationPopup 
        isOpen={isNomineePopupOpen}
        onClose={() => setIsNomineePopupOpen(false)}
        onSubmit={handleNomineeAllocation}
      />
    </div>
  )
}