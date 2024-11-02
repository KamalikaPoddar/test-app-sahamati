'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NomineeAllocationPopup } from './NomineeAllocationPopup'

interface FinancialAccount {
  id: string
  bankName: string
  accountType: string
  accountNumber: string
  balance: number
  hasNominee: boolean
}

export default function FinancialAccountsPage() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<FinancialAccount | null>(null)
  const [isNomineePopupOpen, setIsNomineePopupOpen] = useState(false)

  useEffect(() => {
    // In a real application, this would be an API call to fetch the user's accounts
    const fetchData = async () => {
      if (!consentHandle) {
        console.warn('No consent handle provided, using dummy data')
        setAccounts(dummyAccounts)
        setIsLoading(false)
        return
      }

      try {
        // First API call to request for the consented data 
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

       

        const data2 = await response2.json()
        console.log('Fetched data:', data2)
    const fetchAccounts = async () => {

       // Second API call to fetch the data throguh the session ID provided above
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
      const dummyAccounts: FinancialAccount[] = [
        { id: '1', bankName: 'Ignosis Bank', accountType: 'Savings', accountNumber: 'XXXX6f22', balance: 50000, hasNominee: true },
        { id: '2', bankName: 'Ignosis Bank', accountType: 'Term Deposit', accountNumber: 'XXXX1201', balance: 105622, hasNominee: false },
        { id: '3', bankName: 'Ignosis Bank', accountType: 'Recurring Deposit', accountNumber: 'XXXX9012', balance: 20, hasNominee: false },
         { id: '4', bankName: 'BankB', accountType: 'Savings', accountNumber: 'XXXX9012', balance: 100000, hasNominee: false },
      ]
      setAccounts(dummyAccounts)
    }

    fetchAccounts()
  }, [])

  const handleAddNominee = (account: FinancialAccount) => {
    setSelectedAccount(account)
    setIsNomineePopupOpen(true)
  }

  const handleNomineeAdded = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId ? { ...account, hasNominee: true } : account
    ))
    setIsNomineePopupOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Financial Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle>{account.bankName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Account Type:</strong> {account.accountType}</p>
              <p><strong>Account Number:</strong> {account.accountNumber}</p>
              <p><strong>Balance:</strong> ₹{account.balance.toLocaleString()}</p>
              <p><strong>Nominee Status:</strong> {account.hasNominee ? 'Registered' : 'Not Registered'}</p>
              {!account.hasNominee && (
                <Button onClick={() => handleAddNominee(account)} className="mt-2">
                  Add Nominee
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedAccount && (
        <NomineeAllocationPopup
          isOpen={isNomineePopupOpen}
          onClose={() => setIsNomineePopupOpen(false)}
          account={selectedAccount}
          onNomineeAdded={handleNomineeAdded}
        />
      )}
    </div>
  )
}
