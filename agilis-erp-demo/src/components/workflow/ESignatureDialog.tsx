import { useState } from 'react'
import { AlertTriangle, KeyRound } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ESignatureDialogProps {
  open: boolean
  onClose: () => void
  onSign: (signatureHash: string) => void
  title?: string
  description?: string
}

function generateMockHash(): string {
  const chars = 'abcdef0123456789'
  let hash = ''
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

export function ESignatureDialog({
  open,
  onClose,
  onSign,
  title = 'Electronic Signature',
  description = 'This action requires your electronic signature per 21 CFR Part 11. Please enter your password to confirm.',
}: ESignatureDialogProps) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleConfirm() {
    if (!password.trim()) return
    setLoading(true)
    // Simulate brief processing delay
    setTimeout(() => {
      const hash = generateMockHash()
      onSign(hash)
      setPassword('')
      setLoading(false)
    }, 500)
  }

  function handleClose() {
    setPassword('')
    setLoading(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!password.trim()}
          >
            <KeyRound className="h-4 w-4" />
            Confirm Signature
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Warning */}
        <div className="flex gap-3 rounded-md bg-warning-50 border border-warning-200 p-3">
          <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-warning-700">{description}</p>
        </div>

        {/* Password input */}
        <Input
          label="Password"
          type="password"
          required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleConfirm()
          }}
        />

        {/* Compliance notice */}
        <p className="text-xs text-neutral-400">
          Your signature will be recorded with a timestamp, IP address, and cryptographic hash in
          the immutable audit trail.
        </p>
      </div>
    </Modal>
  )
}
