import { createContext, useContext, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type FleetAsset } from '../data/schema'

type FleetAssetsDialogType = 'add' | 'edit' | 'delete' | 'view'

type FleetAssetsContextType = {
  open: FleetAssetsDialogType | null
  currentAsset: FleetAsset | null
  setCurrentAsset: React.Dispatch<React.SetStateAction<FleetAsset | null>>
  openAdd: () => void
  openEdit: (asset: FleetAsset) => void
  openDelete: (asset: FleetAsset) => void
  openView: (asset: FleetAsset) => void
  closeDialog: () => void
}

const FleetAssetsContext = createContext<FleetAssetsContextType | null>(null)

type FleetAssetsProviderProps = {
  children: React.ReactNode
}

export function FleetAssetsProvider({ children }: FleetAssetsProviderProps) {
  const [open, setOpen] = useDialogState<FleetAssetsDialogType>(null)
  const [currentAsset, setCurrentAsset] = useState<FleetAsset | null>(null)

  const closeDialog = () => {
    setOpen(null)
    window.setTimeout(() => {
      setCurrentAsset(null)
    }, 250)
  }

  const openAdd = () => {
    setCurrentAsset(null)
    setOpen('add')
  }

  const openEdit = (asset: FleetAsset) => {
    setCurrentAsset(asset)
    setOpen('edit')
  }

  const openDelete = (asset: FleetAsset) => {
    setCurrentAsset(asset)
    setOpen('delete')
  }

  const openView = (asset: FleetAsset) => {
    setCurrentAsset(asset)
    setOpen('view')
  }

  return (
    <FleetAssetsContext
      value={{
        open,
        currentAsset,
        setCurrentAsset,
        openAdd,
        openEdit,
        openDelete,
        openView,
        closeDialog,
      }}
    >
      {children}
    </FleetAssetsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFleetAssets() {
  const context = useContext(FleetAssetsContext)

  if (!context) {
    throw new Error('useFleetAssets must be used within <FleetAssetsProvider>')
  }

  return context
}
