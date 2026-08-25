import { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { deleteFleetAsset } from '../api/fleet-assets'
import { FleetAssetDetailSheet } from './fleet-asset-detail-sheet'
import { FleetAssetFormDialog } from './fleet-asset-form-dialog'
import { useFleetAssets } from './fleet-assets-provider'

export function FleetAssetsDialogs() {
  const queryClient = useQueryClient()
  const { open, currentAsset, closeDialog } = useFleetAssets()

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!currentAsset) {
        throw new Error('No asset selected.')
      }

      return deleteFleetAsset(currentAsset.id)
    },
    onSuccess: async () => {
      toast.success('Asset deactivated.')
      await queryClient.invalidateQueries({ queryKey: ['fleet-assets'] })
      closeDialog()
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message
        if (typeof message === 'string') {
          toast.error(message)
          return
        }
      }

      handleServerError(error)
    },
  })

  return (
    <>
      <FleetAssetFormDialog
        open={open === 'add' || open === 'edit'}
        onOpenChange={(state) => {
          if (!state) closeDialog()
        }}
        currentAsset={open === 'edit' ? currentAsset : null}
      />

      <FleetAssetDetailSheet
        asset={currentAsset}
        open={open === 'view'}
        onOpenChange={(state) => {
          if (!state) closeDialog()
        }}
      />

      {currentAsset && (
        <ConfirmDialog
          open={open === 'delete'}
          onOpenChange={(state) => {
            if (!state) closeDialog()
          }}
          title='Delete / Deactivate Asset'
          desc={
            <span>
              Deactivate <strong>{currentAsset.assetCode}</strong>? The asset
              will remain in the system but will be marked inactive.
            </span>
          }
          destructive
          confirmText={
            deleteMutation.isPending ? 'Deactivating...' : 'Deactivate'
          }
          isLoading={deleteMutation.isPending}
          handleConfirm={() => deleteMutation.mutate()}
        />
      )}
    </>
  )
}
